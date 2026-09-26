import { StyleSheet, Text, View } from 'react-native';

import { colors, spacing, typography } from '../theme';

export default function DateSectionHeader({ title, meta }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title} accessibilityRole="header">
        {title}
      </Text>
      {!!meta && <Text style={styles.meta}>{meta}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.sm,
    backgroundColor: colors.background,
  },
  title: {
    ...typography.sectionTitle,
  },
  meta: {
    ...typography.sectionMeta,
  },
});
