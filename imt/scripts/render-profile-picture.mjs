import { access, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import sharp from 'sharp';

const canvasSize = 384;
const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(scriptDir, '..');

const settings = {
  radius: 0.77,
  feather: 0.26,
  maskPixel: 5,
  innerDitherLevels: 12,
  innerDitherStrength: 0.5,
  centerX: 0.5,
  centerY: 0.49,
  cropX: 0.81,
  cropY: 0,
  zoom: 1,
  shape: 'square',
};

const bayer4 = [
  [0, 8, 2, 10],
  [12, 4, 14, 6],
  [3, 11, 1, 9],
  [15, 7, 13, 5],
].map((row) => row.map((value) => (value + 0.5) / 16));

const bayer8 = [
  [0, 48, 12, 60, 3, 51, 15, 63],
  [32, 16, 44, 28, 35, 19, 47, 31],
  [8, 56, 4, 52, 11, 59, 7, 55],
  [40, 24, 36, 20, 43, 27, 39, 23],
  [2, 50, 14, 62, 1, 49, 13, 61],
  [34, 18, 46, 30, 33, 17, 45, 29],
  [10, 58, 6, 54, 9, 57, 5, 53],
  [42, 26, 38, 22, 41, 25, 37, 21],
].map((row) => row.map((value) => (value + 0.5) / 64 - 0.5));

function usage() {
  console.error(
    'Usage: npm run render:profile-picture -- /absolute/path/to/source-image'
  );
}

function clamp(value, min = 0, max = 1) {
  return Math.max(min, Math.min(max, value));
}

function smoothstep(edge0, edge1, value) {
  if (edge0 === edge1) {
    return value < edge0 ? 0 : 1;
  }

  const t = clamp((value - edge0) / (edge1 - edge0));
  return t * t * (3 - 2 * t);
}

function quantizeChannel(value, threshold) {
  const levels = settings.innerDitherLevels - 1;
  const normalized = value / 255;
  const shifted =
    normalized * levels + threshold * settings.innerDitherStrength;

  return Math.round(clamp(Math.round(shifted) / levels) * 255);
}

function maskDistance(x, y) {
  const dx = Math.abs(x - settings.centerX);
  const dy = Math.abs(y - settings.centerY);

  if (settings.shape === 'radial') {
    const maxDistance = Math.hypot(
      Math.max(settings.centerX, 1 - settings.centerX),
      Math.max(settings.centerY, 1 - settings.centerY)
    );
    return Math.hypot(dx, dy) / maxDistance;
  }

  return Math.max(
    dx / Math.max(settings.centerX, 1 - settings.centerX),
    dy / Math.max(settings.centerY, 1 - settings.centerY)
  );
}

async function cropToCanvas(sourcePath) {
  const image = sharp(sourcePath, { limitInputPixels: false });
  const metadata = await image.metadata();

  if (!metadata.width || !metadata.height) {
    throw new Error(`Could not read image dimensions for ${sourcePath}`);
  }

  const sourceSize = Math.floor(
    Math.min(metadata.width, metadata.height) / settings.zoom
  );
  const maxX = Math.max(0, metadata.width - sourceSize);
  const maxY = Math.max(0, metadata.height - sourceSize);
  const left = Math.round(clamp(maxX * settings.cropX, 0, maxX));
  const top = Math.round(clamp(maxY * settings.cropY, 0, maxY));

  const { data } = await image
    .extract({ left, top, width: sourceSize, height: sourceSize })
    .resize(canvasSize, canvasSize, { fit: 'fill' })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  return data;
}

function renderOutput(sourceData) {
  const output = Buffer.alloc(canvasSize * canvasSize * 4);
  const maskColumns = Math.max(1, Math.round(canvasSize / settings.maskPixel));
  const maskRows = Math.max(1, Math.round(canvasSize / settings.maskPixel));

  for (let y = 0; y < canvasSize; y += 1) {
    const normalizedY = (y + 0.5) / canvasSize;
    const maskY = Math.min(maskRows - 1, Math.floor(y / settings.maskPixel));

    for (let x = 0; x < canvasSize; x += 1) {
      const normalizedX = (x + 0.5) / canvasSize;
      const maskX = Math.min(
        maskColumns - 1,
        Math.floor(x / settings.maskPixel)
      );
      const distance = maskDistance(normalizedX, normalizedY);
      const edgeMask = smoothstep(
        settings.radius,
        settings.radius + settings.feather,
        distance
      );
      const alphaTarget = 1 - edgeMask;
      const threshold = bayer4[maskY % 4][maskX % 4];
      const alpha = alphaTarget > threshold ? 255 : 0;
      const innerThreshold = bayer8[y % 8][x % 8];
      const shouldRenderInnerPattern = alphaTarget >= 0.999;
      const index = (y * canvasSize + x) * 4;

      output[index] = shouldRenderInnerPattern
        ? quantizeChannel(sourceData[index], innerThreshold)
        : sourceData[index];
      output[index + 1] = shouldRenderInnerPattern
        ? quantizeChannel(sourceData[index + 1], innerThreshold)
        : sourceData[index + 1];
      output[index + 2] = shouldRenderInnerPattern
        ? quantizeChannel(sourceData[index + 2], innerThreshold)
        : sourceData[index + 2];
      output[index + 3] = Math.round((sourceData[index + 3] * alpha) / 255);
    }
  }

  return output;
}

async function main() {
  const sourcePath = process.argv[2];

  if (!sourcePath) {
    usage();
    process.exitCode = 1;
    return;
  }

  const absoluteSourcePath = path.resolve(sourcePath);
  await access(absoluteSourcePath);

  const crop = await cropToCanvas(absoluteSourcePath);
  const output = renderOutput(crop);
  const image = sharp(output, {
    raw: {
      width: canvasSize,
      height: canvasSize,
      channels: 4,
    },
  });
  const png = await image.png().toBuffer();
  const webp = await image.webp({ lossless: true }).toBuffer();
  const pngPath = path.join(projectRoot, 'public', 'hero-portrait.png');
  const webpPath = path.join(projectRoot, 'public', 'me.webp');

  await Promise.all([writeFile(pngPath, png), writeFile(webpPath, webp)]);

  console.log(`wrote ${path.relative(projectRoot, pngPath)}`);
  console.log(`wrote ${path.relative(projectRoot, webpPath)}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
