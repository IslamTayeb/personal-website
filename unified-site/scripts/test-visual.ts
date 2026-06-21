import assert from 'node:assert/strict';
import { mkdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { chromium, type Browser, type Page } from '@playwright/test';
import { externalWriting } from '../data/external-writing';
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

async function assertThemeBootstrapBeforeHeader() {
  const html = await fetch(baseUrl).then((response) => response.text());
  const scriptIndex = html.indexOf('window.localStorage.getItem');
  const headerIndex = html.indexOf('data-testid="site-header"');

  assert.ok(scriptIndex >= 0, 'theme bootstrap script should render');
  assert.ok(headerIndex >= 0, 'site header should render');
  assert.ok(
    scriptIndex < headerIndex,
    'theme bootstrap should run before visible header markup'
  );
}

async function assertRoybBandPlacement(page: Page) {
  const placement = await page.evaluate(() => {
    const header = document.querySelector('[data-testid="site-header"]');
    const wrap = document.querySelector('[data-testid="royb-band-wrap"]');
    const band = document.querySelector('[data-testid="royb-band"]');
    const nextContent = document.querySelector(
      'main > section header span, [data-testid="blog-article-title"]'
    );

    return {
      headerBottom: header?.getBoundingClientRect().bottom ?? 0,
      wrapTop: wrap?.getBoundingClientRect().top ?? 0,
      wrapBottom: wrap?.getBoundingClientRect().bottom ?? 0,
      bandTop: band?.getBoundingClientRect().top ?? 0,
      bandBottom: band?.getBoundingClientRect().bottom ?? 0,
      bandHeight: band?.getBoundingClientRect().height ?? 0,
      nextContentTop: nextContent?.getBoundingClientRect().top ?? 0,
    };
  });

  const topGap = placement.bandTop - placement.headerBottom;
  const bottomGap = placement.nextContentTop - placement.bandBottom;

  assert.equal(placement.bandHeight, 4, 'ROYB bar should be 4px tall');
  assert.ok(topGap >= 16, `ROYB top gap should be doubled: ${topGap}px`);
  assert.ok(
    Math.abs(topGap - bottomGap) <= 2,
    `ROYB gap above and below should match visually: ${topGap}px / ${bottomGap}px`
  );
  assert.ok(
    Math.abs(placement.wrapTop - placement.headerBottom) <= 1,
    'ROYB wrapper should stay directly after the sticky header'
  );

  return {
    topGap: Number(topGap.toFixed(2)),
    bottomGap: Number(bottomGap.toFixed(2)),
  };
}

async function assertVisibleOneLineDescriptions(page: Page) {
  const failures = await page.evaluate(() =>
    [...document.querySelectorAll<HTMLElement>('[data-one-line="true"]')]
      .filter((element) => {
        const rect = element.getBoundingClientRect();

        return rect.width > 0 && rect.height > 0;
      })
      .map((element) => {
        const style = getComputedStyle(element);
        const rect = element.getBoundingClientRect();
        const lineHeight = Number.parseFloat(style.lineHeight);

        return {
          text: element.textContent?.replace(/\s+/g, ' ').trim(),
          whiteSpace: style.whiteSpace,
          overflowX: style.overflowX,
          height: Number(rect.height.toFixed(2)),
          lineHeight,
        };
      })
      .filter(
        (item) =>
          item.whiteSpace !== 'nowrap' ||
          item.overflowX !== 'hidden' ||
          item.height > item.lineHeight * 1.5
      )
  );

  assert.deepEqual(failures, [], 'visible descriptions should be one line');
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

async function assertScrollbarStyles() {
  const css = await readFile(path.join(root, 'app', 'globals.css'), 'utf8');

  assert.ok(
    css.includes('scrollbar-gutter: auto'),
    'scrollbars should appear only when overflow needs them'
  );
  assert.ok(
    css.includes('::-webkit-scrollbar-thumb') &&
      css.includes('border-radius: 0 !important'),
    'scrollbar thumb should be square'
  );
  assert.ok(
    css.includes('var(--section-color, var(--roy-b)) 20%') &&
      !css.includes('--roy-r-highlight') &&
      !css.includes('--section-highlight'),
    'link hover highlight should use section color at 20% alpha'
  );
  assert.ok(
    css.includes('--rail-gutter: 1.75rem') &&
      css.includes('--rail-marker-size: 0.75rem'),
    'rail gutter and marker sizing should be centralized as root tokens'
  );
}

async function assertHome(page: Page) {
  const result = await page.evaluate(() => {
    const main = document.querySelector('main');
    const header = document.querySelector('[data-testid="site-header"]');
    const wordmarkLinks = [
      ...document.querySelectorAll<HTMLElement>('[data-testid="wordmark"] a'),
    ];
    const themeToggle = document.querySelector('[data-testid="theme-toggle"]');
    const themeToggleClassName = themeToggle
      ? [themeToggle, ...themeToggle.querySelectorAll('*')]
          .map((element) => element.className)
          .join(' ')
      : '';
    const heroSection = document.querySelector('[data-testid="hero-section"]');
    const heroPortrait = document.querySelector<HTMLElement>(
      '[data-testid="hero-portrait"]'
    );
    const heroPortraitStyle = heroPortrait
      ? getComputedStyle(heroPortrait)
      : null;
    const heroPortraitRect = heroPortrait?.getBoundingClientRect();
    const experienceSection = document.querySelector('#experience');
    const experienceTitle = experienceSection?.querySelector('header h2');
    const firstGroupLabel = experienceSection?.querySelector(
      '[data-testid="experience-group-label"]'
    );
    const firstRailTitle = experienceSection?.querySelector(
      '[data-testid="rail-title"]'
    );
    const footer = document.querySelector('[data-testid="site-footer"]');
    const footerSpans = [...(footer?.querySelectorAll('span') ?? [])];
    const footerUpdate = footerSpans[0];
    const footerQuote = footerSpans[1];
    const topLevelSections = [...document.querySelectorAll('main > section')];
    const rootStyle = getComputedStyle(document.documentElement);
    const sectionMarkerData = topLevelSections.map((section) => {
      const marker = section.querySelector<HTMLElement>('header span');
      const style = marker ? getComputedStyle(marker) : null;
      const rect = marker?.getBoundingClientRect();

      return {
        left: rect?.left ?? 0,
        right: rect?.right ?? 0,
        width: rect?.width ?? 0,
        center: rect ? rect.left + rect.width / 2 : 0,
        fontSize: Number.parseFloat(style?.fontSize ?? '0'),
      };
    });
    const sectionLabelLefts = topLevelSections.map(
      (section) =>
        section.querySelector<HTMLElement>('header h2')?.getBoundingClientRect()
          .left ?? 0
    );
    const sectionLefts = topLevelSections.map(
      (section) => section.getBoundingClientRect().left
    );
    const sharedRowTitleLefts = [
      experienceSection
        ?.querySelector<HTMLElement>('[data-testid="experience-group-label"]')
        ?.getBoundingClientRect().left ?? 0,
      experienceSection
        ?.querySelector<HTMLElement>('[data-testid="rail-title"]')
        ?.getBoundingClientRect().left ?? 0,
      document
        .querySelector<HTMLElement>(
          '#publications [data-testid="publication-title-wrap"]'
        )
        ?.getBoundingClientRect().left ?? 0,
      document
        .querySelector<HTMLElement>('#writing [data-testid="rail-title"]')
        ?.getBoundingClientRect().left ?? 0,
    ].filter((left) => left > 0);
    const markerData = [
      ...document.querySelectorAll<HTMLElement>(
        '[data-testid="rail-dot"], [data-testid="publication-dot"]'
      ),
    ].map((dot) => {
      const rect = dot.getBoundingClientRect();

      return {
        left: rect.left,
        width: rect.width,
        center: rect.left + rect.width / 2,
      };
    });
    const connectorCenters = [
      ...document.querySelectorAll<HTMLElement>(
        [
          '[data-testid="rail-connector"]',
          '[data-testid="publication-connector"]',
          '[data-testid="writing-action-connector"]',
          '[data-testid="publication-action-connector"]',
        ].join(', ')
      ),
    ].map((connector) => {
      const rect = connector.getBoundingClientRect();

      return rect.left + rect.width / 2;
    });
    const [writingActionRail, publicationActionRail] = [
      '#writing',
      '#publications',
    ].map((selector) => {
      const row = document.querySelector<HTMLElement>(
        `${selector} [data-testid$="action-row"]`
      );
      const connector = document.querySelector<HTMLElement>(
        `${selector} [data-testid$="action-connector"]`
      );
      const link = row?.querySelector<HTMLElement>('a, button');
      const rowRect = row?.getBoundingClientRect();
      const connectorRect = connector?.getBoundingClientRect();
      const linkRect = link?.getBoundingClientRect();
      const connectorStyle = connector ? getComputedStyle(connector) : null;

      return {
        rowExists: Boolean(row),
        connectorBackgroundImage: connectorStyle?.backgroundImage ?? '',
        connectorCenter: connectorRect
          ? connectorRect.left + connectorRect.width / 2
          : 0,
        connectorTop: connectorRect?.top ?? 0,
        connectorBottom: connectorRect?.bottom ?? 0,
        rowTop: rowRect?.top ?? 0,
        rowBottom: rowRect?.bottom ?? 0,
        linkBottom: linkRect?.bottom ?? 0,
      };
    });
    const groupChevronData = [
      ...document.querySelectorAll<SVGElement>(
        '[data-testid="experience-group-toggle"] svg'
      ),
    ].map((icon) => {
      const rect = icon.getBoundingClientRect();

      return {
        width: rect.width,
        center: rect.left + rect.width / 2,
      };
    });
    const groups = [
      ...document.querySelectorAll('[data-testid="experience-group"]'),
    ].map((group) => ({
      kind: group.getAttribute('data-group'),
      expanded:
        group
          .querySelector('[data-testid="experience-group-toggle"]')
          ?.getAttribute('aria-expanded') ?? '',
      rows: group.querySelectorAll('[data-testid="rail-title"]').length,
      text: group.textContent?.replace(/\s+/g, ' ').trim() ?? '',
      hasShowMore: [...group.querySelectorAll('button')].some(
        (button) => button.textContent?.trim() === 'see more'
      ),
      marginBottom: Number.parseFloat(getComputedStyle(group).marginBottom),
    }));
    const dots = [...document.querySelectorAll('[data-testid="rail-dot"]')].map(
      (dot) => ({
        state: dot.getAttribute('data-state'),
        className: dot.className,
        border: Number.parseFloat(getComputedStyle(dot).borderTopWidth),
        backgroundColor: getComputedStyle(dot).backgroundColor,
      })
    );
    const publicationButtons = document.querySelectorAll(
      '[data-testid="publication-row-button"]'
    );
    const publicationOpenDetails = document.querySelectorAll(
      '[data-testid="publication-open"]'
    );
    const publicationTitles = [
      ...document.querySelectorAll<HTMLElement>(
        '#publications [data-testid="publication-title"]'
      ),
    ];
    const publicationAuthors = [
      ...document.querySelectorAll('[data-testid="publication-authors"]'),
    ].map((authors) => authors.textContent?.replace(/\s+/g, ' ').trim() ?? '');
    const publicationSelfAuthors = [
      ...document.querySelectorAll('[data-testid="publication-author-self"]'),
    ].map((author) => author.textContent?.trim() ?? '');
    const writingDots = [
      ...(document
        .querySelector('#writing')
        ?.querySelectorAll('[data-testid="rail-dot"]') ?? []),
    ].map((dot) => dot.className);
    const writingNewTags = [
      ...(document.querySelector('#writing')?.querySelectorAll('span') ?? []),
    ]
      .map((element) => element.textContent?.trim() ?? '')
      .filter((text) => text === 'New');
    const writingMeta = [
      ...(document
        .querySelector('#writing')
        ?.querySelectorAll('[data-testid="writing-row-meta"]') ?? []),
    ].map((meta) => meta.textContent?.replace(/\s+/g, ' ').trim() ?? '');
    const writingDates = [
      ...(document
        .querySelector('#writing')
        ?.querySelectorAll('[data-testid="rail-title"]') ?? []),
    ].map(
      (title) =>
        title.nextElementSibling?.textContent?.replace(/\s+/g, ' ').trim() ?? ''
    );
    const writingDescriptions = [
      ...(document
        .querySelector('#writing')
        ?.querySelectorAll('p[data-one-line="true"]') ?? []),
    ];
    const writingConnectors = [
      ...(document
        .querySelector('#writing')
        ?.querySelectorAll<HTMLElement>('[data-testid="rail-connector"]') ??
        []),
    ].map((connector) => {
      const style = getComputedStyle(connector);

      return {
        backgroundImage: style.backgroundImage,
        backgroundColor: style.backgroundColor,
      };
    });
    const publicationDots = [
      ...(document
        .querySelector('#publications')
        ?.querySelectorAll('[data-testid="publication-dot"]') ?? []),
    ].map((dot) => dot.className);
    const publicationConnectors = [
      ...document.querySelectorAll<HTMLElement>(
        '#publications [data-testid="publication-connector"]'
      ),
    ].map((connector) => {
      const style = getComputedStyle(connector);

      return {
        backgroundImage: style.backgroundImage,
        backgroundColor: style.backgroundColor,
      };
    });
    const publicationMetaLines = [
      ...(document
        .querySelector('#publications')
        ?.querySelectorAll('[data-testid="publication-meta-line"]') ?? []),
    ].map((meta) => meta.className);
    const publicationDateStyles = [
      ...(document
        .querySelector('#publications')
        ?.querySelectorAll('[data-testid="publication-date"]') ?? []),
    ].map((date) => {
      const style = getComputedStyle(date);

      return {
        fontSize: Number.parseFloat(style.fontSize),
        textTransform: style.textTransform,
        letterSpacing: style.letterSpacing,
        color: style.color,
      };
    });
    const mutedProbe = document.createElement('span');

    mutedProbe.style.color = 'var(--muted-foreground)';
    document.body.append(mutedProbe);
    const mutedToken = getComputedStyle(mutedProbe).color;
    mutedProbe.remove();

    const seeMoreActionStyles = [...document.querySelectorAll('a, button')]
      .filter((element) =>
        /see more/i.test(element.textContent?.replace(/\s+/g, ' ') ?? '')
      )
      .map((element) => {
        const style = getComputedStyle(element);

        return {
          text: element.textContent?.replace(/\s+/g, ' ').trim() ?? '',
          color: style.color,
          fontSize: Number.parseFloat(style.fontSize),
          fontVariantCaps: style.fontVariantCaps,
          textTransform: style.textTransform,
        };
      });

    return {
      mainWidth: main?.getBoundingClientRect().width ?? 0,
      bodyText: document.body.textContent?.replace(/\s+/g, ' ').trim() ?? '',
      headerText: header?.textContent?.replace(/\s+/g, ' ').trim() ?? '',
      wordmarkLinkDisplays: wordmarkLinks.map(
        (link) => getComputedStyle(link).display
      ),
      headerPaddingLeft: header
        ? Number.parseFloat(getComputedStyle(header).paddingLeft)
        : 0,
      headerPaddingRight: header
        ? Number.parseFloat(getComputedStyle(header).paddingRight)
        : 0,
      themeToggleText:
        themeToggle?.textContent?.replace(/\s+/g, ' ').trim() ?? '',
      themeToggleClassName,
      heroTitle:
        document
          .querySelector('[data-testid="hero-title"]')
          ?.textContent?.replace(/\s+/g, ' ')
          .trim() ?? '',
      heroContactText:
        heroSection?.textContent?.replace(/\s+/g, ' ').trim() ?? '',
      heroPortraitWidth: heroPortraitRect?.width ?? 0,
      heroPortraitHeight: heroPortraitRect?.height ?? 0,
      heroPortraitBorderTop: heroPortraitStyle?.borderTopWidth ?? '',
      heroPortraitObjectFit: heroPortraitStyle?.objectFit ?? '',
      sectionMarkers: topLevelSections.map(
        (section) =>
          section
            .querySelector('header span')
            ?.textContent?.replace(/\s+/g, ' ')
            .trim() ?? ''
      ),
      sectionLabels: topLevelSections.map(
        (section) =>
          section
            .querySelector('header h2')
            ?.textContent?.replace(/\s+/g, ' ')
            .trim() ?? ''
      ),
      sectionBorders: topLevelSections.map((section) =>
        Number.parseFloat(getComputedStyle(section).borderTopWidth)
      ),
      railGutter: rootStyle.getPropertyValue('--rail-gutter').trim(),
      railMarkerSize: rootStyle.getPropertyValue('--rail-marker-size').trim(),
      sectionLabelLefts,
      sectionLefts,
      sectionMarkerLefts: sectionMarkerData.map((marker) => marker.left),
      sectionMarkerRights: sectionMarkerData.map((marker) => marker.right),
      sectionMarkerWidths: sectionMarkerData.map((marker) => marker.width),
      sectionMarkerCenters: sectionMarkerData.map((marker) => marker.center),
      sectionMarkerFontSizes: sectionMarkerData.map(
        (marker) => marker.fontSize
      ),
      sharedRowTitleLefts,
      markerLefts: markerData.map((marker) => marker.left),
      markerWidths: markerData.map((marker) => marker.width),
      markerCenters: markerData.map((marker) => marker.center),
      connectorCenters,
      groupChevronWidths: groupChevronData.map((icon) => icon.width),
      groupChevronCenters: groupChevronData.map((icon) => icon.center),
      experienceTitleLeft: experienceTitle?.getBoundingClientRect().left ?? 0,
      firstGroupLabelLeft: firstGroupLabel?.getBoundingClientRect().left ?? 0,
      firstRailTitleLeft: firstRailTitle?.getBoundingClientRect().left ?? 0,
      experienceLegendExists: Boolean(
        experienceSection?.querySelector('[data-testid="experience-legend"]')
      ),
      groups,
      dots,
      writingDots,
      writingNewTags,
      writingMeta,
      writingDates,
      writingDescriptionCount: writingDescriptions.length,
      writingConnectors,
      writingActionRail,
      publicationDots,
      publicationConnectors,
      publicationActionRail,
      publicationMetaLines,
      publicationDateStyles,
      publicationAuthors,
      publicationSelfAuthors,
      hasCoursesSection: Boolean(document.querySelector('#courses')),
      publicationsTitle:
        document
          .querySelector('#publications header h2')
          ?.textContent?.replace(/\s+/g, ' ')
          .trim() ?? '',
      publicationRailExists: Boolean(
        document.querySelector('[data-testid="publication-rail"]')
      ),
      publicationButtonCount: publicationButtons.length,
      publicationOpenDetailCount: publicationOpenDetails.length,
      publicationTitleCount: publicationTitles.length,
      publicationTitleTexts: publicationTitles.map(
        (title) => title.textContent?.replace(/\s+/g, ' ').trim() ?? ''
      ),
      publicationTitleSubscripts: publicationTitles.map((title) =>
        [...title.querySelectorAll('sub')].map(
          (subscript) => subscript.textContent ?? ''
        )
      ),
      publicationTitleHrefs: publicationTitles.map((title) =>
        title instanceof HTMLAnchorElement ? title.href : ''
      ),
      publicationTitleDecorations: publicationTitles.map(
        (title) => getComputedStyle(title).textDecorationLine
      ),
      publicationTitleClassName: publicationTitles[0]?.className ?? '',
      mutedToken,
      seeMoreActionStyles,
      footerBorderTopWidth: footer
        ? Number.parseFloat(getComputedStyle(footer).borderTopWidth)
        : 0,
      footerRight: footer?.getBoundingClientRect().right ?? 0,
      footerUpdateLeft: footerUpdate?.getBoundingClientRect().left ?? 0,
      footerLeft: footer?.getBoundingClientRect().left ?? 0,
      footerQuoteRight: footerQuote?.getBoundingClientRect().right ?? 0,
      footerUpdateText:
        footerUpdate?.textContent?.replace(/\s+/g, ' ').trim() ?? '',
      footerQuoteText:
        footerQuote?.textContent?.replace(/\s+/g, ' ').trim() ?? '',
      footerText: footer?.textContent?.replace(/\s+/g, ' ').trim() ?? '',
    };
  });

  assert.ok(result.mainWidth <= 800, 'main document should stay narrow');
  assert.equal(result.heroTitle, 'Islam Tayeb');
  assert.ok(result.heroPortraitWidth > 0, 'hero portrait should render');
  assert.ok(
    Math.abs(result.heroPortraitWidth - result.heroPortraitHeight) <= 1,
    'hero portrait should be square'
  );
  assert.equal(result.heroPortraitBorderTop, '0px');
  assert.equal(result.heroPortraitObjectFit, 'cover');
  assert.deepEqual(result.sectionMarkers, ['§1', '§2', '§3', '§4']);
  assert.deepEqual(result.sectionLabels, [
    'About',
    'Experience',
    'Selected Publications',
    'Writing',
  ]);
  assert.deepEqual(
    result.sectionBorders,
    result.sectionBorders.map(() => 0),
    'top-level section dividers should stay disabled'
  );
  assert.equal(Number.parseFloat(result.railGutter), 1.75);
  assert.equal(Number.parseFloat(result.railMarkerSize), 0.75);
  assert.ok(
    result.sectionLabelLefts.every(
      (left) => Math.abs(left - result.sectionLabelLefts[0]) <= 1
    ),
    'top-level section labels should share one content edge'
  );
  assert.ok(
    result.sharedRowTitleLefts.every(
      (left) => Math.abs(left - result.sectionLabelLefts[0]) <= 1
    ),
    'rail row titles should align with top-level section labels'
  );
  assert.ok(
    result.sectionLefts.every(
      (left) => Math.abs(left - result.sectionLefts[0]) <= 1
    ),
    'top-level sections should share one left edge'
  );
  assert.ok(
    result.sectionMarkerLefts.every(
      (left) => Math.abs(left - result.sectionLefts[0]) <= 1
    ),
    'section markers should touch the section left edge'
  );
  assert.ok(
    result.markerLefts.every(
      (left) => Math.abs(left - result.sectionLefts[0]) <= 1
    ),
    'rail markers should touch the section left edge'
  );
  assert.ok(
    result.sectionMarkerRights.every(
      (right) => result.sectionLabelLefts[0] - right >= 8
    ),
    'section markers should remain in the rail gutter before content text'
  );
  assert.ok(
    result.sectionMarkerFontSizes.every((size) => Math.round(size) === 12),
    'section markers should stay at the same 12px bottleneck size'
  );
  assert.ok(
    result.markerWidths.every((width) => Math.round(width) === 12),
    'rail markers should match the shared 12px marker size'
  );
  assert.ok(
    result.groupChevronWidths.every((width) => Math.round(width) === 12),
    'experience group chevrons should match the shared marker size'
  );
  const expectedAxis = result.sectionLefts[0] + result.markerWidths[0] / 2;

  assert.ok(
    result.markerCenters.every(
      (center) => Math.abs(center - expectedAxis) <= 1
    ),
    'rail marker centers should share the left-flush rail axis'
  );
  assert.ok(
    result.connectorCenters.every(
      (center) => Math.abs(center - expectedAxis) <= 1
    ),
    'rail connectors should share the left-flush rail axis'
  );
  assert.ok(
    result.groupChevronCenters.every(
      (center) => Math.abs(center - expectedAxis) <= 1
    ),
    'experience chevrons should share the left-flush rail axis'
  );
  assert.equal(result.hasCoursesSection, false, 'Courses should stay hidden');
  assert.ok(
    !result.heroContactText.includes('location') &&
      !result.heroContactText.includes('hometown'),
    'hero metadata should only keep contact links'
  );
  for (const copy of [
    "Hey! I'm a Duke CS student based in Durham, NC, researching ML systems, particularly agent correctness and efficiency.",
    'I was born and raised in Egypt, but later moved to Taif, Saudi Arabia during high school.',
    'I also enjoy writing technical and opinion pieces.',
    'I play Tetris and Monkeytype in my free time.',
  ]) {
    assert.ok(result.bodyText.includes(copy), `hero should include: ${copy}`);
  }
  assert.ok(
    !result.bodyText.includes('Finding the Right Answer Was Never the Point'),
    'external writing should stay off the home writing preview'
  );
  assert.ok(result.bodyText.includes('islam.moh.islamm@gmail.com'));
  assert.ok(!result.bodyText.includes('islam.tayeb@duke.edu'));
  for (const label of ['experience', 'publications', 'courses', 'writing']) {
    assert.ok(
      !result.headerText.includes(label),
      `header should not include ${label} shortcut`
    );
  }
  assert.equal(result.themeToggleText, '', 'theme toggle should be icon-only');
  assert.ok(
    !result.themeToggleClassName.includes('hover:') &&
      !result.themeToggleClassName.includes('active:'),
    'theme toggle should not have hover or active visual classes'
  );
  assert.deepEqual(
    result.wordmarkLinkDisplays,
    ['flex', 'flex'],
    'wordmark links should preserve their icon/text flex layout'
  );
  assert.equal(
    result.headerPaddingLeft + result.headerPaddingRight,
    0,
    'navbar should not add left/right padding'
  );
  assert.ok(
    Math.abs(result.experienceTitleLeft - result.firstGroupLabelLeft) <= 1,
    'Experience title should align with group labels'
  );
  assert.ok(
    Math.abs(result.experienceTitleLeft - result.firstRailTitleLeft) <= 1,
    'Experience title should align with row titles'
  );

  const research = result.groups.find((group) => group.kind === 'Research');
  const engineering = result.groups.find(
    (group) => group.kind === 'Engineering'
  );
  const teaching = result.groups.find((group) => group.kind === 'Teaching');

  assert.equal(research?.expanded, 'true', 'Research should default open');
  assert.equal(research?.rows, 3, 'Research should show 3 rows when collapsed');
  assert.ok(research?.text.includes('Research (5)'));
  assert.ok(research?.text.includes('see more'));
  assert.ok(research?.text.includes('Christian Dallago'));
  assert.ok(research?.text.includes('Matthew Lentz'));
  assert.ok(research?.text.includes('Philip Romero'));
  assert.ok(research?.text.includes('Incoming Aug 2026'));
  assert.ok(research?.text.includes('+ Microsoft Research'));
  assert.ok(!research?.text.includes('% Microsoft Research'));
  assert.ok(!result.bodyText.includes('Dallago Lab'));
  assert.ok(!result.bodyText.includes('Lentz Lab'));
  assert.ok(!result.bodyText.includes('PI '));

  assert.equal(engineering?.expanded, 'true');
  assert.equal(engineering?.rows, 1);
  assert.ok(engineering?.text.includes('see more'));
  assert.equal(teaching?.expanded, 'false');
  assert.equal(teaching?.rows, 0, 'Teaching should default collapsed');
  assert.equal(teaching?.hasShowMore, false, 'Teaching should not see more');
  assert.ok(teaching?.text.includes('Teaching (3)'));
  assert.ok(
    (teaching?.marginBottom ?? 0) < (research?.marginBottom ?? 0),
    'closed groups should use tighter vertical spacing than open groups'
  );

  const incomingDots = result.dots.filter((dot) => dot.state === 'incoming');
  const presentDots = result.dots.filter((dot) => dot.state === 'present');
  const endedDots = result.dots.filter((dot) => dot.state === 'ended');

  assert.ok(incomingDots.length >= 1, 'incoming marker should render');
  assert.ok(incomingDots.every((dot) => dot.border >= 1));
  assert.ok(
    incomingDots.every((dot) => dot.backgroundColor === 'rgba(0, 0, 0, 0)'),
    'incoming rail markers should be transparent inside'
  );
  assert.ok(presentDots.every((dot) => dot.className.includes('bg-roy-o')));
  assert.ok(endedDots.every((dot) => dot.className.includes('bg-foreground')));
  assert.equal(result.experienceLegendExists, false);
  assert.ok(result.writingDots[0]?.includes('bg-roy-b'));
  assert.ok(
    result.writingDots.slice(1).every((dot) => dot.includes('bg-foreground/75'))
  );
  assert.deepEqual(result.writingNewTags, ['New']);
  assert.ok(
    result.writingMeta.every(
      (meta) => meta.includes('words') && meta.includes('min')
    )
  );
  assert.ok(
    result.writingDates.every((date) => /^[A-Z][a-z]{2} \d{4}$/.test(date)),
    'home writing dates should use month-year only'
  );
  assert.equal(
    result.writingDescriptionCount,
    0,
    'writing preview should not render post descriptions'
  );
  assert.ok(
    result.writingConnectors
      .at(-1)
      ?.backgroundImage.includes('repeating-linear-gradient'),
    'writing rail should dash into the see-more action'
  );
  assert.ok(
    result.writingActionRail.rowExists,
    'writing see-more action should be a rail row'
  );
  assert.ok(
    result.writingActionRail.connectorBackgroundImage.includes(
      'repeating-linear-gradient'
    ),
    'writing see-more action row should continue the dashed rail'
  );
  assert.ok(
    Math.abs(result.writingActionRail.connectorCenter - expectedAxis) <= 1,
    'writing action connector should stay on the shared rail axis'
  );
  assert.ok(
    Math.abs(
      result.writingActionRail.connectorBottom -
        result.writingActionRail.rowBottom
    ) <= 1,
    'writing dashed connector should reach the end of the action row'
  );

  for (const term of [
    'PyTorch',
    'FastAPI',
    'Next.js',
    'tRPC',
    'Python',
    'Research Assistant',
    'Software Engineer Intern',
  ]) {
    assert.ok(!result.bodyText.includes(term), `${term} should not render`);
  }

  assert.equal(result.publicationsTitle, 'Selected Publications');
  assert.ok(
    result.publicationRailExists,
    'publications should use rail layout'
  );
  assert.equal(
    result.publicationButtonCount,
    0,
    'publication rows should not render disclosure buttons'
  );
  assert.equal(
    result.publicationOpenDetailCount,
    0,
    'publication rows should not render explanatory detail paragraphs'
  );
  assert.ok(
    result.publicationDots.every((dot) => dot.includes('bg-foreground/75')),
    'publication rail markers should be neutral'
  );
  assert.ok(
    result.publicationConnectors
      .at(-1)
      ?.backgroundImage.includes('repeating-linear-gradient'),
    'publication rail should dash into the see-more action'
  );
  assert.ok(
    result.publicationActionRail.rowExists,
    'publication see-more action should be a rail row'
  );
  assert.ok(
    result.publicationActionRail.connectorBackgroundImage.includes(
      'repeating-linear-gradient'
    ),
    'publication see-more action row should continue the dashed rail'
  );
  assert.ok(
    Math.abs(result.publicationActionRail.connectorCenter - expectedAxis) <= 1,
    'publication action connector should stay on the shared rail axis'
  );
  assert.ok(
    Math.abs(
      result.publicationActionRail.connectorBottom -
        result.publicationActionRail.rowBottom
    ) <= 1,
    'publication dashed connector should reach the end of the action row'
  );
  assert.ok(
    result.publicationMetaLines.every(
      (className) =>
        className.includes('text-muted-foreground') &&
        !className.includes('text-roy-y')
    ),
    'publication type/venue metadata should be neutral'
  );
  assert.ok(
    result.publicationDateStyles.every((style) => style.fontSize === 10),
    'publication dates should match rail meta font size'
  );
  assert.ok(
    result.publicationAuthors.every((authors) =>
      authors.includes('Islam Tayeb')
    )
  );
  assert.equal(
    result.publicationTitleCount,
    result.publicationAuthors.length,
    'each publication title should be the row link'
  );
  assert.ok(
    result.publicationTitleHrefs.every((href) => href.startsWith('https://')),
    'publication titles should link externally'
  );
  assert.ok(
    result.publicationTitleDecorations.every((decoration) =>
      decoration.includes('underline')
    ),
    'publication title links should stay visibly underlined'
  );
  assert.deepEqual(result.publicationTitleTexts, [
    'Machine learning for predicting and optimizing the CO2 uptake in porous organic polymers',
    'Primal dual continual learning for robust antibody design',
    'Post-synthetic modification of UiO-66 analogue metal-organic framework as potential solid sorbent for direct air capture',
  ]);
  assert.deepEqual(result.publicationTitleSubscripts, [['2'], [], []]);
  assert.equal(
    result.publicationSelfAuthors.length,
    result.publicationAuthors.length,
    'each publication author row should emphasize Islam Tayeb'
  );
  assert.ok(
    result.publicationSelfAuthors.every((author) => author === 'Islam Tayeb'),
    'Islam Tayeb should be emphasized in every publication author row'
  );
  assert.ok(
    result.publicationTitleClassName.includes('text-pretty'),
    'publication titles should use pretty wrapping to avoid lonely final words'
  );
  assert.ok(
    result.publicationDateStyles.every(
      (style) => style.textTransform === 'none'
    ),
    'publication dates should keep natural month casing'
  );
  assert.ok(
    result.publicationDateStyles.every((style) => {
      const tracking =
        style.letterSpacing === 'normal'
          ? 0
          : Number.parseFloat(style.letterSpacing);

      return Number.isFinite(tracking) && tracking < 1;
    }),
    'publication dates should not use wide tracking'
  );
  assert.ok(
    result.seeMoreActionStyles.every(
      (style) => style.color === result.mutedToken
    ),
    'see more actions should use the same muted grey as metadata labels'
  );
  assert.ok(
    result.seeMoreActionStyles.every(
      (style) =>
        style.text === style.text.toLowerCase() &&
        style.fontVariantCaps === 'normal' &&
        style.fontSize >= 12 &&
        style.textTransform === 'none'
    ),
    'see more actions should stay lowercase normal text'
  );
  assert.equal(result.footerBorderTopWidth, 1);
  assert.ok(result.bodyText.includes('see more on scholar'));
  assert.ok(result.bodyText.includes('see more on blog'));
  assert.equal(result.footerUpdateText, 'Last updated Jun 21, 2026');
  assert.ok(result.footerQuoteText.includes('plz enjoy game'));
  assert.ok(result.footerQuoteText.includes('rrtyui'));
  assert.ok(!result.footerText.includes('Links:'));
  assert.ok(
    Math.abs(result.footerLeft - result.footerUpdateLeft) <= 1,
    'footer update text should sit at the left edge'
  );
  assert.ok(
    Math.abs(result.footerRight - result.footerQuoteRight) <= 1,
    'footer quote should sit at the right edge'
  );
}

async function assertMobileHeroPortraitHidden(page: Page) {
  const result = await page.evaluate(() => {
    const heroPortrait = document.querySelector<HTMLElement>(
      '[data-testid="hero-portrait"]'
    );
    const rect = heroPortrait?.getBoundingClientRect();

    return {
      exists: Boolean(heroPortrait),
      width: rect?.width ?? 0,
      height: rect?.height ?? 0,
    };
  });

  assert.equal(result.exists, true);
  assert.equal(result.width, 0);
  assert.equal(result.height, 0);
}

async function assertPublicationTitleUnderline(page: Page) {
  const firstTitle = page
    .locator('#publications [data-testid="publication-title"]')
    .first();

  await firstTitle.hover();

  const result = await page.evaluate(() => {
    const title = document.querySelector<HTMLElement>(
      '#publications [data-testid="publication-title"]:hover'
    );
    const style = title ? getComputedStyle(title) : null;
    const probe = document.createElement('span');

    probe.style.color = 'var(--roy-y)';
    document.body.append(probe);

    const yellowToken = getComputedStyle(probe).color;

    probe.remove();

    return {
      backgroundImage: style?.backgroundImage ?? '',
      backgroundSize: style?.backgroundSize ?? '',
      color: style?.color ?? '',
      decoration: style?.textDecorationLine ?? '',
      skipInk: style?.textDecorationSkipInk ?? '',
      yellowToken,
    };
  });

  assert.notEqual(result.backgroundImage, 'none');
  assert.equal(result.backgroundSize, '100% 100%');
  assert.equal(result.color, result.yellowToken);
  assert.equal(result.decoration, 'none');
  assert.equal(result.skipInk, 'auto');
}

async function assertExperienceInteractions(page: Page) {
  const groupRows = async (group: string) =>
    page
      .locator(`[data-testid="experience-group"][data-group="${group}"]`)
      .locator('[data-testid="rail-title"]')
      .count();

  assert.equal(await groupRows('Research'), 3);
  assert.equal(await groupRows('Engineering'), 1);
  assert.equal(await groupRows('Teaching'), 0);

  await page
    .locator('[data-testid="experience-group"][data-group="Research"]')
    .getByRole('button', { name: /Research \(5\)/ })
    .click();
  assert.equal(await groupRows('Research'), 0);

  await page
    .locator('[data-testid="experience-group"][data-group="Research"]')
    .getByRole('button', { name: /Research \(5\)/ })
    .click();
  assert.equal(await groupRows('Research'), 3);

  await page
    .locator('[data-testid="experience-group"][data-group="Research"]')
    .getByRole('button', { name: 'see more' })
    .click();
  assert.equal(await groupRows('Research'), 5);
  assert.equal(await groupRows('Engineering'), 1);

  await page
    .locator('[data-testid="experience-group"][data-group="Teaching"]')
    .getByRole('button', { name: /Teaching \(3\)/ })
    .click();
  assert.equal(await groupRows('Teaching'), 3);
  const teachingText = await page
    .locator('[data-testid="experience-group"][data-group="Teaching"]')
    .textContent();

  assert.ok(teachingText?.includes('Operating Systems'));
  assert.ok(teachingText?.includes('Computer Systems'));
  assert.ok(teachingText?.includes('Organic Chemistry I'));
  assert.ok(teachingText?.includes('Jan 2025 - May 2025'));
  assert.ok(!teachingText?.includes('Sophomore spring'));
  assert.equal(
    (teachingText?.match(/Matthew Lentz/g) ?? []).length,
    2,
    'Matthew Lentz should label both CS teaching rows'
  );
  assert.ok(teachingText?.includes('SAGE Tutoring'));
  await expectNoTeachingShowMore(page);
}

async function expectNoTeachingShowMore(page: Page) {
  const count = await page
    .locator('[data-testid="experience-group"][data-group="Teaching"]')
    .getByRole('button', { name: 'see more' })
    .count();

  assert.equal(count, 0, 'Teaching should not render see more');
}

async function assertHeroLinksHoverHighlight(page: Page) {
  const heroLink = page.locator('[data-testid="hero-section"] a').first();

  await heroLink.hover();

  const colors = await page.evaluate(() => {
    const link = document.querySelector<HTMLElement>(
      '[data-testid="hero-section"] a:hover'
    );
    const probe = document.createElement('span');

    probe.style.color = 'var(--roy-r)';
    document.body.append(probe);

    const linkColor = link ? getComputedStyle(link).color : '';
    const redToken = getComputedStyle(probe).color;

    probe.remove();

    return {
      linkColor,
      redToken,
      backgroundSize: link ? getComputedStyle(link).backgroundSize : '',
      textDecorationLine: link ? getComputedStyle(link).textDecorationLine : '',
      textDecorationSkipInk: link
        ? getComputedStyle(link).textDecorationSkipInk
        : '',
    };
  });

  assert.equal(colors.linkColor, colors.redToken);
  assert.equal(colors.backgroundSize, '100% 100%');
  assert.equal(colors.textDecorationLine, 'none');
  assert.equal(colors.textDecorationSkipInk, 'auto');
}

async function assertBlogIndex(page: Page) {
  const result = await page.evaluate(() => {
    const main = document.querySelector<HTMLElement>('main');
    const mainStyle = main ? getComputedStyle(main) : null;
    const header =
      document
        .querySelector('[data-testid="blog-index-header"]')
        ?.textContent?.replace(/\s+/g, ' ')
        .trim() ?? '';
    const heading =
      document
        .querySelector('#posts h2')
        ?.textContent?.replace(/\s+/g, ' ')
        .trim() ?? '';
    const headingLeft =
      document.querySelector<HTMLElement>('#posts h2')?.getBoundingClientRect()
        .left ?? 0;
    const sectionLeft =
      document.querySelector<HTMLElement>('#posts')?.getBoundingClientRect()
        .left ?? 0;
    const headerRow = document.querySelector<HTMLElement>(
      '#posts header > div'
    );
    const headerRowRect = headerRow?.getBoundingClientRect();
    const marker =
      document
        .querySelector('#posts header span')
        ?.textContent?.replace(/\s+/g, ' ')
        .trim() ?? '';
    const rail = document.querySelector('[data-testid="blog-index-rail"]');
    const items = [...(rail?.querySelectorAll<HTMLElement>('li') ?? [])];
    const legend = document.querySelector<HTMLElement>(
      '[data-testid="blog-index-legend"]'
    );
    const legendRect = legend?.getBoundingClientRect();
    const legendItems = [
      ...(legend?.querySelectorAll<HTMLElement>('span.inline-flex') ?? []),
    ].map((item) => {
      const dot = item.querySelector<HTMLElement>(
        '[data-testid="blog-index-legend-dot"]'
      );
      const dotStyle = dot ? getComputedStyle(dot) : null;

      return {
        text: item.textContent?.replace(/\s+/g, ' ').trim() ?? '',
        border: Number.parseFloat(dotStyle?.borderTopWidth ?? '0'),
        backgroundColor: dotStyle?.backgroundColor ?? '',
        width: dot?.getBoundingClientRect().width ?? 0,
      };
    });
    const itemMarkers = items.map((item) => {
      const dot = item.querySelector<HTMLElement>('[data-testid="rail-dot"]');
      const dotStyle = dot ? getComputedStyle(dot) : null;

      return {
        title:
          item
            .querySelector('[data-testid="rail-title"]')
            ?.textContent?.replace(/\s+/g, ' ')
            .trim() ?? '',
        border: Number.parseFloat(dotStyle?.borderTopWidth ?? '0'),
        backgroundColor: dotStyle?.backgroundColor ?? '',
        width: dot?.getBoundingClientRect().width ?? 0,
      };
    });
    const firstFooter = items[0]?.querySelector(
      '[data-testid="blog-index-row-meta"]'
    );
    const descriptions = rail?.querySelectorAll('p[data-one-line="true"]');
    const postDates = [
      ...(rail?.querySelectorAll('[data-testid="rail-title"]') ?? []),
    ].map(
      (title) =>
        title.nextElementSibling?.textContent?.replace(/\s+/g, ' ').trim() ?? ''
    );
    const externalRows = [
      ...document.querySelectorAll<HTMLElement>(
        '[data-testid="external-writing-row"]'
      ),
    ];
    const externalTitleLinks = [
      ...document.querySelectorAll<HTMLAnchorElement>(
        '[data-testid="external-writing-title"]'
      ),
    ];
    const externalMetas = [
      ...document.querySelectorAll<HTMLElement>(
        '[data-testid="external-writing-meta"]'
      ),
    ];
    const footer = document.querySelector('footer');

    return {
      header,
      mainLeft: main?.getBoundingClientRect().left ?? 0,
      mainContentLeft:
        (main?.getBoundingClientRect().left ?? 0) +
        Number.parseFloat(mainStyle?.paddingLeft ?? '0'),
      heading,
      headingLeft,
      sectionLeft,
      marker,
      headerRowCenter: headerRowRect
        ? headerRowRect.top + headerRowRect.height / 2
        : 0,
      legendCenter: legendRect ? legendRect.top + legendRect.height / 2 : 0,
      legendText: legend?.textContent?.replace(/\s+/g, ' ').trim() ?? '',
      legendItems,
      itemMarkers,
      itemCount: items.length,
      dotCount: rail?.querySelectorAll('[data-testid="rail-dot"]').length ?? 0,
      connectorCount:
        rail?.querySelectorAll('[data-testid="rail-connector"]').length ?? 0,
      externalRows: externalRows.map((row) =>
        row.textContent?.replace(/\s+/g, ' ').trim()
      ),
      externalRowIndexes: externalRows.map((row) => items.indexOf(row)),
      externalTitleTexts: externalTitleLinks.map(
        (link) => link.textContent?.replace(/\s+/g, ' ').trim() ?? ''
      ),
      externalHrefs: externalTitleLinks.map((link) => link.href),
      externalMetas: externalMetas.map(
        (meta) => meta.textContent?.replace(/\s+/g, ' ').trim() ?? ''
      ),
      firstFooterText:
        firstFooter?.textContent?.replace(/\s+/g, ' ').trim() ?? '',
      postDates,
      firstRailTitleLeft:
        items[0]
          ?.querySelector<HTMLElement>('[data-testid="rail-title"]')
          ?.getBoundingClientRect().left ?? 0,
      bodyText: document.body.textContent?.replace(/\s+/g, ' ').trim() ?? '',
      descriptionCount: descriptions?.length ?? 0,
      footerBottom: footer?.getBoundingClientRect().bottom ?? 0,
      viewportHeight: window.innerHeight,
    };
  });

  assert.equal(result.header, '', 'blog header should only contain ROYB band');
  assert.equal(result.marker, '§1');
  assert.equal(result.heading, `Index (${result.itemCount})`);
  assert.ok(
    Math.abs(result.sectionLeft - result.mainContentLeft) <= 1,
    'blog index section should touch the main document content edge'
  );
  assert.ok(
    Math.abs(result.headingLeft - result.firstRailTitleLeft) <= 1,
    'blog index heading should align with blog rail row titles'
  );
  assert.ok(
    Math.abs(result.headerRowCenter - result.legendCenter) <= 1,
    'blog index legend should be vertically centered on the heading row'
  );
  assert.deepEqual(
    result.legendItems.map((item) => item.text),
    ['opinion', 'technical']
  );
  assert.ok(!/new/i.test(result.legendText), 'blog legend should omit new');
  assert.ok(
    result.legendItems[0]?.border >= 1 &&
      result.legendItems[0]?.backgroundColor === 'rgba(0, 0, 0, 0)',
    'opinion legend marker should be hollow'
  );
  assert.ok(
    result.legendItems[1]?.border === 0 &&
      result.legendItems[1]?.backgroundColor !== 'rgba(0, 0, 0, 0)',
    'technical legend marker should be filled'
  );
  assert.ok(
    result.legendItems.every((item) => Math.round(item.width) === 12),
    'blog legend markers should match the rail marker size'
  );
  const filledBlogRows = result.itemMarkers.filter(
    (item) => item.border === 0 && item.backgroundColor !== 'rgba(0, 0, 0, 0)'
  );
  const hollowBlogRows = result.itemMarkers.filter(
    (item) => item.border >= 1 && item.backgroundColor === 'rgba(0, 0, 0, 0)'
  );

  assert.equal(
    filledBlogRows.length,
    2,
    'only Decant and Harmonia should be technical filled rows'
  );
  assert.ok(
    filledBlogRows.some((item) =>
      item.title.includes('On Agent Memory Fidelity (Decant)')
    )
  );
  assert.ok(
    filledBlogRows.some((item) =>
      item.title.includes('On Dimensions of Taste (Harmonia)')
    )
  );
  assert.equal(
    hollowBlogRows.length,
    result.itemCount - filledBlogRows.length,
    'all nontechnical blog rows should be opinion hollow rows'
  );
  assert.ok(
    result.itemMarkers.every((item) => Math.round(item.width) === 12),
    'blog row markers should match the shared marker size'
  );
  assert.ok(result.itemCount >= 3);
  assert.equal(result.dotCount, result.itemCount);
  assert.equal(result.connectorCount, result.itemCount - 1);
  assert.deepEqual(
    result.externalTitleTexts,
    externalWriting.map((item) => item.title)
  );
  assert.deepEqual(
    result.externalHrefs,
    externalWriting.map((item) => item.href)
  );
  assert.deepEqual(
    result.externalMetas,
    externalWriting.map((item) => item.meta)
  );
  assert.deepEqual(
    result.externalRows.map((row) => row?.includes('Nov 2024')),
    externalWriting.map(() => true)
  );
  assert.deepEqual(
    result.externalRowIndexes,
    externalWriting.map(
      (_, index) => result.itemCount - externalWriting.length + index
    )
  );
  assert.equal(result.descriptionCount, 0);
  assert.ok(
    result.postDates.every((date) => /^[A-Z][a-z]{2} \d{4}$/.test(date)),
    'blog index dates should use month-year only'
  );
  assert.ok(result.firstFooterText.includes('words'));
  assert.ok(result.firstFooterText.includes('min'));
  assert.ok(
    !result.firstFooterText.includes('~'),
    'blog index reading metadata should not use approximation markers'
  );
  assert.ok(!result.bodyText.includes('Updated'));
  assert.ok(!result.bodyText.includes('GitHub'));
  assert.ok(
    result.bodyText.includes('Finding the Right Answer Was Never the Point')
  );
  assert.ok(result.bodyText.includes('894 words, 4 min'));
  assert.ok(!result.bodyText.includes('Duke Chronicle'));
  assert.ok(
    Math.abs(result.viewportHeight - result.footerBottom) <= 1,
    'short blog index pages should pin the footer to the viewport bottom'
  );
}

async function assertArticle(page: Page) {
  const firstBodyLink = page.locator('.article-prose p a[href]').first();

  if ((await firstBodyLink.count()) > 0) {
    await firstBodyLink.hover();
  }

  const result = await page.evaluate(() => {
    const main = document.querySelector('main');
    const mainRect = main?.getBoundingClientRect();
    const mainStyle = main ? getComputedStyle(main) : null;
    const title = document.querySelector<HTMLElement>(
      '[data-testid="blog-article-title"]'
    );
    const header = document.querySelector('article > header');
    const headerDate = header?.querySelector<HTMLElement>('time');
    const toc = document.querySelector<HTMLElement>('.article-toc');
    const tocText = toc?.textContent?.replace(/\s+/g, ' ').trim() ?? '';
    const tocMeta = toc?.querySelector<HTMLElement>('.toc-meta');
    const tocMetaLabel = tocMeta?.querySelector<HTMLElement>(
      '.toc-meta-row > span:first-child'
    );
    const tocMetaValue = tocMeta?.querySelector<HTMLElement>(
      '.toc-meta-row > span:last-child'
    );
    const tocFirstSection = toc?.querySelector<HTMLElement>('.toc-section');
    const tocFirstNum = tocFirstSection?.querySelector<HTMLElement>('.toc-num');
    const tocFirstLink = toc?.querySelector<HTMLElement>('.toc-section > a');
    const hoveredArticleLink = document.querySelector<HTMLElement>(
      '.article-prose p a:hover'
    );
    const image = document.querySelector<HTMLElement>('.article-media img');
    const caption = document.querySelector<HTMLElement>(
      '.article-media figcaption'
    );
    const video = document.querySelector<HTMLVideoElement>(
      '.video-figure video'
    );
    const h2 = document.querySelector<HTMLElement>('.article-prose > h2');
    const h3 = document.querySelector<HTMLElement>('.article-prose > h3');
    const token = document.querySelector<HTMLElement>(
      '.article-prose .highlight .hljs-keyword, .article-prose .highlight .hljs-string'
    );
    const codeTokenWeights = [
      ...document.querySelectorAll<HTMLElement>(
        '.article-prose .highlight span'
      ),
    ].map((element) =>
      Number.parseInt(getComputedStyle(element).fontWeight, 10)
    );
    const code = document.querySelector<HTMLElement>(
      '.article-prose .highlight code'
    );
    const highlight = document.querySelector<HTMLElement>(
      '.article-prose .highlight'
    );
    const footnoteRef = document.querySelector<HTMLElement>('.footnote-ref a');
    const footnotesSep = document.querySelector<HTMLElement>('.footnotes-sep');
    const footnotes = document.querySelector<HTMLElement>('.footnotes');
    const footnoteList = document.querySelector<HTMLElement>('.footnotes ol');
    const footnoteItem = footnotes?.querySelector<HTMLElement>('li');
    const articleList = document.querySelector<HTMLElement>(
      '.article-prose > ol'
    );
    const tableFigure = document.querySelector<HTMLElement>('.article-table');
    const firstBodyRow = document.querySelector<HTMLElement>(
      '.article-table tbody tr:nth-child(1)'
    );
    const secondBodyRow = document.querySelector<HTMLElement>(
      '.article-table tbody tr:nth-child(2)'
    );

    const mainContentLeft =
      (mainRect?.left ?? 0) + Number.parseFloat(mainStyle?.paddingLeft ?? '0');
    const titleStyle = title ? getComputedStyle(title) : null;
    const tocMetaStyle = tocMeta ? getComputedStyle(tocMeta) : null;
    const tocMetaLabelStyle = tocMetaLabel
      ? getComputedStyle(tocMetaLabel)
      : null;
    const tocMetaValueStyle = tocMetaValue
      ? getComputedStyle(tocMetaValue)
      : null;
    const headerDateStyle = headerDate ? getComputedStyle(headerDate) : null;
    const tocFirstLinkStyle = tocFirstLink
      ? getComputedStyle(tocFirstLink)
      : null;
    const tocFirstNumStyle = tocFirstNum ? getComputedStyle(tocFirstNum) : null;
    const hoveredArticleLinkStyle = hoveredArticleLink
      ? getComputedStyle(hoveredArticleLink)
      : null;
    const imageStyle = image ? getComputedStyle(image) : null;
    const captionStyle = caption ? getComputedStyle(caption) : null;
    const h2Style = h2 ? getComputedStyle(h2) : null;
    const h3Style = h3 ? getComputedStyle(h3) : null;
    const tokenStyle = token ? getComputedStyle(token) : null;
    const codeStyle = code ? getComputedStyle(code) : null;
    const highlightStyle = highlight ? getComputedStyle(highlight) : null;
    const footnoteRefStyle = footnoteRef ? getComputedStyle(footnoteRef) : null;
    const footnotesStyle = footnotes ? getComputedStyle(footnotes) : null;
    const footnoteListStyle = footnoteList
      ? getComputedStyle(footnoteList)
      : null;
    const footnotesSepStyle = footnotesSep
      ? getComputedStyle(footnotesSep)
      : null;
    const footnoteItemMarkerStyle = footnoteItem
      ? getComputedStyle(footnoteItem, '::marker')
      : null;
    const articleListStyle = articleList ? getComputedStyle(articleList) : null;
    const firstBodyRowStyle = firstBodyRow
      ? getComputedStyle(firstBodyRow)
      : null;
    const secondBodyRowStyle = secondBodyRow
      ? getComputedStyle(secondBodyRow)
      : null;
    const blueProbe = document.createElement('span');

    blueProbe.style.color = 'var(--roy-b)';
    document.body.append(blueProbe);
    const blueToken = getComputedStyle(blueProbe).color;
    blueProbe.remove();

    return {
      bodyText: document.body.textContent?.replace(/\s+/g, ' ').trim() ?? '',
      headerText: header?.textContent?.replace(/\s+/g, ' ').trim() ?? '',
      headerDateText:
        headerDate?.textContent?.replace(/\s+/g, ' ').trim() ?? '',
      headerDateTransform: headerDateStyle?.textTransform ?? '',
      titleText: title?.textContent?.replace(/\s+/g, ' ').trim() ?? '',
      titleLeft: title?.getBoundingClientRect().left ?? 0,
      mainContentLeft,
      titleWeight: Number.parseInt(titleStyle?.fontWeight ?? '0', 10),
      tocText,
      tocMetaFontVariantCaps: tocMetaStyle?.fontVariantCaps ?? '',
      tocMetaLetterSpacing: tocMetaStyle?.letterSpacing ?? '',
      tocMetaLabelSize: Number.parseFloat(tocMetaLabelStyle?.fontSize ?? '0'),
      tocMetaValueSize: Number.parseFloat(tocMetaValueStyle?.fontSize ?? '0'),
      tocMetaLabelTransform: tocMetaLabelStyle?.textTransform ?? '',
      tocMetaValueTransform: tocMetaValueStyle?.textTransform ?? '',
      tocFirstLinkText:
        tocFirstLink?.textContent?.replace(/\s+/g, ' ').trim() ?? '',
      tocFirstNumText:
        tocFirstNum?.textContent?.replace(/\s+/g, ' ').trim() ?? '',
      tocFirstLinkDecoration: tocFirstLinkStyle?.textDecorationLine ?? '',
      tocFirstLinkWidth: tocFirstLink?.getBoundingClientRect().width ?? 0,
      tocWidth: toc?.getBoundingClientRect().width ?? 0,
      tocFirstGap:
        (tocFirstLink?.getBoundingClientRect().left ?? 0) -
        (tocFirstNum?.getBoundingClientRect().right ?? 0),
      tocFirstNumDecoration: tocFirstNumStyle?.textDecorationLine ?? '',
      hoveredArticleLinkBackground:
        hoveredArticleLinkStyle?.backgroundSize ?? '',
      hoveredArticleLinkColor: hoveredArticleLinkStyle?.color ?? '',
      blueToken,
      hoveredArticleLinkDecoration:
        hoveredArticleLinkStyle?.textDecorationLine ?? '',
      hoveredArticleLinkSkipInk:
        hoveredArticleLinkStyle?.textDecorationSkipInk ?? '',
      imageBorderTop: imageStyle?.borderTopWidth ?? '',
      captionAlign: captionStyle?.textAlign ?? '',
      captionSize: Number.parseFloat(captionStyle?.fontSize ?? '0'),
      videoAutoplay: video?.autoplay ?? false,
      videoControls: video?.controls ?? false,
      videoLoop: video?.loop ?? false,
      videoMuted: video?.muted ?? false,
      videoPlaysInline: video?.playsInline ?? false,
      videoPreload: video?.preload ?? '',
      h2Size: Number.parseFloat(h2Style?.fontSize ?? '0'),
      h3Size: Number.parseFloat(h3Style?.fontSize ?? '0'),
      h2Weight: Number.parseInt(h2Style?.fontWeight ?? '0', 10),
      h3Weight: Number.parseInt(h3Style?.fontWeight ?? '0', 10),
      h3Transform: h3Style?.textTransform ?? '',
      tokenColor: tokenStyle?.color ?? '',
      maxCodeTokenWeight: Math.max(0, ...codeTokenWeights),
      codeColor: codeStyle?.color ?? '',
      codeBackground: highlightStyle?.backgroundColor ?? '',
      footnoteRefFamily: footnoteRefStyle?.fontFamily ?? '',
      footnoteRefWeight: Number.parseInt(
        footnoteRefStyle?.fontWeight ?? '0',
        10
      ),
      footnotesSize: Number.parseFloat(footnotesStyle?.fontSize ?? '0'),
      footnoteListPadding: Number.parseFloat(
        footnoteListStyle?.paddingLeft ?? '0'
      ),
      footnotesSepStyle: footnotesSepStyle?.borderTopStyle ?? '',
      footnoteMarkerWeight: Number.parseInt(
        footnoteItemMarkerStyle?.fontWeight ?? '0',
        10
      ),
      footnoteListTag: footnoteList?.tagName ?? '',
      articleListStyle: articleListStyle?.listStyleType ?? '',
      articleListPadding: Number.parseFloat(
        articleListStyle?.paddingLeft ?? '0'
      ),
      tableCaptionCount:
        tableFigure?.querySelectorAll('figcaption').length ?? 0,
      firstBodyRowBackground: firstBodyRowStyle?.backgroundColor ?? '',
      secondBodyRowBackground: secondBodyRowStyle?.backgroundColor ?? '',
      prototypeCount: document.querySelectorAll('[data-prototype]').length,
    };
  });

  assert.ok(result.titleText.length > 0, 'article title should render');
  assert.ok(result.titleWeight >= 600, 'article title should stay strong');
  assert.ok(
    Math.abs(result.titleLeft - result.mainContentLeft) <= 1,
    `article title should align to blog section marker edge: ${result.titleLeft} / ${result.mainContentLeft}`
  );
  assert.ok(!result.headerText.includes('GitHub'));
  assert.ok(!result.headerText.includes('Why agent context should be'));
  assert.match(result.headerDateText, /^[A-Z][a-z]{2} \d{2}, \d{4}$/);
  assert.equal(result.headerDateTransform, 'none');
  for (const text of ['time', 'last updated', 'code', 'github']) {
    assert.ok(result.tocText.includes(text), `TOC should include ${text}`);
  }
  for (const text of ['Time', 'Last updated', 'Code', 'GitHub']) {
    assert.ok(!result.tocText.includes(text), `TOC should lowercase ${text}`);
  }
  assert.ok(!result.tocText.includes('Reading time'));
  assert.ok(!result.tocText.includes('~'));
  assert.equal(result.tocMetaFontVariantCaps, 'normal');
  assert.equal(result.tocMetaLabelTransform, 'none');
  assert.equal(result.tocMetaValueTransform, 'none');
  assert.equal(result.tocMetaLetterSpacing, 'normal');
  assert.ok(
    result.tocMetaLabelSize >= 12 && result.tocMetaLabelSize < 13,
    'TOC metadata labels should match the hero contact scale'
  );
  assert.ok(
    result.tocMetaValueSize >= 12 && result.tocMetaValueSize < 13,
    'TOC metadata values should match the hero contact scale'
  );
  assert.equal(result.tocFirstNumText, '0');
  assert.equal(result.tocFirstLinkText, 'Background');
  assert.equal(result.tocFirstLinkDecoration, 'underline');
  assert.equal(result.tocFirstNumDecoration, 'none');
  assert.ok(
    result.tocFirstGap >= 7,
    `TOC number/title gap should visually read as two spaces: ${result.tocFirstGap}`
  );
  assert.ok(
    result.tocFirstLinkWidth < result.tocWidth * 0.4,
    'TOC hover/click area should stay close to the text, not full width'
  );
  assert.equal(result.hoveredArticleLinkBackground, '100% 100%');
  assert.equal(result.hoveredArticleLinkColor, result.blueToken);
  assert.equal(result.hoveredArticleLinkDecoration, 'none');
  assert.equal(result.hoveredArticleLinkSkipInk, 'auto');

  const tocGithubLink = page
    .locator('.article-toc .toc-meta a[href*="github"]')
    .first();

  if ((await tocGithubLink.count()) > 0) {
    await tocGithubLink.hover();

    const tocGithubHover = await page.evaluate(() => {
      const link = document.querySelector<HTMLElement>(
        '.article-toc .toc-meta a[href*="github"]:hover'
      );
      const probe = document.createElement('span');

      probe.style.color = 'var(--roy-b)';
      document.body.append(probe);

      const blueToken = getComputedStyle(probe).color;
      const style = link ? getComputedStyle(link) : null;

      probe.remove();

      return {
        color: style?.color ?? '',
        backgroundSize: style?.backgroundSize ?? '',
        decoration: style?.textDecorationLine ?? '',
        skipInk: style?.textDecorationSkipInk ?? '',
        blueToken,
      };
    });

    assert.equal(tocGithubHover.color, tocGithubHover.blueToken);
    assert.equal(tocGithubHover.backgroundSize, '100% 100%');
    assert.equal(tocGithubHover.decoration, 'none');
    assert.equal(tocGithubHover.skipInk, 'auto');
  }

  assert.equal(result.imageBorderTop, '0px');
  assert.equal(result.captionAlign, 'center');
  assert.ok(result.captionSize < 14);
  assert.equal(result.videoAutoplay, true);
  assert.equal(result.videoControls, true);
  assert.equal(result.videoLoop, true);
  assert.equal(result.videoMuted, true);
  assert.equal(result.videoPlaysInline, true);
  assert.equal(result.videoPreload, 'auto');
  assert.ok(result.h2Size > result.h3Size);
  assert.ok(result.h2Weight >= 600);
  assert.ok(result.h3Weight < result.h2Weight);
  assert.equal(result.h3Transform, 'none');
  assert.notEqual(result.tokenColor, result.codeColor);
  assert.ok(
    result.maxCodeTokenWeight <= 400,
    'article code highlighting should not bold tokens'
  );
  assert.equal(result.codeBackground, 'rgb(243, 243, 241)');
  assert.equal(result.articleListStyle, 'decimal');
  assert.ok(result.articleListPadding >= 28);
  assert.ok(result.footnotesSize <= 13);
  assert.ok(result.footnoteListPadding >= 24);
  assert.ok(result.footnoteRefFamily.includes('DM Mono'));
  assert.ok(result.footnoteRefWeight >= 600);
  assert.equal(result.footnotesSepStyle, 'dashed');
  assert.ok(
    result.footnoteMarkerWeight <= 500,
    'bottom footnote list markers should not be bold'
  );
  assert.equal(result.footnoteListTag, 'OL');
  assert.equal(result.tableCaptionCount, 0);
  assert.notEqual(
    result.firstBodyRowBackground,
    result.secondBodyRowBackground
  );
  assert.equal(result.prototypeCount, 0);
  assert.ok(!result.bodyText.toLowerCase().includes('prototyping'));
}

async function assertHarmoniaArticle(page: Page) {
  const result = await page.evaluate(() => {
    const prose = document.querySelector<HTMLElement>('.article-prose');
    const proseRect = prose?.getBoundingClientRect();
    const paragraphs = [
      ...document.querySelectorAll<HTMLElement>('.article-prose p'),
    ].map((paragraph) => paragraph.textContent?.trim() ?? '');
    const mellowListItems = [
      ...document.querySelectorAll<HTMLElement>('.article-prose ul li'),
    ].filter((item) => item.textContent?.includes('Mellow-'));
    const outputHeader = [...document.querySelectorAll<HTMLElement>('th')].find(
      (header) => header.textContent?.replace(/\s+/g, ' ').trim() === 'Output'
    );
    const outputHeaderStyle = outputHeader
      ? getComputedStyle(outputHeader)
      : null;
    const outputHeaderRect = outputHeader?.getBoundingClientRect();
    const outputLineHeight = Number.parseFloat(
      outputHeaderStyle?.lineHeight ?? '0'
    );
    const outputPaddingY =
      Number.parseFloat(outputHeaderStyle?.paddingTop ?? '0') +
      Number.parseFloat(outputHeaderStyle?.paddingBottom ?? '0');
    const tableCells = [
      ...document.querySelectorAll<HTMLElement>(
        '.article-table th, .article-table td'
      ),
    ];
    const tableHeaders = [
      ...document.querySelectorAll<HTMLElement>('.article-table th'),
    ];
    const tableDataCells = [
      ...document.querySelectorAll<HTMLElement>('.article-table td'),
    ];
    const tableCodes = [
      ...document.querySelectorAll<HTMLElement>(
        '.article-table th code, .article-table td code'
      ),
    ];
    const tableWraps = [
      ...document.querySelectorAll<HTMLElement>('.article-table .table-wrap'),
    ];

    return {
      bodyText: document.body.textContent?.replace(/\s+/g, ' ').trim() ?? '',
      hasPronounParagraph: paragraphs.some((text) =>
        text.startsWith('It assumes clusters are')
      ),
      hasRepeatedHdbscanStart: paragraphs.some((text) =>
        text.startsWith('HDBSCAN assumes')
      ),
      mellowListCount: mellowListItems.length,
      mellowListParentTag: mellowListItems[0]?.parentElement?.tagName ?? '',
      outputHeight: outputHeaderRect?.height ?? 0,
      outputLineHeight,
      outputPaddingY,
      outputWhiteSpace: outputHeaderStyle?.whiteSpace ?? '',
      outputWordBreak: outputHeaderStyle?.wordBreak ?? '',
      outputOverflowWrap: outputHeaderStyle?.overflowWrap ?? '',
      tableCellWordBreaks: tableCells.map(
        (cell) => getComputedStyle(cell).wordBreak
      ),
      tableCellOverflowWraps: tableCells.map(
        (cell) => getComputedStyle(cell).overflowWrap
      ),
      tableHeaderWhiteSpaces: tableHeaders.map(
        (cell) => getComputedStyle(cell).whiteSpace
      ),
      tableDataCellWhiteSpaces: tableDataCells.map(
        (cell) => getComputedStyle(cell).whiteSpace
      ),
      tableCodeWhiteSpaces: tableCodes.map(
        (code) => getComputedStyle(code).whiteSpace
      ),
      tableWrapData: tableWraps.map((wrap) => {
        const style = getComputedStyle(wrap);
        const rect = wrap.getBoundingClientRect();

        return {
          right: rect.right,
          overflowX: style.overflowX,
          position: style.position,
          scrollWidth: wrap.scrollWidth,
          clientWidth: wrap.clientWidth,
        };
      }),
      proseRight: proseRect?.right ?? 0,
    };
  });

  assert.equal(result.hasPronounParagraph, true);
  assert.ok(result.bodyText.includes('math.pi'));
  assert.ok(!result.bodyText.includes('π'));
  assert.equal(result.hasRepeatedHdbscanStart, false);
  assert.equal(result.mellowListCount, 2);
  assert.equal(result.mellowListParentTag, 'UL');
  assert.equal(result.outputWhiteSpace, 'nowrap');
  assert.equal(result.outputWordBreak, 'normal');
  assert.equal(result.outputOverflowWrap, 'normal');
  assert.ok(
    result.outputHeight <= result.outputLineHeight + result.outputPaddingY + 2,
    'Output table header should not split across multiple lines'
  );
  assert.ok(
    result.tableCellWordBreaks.every((wordBreak) => wordBreak === 'normal'),
    'article table cells should not break single words'
  );
  assert.ok(
    result.tableCellOverflowWraps.every(
      (overflowWrap) => overflowWrap === 'normal'
    ),
    'article table cells should use shadcn-like normal wrapping'
  );
  assert.ok(
    result.tableHeaderWhiteSpaces.every(
      (whiteSpace) => whiteSpace === 'nowrap'
    ),
    'article table headers should stay intact'
  );
  assert.ok(
    result.tableDataCellWhiteSpaces.every(
      (whiteSpace) => whiteSpace === 'normal'
    ),
    'article table body cells should keep normal multi-word wrapping'
  );
  assert.ok(
    result.tableCodeWhiteSpaces.every((whiteSpace) => whiteSpace === 'nowrap'),
    'article table code tokens should stay intact'
  );
  assert.ok(
    result.tableWrapData.every((wrap) => wrap.overflowX === 'auto'),
    'article table wrappers should expose horizontal overflow only when needed'
  );
  assert.ok(
    result.tableWrapData.every((wrap) => wrap.position === 'relative'),
    'article table wrappers should use the shadcn relative wrapper pattern'
  );
  assert.ok(
    result.tableWrapData.every((wrap) => wrap.scrollWidth >= wrap.clientWidth),
    'article table wrappers should preserve intrinsic table width'
  );
  assert.ok(
    result.tableWrapData.every((wrap) => wrap.right <= result.proseRight + 1),
    'article table wrappers should stay inside prose width'
  );
}

async function assertLegacyMediaArticle(page: Page) {
  const result = await page.evaluate(() => {
    const prose = document.querySelector<HTMLElement>('.article-prose');
    const proseRect = prose?.getBoundingClientRect();
    const videos = [...document.querySelectorAll<HTMLVideoElement>('video')];
    const mediaFigures = [
      ...document.querySelectorAll<HTMLElement>('.article-media'),
    ];
    const captions = [
      ...document.querySelectorAll<HTMLElement>('.article-media figcaption'),
    ];
    const keycap = document.querySelector<HTMLElement>('kbd');
    const lists = [
      ...document.querySelectorAll<HTMLElement>(
        '.article-prose > ol, .article-prose > ul'
      ),
    ];

    const captionStyles = captions.map((caption) => {
      const style = getComputedStyle(caption);

      return {
        align: style.textAlign,
        size: Number.parseFloat(style.fontSize),
        color: style.color,
      };
    });
    const videoData = videos.map((video) => {
      const style = getComputedStyle(video);

      return {
        autoplay: video.autoplay,
        controls: video.controls,
        loop: video.loop,
        muted: video.muted,
        playsInline: video.playsInline,
        preload: video.preload,
        borderTop: style.borderTopWidth,
        width: video.getBoundingClientRect().width,
        source: video.currentSrc || video.querySelector('source')?.src || '',
      };
    });
    const keycapStyle = keycap ? getComputedStyle(keycap) : null;
    const listData = lists.map((list) => {
      const style = getComputedStyle(list);
      const rect = list.getBoundingClientRect();

      return {
        paddingLeft: Number.parseFloat(style.paddingLeft),
        left: rect.left,
        right: rect.right,
      };
    });
    const maxListOverflow = proseRect
      ? Math.max(
          0,
          ...listData.map((list) =>
            Math.max(proseRect.left - list.left, list.right - proseRect.right)
          )
        )
      : 0;

    return {
      videoData,
      captionStyles,
      mediaBorderWidths: mediaFigures.map(
        (figure) => getComputedStyle(figure).borderTopWidth
      ),
      keycapDisplay: keycapStyle?.display ?? '',
      keycapBorderTop: keycapStyle?.borderTopWidth ?? '',
      keycapBoxShadow: keycapStyle?.boxShadow ?? '',
      keycapBackgroundImage: keycapStyle?.backgroundImage ?? '',
      listData,
      maxListOverflow,
    };
  });

  assert.ok(
    result.videoData.length >= 2,
    'legacy article should render videos'
  );
  assert.ok(
    result.videoData.every((video) => video.source.includes('/static/media/')),
    'legacy videos should load copied /static/media assets'
  );
  assert.ok(
    result.videoData.every(
      (video) =>
        video.autoplay &&
        video.controls &&
        video.loop &&
        video.muted &&
        video.playsInline &&
        video.preload === 'auto'
    ),
    'legacy videos should use native APM-like media attributes'
  );
  assert.ok(
    result.videoData.every((video) => video.borderTop === '0px'),
    'legacy videos should be borderless'
  );
  assert.ok(
    result.captionStyles.length >= result.videoData.length,
    'legacy media should keep visible captions'
  );
  assert.ok(
    result.captionStyles.every(
      (caption) => caption.align === 'center' && caption.size < 14
    ),
    'legacy captions should be centered and caption-sized'
  );
  assert.equal(result.keycapDisplay, 'inline-block');
  assert.notEqual(result.keycapBorderTop, '0px');
  assert.notEqual(result.keycapBoxShadow, 'none');
  assert.notEqual(result.keycapBackgroundImage, 'none');
  assert.match(result.keycapBoxShadow, /inset/);
  assert.ok(result.listData.length > 0, 'legacy article should include lists');
  assert.ok(
    result.listData.every((list) => list.paddingLeft >= 28),
    'article lists should be indented enough to read as lists'
  );
  assert.ok(
    result.maxListOverflow <= 1,
    `article lists should stay inside prose width: ${result.maxListOverflow}`
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
    await assertThemeBootstrapBeforeHeader();
    await assertScrollbarStyles();

    browser = await chromium.launch();

    const home = await browser.newPage({
      viewport: { width: 1280, height: 900 },
    });
    await home.goto(baseUrl, { waitUntil: 'networkidle' });
    const homeBand = await assertRoybBandPlacement(home);
    await assertHome(home);
    await assertVisibleOneLineDescriptions(home);
    await assertHeroLinksHoverHighlight(home);
    await assertPublicationTitleUnderline(home);
    await assertThemeToggleIsStable(home);
    await screenshot(home, 'home-desktop');
    await assertExperienceInteractions(home);
    await screenshot(home, 'home-experience-expanded');

    const mobile = await browser.newPage({
      viewport: { width: 390, height: 844 },
    });
    await mobile.goto(baseUrl, { waitUntil: 'networkidle' });
    await assertRoybBandPlacement(mobile);
    await assertMobileHeroPortraitHidden(mobile);
    await screenshot(mobile, 'home-mobile');

    const blog = await browser.newPage({
      viewport: { width: 1280, height: 900 },
    });
    await blog.goto(`${baseUrl}/blog`, { waitUntil: 'networkidle' });
    const blogBand = await assertRoybBandPlacement(blog);
    await assertBlogIndex(blog);
    await assertVisibleOneLineDescriptions(blog);
    await screenshot(blog, 'blog-index');

    const [firstPost] = await getListedPosts();
    const article = await browser.newPage({
      viewport: { width: 1280, height: 900 },
    });
    await article.goto(`${baseUrl}/blog/${firstPost.manifest.slug}`, {
      waitUntil: 'networkidle',
    });
    const articleBand = await assertRoybBandPlacement(article);
    await assertArticle(article);
    await assertVisibleOneLineDescriptions(article);
    await screenshot(article, 'blog-article');

    const harmoniaArticle = await browser.newPage({
      viewport: { width: 1280, height: 900 },
    });
    await harmoniaArticle.goto(`${baseUrl}/blog/on-dimensions-of-taste`, {
      waitUntil: 'networkidle',
    });
    await assertRoybBandPlacement(harmoniaArticle);
    await assertHarmoniaArticle(harmoniaArticle);
    await screenshot(harmoniaArticle, 'blog-dimensions');

    const legacyArticle = await browser.newPage({
      viewport: { width: 1280, height: 900 },
    });
    await legacyArticle.goto(`${baseUrl}/blog/on-using-computers`, {
      waitUntil: 'networkidle',
    });
    await assertRoybBandPlacement(legacyArticle);
    await assertLegacyMediaArticle(legacyArticle);
    await screenshot(legacyArticle, 'blog-using-computers');

    assert.deepEqual(
      [homeBand.topGap, blogBand.topGap, articleBand.topGap],
      [homeBand.topGap, homeBand.topGap, homeBand.topGap],
      'ROYB top gap should be consistent on home, blog index, and article pages'
    );

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
