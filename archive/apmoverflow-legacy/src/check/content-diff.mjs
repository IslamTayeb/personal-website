import { readFile } from 'node:fs/promises';

import { loadMarkdownPosts, postOutputPath } from '../content/load-posts.mjs';
import { renderMarkdownPost } from '../markdown/render-markdown.mjs';
import { renderPostPage } from '../render/post-page.mjs';
import { htmlToTextLines } from '../utils/html.mjs';

function lcsMatrix(left, right) {
  const rows = left.length + 1;
  const columns = right.length + 1;
  const matrix = Array.from({ length: rows }, () => Array(columns).fill(0));

  for (let row = left.length - 1; row >= 0; row -= 1) {
    for (let column = right.length - 1; column >= 0; column -= 1) {
      matrix[row][column] =
        left[row] === right[column]
          ? matrix[row + 1][column + 1] + 1
          : Math.max(matrix[row + 1][column], matrix[row][column + 1]);
    }
  }

  return matrix;
}

function diffLines(left, right) {
  const matrix = lcsMatrix(left, right);
  const output = [];
  let leftIndex = 0;
  let rightIndex = 0;

  while (leftIndex < left.length && rightIndex < right.length) {
    if (left[leftIndex] === right[rightIndex]) {
      leftIndex += 1;
      rightIndex += 1;
    } else if (
      matrix[leftIndex + 1][rightIndex] >= matrix[leftIndex][rightIndex + 1]
    ) {
      output.push(`- ${left[leftIndex]}`);
      leftIndex += 1;
    } else {
      output.push(`+ ${right[rightIndex]}`);
      rightIndex += 1;
    }
  }

  while (leftIndex < left.length) {
    output.push(`- ${left[leftIndex]}`);
    leftIndex += 1;
  }

  while (rightIndex < right.length) {
    output.push(`+ ${right[rightIndex]}`);
    rightIndex += 1;
  }

  return output;
}

function renderedHtmlForPost(post) {
  const rendered = renderMarkdownPost(post);

  return renderPostPage(rendered);
}

export async function checkContentDiff() {
  const posts = await loadMarkdownPosts();
  const failures = [];

  for (const post of posts) {
    const currentHtml = await readFile(postOutputPath(post), 'utf8');
    const nextHtml = renderedHtmlForPost(post);
    const currentText = htmlToTextLines(currentHtml);
    const nextText = htmlToTextLines(nextHtml);

    if (currentText.join('\n') === nextText.join('\n')) {
      continue;
    }

    failures.push({
      slug: post.manifest.slug,
      diff: diffLines(currentText, nextText).slice(0, 80),
    });
  }

  if (failures.length > 0) {
    const details = failures
      .map(
        (failure) =>
          `Content drift for ${failure.slug}:\n${failure.diff.join('\n')}`
      )
      .join('\n\n');

    throw new Error(details);
  }
}
