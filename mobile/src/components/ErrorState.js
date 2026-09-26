import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, radii, spacing, typography } from '../theme';
import Spinner from './Spinner';

export default function ErrorState({ message, onRetry }) {
  return (
    <View style={styles.container}>
      <Spinner size={44} tone="red" />
      <Text style={styles.title}>Unable to load shifts</Text>
      {!!message && <Text style={styles.message}>{message}</Text>}
      <Pressable
        onPress={onRetry}
        accessibilityRole="button"
        accessibilityLabel="Try again"
        style={({ pressed }) => [styles.action, pressed && styles.actionPressed]}
      >
        <Text style={styles.actionText}>Try again</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.xxl,
  },
  spinner: {
    marginBottom: spacing.lg,
  },
  title: {
    ...typography.sectionTitle,
    fontSize: 18,
  },
  message: {
    ...typography.subtitle,
    marginTop: spacing.sm,
    textAlign: 'center',
  },
  action: {
    marginTop: spacing.lg,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: radii.pill,
    backgroundColor: colors.primary,
  },
  actionPressed: {
    opacity: 0.85,
  },
  actionText: {
    ...typography.button,
    color: colors.surface,
  },
});
