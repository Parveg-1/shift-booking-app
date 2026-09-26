import { SectionList, StyleSheet } from 'react-native';

import { colors, spacing } from '../theme';
import DateSectionHeader from './DateSectionHeader';
import EmptyState from './EmptyState';
import ErrorState from './ErrorState';
import LoadingState from './LoadingState';

const buildSectionMeta = (section) => {
  const count = section.data.length;
  return `${count} ${count === 1 ? 'shift' : 'shifts'} · ${section.duration}`;
};

export default function ShiftList({
  sections,
  loading,
  error,
  onRetry,
  renderShift,
  header = null,
  emptyTitle,
  emptyMessage,
  emptyActionLabel,
  onEmptyAction,
}) {
  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={onRetry} />;
  }

  if (!sections.length) {
    return (
      <EmptyState
        title={emptyTitle}
        message={emptyMessage}
        actionLabel={emptyActionLabel}
        onAction={onEmptyAction}
      />
    );
  }

  return (
    <SectionList
      sections={sections}
      keyExtractor={(shift) => shift.id}
      renderItem={({ item }) => renderShift(item)}
      renderSectionHeader={({ section }) => (
        <DateSectionHeader title={section.title} meta={buildSectionMeta(section)} />
      )}
      ListHeaderComponent={header}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    />
  );
}

const styles = StyleSheet.create({
  content: {
    paddingBottom: spacing.xxl,
    backgroundColor: colors.background,
  },
});
