import { createContext, useCallback, useContext, useEffect, useMemo, useReducer } from 'react';
import { Alert } from 'react-native';

import { bookShift, cancelShift, getShifts } from '../services/api';
import { sortByStartTime } from '../utils/shifts';

const ShiftContext = createContext(null);

export const initialState = {
  shifts: [],
  loading: true,
  error: null,
  pendingIds: [],
};

export const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_START':
      return { ...state, loading: true, error: null };

    case 'FETCH_SUCCESS':
      return { ...state, loading: false, error: null, shifts: sortByStartTime(action.payload) };

    case 'FETCH_ERROR':
      return { ...state, loading: false, error: action.payload };

    case 'UPDATE_SHIFT':
      return {
        ...state,
        shifts: state.shifts.map((shift) =>
          shift.id === action.payload.id ? action.payload : shift,
        ),
      };

    case 'SET_PENDING': {
      const pendingIds = action.pending
        ? [...state.pendingIds, action.id]
        : state.pendingIds.filter((id) => id !== action.id);

      return { ...state, pendingIds: [...new Set(pendingIds)] };
    }

    default:
      return state;
  }
};

export const ShiftProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const load = useCallback(async ({ silent = false } = {}) => {
    if (!silent) {
      dispatch({ type: 'FETCH_START' });
    }

    try {
      dispatch({ type: 'FETCH_SUCCESS', payload: await getShifts() });
    } catch (error) {
      dispatch({ type: 'FETCH_ERROR', payload: error.message });
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const mutate = useCallback(
    async (id, request, fallbackMessage) => {
      dispatch({ type: 'SET_PENDING', id, pending: true });

      try {
        const updated = await request(id);
        dispatch({ type: 'UPDATE_SHIFT', payload: updated });
        return true;
      } catch (error) {
        Alert.alert(fallbackMessage, error.message, [
          { text: 'Dismiss', style: 'cancel' },
          { text: 'Refresh', onPress: () => load({ silent: true }) },
        ]);
        return false;
      } finally {
        dispatch({ type: 'SET_PENDING', id, pending: false });
      }
    },
    [load],
  );

  const book = useCallback(
    (id) => mutate(id, bookShift, 'Unable to book the shift'),
    [mutate],
  );

  const cancel = useCallback(
    (id) => mutate(id, cancelShift, 'Unable to cancel the shift'),
    [mutate],
  );

  const value = useMemo(
    () => ({ ...state, book, cancel, reload: load }),
    [state, book, cancel, load],
  );

  return <ShiftContext.Provider value={value}>{children}</ShiftContext.Provider>;
};

export const useShifts = () => {
  const context = useContext(ShiftContext);

  if (!context) {
    throw new Error('useShifts must be used inside a ShiftProvider');
  }

  return context;
};
