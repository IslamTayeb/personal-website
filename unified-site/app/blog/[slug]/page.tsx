import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ArticleProse } from '@/components/primitives/article-prose';
import { RoybBand } from '@/components/primitives/royb-band';
import { formatDate, datetime } from '@/lib/blog/date';
import { getAllPosts, getPostBySlug } from '@/lib/blog/posts';

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateStaticParams() {
  const posts = await getAllPosts();

  return posts.map((post) => ({
    slug: post.manifest.slug,
  }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return {};
  }

  return {
    title: post.manifest.title,
    description: post.summary,
    openGraph: {
      title: post.manifest.title,
      description: post.summary,
      type: 'article',
      publishedTime: datetime(post.manifest.publishedAt),
      modifiedTime: datetime(post.manifest.updatedAt),
      images: post.manifest.socialImage ? [post.manifest.socialImage] : [],
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <>
      <RoybBand />
      <article className="py-7 md:py-8">
        <header className="mb-7 flex flex-col gap-2.5">
          <h1 className="text-2xl font-semibold leading-tight tracking-tight text-foreground text-balance md:text-3xl">
            {post.manifest.title}
          </h1>
          <time
            dateTime={post.manifest.publishedAt}
            className="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground"
          >
            {formatDate(post.manifest.publishedAt)}
          </time>
        </header>
        <ArticleProse html={post.html} />
      </article>
    </>
  );
}
