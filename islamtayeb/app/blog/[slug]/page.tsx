import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ArticleProse } from '@/components/primitives/article-prose';
import { RoybBand } from '@/components/primitives/royb-band';
import { siteMetadata } from '@/data/site-metadata';
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

  const socialImage = {
    ...siteMetadata.socialImage,
    url: post.manifest.socialImage ?? siteMetadata.socialImage.url,
  };

  return {
    title: post.manifest.title,
    description: post.summary,
    openGraph: {
      title: post.manifest.title,
      description: post.summary,
      type: 'article',
      publishedTime: datetime(post.manifest.publishedAt),
      modifiedTime: datetime(post.manifest.updatedAt),
      images: [socialImage],
    },
    twitter: {
      card: 'summary',
      title: post.manifest.title,
      description: post.summary,
      images: [socialImage],
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
      <article data-testid="blog-article" className="pb-44 pt-0">
        <header className="mb-7 flex flex-col gap-2.5">
          <h1
            data-testid="blog-article-title"
            className="text-3xl font-semibold leading-tight tracking-tight text-foreground text-balance md:text-4xl"
          >
            {post.manifest.title}
          </h1>
          <time
            dateTime={post.manifest.publishedAt}
            className="font-mono text-sm tracking-[0.08em] text-muted-foreground"
          >
            {formatDate(post.manifest.publishedAt)}
          </time>
        </header>
        <ArticleProse html={post.html} />
      </article>
    </>
  );
}
