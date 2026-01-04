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

function stripHtml(html: string): string {
  return html
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/<[^>]*>/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

async function getBlogPosts(): Promise<BlogPost[]> {
  try {
    const res = await fetch('https://islamtayeb.bearblog.dev/feed/?type=rss', {
      next: { revalidate: 3600 },
    });
    const xml = await res.text();

    const items: BlogPost[] = [];
    const itemRegex = /<item>([\s\S]*?)<\/item>/g;
    let match;

    while ((match = itemRegex.exec(xml)) !== null) {
      const item = match[1];

      const titleMatch = item.match(
        /<title>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/title>/
      );
      const linkMatch = item.match(/<link>([\s\S]*?)<\/link>/);
      const pubDateMatch = item.match(/<pubDate>([\s\S]*?)<\/pubDate>/);
      const descMatch = item.match(
        /<description>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/description>/
      );

      if (titleMatch && linkMatch) {
        const title = titleMatch[1].trim();
        const description = descMatch ? stripHtml(descMatch[1]) : '';

        items.push({
          id: generateHash(title),
          title,
          date: pubDateMatch ? formatDate(pubDateMatch[1]) : '',
          excerpt:
            description.slice(0, 100) + (description.length > 100 ? '...' : ''),
          url: linkMatch[1].trim(),
        });
      }
    }

    return items.slice(0, 3);
  } catch (error) {
    console.error('Failed to fetch blog posts:', error);
    return [];
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
        <div className="absolute top-4 left-0 right-0 h-px bg-muted-foreground/30" />

        {/* Posts */}
        <div className="grid grid-cols-3 gap-6 pb-4">
          {posts.map((post, index) => (
            <div
              key={post.id}
              className="group relative pt-10"
            >
              {/* Node */}
              <div className="absolute top-0 left-0 w-8 h-8 rounded-full border-2 border-muted-foreground/50 bg-background flex items-center justify-center group-hover:border-foreground transition-colors z-10">
                <div className="w-3 h-3 rounded-full bg-muted-foreground/50 group-hover:bg-foreground transition-colors" />
              </div>

              {/* Content */}
              <div>
                <span className="text-sm text-muted-foreground/60 uppercase tracking-wider font-mono">
                  {post.date}
                </span>
                <Link
                  href={post.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block mt-1"
                >
                  <h3 className="font-sans text-base text-foreground leading-snug underline underline-offset-2 hover:no-underline line-clamp-2">
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
