import { escapeHtml } from './html';

export function codeBlockHtml({
  highlighted,
  lang,
}: {
  highlighted: string;
  lang: string;
}) {
  const safeLang = escapeHtml(lang);

  return `<div class="article-code-block article-code-block-blue highlight" data-code-theme="blue"><pre><code class="hljs language-${safeLang}">${highlighted}</code></pre></div>\n`;
}
