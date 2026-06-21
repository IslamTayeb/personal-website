import assert from 'node:assert/strict';
import { mkdir, readFile } from 'node:fs/promises';
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
    const themeToggleStateClassName = themeToggle
      ? [themeToggle, ...themeToggle.querySelectorAll('*')]
          .map((element) => element.className)
          .join(' ')
      : '';
    const heroSection = document.querySelector('[data-testid="hero-section"]');
    const heroSectionMarker =
      heroSection
        ?.querySelector('header span')
        ?.textContent?.replace(/\s+/g, ' ')
        .trim() ?? '';
    const heroSectionLabel =
      heroSection
        ?.querySelector('header h2')
        ?.textContent?.replace(/\s+/g, ' ')
        .trim() ?? '';
    const topLevelSections = [...document.querySelectorAll('main > section')];
    const footer = document.querySelector('footer');
    const footerQuote = footer?.querySelector('span');
    const experienceSection = document.querySelector('#experience');
    const publicationMetaLine = document.querySelector(
      '[data-testid="publication-meta-line"]'
    );
    const engineeringGroup = document.querySelector(
      '[data-testid="experience-group"][data-group="Engineering"]'
    );
    const moreControl = document.querySelector<HTMLElement>(
      '[data-testid="experience-more-control"]'
    );
    const seeMoreScholar = [
      ...document.querySelectorAll<HTMLElement>('a'),
    ].find((link) =>
      link.textContent?.toLowerCase().includes('see more on scholar')
    );
    const readAllPosts = [...document.querySelectorAll<HTMLElement>('a')].find(
      (link) => link.textContent?.toLowerCase().includes('read all posts')
    );
    const detail = document.querySelector('[data-testid="course-detail"]');
    const detailText = document.querySelector(
      '[data-testid="course-detail-text"]'
    );
    const section = document.querySelector('section');
    const panel = document.querySelector('[data-testid="bordered-panel"]');
    const panelStyle = panel ? getComputedStyle(panel) : null;
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
      heroBorderTopWidth: heroSection
        ? Number.parseFloat(getComputedStyle(heroSection).borderTopWidth)
        : 0,
      heroSectionMarker,
      heroSectionLabel,
      sectionBorderTopWidths: topLevelSections.map((element) =>
        Number.parseFloat(getComputedStyle(element).borderTopWidth)
      ),
      footerBorderTopWidth: footer
        ? Number.parseFloat(getComputedStyle(footer).borderTopWidth)
        : 0,
      headerPaddingLeft: header
        ? Number.parseFloat(getComputedStyle(header).paddingLeft)
        : 0,
      headerPaddingRight: header
        ? Number.parseFloat(getComputedStyle(header).paddingRight)
        : 0,
      headerHeight: header?.getBoundingClientRect().height ?? 0,
      footerHeight: footer?.getBoundingClientRect().height ?? 0,
      footerRight: footer?.getBoundingClientRect().right ?? 0,
      footerQuoteRight: footerQuote?.getBoundingClientRect().right ?? 0,
      footerText: footer?.textContent?.replace(/\s+/g, ' ').trim() ?? '',
      headerText: header?.textContent?.replace(/\s+/g, ' ').trim() ?? '',
      themeToggleClassName: themeToggleStateClassName,
      engineeringText:
        engineeringGroup?.textContent?.replace(/\s+/g, ' ').trim() ?? '',
      bodyText: document.body.textContent?.replace(/\s+/g, ' ').trim() ?? '',
      hasProjectsSection: Boolean(document.querySelector('#projects')),
      hasThemeToggle: Boolean(themeToggle),
      themeToggleText:
        themeToggle?.textContent?.replace(/\s+/g, ' ').trim() ?? '',
      publicationMetaLineText:
        publicationMetaLine?.textContent?.replace(/\s+/g, ' ').trim() ?? '',
      viewportWidth: window.innerWidth,
      courseDetailHeight: detail?.getBoundingClientRect().height ?? 0,
      showMoreText: moreControl?.textContent?.replace(/\s+/g, ' ').trim() ?? '',
      showMoreClassName: moreControl?.className ?? '',
      showMoreRight: moreControl?.getBoundingClientRect().right ?? 0,
      seeMoreScholarClassName: seeMoreScholar?.className ?? '',
      seeMoreScholarRight: seeMoreScholar?.getBoundingClientRect().right ?? 0,
      readAllPostsClassName: readAllPosts?.className ?? '',
      experienceGroups,
      courseDetailText:
        detailText?.textContent?.replace(/\s+/g, ' ').trim() ?? '',
      sectionPaddingTop: section
        ? Number.parseFloat(getComputedStyle(section).paddingTop)
        : 0,
      experiencePaddingTop: experienceSection
        ? Number.parseFloat(getComputedStyle(experienceSection).paddingTop)
        : 0,
      panelPaddingTop: panel
        ? Number.parseFloat(getComputedStyle(panel).paddingTop)
        : 0,
      panelBorderTopWidth: panelStyle
        ? Number.parseFloat(panelStyle.borderTopWidth)
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
  assert.equal(
    measurements.heroBorderTopWidth,
    0,
    'there should be no divider between ROYB band and hero'
  );
  assert.equal(measurements.heroSectionMarker, '§1');
  assert.equal(
    measurements.heroSectionLabel,
    'About',
    'hero should be labeled as the first About section'
  );
  assert.deepEqual(
    measurements.sectionBorderTopWidths,
    measurements.sectionBorderTopWidths.map(() => 0),
    'top-level section dividers should be disabled for this visual pass'
  );
  assert.equal(
    measurements.footerBorderTopWidth,
    0,
    'footer divider should be disabled with section dividers'
  );
  assert.ok(measurements.hasThemeToggle, 'header should include theme toggle');
  assert.equal(
    measurements.themeToggleText,
    '',
    'theme toggle should use compact icon controls, not Light/Dark text'
  );
  assert.ok(
    !measurements.themeToggleClassName.includes('hover:'),
    'theme toggle should not have hover state classes'
  );
  assert.ok(
    !measurements.themeToggleClassName.includes('active:'),
    'theme toggle should not have click/active state classes'
  );
  assert.ok(
    measurements.themeToggleClassName.includes('focus-visible:'),
    'theme toggle should keep keyboard-focus styling'
  );
  assert.equal(
    measurements.headerPaddingLeft + measurements.headerPaddingRight,
    0,
    'navbar should not add left/right padding'
  );
  assert.ok(
    !measurements.hasProjectsSection,
    'projects section should not render'
  );
  for (const phrase of [
    'unified prototype',
    'component-lab',
    'Systems, research, and writing from',
    'Building small systems for science',
    'One document surface',
    'Portfolio sections',
    'Hero',
    'Duke student finding lazy automations',
    'I also enjoy playing',
    "I've also been writing on",
  ]) {
    assert.ok(
      !measurements.bodyText.includes(phrase),
      `public page should not leak internal copy: ${phrase}`
    );
  }
  for (const phrase of [
    "Hey! I'm a Duke CS student researching ML systems, particularly agent correctness and efficiency.",
    'I was born and raised in Egypt, but later moved to Taif, Saudi Arabia during high school.',
    'I play Tetris and Monkeytype in my free time. I also enjoy writing technical and opinion pieces.',
  ]) {
    assert.ok(
      measurements.bodyText.includes(phrase),
      `hero should render updated copy: ${phrase}`
    );
  }
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
  assert.ok(
    Math.abs(measurements.showMoreRight - measurements.seeMoreScholarRight) <=
      1,
    'experience show more should align to the same right edge as section actions'
  );
  for (const className of [
    measurements.showMoreClassName,
    measurements.seeMoreScholarClassName,
    measurements.readAllPostsClassName,
  ]) {
    assert.ok(
      className.includes('royb-link-highlight') &&
        className.includes('text-muted-foreground') &&
        className.includes('tracking-[0.12em]'),
      'section actions should share the same compact highlighted action style'
    );
  }
  for (const role of [
    'ML Research Assistant',
    'Research Assistant',
    'Software Engineer Intern',
    'ML Engineer Intern',
  ]) {
    assert.ok(
      !measurements.bodyText.includes(role),
      `experience rail should not render role label: ${role}`
    );
  }
  assert.equal(
    measurements.courseDetailHeight,
    42,
    'course detail height should be stable'
  );
  assert.ok(
    measurements.courseDetailText.includes('Memory management') &&
      measurements.courseDetailText.includes('magic'),
    'course detail should preserve the personal old-site course note'
  );
  assert.ok(
    measurements.publicationMetaLineText.includes('Research Article') &&
      measurements.publicationMetaLineText.includes(
        'Journal of Environmental Chemical Engineering'
      ),
    'publication type and journal should share the same metadata line'
  );
  assert.ok(
    measurements.sectionPaddingTop <= 32,
    'section spacing should stay compact'
  );
  assert.equal(
    measurements.experiencePaddingTop,
    14,
    'standard section vertical padding should be halved on desktop'
  );
  assert.ok(
    measurements.panelPaddingTop <= 16,
    'panel padding should stay compact'
  );
  assert.equal(
    measurements.panelBorderTopWidth,
    0,
    'section panels should not draw full boxes'
  );
  assert.ok(
    Math.abs(measurements.footerHeight - measurements.headerHeight) <= 1,
    `footer should match nav height: ${measurements.footerHeight} / ${measurements.headerHeight}`
  );
  for (const text of ['plz enjoy game', 'rrtyui']) {
    assert.ok(
      measurements.footerText.includes(text),
      `footer should include APM Overflow footer content: ${text}`
    );
  }
  for (const text of ['Links:', 'Website', 'LinkedIn', 'GitHub', 'Email']) {
    assert.ok(
      !measurements.footerText.includes(text),
      `footer should not include removed link cluster: ${text}`
    );
  }
  assert.ok(
    Math.abs(measurements.footerRight - measurements.footerQuoteRight) <= 1,
    'footer quote should sit at the right edge'
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

async function assertScrollbarStyles(page: Page) {
  const scrollbarColor = await page.evaluate(
    () => getComputedStyle(document.documentElement).scrollbarColor
  );
  const css = await readFile(path.join(root, 'app', 'globals.css'), 'utf8');

  assert.notEqual(
    scrollbarColor,
    'auto',
    'html should set explicit scrollbar colors'
  );
  assert.ok(
    css.includes('::-webkit-scrollbar-track') &&
      css.includes('background: var(--background)'),
    'scrollbar track should match the page background'
  );
  assert.ok(
    css.includes('::-webkit-scrollbar-thumb') && css.includes('border: 0'),
    'scrollbar thumb should not have an inset border'
  );
  assert.ok(
    css.includes('::-webkit-scrollbar-thumb') &&
      css.includes('border-radius: 0 !important'),
    'scrollbar thumb should be square'
  );
  assert.ok(
    css.includes('::-webkit-scrollbar-corner') &&
      css.includes('border-radius: 0 !important'),
    'scrollbar corner should also stay square'
  );
  assert.ok(
    css.includes('scrollbar-gutter: auto'),
    'scrollbars should appear only when overflow needs them'
  );
  assert.ok(
    css.includes('var(--section-color, var(--roy-b)) 18%'),
    'link hover highlight should keep the stronger selected opacity'
  );
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

async function assertHeroLinksHoverRed(page: Page) {
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
      textDecorationLine: link ? getComputedStyle(link).textDecorationLine : '',
    };
  });

  assert.equal(
    colors.linkColor,
    colors.redToken,
    'hero links should hover to the ROYB red token'
  );
  assert.equal(
    colors.textDecorationLine,
    'none',
    'hovered hero links should drop the underline'
  );
}

async function assertArticleRendering(page: Page) {
  const result = await page.evaluate(() => {
    const header = document.querySelector('article > header');
    const title = header?.querySelector('h1');
    const date = header?.querySelector('time');
    const toc = document.querySelector<HTMLElement>('.article-toc');
    const tocText = toc?.textContent?.replace(/\s+/g, ' ').trim() ?? '';
    const firstImage =
      document.querySelector<HTMLElement>('.article-media img');
    const firstCaption = document.querySelector<HTMLElement>(
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
    const code = document.querySelector<HTMLElement>(
      '.article-prose .highlight code'
    );
    const highlight = document.querySelector<HTMLElement>(
      '.article-prose .highlight'
    );
    const footnotes = document.querySelector<HTMLElement>('.footnotes');
    const footnoteList = document.querySelector<HTMLElement>('.footnotes ol');
    const footnoteRef = document.querySelector<HTMLElement>('.footnote-ref a');
    const firstArticleList = document.querySelector<HTMLElement>(
      '.article-prose > ol'
    );
    const tableFigure = document.querySelector<HTMLElement>('.article-table');
    const table = document.querySelector<HTMLElement>('.table-wrap table');
    const firstBodyRow = document.querySelector<HTMLElement>(
      '.article-table tbody tr:nth-child(1)'
    );
    const secondBodyRow = document.querySelector<HTMLElement>(
      '.article-table tbody tr:nth-child(2)'
    );

    const titleRect = title?.getBoundingClientRect();
    const dateRect = date?.getBoundingClientRect();
    const imageStyle = firstImage ? getComputedStyle(firstImage) : null;
    const captionStyle = firstCaption ? getComputedStyle(firstCaption) : null;
    const h2Style = h2 ? getComputedStyle(h2) : null;
    const h3Style = h3 ? getComputedStyle(h3) : null;
    const tokenStyle = token ? getComputedStyle(token) : null;
    const codeStyle = code ? getComputedStyle(code) : null;
    const highlightStyle = highlight ? getComputedStyle(highlight) : null;
    const footnotesStyle = footnotes ? getComputedStyle(footnotes) : null;
    const footnoteRefStyle = footnoteRef ? getComputedStyle(footnoteRef) : null;
    const firstArticleListStyle = firstArticleList
      ? getComputedStyle(firstArticleList)
      : null;
    const tableStyle = table ? getComputedStyle(table) : null;
    const firstBodyRowStyle = firstBodyRow
      ? getComputedStyle(firstBodyRow)
      : null;
    const secondBodyRowStyle = secondBodyRow
      ? getComputedStyle(secondBodyRow)
      : null;

    return {
      bodyText: document.body.textContent?.replace(/\s+/g, ' ').trim() ?? '',
      headerText: header?.textContent?.replace(/\s+/g, ' ').trim() ?? '',
      titleBottom: titleRect?.bottom ?? 0,
      dateTop: dateRect?.top ?? 0,
      tocText,
      tocHasSublinks: Boolean(toc?.querySelector('.toc-subs a')),
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
      codeColor: codeStyle?.color ?? '',
      codeBackground: highlightStyle?.backgroundColor ?? '',
      footnotesSize: Number.parseFloat(footnotesStyle?.fontSize ?? '0'),
      footnoteRefFamily: footnoteRefStyle?.fontFamily ?? '',
      footnoteRefWeight: Number.parseInt(
        footnoteRefStyle?.fontWeight ?? '0',
        10
      ),
      footnoteListTag: footnoteList?.tagName ?? '',
      firstArticleListStyle: firstArticleListStyle?.listStyleType ?? '',
      firstArticleListPadding: Number.parseFloat(
        firstArticleListStyle?.paddingLeft ?? '0'
      ),
      tableDisplay: tableStyle?.display ?? '',
      tableFigureExists: Boolean(tableFigure),
      tableCaptionCount:
        tableFigure?.querySelectorAll('figcaption').length ?? 0,
      firstBodyRowBackground: firstBodyRowStyle?.backgroundColor ?? '',
      secondBodyRowBackground: secondBodyRowStyle?.backgroundColor ?? '',
      dataPrototypeCount: document.querySelectorAll('[data-prototype]').length,
      prototypeCardCount: document.querySelectorAll('.prototype-card').length,
    };
  });

  assert.ok(
    !result.headerText.includes('Why agent context should be structured'),
    'article header should not include the summary block'
  );
  assert.ok(
    !result.headerText.includes('GitHub'),
    'article header should not include the code link'
  );
  assert.ok(
    result.dateTop >= result.titleBottom,
    'article date should render under the title'
  );
  for (const text of ['Time', 'Last updated', 'Code', 'GitHub']) {
    assert.ok(
      result.tocText.includes(text),
      `article index should include ${text}`
    );
  }
  assert.ok(
    !result.tocText.includes('Reading time'),
    'article index should shorten Reading time to Time'
  );
  assert.ok(result.tocHasSublinks, 'article index should include H3 sublinks');
  assert.equal(
    result.imageBorderTop,
    '0px',
    'article media should be borderless'
  );
  assert.equal(
    result.captionAlign,
    'center',
    'media captions should be centered'
  );
  assert.ok(result.captionSize < 14, 'media captions should be small');
  assert.equal(result.videoAutoplay, true, 'video should autoplay');
  assert.equal(result.videoControls, true, 'video should show controls');
  assert.equal(result.videoLoop, true, 'video should loop');
  assert.equal(result.videoMuted, true, 'video should be muted for autoplay');
  assert.equal(result.videoPlaysInline, true, 'video should play inline');
  assert.equal(
    result.videoPreload,
    'auto',
    'video should preload automatically'
  );
  assert.ok(
    result.h2Size > result.h3Size,
    'H2 should be visually stronger than H3'
  );
  assert.ok(result.h2Weight >= 600, 'H2 should have strong weight');
  assert.ok(result.h3Weight >= 600, 'H3 should have heading weight');
  assert.equal(
    result.h3Transform,
    'none',
    'H3 should read like a real subheading, not a metadata label'
  );
  assert.equal(
    result.firstArticleListStyle,
    'decimal',
    'article ordered lists should show list structure'
  );
  assert.ok(
    result.firstArticleListPadding > 0,
    'article lists should reserve marker space'
  );
  assert.notEqual(
    result.tokenColor,
    result.codeColor,
    'syntax tokens should not collapse to plain code color'
  );
  assert.equal(
    result.codeBackground,
    'rgb(243, 243, 241)',
    'code block background should be #F3F3F1'
  );
  assert.ok(result.footnotesSize <= 13, 'footnotes should stay compact');
  assert.ok(
    result.footnoteRefFamily.includes('DM Mono'),
    'footnote reference numbers should use the mono face'
  );
  assert.ok(
    result.footnoteRefWeight >= 600,
    'footnote reference numbers should be slightly bolder'
  );
  assert.equal(result.footnoteListTag, 'OL', 'footnotes should be ordered');
  assert.ok(result.tableFigureExists, 'article table figure should render');
  assert.ok(result.tableDisplay.length > 0, 'article tables should render');
  assert.equal(
    result.tableCaptionCount,
    0,
    'past blog tables should not render synthetic captions'
  );
  assert.notEqual(
    result.firstBodyRowBackground,
    result.secondBodyRowBackground,
    'plain article tables should use the no-caption alternating row treatment'
  );
  assert.equal(
    result.dataPrototypeCount,
    0,
    'article output should not include prototyping data attributes'
  );
  assert.equal(
    result.prototypeCardCount,
    0,
    'article output should not include prototyping cards'
  );
  assert.ok(
    !result.bodyText.toLowerCase().includes('prototyping'),
    'article output should not mention prototyping'
  );
}

async function assertBlogIndexRail(page: Page) {
  const result = await page.evaluate(() => {
    const blogHeader =
      document
        .querySelector('[data-testid="blog-index-header"]')
        ?.textContent?.replace(/\s+/g, ' ')
        .trim() ?? '';
    const indexHeading =
      document
        .querySelector('#posts h2')
        ?.textContent?.replace(/\s+/g, ' ')
        .trim() ?? '';
    const rail = document.querySelector('[data-testid="blog-index-rail"]');
    const items = [...(rail?.querySelectorAll('li') ?? [])];
    const firstItem = items[0];
    const firstTitle = firstItem?.querySelector('[data-testid="rail-title"]');
    const firstDot = firstItem?.querySelector('[data-testid="rail-dot"]');
    const firstConnector = firstItem?.querySelector(
      '[data-testid="rail-connector"]'
    );
    const firstFooter = firstItem?.querySelector(
      '[data-testid="blog-index-row-meta"]'
    );
    const footer = document.querySelector('footer');

    return {
      blogHeader,
      indexHeading,
      hasRail: Boolean(rail),
      itemCount: items.length,
      dotCount: rail?.querySelectorAll('[data-testid="rail-dot"]').length ?? 0,
      connectorCount:
        rail?.querySelectorAll('[data-testid="rail-connector"]').length ?? 0,
      firstTitleText:
        firstTitle?.textContent?.replace(/\s+/g, ' ').trim() ?? '',
      firstDotClassName: firstDot?.className ?? '',
      firstConnectorTop: firstConnector
        ? Number.parseFloat(getComputedStyle(firstConnector).top)
        : null,
      firstFooterText:
        firstFooter?.textContent?.replace(/\s+/g, ' ').trim() ?? '',
      hasDivideYClass: rail?.className.includes('divide-y') ?? false,
      footerBottom: footer?.getBoundingClientRect().bottom ?? 0,
      viewportHeight: window.innerHeight,
    };
  });

  assert.ok(result.hasRail, 'blog index should render as a rail list');
  assert.equal(
    result.blogHeader,
    '',
    'blog header should keep only the ROYB band and no text'
  );
  assert.equal(
    result.indexHeading,
    `Index (${result.itemCount})`,
    'blog post count should live in the index heading'
  );
  assert.ok(result.itemCount >= 3, 'blog index should render listed posts');
  assert.equal(
    result.dotCount,
    result.itemCount,
    'each blog index row should have a rail dot'
  );
  assert.equal(
    result.connectorCount,
    result.itemCount - 1,
    'blog index should connect rows like the home writing rail'
  );
  assert.ok(
    result.firstDotClassName.includes('bg-roy-b'),
    'first blog rail dot should carry the writing blue accent'
  );
  assert.equal(
    result.firstConnectorTop,
    19,
    'blog rail connector should use the shared rail spacing'
  );
  assert.ok(
    result.firstFooterText.includes('min'),
    'blog rail row should keep reading time metadata'
  );
  assert.ok(
    !result.firstFooterText.includes('Updated') &&
      !result.firstFooterText.includes('GitHub'),
    'blog rail row should omit updated date and code link metadata'
  );
  assert.equal(
    result.hasDivideYClass,
    false,
    'blog index should not use the old divided ledger class'
  );
  assert.ok(
    Math.abs(result.viewportHeight - result.footerBottom) <= 1,
    'short blog index pages should pin the footer to the viewport bottom'
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

    browser = await chromium.launch();
    const page = await browser.newPage({
      viewport: { width: 1280, height: 900 },
    });
    await page.goto(baseUrl, { waitUntil: 'networkidle' });
    await screenshot(page, 'home-desktop');
    await assertHomeMeasurements(page);
    await assertScrollbarStyles(page);
    await assertVisibleOneLineDescriptions(page);
    await assertHeroLinksHoverRed(page);
    await assertThemeToggleIsStable(page);
    await assertCourseHeightIsStable(page);
    await screenshot(page, 'home-course-deselected');

    await page.getByRole('button', { name: 'show more' }).click();
    await screenshot(page, 'home-experience-expanded');

    await page
      .getByRole('button', { name: /Machine learning for predicting/ })
      .click();
    await assertVisibleOneLineDescriptions(page);
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
    await assertVisibleOneLineDescriptions(blog);
    await assertBlogIndexRail(blog);
    await screenshot(blog, 'blog-index');

    const [firstPost] = await getListedPosts();
    const article = await browser.newPage({
      viewport: { width: 1280, height: 900 },
    });
    await article.goto(`${baseUrl}/blog/${firstPost.manifest.slug}`, {
      waitUntil: 'networkidle',
    });
    await assertVisibleOneLineDescriptions(article);
    await assertArticleRendering(article);
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
