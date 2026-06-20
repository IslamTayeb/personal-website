import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { chromium, type Browser, type Page } from '@playwright/test';
import { getListedPosts } from '../lib/blog/posts';

const root = process.cwd();
const port = 3011;
let baseUrl = `http://localhost:${port}`;
const existingBaseUrl = process.env.VISUAL_BASE_URL ?? 'http://localhost:3002';
const screenshotDir = path.join(root, 'test-results', 'visual');

async function isServerReady(url: string) {
  try {
    const response = await fetch(url);

    return response.ok;
  } catch {
    return false;
  }
}

async function waitForServer(url: string) {
  const deadline = Date.now() + 45_000;

  while (Date.now() < deadline) {
    if (await isServerReady(url)) {
      return;
    }

    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  throw new Error(`Timed out waiting for ${url}`);
}

async function screenshot(page: Page, name: string) {
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({
    path: path.join(screenshotDir, `${name}.png`),
    fullPage: true,
  });
}

async function assertHomeMeasurements(page: Page) {
  const measurements = await page.evaluate(() => {
    const main = document.querySelector('main');
    const band = document.querySelector('[data-testid="royb-band"]');
    const title = document.querySelector('[data-testid="hero-title"]');
    const header = document.querySelector('[data-testid="site-header"]');
    const themeToggle = document.querySelector('[data-testid="theme-toggle"]');
    const detail = document.querySelector('[data-testid="course-detail"]');
    const section = document.querySelector('section');
    const panel = document.querySelector('[data-testid="bordered-panel"]');
    const connectors = [
      ...document.querySelectorAll('[data-testid="rail-connector"]'),
    ];
    const dots = [...document.querySelectorAll('[data-testid="rail-dot"]')];
    const firstConnector = connectors[0]?.getBoundingClientRect();
    const firstDot = dots[0]?.getBoundingClientRect();
    const secondDot = dots[1]?.getBoundingClientRect();
    const experienceGroups = [
      ...document.querySelectorAll('[data-testid="experience-group"]'),
    ].map((group) => {
      const label = group.querySelector(
        '[data-testid="experience-group-label"]'
      );
      const railTitle = group.querySelector('[data-testid="rail-title"]');
      const labelRect = label?.getBoundingClientRect();
      const railTitleRect = railTitle?.getBoundingClientRect();

      return {
        group: group.getAttribute('data-group'),
        labelLeft: labelRect ? Number(labelRect.left.toFixed(2)) : null,
        railTitleLeft: railTitleRect
          ? Number(railTitleRect.left.toFixed(2))
          : null,
      };
    });

    return {
      mainWidth: main?.getBoundingClientRect().width ?? 0,
      bandHeight: band?.getBoundingClientRect().height ?? 0,
      heroTitleText: title?.textContent?.replace(/\s+/g, ' ').trim() ?? '',
      titleRight: title?.getBoundingClientRect().right ?? 0,
      headerText: header?.textContent?.replace(/\s+/g, ' ').trim() ?? '',
      hasThemeToggle: Boolean(themeToggle),
      viewportWidth: window.innerWidth,
      courseDetailHeight: detail?.getBoundingClientRect().height ?? 0,
      showMoreText:
        [...document.querySelectorAll('button')]
          .find((button) => button.textContent?.trim() === 'show more')
          ?.textContent?.trim() ?? '',
      experienceGroups,
      sectionPaddingTop: section
        ? Number.parseFloat(getComputedStyle(section).paddingTop)
        : 0,
      panelPaddingTop: panel
        ? Number.parseFloat(getComputedStyle(panel).paddingTop)
        : 0,
      railTopGap:
        firstConnector && firstDot
          ? Math.round(
              firstConnector.top - (firstDot.top + firstDot.height / 2)
            )
          : null,
      railBottomGap:
        firstConnector && secondDot
          ? Math.round(
              secondDot.top + secondDot.height / 2 - firstConnector.bottom
            )
          : null,
    };
  });

  assert.ok(measurements.mainWidth <= 800, 'main document should stay narrow');
  assert.equal(measurements.bandHeight, 4, 'ROYB bar should be 4px tall');
  assert.equal(
    measurements.heroTitleText,
    'Islam Tayeb',
    'hero title should use the plain name'
  );
  assert.ok(
    measurements.titleRight < measurements.viewportWidth,
    'hero title should not overflow'
  );
  assert.ok(measurements.hasThemeToggle, 'header should include theme toggle');
  for (const label of ['experience', 'publications', 'courses', 'writing']) {
    assert.ok(
      !measurements.headerText.includes(label),
      `header should not include ${label} shortcut`
    );
  }
  assert.equal(
    measurements.showMoreText,
    'show more',
    'collapsed experience control should not include a count'
  );
  assert.equal(
    measurements.courseDetailHeight,
    33,
    'course detail height should be stable'
  );
  assert.ok(
    measurements.sectionPaddingTop <= 32,
    'section spacing should stay compact'
  );
  assert.ok(
    measurements.panelPaddingTop <= 16,
    'panel padding should stay compact'
  );

  if (measurements.railTopGap !== null && measurements.railBottomGap !== null) {
    assert.ok(
      measurements.railTopGap > 0,
      'rail line should start below current dot'
    );
    assert.ok(
      Math.abs(measurements.railTopGap - measurements.railBottomGap) <= 10,
      `rail connector gaps should be visually close: ${measurements.railTopGap} / ${measurements.railBottomGap}`
    );
  }

  for (const group of measurements.experienceGroups) {
    assert.ok(group.labelLeft !== null, `${group.group} label should exist`);
    assert.ok(
      group.railTitleLeft !== null,
      `${group.group} first rail title should exist`
    );
    assert.ok(
      Math.abs(group.labelLeft - group.railTitleLeft) <= 1,
      `${group.group} label should align to first rail title: ${group.labelLeft} / ${group.railTitleLeft}`
    );
  }
}

async function assertCourseHeightIsStable(page: Page) {
  const before = await page
    .locator('[data-testid="course-detail"]')
    .boundingBox();
  await page.getByRole('button', { name: 'Operating Systems' }).click();
  const after = await page
    .locator('[data-testid="course-detail"]')
    .boundingBox();

  assert.equal(
    before?.height,
    after?.height,
    'course selected and empty states should match height'
  );
}

async function assertThemeToggleIsStable(page: Page) {
  const before = await page.locator('main').boundingBox();
  const beforeClass = await page.locator('html').getAttribute('class');

  await page.getByTestId('theme-toggle').click();
  await page.waitForFunction(
    (initial) => document.documentElement.className !== initial,
    beforeClass
  );

  const afterClass = await page.locator('html').getAttribute('class');
  const after = await page.locator('main').boundingBox();

  assert.ok(
    afterClass?.includes('dark') || afterClass?.includes('light'),
    'theme toggle should set an explicit root theme class'
  );
  assert.equal(
    Math.round(before?.width ?? 0),
    Math.round(after?.width ?? 0),
    'theme toggle should not change document width'
  );

  await page.getByTestId('theme-toggle').click();
  await page.waitForFunction(
    (current) => document.documentElement.className !== current,
    afterClass
  );
}

async function main() {
  await mkdir(screenshotDir, { recursive: true });

  const nextBin = path.join(root, 'node_modules', '.bin', 'next');
  const useExistingServer = await isServerReady(existingBaseUrl);
  const server = useExistingServer
    ? null
    : spawn(nextBin, ['dev', '-p', String(port)], {
        cwd: root,
        stdio: 'ignore',
        env: {
          ...process.env,
          NEXT_TELEMETRY_DISABLED: '1',
        },
      });

  if (useExistingServer) {
    baseUrl = existingBaseUrl;
  }

  let browser: Browser | null = null;

  try {
    await waitForServer(baseUrl);

    browser = await chromium.launch();
    const page = await browser.newPage({
      viewport: { width: 1280, height: 900 },
    });
    await page.goto(baseUrl, { waitUntil: 'networkidle' });
    await screenshot(page, 'home-desktop');
    await assertHomeMeasurements(page);
    await assertThemeToggleIsStable(page);
    await assertCourseHeightIsStable(page);
    await screenshot(page, 'home-course-deselected');

    await page.getByRole('button', { name: 'show more' }).click();
    await screenshot(page, 'home-experience-expanded');

    await page
      .getByRole('button', { name: /Machine learning for predicting/ })
      .click();
    await screenshot(page, 'home-publication-open');

    const mobile = await browser.newPage({
      viewport: { width: 390, height: 844 },
    });
    await mobile.goto(baseUrl, { waitUntil: 'networkidle' });
    await screenshot(mobile, 'home-mobile');

    const blog = await browser.newPage({
      viewport: { width: 1280, height: 900 },
    });
    await blog.goto(`${baseUrl}/blog`, { waitUntil: 'networkidle' });
    await screenshot(blog, 'blog-index');

    const [firstPost] = await getListedPosts();
    const article = await browser.newPage({
      viewport: { width: 1280, height: 900 },
    });
    await article.goto(`${baseUrl}/blog/${firstPost.manifest.slug}`, {
      waitUntil: 'networkidle',
    });
    await screenshot(article, 'blog-article');

    console.log(`visual ok: screenshots written to ${screenshotDir}`);
  } finally {
    await browser?.close();
    server?.kill();
  }
}

main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
