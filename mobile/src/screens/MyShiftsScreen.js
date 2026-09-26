import { useCallback, useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import ShiftCard from '../components/ShiftCard';
import ShiftList from '../components/ShiftList';
import { useShifts } from '../context/ShiftContext';
import { colors, spacing, typography } from '../theme';
import { groupByDate, summarize } from '../utils/shifts';

export default function MyShiftsScreen({ navigation }) {
  const { shifts, loading, error, pendingIds, cancel, reload } = useShifts();

  const bookedShifts = useMemo(() => shifts.filter((shift) => shift.booked), [shifts]);
  const sections = useMemo(() => groupByDate(bookedShifts), [bookedShifts]);
  const summary = useMemo(() => summarize(bookedShifts), [bookedShifts]);

  const renderShift = useCallback(
    (shift) => (
      <ShiftCard
        shift={shift}
        busy={pendingIds.includes(shift.id)}
        onAction={() => cancel(shift.id)}
      />
    ),
    [pendingIds, cancel],
  );

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.title} accessibilityRole="header">
          My shifts
        </Text>
        <Text style={styles.subtitle}>
          {summary.count} booked {summary.count === 1 ? 'shift' : 'shifts'} · {summary.duration}
        </Text>
      </View>

      <ShiftList
        sections={sections}
        loading={loading}
        error={error}
        onRetry={reload}
        renderShift={renderShift}
        emptyTitle="No booked shifts"
        emptyMessage="Book a shift from Available shifts and it will show up here."
        emptyActionLabel="Browse shifts"
        onEmptyAction={() => navigation.navigate('AvailableShifts')}
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
