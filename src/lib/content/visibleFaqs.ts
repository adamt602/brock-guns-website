import type { FaqGroup } from '@/types/faq';

/**
 * Returns the FAQ groups that should be published.
 * When placeholders are hidden, questions whose answer is entirely pending
 * are removed, along with any topic left empty.
 */
export function visibleFaqGroups(groups: FaqGroup[], showPendingContent: boolean): FaqGroup[] {
  if (showPendingContent) return groups;

  return groups
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => item.answer.some((part) => part.type !== 'pending')),
    }))
    .filter((group) => group.items.length > 0);
}
