import path from 'node:path';

const allowedTopLevelFields = new Set([
  'slug',
  'source',
  'title',
  'description',
  'publishedAt',
  'updatedAt',
  'listed',
  'allowHtml',
  'wrapTables',
  'codeLink',
  'socialImage',
  'images',
  'videoInserts',
]);

function issueList(label, issues) {
  return `${label}\n${issues.map((issue) => `- ${issue}`).join('\n')}`;
}

function isPlainObject(value) {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

function isValidDateString(value) {
  return isNonEmptyString(value) && !Number.isNaN(new Date(value).getTime());
}

function validateStringField(issues, value, field) {
  if (!isNonEmptyString(value)) {
    issues.push(`${field} must be a non-empty string`);
  }
}

function validateDateField(issues, value, field) {
  if (!isValidDateString(value)) {
    issues.push(`${field} must be a valid date string`);
  }
}

function validateCodeLink(issues, value) {
  if (value === undefined || value === null) {
    return null;
  }

  if (!isPlainObject(value)) {
    issues.push('codeLink must be an object when present');
    return null;
  }

  validateStringField(issues, value.label, 'codeLink.label');
  validateStringField(issues, value.href, 'codeLink.href');

  return {
    label: value.label,
    href: value.href,
  };
}

function validateImages(issues, value) {
  if (value === undefined) {
    return [];
  }

  if (!Array.isArray(value)) {
    issues.push('images must be an array when present');
    return [];
  }

  return value.map((image, index) => {
    if (!isPlainObject(image)) {
      issues.push(`images[${index}] must be an object`);
      return {};
    }

    validateStringField(issues, image.filename, `images[${index}].filename`);
    validateStringField(issues, image.alt, `images[${index}].alt`);

    return {
      filename: image.filename,
      alt: image.alt,
    };
  });
}

function validateVideoInserts(issues, value) {
  if (value === undefined) {
    return [];
  }

  if (!Array.isArray(value)) {
    issues.push('videoInserts must be an array when present');
    return [];
  }

  return value.map((insert, index) => {
    if (!isPlainObject(insert)) {
      issues.push(`videoInserts[${index}] must be an object`);
      return {};
    }

    validateStringField(
      issues,
      insert.beforeHeadingId,
      `videoInserts[${index}].beforeHeadingId`
    );
    validateStringField(
      issues,
      insert.filename,
      `videoInserts[${index}].filename`
    );
    validateStringField(
      issues,
      insert.captionHtml,
      `videoInserts[${index}].captionHtml`
    );
    validateStringField(
      issues,
      insert.ariaLabel,
      `videoInserts[${index}].ariaLabel`
    );

    return {
      beforeHeadingId: insert.beforeHeadingId,
      filename: insert.filename,
      captionHtml: insert.captionHtml,
      ariaLabel: insert.ariaLabel,
    };
  });
}

export function validatePostManifest(raw, manifestPath) {
  const issues = [];
  const manifestLabel = path.relative(process.cwd(), manifestPath);

  if (!isPlainObject(raw)) {
    throw new Error(`${manifestLabel} must contain a JSON object`);
  }

  for (const field of Object.keys(raw)) {
    if (!allowedTopLevelFields.has(field)) {
      issues.push(`unknown field: ${field}`);
    }
  }

  validateStringField(issues, raw.slug, 'slug');
  validateStringField(issues, raw.source, 'source');
  validateStringField(issues, raw.title, 'title');
  validateStringField(issues, raw.description, 'description');
  validateDateField(issues, raw.publishedAt, 'publishedAt');
  validateDateField(issues, raw.updatedAt, 'updatedAt');

  if (
    isNonEmptyString(raw.slug) &&
    !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(raw.slug)
  ) {
    issues.push('slug must be lowercase kebab-case');
  }

  if (isNonEmptyString(raw.source) && !raw.source.endsWith('.md')) {
    issues.push('source must point to a Markdown file ending in .md');
  }

  if (
    isValidDateString(raw.publishedAt) &&
    isValidDateString(raw.updatedAt) &&
    new Date(raw.updatedAt) < new Date(raw.publishedAt)
  ) {
    issues.push('updatedAt must not be earlier than publishedAt');
  }

  if (
    raw.socialImage !== undefined &&
    raw.socialImage !== null &&
    !isNonEmptyString(raw.socialImage)
  ) {
    issues.push('socialImage must be a non-empty string or null');
  }

  if (raw.listed !== undefined && typeof raw.listed !== 'boolean') {
    issues.push('listed must be a boolean when present');
  }

  if (raw.allowHtml !== undefined && typeof raw.allowHtml !== 'boolean') {
    issues.push('allowHtml must be a boolean when present');
  }

  if (raw.wrapTables !== undefined && typeof raw.wrapTables !== 'boolean') {
    issues.push('wrapTables must be a boolean when present');
  }

  const codeLink = validateCodeLink(issues, raw.codeLink);
  const images = validateImages(issues, raw.images);
  const videoInserts = validateVideoInserts(issues, raw.videoInserts);

  if (issues.length > 0) {
    throw new Error(
      issueList(`Invalid post manifest: ${manifestLabel}`, issues)
    );
  }

  return {
    slug: raw.slug,
    source: raw.source,
    title: raw.title,
    description: raw.description,
    publishedAt: raw.publishedAt,
    updatedAt: raw.updatedAt,
    listed: raw.listed ?? true,
    allowHtml: raw.allowHtml ?? false,
    wrapTables: raw.wrapTables ?? true,
    codeLink,
    socialImage: raw.socialImage ?? null,
    images,
    videoInserts,
  };
}
