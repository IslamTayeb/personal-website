import Link from 'next/link';
import { Section } from './Misc/Section';
import { Badge } from '@/components/ui/badge';

interface BlogPost {
  id: string;
  title: string;
  date: string;
  excerpt: string;
  url: string;
}

interface BlogListItem {
  title: string;
  publishedAt: string;
  url: string;
}

const BLOG_HOME_URL = 'https://apmoverflow.xyz/';
const BLOG_INDEX_URL = 'https://apmoverflow.xyz/blog/';
const BLOG_FEED_URL = 'https://apmoverflow.xyz/feed/';
const MAX_POSTS = 3;

function generateHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(16).slice(0, 7).padStart(7, '0');
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

function decodeHtmlEntities(value: string): string {
  const namedEntities: Record<string, string> = {
    amp: '&',
    apos: "'",
    gt: '>',
    lt: '<',
    nbsp: ' ',
    quot: '"',
  };

  return value
    .replace(/&#(\d+);/g, (_, codePoint: string) =>
      String.fromCodePoint(Number.parseInt(codePoint, 10))
    )
    .replace(/&#x([0-9a-f]+);/gi, (_, codePoint: string) =>
      String.fromCodePoint(Number.parseInt(codePoint, 16))
    )
    .replace(/&([a-z]+);/gi, (entity, name: string) => {
      return namedEntities[name.toLowerCase()] ?? entity;
    });
}

function stripHtml(html: string): string {
  return decodeHtmlEntities(html)
    .replace(/<[^>]*>/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

async function fetchText(url: string): Promise<string> {
  const res = await fetch(url, {
    next: { revalidate: 3600 },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch ${url}: ${res.status}`);
  }

  return res.text();
}

function absoluteBlogUrl(href: string): string {
  return new URL(href, BLOG_HOME_URL).toString();
}

function excerptFromPostHtml(html: string): string {
  const mainMatch = html.match(/<main>([\s\S]*?)<\/main>/);
  const main = mainMatch ? mainMatch[1] : html;
  const paragraphs = Array.from(main.matchAll(/<p(?:\s[^>]*)?>[\s\S]*?<\/p>/g));
  const paragraph = paragraphs
    .map((paragraphMatch) => paragraphMatch[0].trim())
    .find(
      (paragraphHtml) =>
        !paragraphHtml.includes('<time ') && stripHtml(paragraphHtml).length > 0
    );

  return paragraph ? stripHtml(paragraph) : '';
}

function toExcerpt(description: string): string {
  return description.slice(0, 100) + (description.length > 100 ? '...' : '');
}

function parseBlogIndex(html: string): BlogListItem[] {
  const items = Array.from(html.matchAll(/<li>([\s\S]*?)<\/li>/g))
    .map(([, item]) => {
      const timeMatch = item.match(/<time\s+datetime=["']([^"']+)["'][^>]*>/);
      const linkMatch = item.match(
        /<a\b[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a\s*>/
      );

      if (!timeMatch || !linkMatch) {
        return null;
      }

      return {
        title: stripHtml(linkMatch[2]),
        publishedAt: timeMatch[1],
        url: absoluteBlogUrl(linkMatch[1]),
      };
    })
    .filter((item): item is BlogListItem => item !== null);

  return items.sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}

async function getBlogPostsFromIndex(): Promise<BlogPost[]> {
  const html = await fetchText(BLOG_INDEX_URL);
  const items = parseBlogIndex(html).slice(0, MAX_POSTS);

  return Promise.all(
    items.map(async (item) => {
      let description = '';

      try {
        description = excerptFromPostHtml(await fetchText(item.url));
      } catch (error) {
        console.error(`Failed to fetch blog post ${item.url}:`, error);
      }

      return {
        id: generateHash(item.url),
        title: item.title,
        date: formatDate(item.publishedAt),
        excerpt: toExcerpt(description),
        url: item.url,
      };
    })
  );
}

async function getBlogPostsFromFeed(): Promise<BlogPost[]> {
  const xml = await fetchText(BLOG_FEED_URL);
  const items: BlogPost[] = [];
  const entryRegex = /<entry>([\s\S]*?)<\/entry>/g;
  let match;

  while ((match = entryRegex.exec(xml)) !== null) {
    const entry = match[1];

    const titleMatch = entry.match(
      /<title>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/title>/
    );
    const linkMatch = entry.match(
      /<link[^>]+href=["']([^"']+)["'][^>]*rel=["']alternate["']/
    );
    const publishedMatch = entry.match(/<published>([\s\S]*?)<\/published>/);
    const contentMatch = entry.match(
      /<content[^>]*>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/content>/
    );

    if (titleMatch && linkMatch) {
      const title = stripHtml(titleMatch[1]);
      const description = contentMatch ? stripHtml(contentMatch[1]) : '';

      items.push({
        id: generateHash(linkMatch[1]),
        title,
        date: publishedMatch ? formatDate(publishedMatch[1]) : '',
        excerpt: toExcerpt(description),
        url: linkMatch[1].trim(),
      });
    }
  }

  return items.slice(0, MAX_POSTS);
}

async function getBlogPosts(): Promise<BlogPost[]> {
  try {
    return await getBlogPostsFromIndex();
  } catch (error) {
    console.error('Failed to fetch blog index:', error);

    try {
      return await getBlogPostsFromFeed();
    } catch (feedError) {
      console.error('Failed to fetch blog feed:', feedError);
      return [];
    }
  }
}

export async function Blog() {
  const posts = await getBlogPosts();

  if (posts.length === 0) {
    return null;
  }

  return (
    <Section className="font-sans flex-col gap-4">
      <Badge variant={'outline'} className="mb-4" id="blog">
        Blog
      </Badge>

      <div className="relative">
        {/* Horizontal line */}
        <div className="absolute top-4 left-0 right-0 hidden h-px bg-muted-foreground/30 sm:block" />

        {/* Posts */}
        <div className="grid grid-cols-1 gap-6 pb-4 sm:grid-cols-3">
          {posts.map((post, index) => (
            <div key={post.id} className="group relative pt-10">
              {/* Node */}
              <div className="absolute top-0 left-0 w-8 h-8 rounded-full border-2 border-muted-foreground/50 bg-background flex items-center justify-center group-hover:border-foreground transition-colors z-10">
                <div className="w-3 h-3 rounded-full bg-muted-foreground/50 group-hover:bg-foreground transition-colors" />
              </div>

              {/* Content */}
              <div className="min-w-0">
                <span className="text-sm text-muted-foreground/60 uppercase tracking-wider font-mono">
                  {post.date}
                </span>
                <Link
                  href={post.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block mt-1 min-w-0"
                >
                  <h3 className="font-sans text-base text-foreground leading-snug underline underline-offset-2 hover:no-underline truncate">
                    {post.title}
                    {index === 0 && (
                      <Badge
                        variant="default"
                        className="ml-1.5 no-underline rounded-md text-[0.6rem] px-1 py-[0.05rem] h-fit font-mono leading-tight align-middle"
                      >
                        New
                      </Badge>
                    )}
                  </h3>
                </Link>
                <p className="text-sm text-muted-foreground/60 mt-1 line-clamp-2">
                  {post.excerpt}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end w-full">
        <Link
          href="https://apmoverflow.xyz/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs leading-none text-muted-foreground/80 flex items-center underline hover:no-underline font-mono tracking-wide"
        >
          See more on my blog...
        </Link>
      </div>
    </Section>
  );
}
