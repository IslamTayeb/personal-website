import type { ReactNode } from 'react';
import { Tag } from '@/components/primitives/tag';
import type { PostKind } from '@/lib/blog/manifest';

const postKindTone = {
  technical: 'neutral',
} as const;

export function PostTags({
  isNew = false,
  kind,
}: {
  isNew?: boolean;
  kind?: PostKind | null;
}) {
  const tags: ReactNode[] = [];

  if (isNew) {
    tags.push(
      <Tag key="new" tone="b" data-post-tag="new">
        New
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
