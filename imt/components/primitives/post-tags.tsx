import type { ReactNode } from 'react';
import { SquareArrowOutUpRight } from 'lucide-react';
import { Tag } from '@/components/primitives/tag';
import type { PostKind } from '@/lib/blog/manifest';

const postKindTone = {
  technical: 'neutral',
} as const;

export function PostTags({
  kind,
  external = false,
}: {
  kind?: PostKind | null;
  // Marks writing published somewhere other than this site.
  external?: boolean;
}) {
  const tags: ReactNode[] = [];

  if (external) {
    tags.push(
      <Tag
        key="external"
        tone="neutral"
        data-post-tag="external"
        className="gap-1"
      >
        <SquareArrowOutUpRight
          aria-hidden
          className="size-[10px] shrink-0"
          strokeWidth={2}
        />
        external
      </Tag>
    );
  }

  if (kind) {
    tags.push(
      <Tag key={kind} tone={postKindTone[kind]} data-post-tag={kind}>
        {kind}
      </Tag>
    );
  }

  if (tags.length === 0) {
    return null;
  }

  return (
    <span
      data-post-tags
      className="ml-2 inline-flex flex-wrap gap-1 align-middle"
    >
      {tags}
    </span>
  );
}
