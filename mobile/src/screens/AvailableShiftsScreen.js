import { useCallback, useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import CityFilter from '../components/CityFilter';
import ShiftCard from '../components/ShiftCard';
import ShiftList from '../components/ShiftList';
import { useShifts } from '../context/ShiftContext';
import { colors, spacing, typography } from '../theme';
import {
  ALL_CITIES,
  filterByCity,
  getCityOptions,
  groupByDate,
  hasBookedConflict,
  isUpcoming,
} from '../utils/shifts';

export default function AvailableShiftsScreen() {
  const { shifts, loading, error, pendingIds, book, cancel, reload } = useShifts();
  const [city, setCity] = useState(ALL_CITIES);

  const bookedShifts = useMemo(() => shifts.filter((shift) => shift.booked), [shifts]);
  const upcomingShifts = useMemo(() => shifts.filter(isUpcoming), [shifts]);
  const cityOptions = useMemo(() => getCityOptions(upcomingShifts), [upcomingShifts]);

  const sections = useMemo(
    () => groupByDate(filterByCity(upcomingShifts, city)),
    [upcomingShifts, city],
  );

  const renderShift = useCallback(
    (shift) => (
      <ShiftCard
        shift={shift}
        busy={pendingIds.includes(shift.id)}
        overlapping={hasBookedConflict(shift, bookedShifts)}
        onAction={() => (shift.booked ? cancel(shift.id) : book(shift.id))}
      />
    ),
    [pendingIds, bookedShifts, book, cancel],
  );

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.title} accessibilityRole="header">
          Available shifts
        </Text>
        <Text style={styles.subtitle}>
          {upcomingShifts.length} upcoming {upcomingShifts.length === 1 ? 'shift' : 'shifts'}
        </Text>
      </View>

      <ShiftList
        sections={sections}
        loading={loading}
        error={error}
        onRetry={reload}
        renderShift={renderShift}
        header={<CityFilter options={cityOptions} selected={city} onSelect={setCity} />}
        emptyTitle={city === ALL_CITIES ? 'No upcoming shifts' : `No shifts in ${city}`}
        emptyMessage={
          city === ALL_CITIES
            ? 'New shifts will show up here as soon as they are published.'
            : 'Try another city or pick "All" to see every shift.'
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.sm,
    gap: spacing.xs,
  },
  title: {
    ...typography.title,
  },
  subtitle: {
    ...typography.subtitle,
  },
});
