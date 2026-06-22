import { escapeHtml } from './html';

export type CodeBlockTheme = 'blue' | 'royb' | 'saturated';

export const defaultCodeBlockTheme: CodeBlockTheme = 'blue';

export function codeBlockHtml({
  highlighted,
  lang,
  theme = defaultCodeBlockTheme,
}: {
  highlighted: string;
  lang: string;
  theme?: CodeBlockTheme;
}) {
  const safeLang = escapeHtml(lang);

  return `<div class="article-code-block article-code-block-${theme} highlight" data-code-theme="${theme}"><pre><code class="hljs language-${safeLang}">${highlighted}</code></pre></div>\n`;
}
