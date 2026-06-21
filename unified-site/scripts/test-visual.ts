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
}

async function assertHome(page: Page) {
  const result = await page.evaluate(() => {
    const main = document.querySelector('main');
    const header = document.querySelector('[data-testid="site-header"]');
    const themeToggle = document.querySelector('[data-testid="theme-toggle"]');
    const themeToggleClassName = themeToggle
      ? [themeToggle, ...themeToggle.querySelectorAll('*')]
          .map((element) => element.className)
          .join(' ')
      : '';
    const heroSection = document.querySelector('[data-testid="hero-section"]');
    const experienceSection = document.querySelector('#experience');
    const experienceTitle = experienceSection?.querySelector('header h2');
    const firstGroupLabel = experienceSection?.querySelector(
      '[data-testid="experience-group-label"]'
    );
    const firstRailTitle = experienceSection?.querySelector(
      '[data-testid="rail-title"]'
    );
    const footer = document.querySelector('[data-testid="site-footer"]');
    const footerQuote = footer?.querySelector('span');
    const topLevelSections = [...document.querySelectorAll('main > section')];
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
    const publicationDots = [
      ...(document
        .querySelector('#publications')
        ?.querySelectorAll('[data-testid="publication-dot"]') ?? []),
    ].map((dot) => dot.className);
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

    const seeMoreActionColors = [...document.querySelectorAll('a, button')]
      .filter((element) =>
        /see more/i.test(element.textContent?.replace(/\s+/g, ' ') ?? '')
      )
      .map((element) => getComputedStyle(element).color);

    return {
      mainWidth: main?.getBoundingClientRect().width ?? 0,
      bodyText: document.body.textContent?.replace(/\s+/g, ' ').trim() ?? '',
      headerText: header?.textContent?.replace(/\s+/g, ' ').trim() ?? '',
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
      experienceTitleLeft: experienceTitle?.getBoundingClientRect().left ?? 0,
      firstGroupLabelLeft: firstGroupLabel?.getBoundingClientRect().left ?? 0,
      firstRailTitleLeft: firstRailTitle?.getBoundingClientRect().left ?? 0,
      groups,
      dots,
      writingDots,
      writingNewTags,
      writingMeta,
      writingDates,
      writingDescriptionCount: writingDescriptions.length,
      publicationDots,
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
      publicationTitleHrefs: publicationTitles.map((title) =>
        title instanceof HTMLAnchorElement ? title.href : ''
      ),
      publicationTitleDecorations: publicationTitles.map(
        (title) => getComputedStyle(title).textDecorationLine
      ),
      publicationTitleClassName: publicationTitles[0]?.className ?? '',
      mutedToken,
      seeMoreActionColors,
      footerBorderTopWidth: footer
        ? Number.parseFloat(getComputedStyle(footer).borderTopWidth)
        : 0,
      footerRight: footer?.getBoundingClientRect().right ?? 0,
      footerQuoteRight: footerQuote?.getBoundingClientRect().right ?? 0,
      footerText: footer?.textContent?.replace(/\s+/g, ' ').trim() ?? '',
    };
  });

  assert.ok(result.mainWidth <= 800, 'main document should stay narrow');
  assert.equal(result.heroTitle, 'Islam Tayeb');
  assert.deepEqual(result.sectionMarkers, ['§0', '§1', '§2', '§3']);
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
  assert.equal(result.hasCoursesSection, false, 'Courses should stay hidden');
  assert.ok(
    !result.heroContactText.includes('location') &&
      !result.heroContactText.includes('hometown'),
    'hero metadata should only keep contact links'
  );
  for (const copy of [
    "Hey! I'm a Duke CS student based in Durham, NC, researching ML systems, particularly agent correctness and efficiency.",
    'I was born and raised in Egypt, but later moved to Taif, Saudi Arabia during high school.',
    'I play Tetris and Monkeytype in my free time. I also enjoy writing technical and opinion pieces.',
  ]) {
    assert.ok(result.bodyText.includes(copy), `hero should include: ${copy}`);
  }
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
  assert.ok(presentDots.every((dot) => dot.className.includes('bg-roy-o')));
  assert.ok(endedDots.every((dot) => dot.className.includes('bg-foreground')));
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
    'Machine learning for predicting and optimizing the CO₂ uptake in porous organic polymers',
    'Primal dual continual learning for robust antibody design',
    'Post-synthetic modification of UiO-66 analogue metal-organic framework as potential solid sorbent for direct air capture',
  ]);
  assert.ok(!result.bodyText.includes('CO2'));
  assert.ok(result.bodyText.includes('CO₂'));
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
    result.seeMoreActionColors.every((color) => color === result.mutedToken),
    'see more actions should use the same muted grey as metadata labels'
  );
  assert.equal(result.footerBorderTopWidth, 1);
  assert.ok(result.bodyText.includes('See more on Scholar'));
  assert.ok(result.bodyText.includes('See more on blog'));
  assert.ok(result.footerText.includes('plz enjoy game'));
  assert.ok(!result.footerText.includes('Links:'));
  assert.ok(
    Math.abs(result.footerRight - result.footerQuoteRight) <= 1,
    'footer quote should sit at the right edge'
  );
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
    };
  });

  assert.equal(colors.linkColor, colors.redToken);
  assert.equal(colors.backgroundSize, '100% 100%');
  assert.equal(colors.textDecorationLine, 'none');
}

async function assertBlogIndex(page: Page) {
  const result = await page.evaluate(() => {
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
    const marker =
      document
        .querySelector('#posts header span')
        ?.textContent?.replace(/\s+/g, ' ')
        .trim() ?? '';
    const rail = document.querySelector('[data-testid="blog-index-rail"]');
    const items = [...(rail?.querySelectorAll('li') ?? [])];
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
    const footer = document.querySelector('footer');

    return {
      header,
      heading,
      marker,
      itemCount: items.length,
      dotCount: rail?.querySelectorAll('[data-testid="rail-dot"]').length ?? 0,
      connectorCount:
        rail?.querySelectorAll('[data-testid="rail-connector"]').length ?? 0,
      firstFooterText:
        firstFooter?.textContent?.replace(/\s+/g, ' ').trim() ?? '',
      postDates,
      bodyText: document.body.textContent?.replace(/\s+/g, ' ').trim() ?? '',
      descriptionCount: descriptions?.length ?? 0,
      footerBottom: footer?.getBoundingClientRect().bottom ?? 0,
      viewportHeight: window.innerHeight,
    };
  });

  assert.equal(result.header, '', 'blog header should only contain ROYB band');
  assert.equal(result.marker, '§0');
  assert.equal(result.heading, `Index (${result.itemCount})`);
  assert.ok(result.itemCount >= 3);
  assert.equal(result.dotCount, result.itemCount);
  assert.equal(result.connectorCount, result.itemCount - 1);
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
    const toc = document.querySelector<HTMLElement>('.article-toc');
    const tocText = toc?.textContent?.replace(/\s+/g, ' ').trim() ?? '';
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
    const code = document.querySelector<HTMLElement>(
      '.article-prose .highlight code'
    );
    const highlight = document.querySelector<HTMLElement>(
      '.article-prose .highlight'
    );
    const footnoteRef = document.querySelector<HTMLElement>('.footnote-ref a');
    const footnotes = document.querySelector<HTMLElement>('.footnotes');
    const footnoteList = document.querySelector<HTMLElement>('.footnotes ol');
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
    const tocFirstLinkStyle = tocFirstLink
      ? getComputedStyle(tocFirstLink)
      : null;
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
      titleText: title?.textContent?.replace(/\s+/g, ' ').trim() ?? '',
      titleLeft: title?.getBoundingClientRect().left ?? 0,
      mainContentLeft,
      titleWeight: Number.parseInt(titleStyle?.fontWeight ?? '0', 10),
      tocText,
      tocFirstLinkText:
        tocFirstLink?.textContent?.replace(/\s+/g, ' ').trim() ?? '',
      tocFirstLinkDecoration: tocFirstLinkStyle?.textDecorationLine ?? '',
      hoveredArticleLinkBackground:
        hoveredArticleLinkStyle?.backgroundSize ?? '',
      hoveredArticleLinkColor: hoveredArticleLinkStyle?.color ?? '',
      blueToken,
      hoveredArticleLinkDecoration:
        hoveredArticleLinkStyle?.textDecorationLine ?? '',
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
      footnoteRefFamily: footnoteRefStyle?.fontFamily ?? '',
      footnoteRefWeight: Number.parseInt(
        footnoteRefStyle?.fontWeight ?? '0',
        10
      ),
      footnotesSize: Number.parseFloat(footnotesStyle?.fontSize ?? '0'),
      footnoteListPadding: Number.parseFloat(
        footnoteListStyle?.paddingLeft ?? '0'
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
  for (const text of ['Time', 'Last updated', 'Code', 'GitHub']) {
    assert.ok(result.tocText.includes(text), `TOC should include ${text}`);
  }
  assert.ok(!result.tocText.includes('Reading time'));
  assert.ok(!result.tocText.includes('~'));
  assert.ok(/^0\s+Background/.test(result.tocFirstLinkText));
  assert.equal(result.tocFirstLinkDecoration, 'underline');
  assert.equal(result.hoveredArticleLinkBackground, '100% 100%');
  assert.equal(result.hoveredArticleLinkColor, result.blueToken);
  assert.equal(result.hoveredArticleLinkDecoration, 'none');
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
  assert.ok(result.h3Weight >= 600);
  assert.equal(result.h3Transform, 'none');
  assert.notEqual(result.tokenColor, result.codeColor);
  assert.equal(result.codeBackground, 'rgb(243, 243, 241)');
  assert.equal(result.articleListStyle, 'decimal');
  assert.ok(result.articleListPadding > 0);
  assert.ok(result.footnotesSize <= 13);
  assert.ok(result.footnoteListPadding >= 24);
  assert.ok(result.footnoteRefFamily.includes('DM Mono'));
  assert.ok(result.footnoteRefWeight >= 600);
  assert.equal(result.footnoteListTag, 'OL');
  assert.equal(result.tableCaptionCount, 0);
  assert.notEqual(
    result.firstBodyRowBackground,
    result.secondBodyRowBackground
  );
  assert.equal(result.prototypeCount, 0);
  assert.ok(!result.bodyText.toLowerCase().includes('prototyping'));
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
    await assertThemeToggleIsStable(home);
    await screenshot(home, 'home-desktop');
    await assertExperienceInteractions(home);
    await screenshot(home, 'home-experience-expanded');

    const mobile = await browser.newPage({
      viewport: { width: 390, height: 844 },
    });
    await mobile.goto(baseUrl, { waitUntil: 'networkidle' });
    await assertRoybBandPlacement(mobile);
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
