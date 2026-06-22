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
      css.includes(
        'box-shadow: inset 0 -0.42em 0 var(--link-hover-highlight)'
      ) &&
      !css.includes('--roy-r-highlight') &&
      !css.includes('--section-highlight'),
    'link hover highlight should use section color at 20% alpha'
  );
  const railGutterMatches = css.match(/--rail-gutter:/g) ?? [];
  const railMarkerMatches = css.match(/--rail-marker-size:/g) ?? [];

  assert.ok(
    css.includes('--rail-gutter: 2rem') &&
      railGutterMatches.length === 1 &&
      css.includes('--rail-marker-size: 0.75rem') &&
      railMarkerMatches.length === 1,
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
    const heroHeader = heroSection?.querySelector<HTMLElement>('header');
    const heroTitleElement = document.querySelector<HTMLElement>(
      '[data-testid="hero-title"]'
    );
    const heroTitleRect = heroTitleElement?.getBoundingClientRect();
    const heroContentRect =
      heroTitleElement?.nextElementSibling?.getBoundingClientRect();
    const heroContactColumn = heroTitleElement?.nextElementSibling
      ?.firstElementChild as HTMLElement | null | undefined;
    const heroContactColumnRect = heroContactColumn?.getBoundingClientRect();
    const heroContactIndex = heroContactColumn?.firstElementChild as
      | HTMLElement
      | null
      | undefined;
    const heroContactDetails =
      heroContactIndex?.querySelector<HTMLElement>('div');
    const heroContactLabels = [
      ...(heroContactColumn?.querySelectorAll('a') ?? []),
    ].map((link) => link.textContent?.trim() ?? '');
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
    const experienceGroupLabelStyles = [
      ...(experienceSection?.querySelectorAll<HTMLElement>(
        '[data-testid="experience-group-label"]'
      ) ?? []),
    ].map((label) => {
      const style = getComputedStyle(label);
      const rect = label.getBoundingClientRect();
      const toggleRect = label.parentElement?.getBoundingClientRect();

      return {
        text: label.textContent?.replace(/\s+/g, ' ').trim() ?? '',
        className: label.className,
        justifySelf: style.justifySelf,
        textDecorationLine: style.textDecorationLine,
        width: rect.width,
        toggleWidth: toggleRect?.width ?? 0,
      };
    });
    const firstRailTitle = experienceSection?.querySelector(
      '[data-testid="rail-title"]'
    );
    const experienceLinks = [
      ...(experienceSection?.querySelectorAll<HTMLAnchorElement>('a') ?? []),
    ].map((link) => ({
      text: link.textContent?.replace(/\s+/g, ' ').trim() ?? '',
      href: link.href,
    }));
    const advisorLabels = [
      ...(experienceSection?.querySelectorAll<HTMLElement>(
        '[data-testid="advisor-label"]'
      ) ?? []),
    ].map((label) => {
      const style = getComputedStyle(label);

      return {
        text: label.textContent?.replace(/\s+/g, ' ').trim() ?? '',
        textTransform: style.textTransform,
        letterSpacing: style.letterSpacing,
      };
    });
    const footer = document.querySelector('[data-testid="site-footer"]');
    const footerUpdate = footer?.querySelector<HTMLElement>(
      '[data-testid="site-footer-updated"]'
    );
    const footerQuote = footer?.querySelector<HTMLElement>(
      '[data-testid="site-footer-quote"]'
    );
    const footerUpdateStyle = footerUpdate
      ? getComputedStyle(footerUpdate)
      : null;
    const footerQuoteStyle = footerQuote ? getComputedStyle(footerQuote) : null;
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
        color: style?.color ?? '',
      };
    });
    const bodyStyle = getComputedStyle(document.body);
    const bodyColor = bodyStyle.color;
    const bodyBackgroundColor = bodyStyle.backgroundColor;
    const bodyFontFamily = bodyStyle.fontFamily;
    const readingProbe = document.createElement('span');

    readingProbe.className = 'reading-copy';
    document.body.append(readingProbe);
    const readingFontFamily = getComputedStyle(readingProbe).fontFamily;
    readingProbe.remove();
    const sectionLabelColors = topLevelSections.map((section) => {
      const label = section.querySelector<HTMLElement>('header h2');

      return label ? getComputedStyle(label).color : '';
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
        paddingTop: row
          ? Number.parseFloat(getComputedStyle(row).paddingTop)
          : 0,
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
    const railRowPaddingBottoms = [
      ...document.querySelectorAll<HTMLElement>(
        '#experience ul, #publications ul, #writing ul'
      ),
    ].flatMap((list) =>
      [...list.children]
        .slice(0, -1)
        .filter(
          (row): row is HTMLElement =>
            row instanceof HTMLElement &&
            Boolean(
              row.querySelector(
                '[data-testid="rail-dot"], [data-testid="publication-dot"]'
              )
            )
        )
        .map((row) => Number.parseFloat(getComputedStyle(row).paddingBottom))
    );
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
    ].map((group) => {
      const toggle = group.querySelector<HTMLElement>(
        '[data-testid="experience-group-toggle"]'
      );
      const showMore = [...group.querySelectorAll('button')].find(
        (button) => button.textContent?.trim() === 'see more'
      );
      const showMoreWrap = showMore?.parentElement;

      return {
        kind: group.getAttribute('data-group'),
        expanded: toggle?.getAttribute('aria-expanded') ?? '',
        rows: group.querySelectorAll('[data-testid="rail-title"]').length,
        text: group.textContent?.replace(/\s+/g, ' ').trim() ?? '',
        hasShowMore: Boolean(showMore),
        togglePaddingBottom: toggle
          ? Number.parseFloat(getComputedStyle(toggle).paddingBottom)
          : 0,
        showMorePaddingTop: showMoreWrap
          ? Number.parseFloat(getComputedStyle(showMoreWrap).paddingTop)
          : 0,
        marginBottom: Number.parseFloat(getComputedStyle(group).marginBottom),
      };
    });
    const experienceDescriptionStyles = [
      ...(experienceSection?.querySelectorAll<HTMLElement>(
        'p[data-one-line="true"]'
      ) ?? []),
    ].map((description) => {
      const style = getComputedStyle(description);

      return {
        color: style.color,
        fontFamily: style.fontFamily,
        fontSize: Number.parseFloat(style.fontSize),
        fontWeight: Number.parseInt(style.fontWeight, 10),
        lineHeight: style.lineHeight,
        textTransform: style.textTransform,
      };
    });
    const dots = [...document.querySelectorAll('[data-testid="rail-dot"]')].map(
      (dot) => ({
        state: dot.getAttribute('data-state'),
        className: dot.className,
        border: Number.parseFloat(getComputedStyle(dot).borderTopWidth),
        borderColor: getComputedStyle(dot).borderTopColor,
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
    const publicationAuthorStyles = [
      ...document.querySelectorAll<HTMLElement>(
        '[data-testid="publication-authors"]'
      ),
    ].map((authors) => {
      const style = getComputedStyle(authors);

      return {
        color: style.color,
        fontFamily: style.fontFamily,
        fontSize: Number.parseFloat(style.fontSize),
        fontWeight: Number.parseInt(style.fontWeight, 10),
        lineHeight: style.lineHeight,
        textTransform: style.textTransform,
      };
    });
    const publicationSelfAuthors = [
      ...document.querySelectorAll('[data-testid="publication-author-self"]'),
    ].map((author) => author.textContent?.trim() ?? '');
    const publicationSelfAuthorStyles = [
      ...document.querySelectorAll<HTMLElement>(
        '[data-testid="publication-author-self"]'
      ),
    ].map((author) => {
      const style = getComputedStyle(author);

      return {
        className: author.className,
        fontStyle: style.fontStyle,
        fontWeight: Number.parseInt(style.fontWeight, 10),
      };
    });
    const publicationRows = [
      ...(document
        .querySelector('#publications')
        ?.querySelectorAll('[data-testid="publication-row"]') ?? []),
    ].map((row) =>
      [...row.querySelectorAll<HTMLElement>('[data-testid]')].map((element) =>
        element.getAttribute('data-testid')
      )
    );
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
    const writingMetaStyles = [
      ...(document
        .querySelector('#writing')
        ?.querySelectorAll<HTMLElement>('[data-testid="writing-row-meta"]') ??
        []),
    ].map((meta) => {
      const style = getComputedStyle(meta);

      return {
        color: style.color,
        fontFamily: style.fontFamily,
        fontSize: Number.parseFloat(style.fontSize),
        fontWeight: Number.parseInt(style.fontWeight, 10),
        lineHeight: style.lineHeight,
        textTransform: style.textTransform,
      };
    });
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
    const publicationMetaLineStyles = [
      ...(document
        .querySelector('#publications')
        ?.querySelectorAll<HTMLElement>(
          '[data-testid="publication-meta-line"]'
        ) ?? []),
    ].map((meta) => {
      const style = getComputedStyle(meta);

      return {
        color: style.color,
        fontFamily: style.fontFamily,
        fontSize: Number.parseFloat(style.fontSize),
        fontWeight: Number.parseInt(style.fontWeight, 10),
        lineHeight: style.lineHeight,
        textTransform: style.textTransform,
      };
    });
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
    const highlightedLinkClassNames = [
      ...document.querySelectorAll<HTMLElement>('a.royb-link-highlight'),
    ].map((link) => link.className);

    return {
      mainWidth: main?.getBoundingClientRect().width ?? 0,
      bodyColor,
      bodyBackgroundColor,
      bodyFontFamily,
      readingFontFamily,
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
        heroTitleElement?.textContent?.replace(/\s+/g, ' ').trim() ?? '',
      heroContactText:
        heroSection?.textContent?.replace(/\s+/g, ' ').trim() ?? '',
      dukeLinkHref:
        heroSection?.querySelector<HTMLAnchorElement>(
          'a[href="https://www.duke.edu/"]'
        )?.href ?? '',
      heroHeaderTitleGap:
        (heroTitleRect?.top ?? 0) -
        (heroHeader?.getBoundingClientRect().bottom ?? 0),
      heroTitleContentGap:
        (heroContentRect?.top ?? 0) - (heroTitleRect?.bottom ?? 0),
      heroContentWidth: heroContentRect?.width ?? 0,
      heroContactColumnWidth: heroContactColumnRect?.width ?? 0,
      heroContactIndexGap: heroContactIndex
        ? Number.parseFloat(getComputedStyle(heroContactIndex).rowGap)
        : 0,
      heroContactDetailsGap: heroContactDetails
        ? Number.parseFloat(getComputedStyle(heroContactDetails).rowGap)
        : 0,
      heroContactLabels,
      heroPortraitExists: Boolean(heroPortrait),
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
      viewportHeight: window.innerHeight,
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
      sectionMarkerColors: sectionMarkerData.map((marker) => marker.color),
      sectionLabelColors,
      sharedRowTitleLefts,
      markerLefts: markerData.map((marker) => marker.left),
      markerWidths: markerData.map((marker) => marker.width),
      markerCenters: markerData.map((marker) => marker.center),
      connectorCenters,
      railRowPaddingBottoms,
      groupChevronWidths: groupChevronData.map((icon) => icon.width),
      groupChevronCenters: groupChevronData.map((icon) => icon.center),
      experienceTitleLeft: experienceTitle?.getBoundingClientRect().left ?? 0,
      firstGroupLabelLeft: firstGroupLabel?.getBoundingClientRect().left ?? 0,
      firstRailTitleLeft: firstRailTitle?.getBoundingClientRect().left ?? 0,
      experienceLinks,
      advisorLabels,
      experienceGroupLabelStyles,
      experienceLegendExists: Boolean(
        experienceSection?.querySelector('[data-testid="experience-legend"]')
      ),
      groups,
      experienceDescriptionStyles,
      dots,
      writingDots,
      writingNewTags,
      writingMeta,
      writingMetaStyles,
      writingDates,
      writingDescriptionCount: writingDescriptions.length,
      writingConnectors,
      writingActionRail,
      publicationDots,
      publicationConnectors,
      publicationActionRail,
      publicationMetaLines,
      publicationMetaLineStyles,
      publicationDateStyles,
      publicationAuthors,
      publicationAuthorStyles,
      publicationSelfAuthors,
      publicationSelfAuthorStyles,
      publicationRows,
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
      highlightedLinkClassNames,
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
      footerUpdateWhiteSpace: footerUpdateStyle?.whiteSpace ?? '',
      footerQuoteTextAlign: footerQuoteStyle?.textAlign ?? '',
    };
  });

  assert.ok(result.mainWidth <= 800, 'main document should stay narrow');
  assert.equal(result.heroTitle, 'Islam Tayeb');
  assert.equal(result.heroPortraitExists, true, 'hero portrait should render');
  assert.ok(result.heroPortraitWidth > 0, 'hero portrait should have width');
  assert.ok(
    Math.abs(result.heroPortraitWidth - result.heroPortraitHeight) <= 1,
    `hero portrait should stay square: ${result.heroPortraitWidth} x ${result.heroPortraitHeight}`
  );
  assert.ok(
    result.heroPortraitWidth <= result.heroContactColumnWidth,
    `hero portrait should stay inside the contact column: ${result.heroPortraitWidth} / ${result.heroContactColumnWidth}`
  );
  assert.equal(result.heroPortraitBorderTop, '0px');
  assert.equal(result.heroPortraitObjectFit, 'cover');
  assert.equal(result.heroContactIndexGap, 8);
  assert.equal(result.heroContactDetailsGap, 2);
  assert.ok(
    result.heroHeaderTitleGap >= 11 && result.heroHeaderTitleGap <= 13,
    `About/title gap should match the blog index header gap: ${result.heroHeaderTitleGap}`
  );
  assert.ok(
    result.heroTitleContentGap >= 7,
    'hero title should keep a visible bottom gap before contact/body content'
  );
  assert.ok(
    result.heroContentWidth > 0 &&
      Math.abs(
        result.heroContactColumnWidth / result.heroContentWidth - 0.25
      ) <= 0.02,
    `hero contact column should take 25% of the content row: ${result.heroContactColumnWidth} / ${result.heroContentWidth}`
  );
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
  assert.equal(Number.parseFloat(result.railGutter), 2);
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
    result.sectionMarkerFontSizes.every((size) => Math.round(size) === 16),
    'section markers should follow the promoted 16px section label size'
  );
  assert.ok(
    result.sectionMarkerWidths.every((width) => Math.round(width) === 14),
    'section marker text should have a fixed 14px width'
  );
  assert.deepEqual(
    result.sectionLabelColors,
    result.sectionLabelColors.map(() => result.bodyColor),
    'section title labels should use neutral foreground text'
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
  assert.deepEqual(result.heroContactLabels, [
    'email',
    'linkedin',
    'github',
    'x',
    'scholar',
  ]);
  for (const copy of [
    "I'm researching systems in ML, particularly agent correctness and efficiency, and study at Duke.",
    'I was born and raised in Egypt, but later moved to Taif, Saudi Arabia during high school.',
    'I also played osu! competitively and designed a few skins (500K+ downloads).',
    'I play Tetris and Monkeytype in my free time.',
  ]) {
    assert.ok(result.bodyText.includes(copy), `hero should include: ${copy}`);
  }
  assert.equal(result.dukeLinkHref, 'https://www.duke.edu/');
  assert.ok(
    !result.bodyText.includes('Finding the Right Answer Was Never the Point'),
    'external writing should stay off the home writing preview'
  );
  assert.ok(!result.bodyText.includes('islam.moh.islamm@gmail.com'));
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
  assert.deepEqual(
    result.experienceGroupLabelStyles.map(
      (label: { text: string }) => label.text
    ),
    ['Research (5)', 'Engineering (3)', 'Teaching (3)']
  );
  assert.ok(
    result.experienceGroupLabelStyles.every(
      (label: { textDecorationLine: string }) =>
        label.textDecorationLine.includes('underline')
    ),
    'experience group labels should be underlined because they are clickable'
  );
  assert.ok(
    result.experienceGroupLabelStyles.every(
      (label: { className: string }) =>
        label.className.includes('royb-link') &&
        label.className.includes('royb-link-highlight') &&
        label.className.includes('royb-link-fragment') &&
        label.className.includes('section-color-o') &&
        label.className.includes('w-fit') &&
        label.className.includes('justify-self-start')
    ),
    'experience group labels should use the shared ROYB link primitive'
  );
  assert.ok(
    result.experienceGroupLabelStyles.every(
      (label: { justifySelf: string; width: number; toggleWidth: number }) =>
        label.justifySelf.endsWith('start') &&
        label.width > 0 &&
        label.toggleWidth > 0 &&
        label.width < label.toggleWidth * 0.5
    ),
    'experience group label hover boxes should stay scoped to text, not the full row'
  );

  const research = result.groups.find((group) => group.kind === 'Research');
  const engineering = result.groups.find(
    (group) => group.kind === 'Engineering'
  );
  const teaching = result.groups.find((group) => group.kind === 'Teaching');

  assert.equal(research?.expanded, 'true', 'Research should default open');
  assert.equal(research?.rows, 4, 'Research should show 4 rows when collapsed');
  assert.ok(research?.text.includes('Research (5)'));
  assert.ok(research?.text.includes('see more'));
  assert.equal(research?.showMorePaddingTop, 8);
  assert.ok(research?.text.includes('Christian Dallago'));
  assert.ok(research?.text.includes('Matthew Lentz'));
  assert.ok(research?.text.includes('Philip Romero'));
  assert.ok(
    result.advisorLabels.some(
      (label) =>
        label.text === 'Christian Dallago' &&
        label.textTransform === 'none' &&
        label.letterSpacing === 'normal'
    ),
    'advisor labels should render proper names in normal case'
  );
  assert.ok(research?.text.includes('incoming Aug 2026'));
  assert.ok(!research?.text.includes('Incoming Aug 2026'));
  assert.ok(research?.text.includes('Anthropic'));
  assert.ok(research?.text.includes('+ Microsoft Research'));
  assert.ok(
    result.experienceLinks.some(
      (link) =>
        link.text === 'Anthropic' &&
        link.href === 'https://www.anthropic.com/news/ai-for-science-program'
    ),
    'Anthropic should link to the AI for Science Program page'
  );
  assert.ok(!research?.text.includes('% Microsoft Research'));
  assert.ok(!result.bodyText.includes('Dallago Lab'));
  assert.ok(!result.bodyText.includes('Lentz Lab'));
  assert.ok(!result.bodyText.includes('PI '));

  assert.equal(engineering?.expanded, 'true');
  assert.equal(engineering?.rows, 1);
  assert.ok(engineering?.text.includes('see more'));
  assert.equal(engineering?.showMorePaddingTop, 8);
  assert.equal(teaching?.expanded, 'false');
  assert.equal(teaching?.rows, 0, 'Teaching should default collapsed');
  assert.equal(teaching?.hasShowMore, false, 'Teaching should not see more');
  assert.equal(
    teaching?.togglePaddingBottom,
    0,
    'final closed Teaching toggle should not add bottom whitespace'
  );
  assert.ok(teaching?.text.includes('Teaching (3)'));
  assert.ok(
    (teaching?.marginBottom ?? 0) < (research?.marginBottom ?? 0),
    'closed groups should use tighter vertical spacing than open groups'
  );

  const metadataStyle = {
    color: result.bodyColor,
    fontFamily: result.readingFontFamily,
    fontSize: 14,
    fontWeight: 400,
    textTransform: 'none',
  };
  const matchesMetadataStyle = (style: {
    color: string;
    fontFamily: string;
    fontSize: number;
    fontWeight: number;
    textTransform: string;
  }) =>
    style.color === metadataStyle.color &&
    style.fontFamily === metadataStyle.fontFamily &&
    style.fontSize === metadataStyle.fontSize &&
    style.fontWeight === metadataStyle.fontWeight &&
    style.textTransform === metadataStyle.textTransform;

  assert.ok(
    result.experienceDescriptionStyles.length >= 1 &&
      result.experienceDescriptionStyles.every(
        (style) =>
          style.color === result.bodyColor &&
          style.fontFamily === result.readingFontFamily &&
          style.fontSize === 16 &&
          style.textTransform === 'none'
      ),
    'experience descriptions should use the promoted readable body style'
  );

  const incomingDots = result.dots.filter((dot) => dot.state === 'incoming');
  const presentDots = result.dots.filter((dot) => dot.state === 'present');
  const endedDots = result.dots.filter((dot) => dot.state === 'ended');

  assert.ok(incomingDots.length >= 1, 'incoming marker should render');
  assert.ok(
    incomingDots.every(
      (dot) =>
        dot.className.includes('border-roy-o') &&
        dot.className.includes('bg-background') &&
        dot.border > 0 &&
        dot.backgroundColor === result.bodyBackgroundColor
    ),
    'incoming rail markers should be hollow'
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
    result.writingMetaStyles.every(matchesMetadataStyle),
    'writing word/time metadata should stay at the compact foreground metadata scale'
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
      .slice(0, -1)
      .every((connector) => connector.backgroundImage === 'none'),
    'writing rail should use solid connectors between visible rows'
  );
  assert.match(
    result.writingConnectors.at(-1)?.backgroundImage ?? '',
    /repeating-linear-gradient/,
    'writing rail should continue with a dashed connector after the final visible row'
  );
  assert.ok(
    result.writingActionRail.rowExists,
    'writing see-more action should be a rail row'
  );
  assert.equal(
    result.writingActionRail.connectorBackgroundImage,
    '',
    'writing see-more action should not draw a rail connector'
  );
  assert.equal(
    result.writingActionRail.paddingTop,
    8,
    'writing see-more action should keep the shared 8px rail gap'
  );
  assert.ok(
    result.railRowPaddingBottoms.length > 0 &&
      result.railRowPaddingBottoms.every((padding) => padding === 8),
    'experience, publication, and writing rail rows should use pb-2 between rows'
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
      .slice(0, -1)
      .every((connector) => connector.backgroundImage === 'none'),
    'publication rail should use solid connectors between visible rows'
  );
  assert.match(
    result.publicationConnectors.at(-1)?.backgroundImage ?? '',
    /repeating-linear-gradient/,
    'publication rail should continue with a dashed connector after the final visible row'
  );
  assert.ok(
    result.publicationActionRail.rowExists,
    'publication see-more action should be a rail row'
  );
  assert.equal(
    result.publicationActionRail.connectorBackgroundImage,
    '',
    'publication see-more action should not draw a rail connector'
  );
  assert.equal(
    result.publicationActionRail.paddingTop,
    8,
    'publication see-more action should keep the shared 8px rail gap'
  );
  assert.ok(
    result.publicationMetaLines.every(
      (className) =>
        className.includes('text-muted-foreground') &&
        className.includes('font-normal') &&
        !className.includes('font-mono') &&
        !className.includes('uppercase') &&
        !className.includes('text-roy-y')
    ),
    'publication type/venue metadata should use muted date color'
  );
  assert.ok(
    result.publicationAuthorStyles.every(matchesMetadataStyle),
    'publication authors should stay at the compact foreground metadata scale'
  );
  assert.ok(
    result.publicationMetaLineStyles.every(
      (style) =>
        style.color === result.mutedToken &&
        style.fontFamily === metadataStyle.fontFamily &&
        style.fontSize === metadataStyle.fontSize &&
        style.fontWeight === metadataStyle.fontWeight &&
        style.textTransform === metadataStyle.textTransform
    ),
    'publication type and journal should match publication date color'
  );
  assert.ok(
    result.publicationDateStyles.every((style) => style.fontSize === 14),
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
    result.publicationSelfAuthorStyles.every(
      (style: { className: string; fontStyle: string; fontWeight: number }) =>
        style.className.includes('font-medium') &&
        style.className.includes('italic') &&
        style.fontStyle === 'italic' &&
        style.fontWeight === 500
    ),
    'Islam Tayeb author spans should render italic at font-medium weight'
  );
  assert.ok(
    !result.publicationTitleClassName.includes('text-balance'),
    'publication titles should avoid balance wrappers that create awkward short final lines'
  );
  assert.ok(
    result.publicationRows.every((row) => {
      const authorIndex = row.indexOf('publication-authors');
      const metaIndex = row.indexOf('publication-meta-line');

      return authorIndex >= 0 && metaIndex > authorIndex;
    }),
    'publication type and journal should render under the authors'
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
    result.highlightedLinkClassNames.every((className) =>
      className.includes('royb-link-fragment')
    ),
    'home highlighted links should share the fragment-aware underline primitive'
  );
  assert.ok(
    result.seeMoreActionStyles.every(
      (style) =>
        style.text === style.text.toLowerCase() &&
        style.fontVariantCaps === 'normal' &&
        style.fontSize === 14 &&
        style.textTransform === 'none'
    ),
    'see more actions should stay lowercase date-sized normal text'
  );
  assert.equal(result.footerBorderTopWidth, 1);
  assert.ok(result.bodyText.includes('see more on scholar'));
  assert.ok(result.bodyText.includes('see more on blog'));
  assert.equal(result.footerUpdateText, 'Last updated Jun 21, 2026');
  assert.ok(result.footerQuoteText.includes('plz enjoy game'));
  assert.ok(result.footerQuoteText.includes('rrtyui'));
  assert.ok(!result.footerText.includes('Links:'));
  assert.equal(result.footerUpdateWhiteSpace, 'nowrap');
  assert.equal(result.footerQuoteTextAlign, 'right');
  assert.ok(
    Math.abs(result.footerLeft - result.footerUpdateLeft) <= 1,
    'footer update text should sit at the left edge'
  );
  assert.ok(
    Math.abs(result.footerRight - result.footerQuoteRight) <= 1,
    'footer quote should sit at the right edge'
  );
}

async function assertMobileHeroContactCompact(page: Page) {
  const result = await page.evaluate(() => {
    const heroPortrait = document.querySelector<HTMLElement>(
      '[data-testid="hero-portrait"]'
    );
    const heroContactIndex = heroPortrait?.parentElement as HTMLElement | null;
    const heroContactDetails =
      heroContactIndex?.querySelector<HTMLElement>('div');
    const portraitRect = heroPortrait?.getBoundingClientRect();
    const contactIndexRect = heroContactIndex?.getBoundingClientRect();
    const contactDetailsRect = heroContactDetails?.getBoundingClientRect();

    return {
      exists: Boolean(heroPortrait),
      display: heroPortrait ? getComputedStyle(heroPortrait).display : '',
      width: portraitRect?.width ?? 0,
      height: portraitRect?.height ?? 0,
      contactTopGap:
        (contactDetailsRect?.top ?? 0) - (contactIndexRect?.top ?? 0),
      contactLabel:
        heroContactDetails
          ?.querySelector('span')
          ?.textContent?.replace(/\s+/g, ' ')
          .trim() ?? '',
      contactLinks: [...(heroContactDetails?.querySelectorAll('a') ?? [])].map(
        (link) => link.textContent?.trim() ?? ''
      ),
    };
  });

  assert.equal(result.exists, true);
  assert.equal(result.display, 'none');
  assert.equal(result.width, 0);
  assert.equal(result.height, 0);
  assert.ok(
    Math.abs(result.contactTopGap) <= 1,
    `mobile contact should start without a hidden portrait gap: ${result.contactTopGap}`
  );
  assert.equal(result.contactLabel, 'contact');
  assert.deepEqual(result.contactLinks, [
    'email',
    'linkedin',
    'github',
    'x',
    'scholar',
  ]);
}

async function assertMobileRailDescriptionsWrap(page: Page) {
  const result = await page.evaluate(() =>
    [
      ...document.querySelectorAll<HTMLElement>(
        '#experience p[data-one-line="true"]'
      ),
    ].map((description) => {
      const style = getComputedStyle(description);
      const rect = description.getBoundingClientRect();

      return {
        text: description.textContent?.replace(/\s+/g, ' ').trim() ?? '',
        whiteSpace: style.whiteSpace,
        overflowX: style.overflowX,
        textOverflow: style.textOverflow,
        height: rect.height,
        lineHeight: Number.parseFloat(style.lineHeight),
      };
    })
  );

  assert.ok(result.length > 0, 'mobile experience descriptions should render');
  assert.ok(
    result.every(
      (description) =>
        description.whiteSpace === 'normal' &&
        description.overflowX === 'visible' &&
        description.textOverflow === 'clip'
    ),
    'mobile experience descriptions should use normal wrapping instead of truncation'
  );
  assert.ok(
    result.some(
      (description) => description.height > description.lineHeight * 1.5
    ),
    'at least one mobile experience description should wrap across lines'
  );
}

async function assertMobileFooterAlignment(page: Page) {
  const result = await page.evaluate(() => {
    const footer = document.querySelector<HTMLElement>(
      '[data-testid="site-footer"]'
    );
    const update = footer?.querySelector<HTMLElement>(
      '[data-testid="site-footer-updated"]'
    );
    const quote = footer?.querySelector<HTMLElement>(
      '[data-testid="site-footer-quote"]'
    );
    const updateStyle = update ? getComputedStyle(update) : null;
    const quoteStyle = quote ? getComputedStyle(quote) : null;
    const footerRect = footer?.getBoundingClientRect();
    const updateRect = update?.getBoundingClientRect();

    return {
      footerClientWidth: footer?.clientWidth ?? 0,
      footerScrollWidth: footer?.scrollWidth ?? 0,
      footerVisibleText: footer?.innerText?.replace(/\s+/g, ' ').trim() ?? '',
      footerLeft: footerRect?.left ?? 0,
      updateLeft: updateRect?.left ?? 0,
      updateHeight: updateRect?.height ?? 0,
      updateText: update?.innerText?.replace(/\s+/g, ' ').trim() ?? '',
      updateFontSize: Number.parseFloat(updateStyle?.fontSize ?? '0'),
      updateLineHeight: Number.parseFloat(updateStyle?.lineHeight ?? '0'),
      updateWhiteSpace: updateStyle?.whiteSpace ?? '',
      quoteDisplay: quoteStyle?.display ?? '',
    };
  });

  assert.ok(
    result.footerScrollWidth <= result.footerClientWidth + 1,
    `mobile footer should not overflow horizontally: ${result.footerScrollWidth} / ${result.footerClientWidth}`
  );
  assert.equal(result.updateWhiteSpace, 'nowrap');
  assert.equal(result.updateText, 'Last updated Jun 21, 2026');
  assert.equal(result.updateFontSize, 14);
  assert.equal(result.footerVisibleText, 'Last updated Jun 21, 2026');
  assert.equal(result.quoteDisplay, 'none');
  assert.ok(!result.footerVisibleText.includes('plz enjoy game'));
  assert.ok(!result.footerVisibleText.includes('rrtyui'));
  assert.ok(
    Math.abs(result.footerLeft - result.updateLeft) <= 1,
    'mobile footer update should stay on the left edge'
  );
  assert.ok(
    result.updateHeight <= result.updateLineHeight * 1.25,
    `mobile footer update should stay one line: ${result.updateHeight} / ${result.updateLineHeight}`
  );
}

async function assertWrappedInlineHighlight({
  page,
  selector,
  label,
  colorVariable,
}: {
  page: Page;
  selector: string;
  label: string;
  colorVariable: string;
}) {
  const titleLink = page.locator(selector).first();

  assert.ok((await titleLink.count()) > 0, `${label} should render`);
  await titleLink.hover();

  const result = await page.evaluate(
    ({ selector, colorVariable }) => {
      const link = document.querySelector<HTMLElement>(selector);
      const style = link ? getComputedStyle(link) : null;
      const probe = document.createElement('span');

      probe.style.color = colorVariable;
      document.body.append(probe);

      const expectedColor = getComputedStyle(probe).color;

      probe.remove();

      const range = document.createRange();

      if (link) {
        range.selectNodeContents(link);
      }

      const contentRects = [...range.getClientRects()].filter(
        (rect) => rect.width > 0 && rect.height > 0
      );
      const elementRects = link
        ? [...link.getClientRects()].filter(
            (rect) => rect.width > 0 && rect.height > 0
          )
        : [];

      return {
        text: link?.textContent?.replace(/\s+/g, ' ').trim() ?? '',
        contentLineCount: contentRects.length,
        elementLineCount: elementRects.length,
        display: style?.display ?? '',
        boxShadow: style?.boxShadow ?? '',
        color: style?.color ?? '',
        decoration: style?.textDecorationLine ?? '',
        expectedColor,
      };
    },
    { selector, colorVariable }
  );

  assert.ok(
    result.contentLineCount > 1,
    `${label} should wrap before testing multiline highlight: ${result.contentLineCount}`
  );
  assert.ok(
    result.elementLineCount > 1,
    `${label} anchor should expose per-line fragments, not one block box: ${result.elementLineCount}`
  );
  assert.equal(result.display, 'inline', `${label} should stay inline`);
  assert.ok(result.boxShadow.includes('inset'));
  assert.equal(result.color, result.expectedColor);
  assert.equal(result.decoration, 'none');
}

async function assertMobileHomeWrappedHighlights(page: Page) {
  await assertWrappedInlineHighlight({
    page,
    selector: 'a[href="https://machine.learning.bio/"]',
    label: 'mobile experience advisor org link',
    colorVariable: 'var(--roy-o)',
  });
  await assertWrappedInlineHighlight({
    page,
    selector: 'a[href="/blog/on-agent-memory-fidelity"]',
    label: 'mobile home writing title',
    colorVariable: 'var(--roy-b)',
  });
  await assertWrappedInlineHighlight({
    page,
    selector: '#publications [data-testid="publication-title"]',
    label: 'mobile publication title',
    colorVariable: 'var(--roy-y)',
  });
}

async function assertMobileBlogWrappedHighlight(page: Page) {
  await assertWrappedInlineHighlight({
    page,
    selector: 'a[href="/blog/on-agent-memory-fidelity"]',
    label: 'mobile blog index title',
    colorVariable: 'var(--roy-b)',
  });
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
      boxShadow: style?.boxShadow ?? '',
      color: style?.color ?? '',
      decoration: style?.textDecorationLine ?? '',
      skipInk: style?.textDecorationSkipInk ?? '',
      yellowToken,
    };
  });

  assert.ok(result.boxShadow.includes('inset'));
  assert.equal(result.color, result.yellowToken);
  assert.equal(result.decoration, 'none');
  assert.equal(result.skipInk, 'auto');
}

async function assertExperienceGroupLabelHoverHighlight(page: Page) {
  await page.locator('[data-testid="experience-group-label"]').first().hover();

  const result = await page.evaluate(() => {
    const label = document.querySelector<HTMLElement>(
      '[data-testid="experience-group-label"]:hover'
    );
    const style = label ? getComputedStyle(label) : null;
    const probe = document.createElement('span');

    probe.style.color = 'var(--roy-o)';
    document.body.append(probe);

    const orangeToken = getComputedStyle(probe).color;

    probe.remove();

    return {
      boxShadow: style?.boxShadow ?? '',
      color: style?.color ?? '',
      decoration: style?.textDecorationLine ?? '',
      skipInk: style?.textDecorationSkipInk ?? '',
      orangeToken,
    };
  });

  assert.ok(result.boxShadow.includes('inset'));
  assert.equal(result.color, result.orangeToken);
  assert.equal(result.decoration, 'none');
  assert.equal(result.skipInk, 'auto');
}

async function assertExperienceInteractions(page: Page) {
  const groupRows = async (group: string) =>
    page
      .locator(`[data-testid="experience-group"][data-group="${group}"]`)
      .locator('[data-testid="rail-title"]')
      .count();

  assert.equal(await groupRows('Research'), 4);
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
  assert.equal(await groupRows('Research'), 4);

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
  const teachingIncomingDot = page
    .locator('[data-testid="experience-group"][data-group="Teaching"]')
    .locator('[data-testid="rail-dot"][data-state="incoming"]');
  const teachingIncomingDotClassName =
    (await teachingIncomingDot.getAttribute('class')) ?? '';

  assert.ok(teachingText?.includes('Operating Systems'));
  assert.ok(teachingText?.includes('Computer Systems'));
  assert.ok(teachingText?.includes('Organic Chemistry I'));
  assert.ok(
    teachingText?.includes(
      'Introducing kernels, co-leading a discussion section + office hours'
    )
  );
  assert.ok(
    teachingText?.includes(
      'Introduced CPUs, co-led a discussion section + office hours'
    )
  );
  assert.ok(
    teachingText?.includes(
      'Led a study group, saw kids quit pre-med as the semester went'
    )
  );
  assert.ok(teachingIncomingDotClassName.includes('border-roy-o'));
  assert.ok(teachingIncomingDotClassName.includes('bg-background'));
  assert.ok(!teachingText?.includes('Duke University.'));
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
      boxShadow: link ? getComputedStyle(link).boxShadow : '',
      textDecorationLine: link ? getComputedStyle(link).textDecorationLine : '',
      textDecorationSkipInk: link
        ? getComputedStyle(link).textDecorationSkipInk
        : '',
    };
  });

  assert.equal(colors.linkColor, colors.redToken);
  assert.ok(colors.boxShadow.includes('inset'));
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
    const headingElement = document.querySelector<HTMLElement>('#posts h2');
    const bodyColor = getComputedStyle(document.body).color;
    const markerElement =
      document.querySelector<HTMLElement>('#posts header span');
    const headingLeft = headingElement?.getBoundingClientRect().left ?? 0;
    const sectionLeft =
      document.querySelector<HTMLElement>('#posts')?.getBoundingClientRect()
        .left ?? 0;
    const headerRow = document.querySelector<HTMLElement>(
      '#posts header > div'
    );
    const headerRowRect = headerRow?.getBoundingClientRect();
    const marker =
      markerElement?.textContent?.replace(/\s+/g, ' ').trim() ?? '';
    const rail = document.querySelector('[data-testid="blog-index-rail"]');
    const items = [...(rail?.querySelectorAll<HTMLElement>('li') ?? [])];
    const legend = document.querySelector<HTMLElement>(
      '[data-testid="blog-index-legend"]'
    );
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
    const firstFooterStyle = firstFooter ? getComputedStyle(firstFooter) : null;
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
    const externalMetaStyles = externalMetas.map((meta) => {
      const style = getComputedStyle(meta);

      return {
        color: style.color,
        fontFamily: style.fontFamily,
        fontSize: Number.parseFloat(style.fontSize),
        fontWeight: Number.parseInt(style.fontWeight, 10),
        textTransform: style.textTransform,
      };
    });
    const footer = document.querySelector('footer');
    const bodyStyle = getComputedStyle(document.body);
    const readingProbe = document.createElement('span');

    readingProbe.className = 'reading-copy';
    document.body.append(readingProbe);
    const readingFontFamily = getComputedStyle(readingProbe).fontFamily;
    readingProbe.remove();

    const highlightedLinkClassNames = [
      ...document.querySelectorAll<HTMLElement>('a.royb-link-highlight'),
    ].map((link) => link.className);

    return {
      header,
      mainLeft: main?.getBoundingClientRect().left ?? 0,
      mainContentLeft:
        (main?.getBoundingClientRect().left ?? 0) +
        Number.parseFloat(mainStyle?.paddingLeft ?? '0'),
      heading,
      headingLeft,
      bodyColor,
      bodyFontFamily: bodyStyle.fontFamily,
      headingColor: headingElement
        ? getComputedStyle(headingElement).color
        : '',
      readingFontFamily,
      sectionLeft,
      marker,
      markerColor: markerElement ? getComputedStyle(markerElement).color : '',
      headerFirstRowGap:
        (items[0]?.getBoundingClientRect().top ?? 0) -
        (headerRowRect?.bottom ?? 0),
      legendExists: Boolean(legend),
      itemMarkers,
      itemCount: items.length,
      rowPaddingBottoms: items
        .slice(0, -1)
        .map((item) => Number.parseFloat(getComputedStyle(item).paddingBottom)),
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
      externalMetaStyles,
      firstFooterText:
        firstFooter?.textContent?.replace(/\s+/g, ' ').trim() ?? '',
      firstFooterStyle: {
        color: firstFooterStyle?.color ?? '',
        fontFamily: firstFooterStyle?.fontFamily ?? '',
        fontSize: Number.parseFloat(firstFooterStyle?.fontSize ?? '0'),
        fontWeight: Number.parseInt(firstFooterStyle?.fontWeight ?? '0', 10),
        textTransform: firstFooterStyle?.textTransform ?? '',
      },
      postDates,
      firstRailTitleLeft:
        items[0]
          ?.querySelector<HTMLElement>('[data-testid="rail-title"]')
          ?.getBoundingClientRect().left ?? 0,
      bodyText: document.body.textContent?.replace(/\s+/g, ' ').trim() ?? '',
      descriptionCount: descriptions?.length ?? 0,
      highlightedLinkClassNames,
      footerBottom: footer?.getBoundingClientRect().bottom ?? 0,
      viewportHeight: window.innerHeight,
    };
  });

  assert.equal(result.header, '', 'blog header should only contain ROYB band');
  assert.equal(result.marker, '§1');
  assert.equal(result.heading, `Index (${result.itemCount})`);
  assert.equal(
    result.headingColor,
    result.bodyColor,
    'blog index title should use neutral foreground text'
  );
  assert.ok(
    Math.abs(result.sectionLeft - result.mainContentLeft) <= 1,
    'blog index section should touch the main document content edge'
  );
  assert.ok(
    Math.abs(result.headingLeft - result.firstRailTitleLeft) <= 1,
    'blog index heading should align with blog rail row titles'
  );
  assert.ok(
    result.headerFirstRowGap >= 11 && result.headerFirstRowGap <= 13,
    `blog index header/list gap should match About/title spacing: ${result.headerFirstRowGap}`
  );
  assert.ok(
    result.rowPaddingBottoms.length > 0 &&
      result.rowPaddingBottoms.every((padding) => padding === 8),
    'blog index rail rows should use pb-2 between rows'
  );
  assert.equal(result.legendExists, false, 'blog index legend should be gone');
  const filledBlogRows = result.itemMarkers.filter(
    (item) => item.border === 0 && item.backgroundColor !== 'rgba(0, 0, 0, 0)'
  );
  const hollowBlogRows = result.itemMarkers.filter(
    (item) => item.border >= 1 && item.backgroundColor === 'rgba(0, 0, 0, 0)'
  );

  assert.equal(
    filledBlogRows.length,
    result.itemCount,
    'all blog rows should use filled rail markers'
  );
  assert.equal(
    hollowBlogRows.length,
    0,
    'blog rows should not use hollow opinion markers'
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
  assert.deepEqual(
    {
      color: result.firstFooterStyle.color,
      fontFamily: result.firstFooterStyle.fontFamily,
      fontSize: result.firstFooterStyle.fontSize,
      fontWeight: result.firstFooterStyle.fontWeight,
      textTransform: result.firstFooterStyle.textTransform,
    },
    {
      color: result.bodyColor,
      fontFamily: result.readingFontFamily,
      fontSize: 14,
      fontWeight: 400,
      textTransform: 'none',
    },
    'blog index word/time metadata should use body foreground styling'
  );
  assert.ok(
    result.externalMetaStyles.every(
      (style) =>
        style.color === result.bodyColor &&
        style.fontFamily === result.readingFontFamily &&
        style.fontSize === 14 &&
        style.fontWeight === 400 &&
        style.textTransform === 'none'
    ),
    'external writing word/time metadata should match blog post metadata'
  );
  assert.ok(
    result.highlightedLinkClassNames.every((className) =>
      className.includes('royb-link-fragment')
    ),
    'blog index highlighted links should share the fragment-aware underline primitive'
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
    const article = document.querySelector<HTMLElement>(
      '[data-testid="blog-article"]'
    );
    const articleStyle = article ? getComputedStyle(article) : null;
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
    const h4 = document.querySelector<HTMLElement>('.article-prose > h4');
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
    const tocFirstSectionStyle = tocFirstSection
      ? getComputedStyle(tocFirstSection)
      : null;
    const hoveredArticleLinkStyle = hoveredArticleLink
      ? getComputedStyle(hoveredArticleLink)
      : null;
    const imageStyle = image ? getComputedStyle(image) : null;
    const captionStyle = caption ? getComputedStyle(caption) : null;
    const h2Style = h2 ? getComputedStyle(h2) : null;
    const h3Style = h3 ? getComputedStyle(h3) : null;
    const h4Style = h4 ? getComputedStyle(h4) : null;
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
    const highlightedLinkClassNames = [
      ...document.querySelectorAll<HTMLElement>(
        '.article-prose a.royb-link-highlight'
      ),
    ].map((link) => link.className);
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
      articlePaddingBottom: Number.parseFloat(
        articleStyle?.paddingBottom ?? '0'
      ),
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
      tocFirstColumnGap: Number.parseFloat(
        tocFirstSectionStyle?.columnGap ?? '0'
      ),
      tocFirstNumDecoration: tocFirstNumStyle?.textDecorationLine ?? '',
      hoveredArticleLinkShadow: hoveredArticleLinkStyle?.boxShadow ?? '',
      hoveredArticleLinkColor: hoveredArticleLinkStyle?.color ?? '',
      blueToken,
      hoveredArticleLinkDecoration:
        hoveredArticleLinkStyle?.textDecorationLine ?? '',
      hoveredArticleLinkSkipInk:
        hoveredArticleLinkStyle?.textDecorationSkipInk ?? '',
      highlightedLinkClassNames,
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
      h4Size: Number.parseFloat(h4Style?.fontSize ?? '0'),
      h4Family: h4Style?.fontFamily ?? '',
      h2Weight: Number.parseInt(h2Style?.fontWeight ?? '0', 10),
      h3Weight: Number.parseInt(h3Style?.fontWeight ?? '0', 10),
      h3Transform: h3Style?.textTransform ?? '',
      h4Transform: h4Style?.textTransform ?? '',
      h4LetterSpacing: h4Style?.letterSpacing ?? '',
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
    result.tocMetaLabelSize >= 14 && result.tocMetaLabelSize < 15,
    'TOC metadata labels should match the hero contact scale'
  );
  assert.ok(
    result.tocMetaValueSize >= 14 && result.tocMetaValueSize < 15,
    'TOC metadata values should match the hero contact scale'
  );
  assert.equal(result.tocFirstNumText, '0');
  assert.equal(result.tocFirstLinkText, 'Background');
  assert.equal(result.tocFirstLinkDecoration, 'underline');
  assert.equal(result.tocFirstNumDecoration, 'none');
  assert.equal(
    result.tocFirstColumnGap,
    12,
    'TOC section number/title column gap should be 0.75rem'
  );
  assert.ok(
    result.tocFirstGap >= 12,
    `TOC rendered number/title gap should reflect the wider grid gap: ${result.tocFirstGap}`
  );
  assert.ok(
    result.tocFirstLinkWidth < result.tocWidth * 0.4,
    'TOC hover/click area should stay close to the text, not full width'
  );
  assert.ok(result.hoveredArticleLinkShadow.includes('inset'));
  assert.equal(result.hoveredArticleLinkColor, result.blueToken);
  assert.equal(result.hoveredArticleLinkDecoration, 'none');
  assert.equal(result.hoveredArticleLinkSkipInk, 'auto');
  assert.ok(
    result.highlightedLinkClassNames.every((className) =>
      className.includes('royb-link-fragment')
    ),
    'article highlighted links should share the fragment-aware underline primitive'
  );

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
        boxShadow: style?.boxShadow ?? '',
        decoration: style?.textDecorationLine ?? '',
        skipInk: style?.textDecorationSkipInk ?? '',
        blueToken,
      };
    });

    assert.equal(tocGithubHover.color, tocGithubHover.blueToken);
    assert.ok(tocGithubHover.boxShadow.includes('inset'));
    assert.equal(tocGithubHover.decoration, 'none');
    assert.equal(tocGithubHover.skipInk, 'auto');
  }

  assert.equal(result.imageBorderTop, '0px');
  assert.equal(result.captionAlign, 'center');
  assert.ok(result.captionSize >= 14 && result.captionSize < 15);
  assert.equal(result.videoAutoplay, true);
  assert.equal(result.videoControls, true);
  assert.equal(result.videoLoop, true);
  assert.equal(result.videoMuted, true);
  assert.equal(result.videoPlaysInline, true);
  assert.equal(result.videoPreload, 'auto');
  assert.ok(result.h2Size > result.h3Size);
  assert.ok(result.h2Weight >= 600);
  assert.ok(result.h3Weight >= 600 && result.h3Weight <= result.h2Weight);
  assert.equal(result.h3Transform, 'none');
  if (result.h4Size > 0) {
    assert.ok(result.h3Size > result.h4Size);
    assert.ok(result.h4Size >= 18);
    assert.equal(result.h4Transform, 'none');
    assert.equal(result.h4LetterSpacing, 'normal');
    assert.ok(
      result.h4Family.includes('Sora'),
      'article h4 labels should use the site title sans font'
    );
  }
  assert.notEqual(result.tokenColor, result.codeColor);
  assert.ok(
    result.maxCodeTokenWeight <= 400,
    'article code highlighting should not bold tokens'
  );
  assert.equal(result.codeBackground, 'rgb(243, 243, 241)');
  assert.ok(
    result.articlePaddingBottom >= 170 && result.articlePaddingBottom <= 178,
    `articles should keep a fixed bottom reading buffer: ${result.articlePaddingBottom}`
  );
  assert.equal(result.articleListStyle, 'decimal');
  assert.ok(result.articleListPadding >= 39 && result.articleListPadding <= 41);
  assert.ok(result.footnotesSize >= 14 && result.footnotesSize < 15);
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

  const darkCode = await page.evaluate(() => {
    const root = document.documentElement;
    const originalClassName = root.className;

    root.classList.remove('light');
    root.classList.add('dark');

    const block = document.querySelector<HTMLElement>(
      '.article-prose .article-code-block'
    );
    const keyword = document.querySelector<HTMLElement>(
      '.article-prose .highlight .hljs-keyword, .article-prose .highlight .k'
    );
    const kbd = document.querySelector<HTMLElement>('.article-prose kbd');
    const code = document.querySelector<HTMLElement>(
      '.article-prose .highlight code'
    );
    const blockStyle = block ? getComputedStyle(block) : null;
    const keywordStyle = keyword ? getComputedStyle(keyword) : null;
    const kbdStyle = kbd ? getComputedStyle(kbd) : null;
    const codeStyle = code ? getComputedStyle(code) : null;
    const result = {
      background: blockStyle?.backgroundColor ?? '',
      color: codeStyle?.color ?? blockStyle?.color ?? '',
      keywordColor: keywordStyle?.color ?? '',
      kbdBackground: kbdStyle?.backgroundColor ?? '',
      kbdBackgroundImage: kbdStyle?.backgroundImage ?? '',
      kbdBorderTop: kbdStyle?.borderTopColor ?? '',
      kbdColor: kbdStyle?.color ?? '',
    };

    root.className = originalClassName;

    return result;
  });

  assert.equal(darkCode.background, 'rgb(28, 28, 28)');
  assert.notEqual(darkCode.color, 'rgb(28, 28, 28)');
  assert.notEqual(darkCode.keywordColor, 'rgb(28, 28, 28)');
  assert.equal(darkCode.kbdBackground, 'rgb(36, 36, 36)');
  assert.match(darkCode.kbdBackgroundImage, /linear-gradient/);
  assert.notEqual(darkCode.kbdColor, darkCode.kbdBackground);
  assert.notEqual(darkCode.kbdBorderTop, darkCode.kbdBackground);
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
    const h4 = document.querySelector<HTMLElement>('.article-prose h4');
    const h4Style = h4 ? getComputedStyle(h4) : null;
    const tablePair = document.querySelector<HTMLElement>(
      '.article-table-pair'
    );
    const tablePairStyle = tablePair ? getComputedStyle(tablePair) : null;
    const keyVisualizations = document.querySelector<HTMLElement>(
      '.key-visualizations'
    );
    const keyVisualizationsStyle = keyVisualizations
      ? getComputedStyle(keyVisualizations)
      : null;
    const iframes = [
      ...document.querySelectorAll<HTMLIFrameElement>('.article-prose iframe'),
    ];

    return {
      bodyText: document.body.textContent?.replace(/\s+/g, ' ').trim() ?? '',
      h4Text: h4?.textContent?.replace(/\s+/g, ' ').trim() ?? '',
      h4Transform: h4Style?.textTransform ?? '',
      h4LetterSpacing: h4Style?.letterSpacing ?? '',
      h4FontFamily: h4Style?.fontFamily ?? '',
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
      tablePairDisplay: tablePairStyle?.display ?? '',
      tablePairFlexDirection: tablePairStyle?.flexDirection ?? '',
      keyVisualizationsDisplay: keyVisualizationsStyle?.display ?? '',
      keyVisualizationsFlexDirection:
        keyVisualizationsStyle?.flexDirection ?? '',
      iframeData: iframes.map((iframe) => ({
        allowTransparency: iframe.getAttribute('allowtransparency') ?? '',
        styleAttr: iframe.getAttribute('style') ?? '',
        isHarmonia: iframe.getAttribute('data-harmonia-iframe') ?? '',
        baseSrc: iframe.getAttribute('data-harmonia-src') ?? '',
        src: iframe.getAttribute('src') ?? '',
        theme: iframe.getAttribute('data-harmonia-theme') ?? '',
        background: getComputedStyle(iframe).backgroundColor,
        opacity: getComputedStyle(iframe).opacity,
      })),
    };
  });

  assert.equal(result.hasPronounParagraph, true);
  assert.equal(result.h4Text, 'Genre Fusion (Dim 13)');
  assert.equal(result.h4Transform, 'none');
  assert.equal(result.h4LetterSpacing, 'normal');
  assert.ok(
    result.h4FontFamily.includes('Sora'),
    'Harmonia subheads should use the sans title font'
  );
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
  assert.equal(result.tablePairDisplay, 'flex');
  assert.equal(result.tablePairFlexDirection, 'column');
  assert.equal(result.keyVisualizationsDisplay, 'flex');
  assert.equal(result.keyVisualizationsFlexDirection, 'column');
  assert.ok(result.iframeData.length >= 1, 'Harmonia should render iframes');
  assert.ok(
    result.iframeData.every(
      (iframe) =>
        iframe.allowTransparency === 'true' &&
        iframe.isHarmonia === 'true' &&
        iframe.baseSrc.startsWith('https://islamtayeb.github.io/harmonia/') &&
        iframe.src.includes('theme=light') &&
        iframe.theme === 'light' &&
        !/background\s*:/i.test(iframe.styleAttr) &&
        iframe.background === 'rgba(0, 0, 0, 0)' &&
        iframe.opacity === '1'
    ),
    'all Harmonia iframes should be transparent and fully opaque'
  );
}

async function assertHarmoniaIframeDarkTheme(page: Page) {
  await page.getByTestId('theme-toggle').click();
  await page.waitForFunction(() =>
    [...document.querySelectorAll('iframe[data-harmonia-iframe="true"]')].every(
      (iframe) =>
        iframe.getAttribute('data-harmonia-theme') === 'dark' &&
        (iframe.getAttribute('src') ?? '').includes('theme=dark')
    )
  );

  const result = await page.evaluate(() =>
    [
      ...document.querySelectorAll<HTMLIFrameElement>(
        'iframe[data-harmonia-iframe="true"]'
      ),
    ].map((iframe) => ({
      src: iframe.getAttribute('src') ?? '',
      theme: iframe.getAttribute('data-harmonia-theme') ?? '',
    }))
  );

  assert.ok(result.length >= 1, 'Harmonia should render theme-aware iframes');
  assert.ok(
    result.every(
      (iframe) => iframe.theme === 'dark' && iframe.src.includes('theme=dark')
    ),
    'Harmonia iframes should receive the dark theme argument after toggling'
  );

  await page.getByTestId('theme-toggle').click();
  await page.waitForFunction(() =>
    [...document.querySelectorAll('iframe[data-harmonia-iframe="true"]')].every(
      (iframe) =>
        iframe.getAttribute('data-harmonia-theme') === 'light' &&
        (iframe.getAttribute('src') ?? '').includes('theme=light')
    )
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
    const detailSummaries = [
      ...document.querySelectorAll<HTMLElement>('.article-summary'),
    ];
    const lists = [
      ...document.querySelectorAll<HTMLElement>(
        '.article-prose > ol, .article-prose > ul'
      ),
    ];
    const orderedItem = document.querySelector('.article-prose > ol > li');
    const unorderedItem = document.querySelector('.article-prose > ul > li');
    const orderedWalker = orderedItem
      ? document.createTreeWalker(orderedItem, NodeFilter.SHOW_TEXT)
      : null;
    const unorderedWalker = unorderedItem
      ? document.createTreeWalker(unorderedItem, NodeFilter.SHOW_TEXT)
      : null;
    let orderedNode = orderedWalker?.nextNode() ?? null;
    let unorderedNode = unorderedWalker?.nextNode() ?? null;

    while (orderedNode && !orderedNode.textContent?.trim()) {
      orderedNode = orderedWalker?.nextNode() ?? null;
    }

    while (unorderedNode && !unorderedNode.textContent?.trim()) {
      unorderedNode = unorderedWalker?.nextNode() ?? null;
    }

    const orderedRange = document.createRange();
    const unorderedRange = document.createRange();

    if (orderedNode) {
      orderedRange.selectNodeContents(orderedNode);
    }

    if (unorderedNode) {
      unorderedRange.selectNodeContents(unorderedNode);
    }

    const orderedTextLeft = orderedNode
      ? orderedRange.getBoundingClientRect().left
      : 0;
    const unorderedTextLeft = unorderedNode
      ? unorderedRange.getBoundingClientRect().left
      : 0;

    orderedRange.detach();
    unorderedRange.detach();

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
        tag: list.tagName,
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
      orderedTextLeft,
      unorderedTextLeft,
      maxListOverflow,
      detailSummaryTexts: detailSummaries.map(
        (summary) => summary.textContent?.replace(/\s+/g, ' ').trim() ?? ''
      ),
      detailSummaryEmTexts: detailSummaries.map(
        (summary) =>
          summary
            .querySelector('em')
            ?.textContent?.replace(/\s+/g, ' ')
            .trim() ?? ''
      ),
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
      (caption) => caption.align === 'center' && caption.size >= 14
    ),
    'legacy captions should be centered and caption-sized'
  );
  assert.equal(result.keycapDisplay, 'inline-block');
  assert.notEqual(result.keycapBorderTop, '0px');
  assert.notEqual(result.keycapBoxShadow, 'none');
  assert.match(result.keycapBackgroundImage, /linear-gradient/);
  assert.match(result.keycapBoxShadow, /inset/);
  assert.ok(result.listData.length > 0, 'legacy article should include lists');
  assert.ok(
    result.listData.some(
      (list) =>
        list.tag === 'OL' && list.paddingLeft >= 39 && list.paddingLeft <= 41
    ),
    'ordered article lists should keep an APM-like outside-marker indent'
  );
  assert.ok(
    result.listData.some(
      (list) =>
        list.tag === 'UL' && list.paddingLeft >= 39 && list.paddingLeft <= 41
    ),
    'unordered article lists should keep the same APM/browser-default indent'
  );
  assert.ok(
    result.unorderedTextLeft - result.orderedTextLeft >= 5 &&
      result.unorderedTextLeft - result.orderedTextLeft <= 8,
    `ordered/unordered list text should keep the APM outside-marker offset: ${result.orderedTextLeft} / ${result.unorderedTextLeft}`
  );
  assert.ok(
    result.maxListOverflow <= 1,
    `article lists should stay inside prose width: ${result.maxListOverflow}`
  );
  assert.ok(
    result.detailSummaryTexts.includes('tmux: Terminal multiplexer'),
    'details summaries should preserve the visible label text'
  );
  assert.ok(
    result.detailSummaryEmTexts.every((text) => text.endsWith(':')),
    'details summary colons should live inside the emphasized/link label'
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
    await assertExperienceGroupLabelHoverHighlight(home);
    await assertThemeToggleIsStable(home);
    await screenshot(home, 'home-desktop');
    await assertExperienceInteractions(home);
    await screenshot(home, 'home-experience-expanded');

    const mobile = await browser.newPage({
      viewport: { width: 390, height: 844 },
    });
    await mobile.goto(baseUrl, { waitUntil: 'networkidle' });
    await assertRoybBandPlacement(mobile);
    await assertMobileHeroContactCompact(mobile);
    await assertMobileRailDescriptionsWrap(mobile);
    await assertMobileFooterAlignment(mobile);
    await screenshot(mobile, 'home-mobile');

    const narrowMobile = await browser.newPage({
      viewport: { width: 320, height: 844 },
    });
    await narrowMobile.goto(baseUrl, { waitUntil: 'networkidle' });
    await assertMobileFooterAlignment(narrowMobile);
    await assertMobileHomeWrappedHighlights(narrowMobile);

    const mobileBlog = await browser.newPage({
      viewport: { width: 390, height: 844 },
    });
    await mobileBlog.goto(`${baseUrl}/blog`, { waitUntil: 'networkidle' });
    await assertMobileBlogWrappedHighlight(mobileBlog);
    await screenshot(mobileBlog, 'blog-index-mobile');

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
    await assertHarmoniaIframeDarkTheme(harmoniaArticle);
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
