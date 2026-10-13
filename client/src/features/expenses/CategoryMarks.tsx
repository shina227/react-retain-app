import type { CSSProperties } from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { CategorySummary } from '@/types/api';

// Categories are admin-defined, so there's no icon to show: the avatar is the category's
// initial on a 12% tint of its colour, which reads in light and dark mode alike.
export function CategoryAvatar({
  category,
  className,
}: {
  category: CategorySummary;
  className?: string;
}) {
  return (
    <span
      aria-hidden
      className={cn(
        'flex size-10 shrink-0 items-center justify-center rounded-full text-base font-semibold',
        className,
      )}
      style={{
        color: category.color,
        backgroundColor: `color-mix(in srgb, ${category.color} 12%, transparent)`,
      }}
    >
      {category.name.charAt(0).toUpperCase()}
    </span>
  );
}

// Outline badge with a dot in the category colour, like the Untitled "● Active" status badge.
export function CategoryBadge({ category }: { category: CategorySummary }) {
  return (
    <Badge variant="outline" dot style={{ '--dot': category.color } as CSSProperties}>
      {category.name}
    </Badge>
  );
}
