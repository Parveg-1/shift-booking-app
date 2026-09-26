import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, radii, spacing, typography } from '../theme';
import { formatTimeRange, getShiftDuration, hasStarted } from '../utils/shifts';
import Spinner from './Spinner';

export default function ShiftCard({ shift, busy = false, overlapping = false, onAction }) {
  const isBooked = shift.booked;
  const started = hasStarted(shift);
  const tone = isBooked ? 'red' : 'green';

  const hint = isBooked
    ? started
      ? 'Started'
      : 'Booked'
    : overlapping
      ? 'Overlapping'
      : null;

  const disabled = busy || started || (!isBooked && overlapping);
  const actionLabel = isBooked ? 'Cancel' : 'Book';

  return (
    <View style={[styles.card, isBooked && styles.cardBooked]}>
      <View style={styles.details}>
        <Text style={styles.time}>{formatTimeRange(shift)}</Text>
        <Text style={styles.meta}>
          {shift.area} · {getShiftDuration(shift)}
        </Text>
      </View>

      <View style={styles.actions}>
        {!!hint && (
          <View
            style={[styles.badge, isBooked ? styles.badgeBooked : styles.badgeMuted]}
            accessibilityLabel={`Status: ${hint}`}
          >
            <Text style={[styles.badgeText, isBooked ? styles.badgeTextBooked : styles.badgeTextMuted]}>
              {hint}
            </Text>
          </View>
        )}

        <Pressable
          onPress={onAction}
          disabled={disabled}
          accessibilityRole="button"
          accessibilityLabel={`${actionLabel} shift, ${shift.area}, ${formatTimeRange(shift)}`}
          accessibilityHint={disabled ? 'This action is not available' : undefined}
          accessibilityState={{ disabled, busy }}
          style={({ pressed }) => [
            styles.button,
            isBooked ? styles.buttonCancel : styles.buttonBook,
            disabled && styles.buttonDisabled,
            pressed && !disabled && styles.buttonPressed,
          ]}
        >
          {busy ? (
            <Spinner tone={tone} />
          ) : (
            <Text style={[styles.buttonText, disabled && styles.buttonTextDisabled]}>
              {actionLabel}
            </Text>
          )}
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: spacing.lg,
    marginVertical: spacing.xs,
    padding: spacing.lg,
    borderRadius: radii.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.md,
  },
  cardBooked: {
    borderColor: colors.successSoft,
    backgroundColor: colors.successSoft,
  },
  details: {
    flex: 1,
    gap: spacing.xs,
  },
  time: {
    ...typography.cardTime,
  },
  meta: {
    ...typography.cardArea,
  },
  actions: {
    alignItems: 'flex-end',
    gap: spacing.sm,
  },
  badge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radii.pill,
  },
  badgeBooked: {
    backgroundColor: colors.surface,
  },
  badgeMuted: {
    backgroundColor: colors.background,
  },
  badgeText: {
    ...typography.badge,
  },
  badgeTextBooked: {
    color: colors.success,
  },
  badgeTextMuted: {
    color: colors.textMuted,
  },
  button: {
    minWidth: 96,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    borderRadius: radii.pill,
  },
  buttonBook: {
    backgroundColor: colors.primary,
  },
  buttonCancel: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  buttonDisabled: {
    backgroundColor: colors.disabled,
    borderColor: colors.disabled,
  },
  buttonPressed: {
    opacity: 0.85,
  },
  buttonText: {
    ...typography.button,
    color: colors.surface,
  },
  buttonTextDisabled: {
    color: colors.surface,
  },
});
