'use client';

import { useEffect, useRef, useState, type PointerEvent } from 'react';
import { Section } from './frame';

type MaskShape = 'square' | 'radial';

type PortraitSource = {
  id: string;
  label: string;
  src: string;
  note: string;
};

type DitherSettings = {
  radius: number;
  feather: number;
  centerPixel: number;
  edgePixel: number;
  maskPixel: number;
  colorPixel: number;
  fineDither: number;
  colorAmount: number;
  colorDither: number;
  sharpen: number;
  centerX: number;
  centerY: number;
  cropX: number;
  cropY: number;
  zoom: number;
  previewSize: number;
  shape: MaskShape;
};

type LabState = {
  sourceIndex: number;
  settingsBySource: Record<string, DitherSettings>;
};

type DragState = {
  pointerId: number;
  lastX: number;
  lastY: number;
};

const canvasSize = 384;
const rehaulDisplaySize = 171;
const storageKey = 'portrait-dither-lab:v6';
const storageVersion = 6;

const portraitSources: PortraitSource[] = [
  {
    id: 'frog',
    label: 'frog bench',
    src: '/portrait-lab/img-6673.jpg',
    note: 'front-facing, cleanest face crop',
  },
  {
    id: 'ramen-a',
    label: 'ramen a',
    src: '/portrait-lab/img-6677-2.png',
    note: 'restaurant crop, head down',
  },
  {
    id: 'ramen-b',
    label: 'ramen b',
    src: '/portrait-lab/img-6676.jpg',
    note: 'near-duplicate with different mouth/hand position',
  },
  {
    id: 'side-profile',
    label: 'side profile',
    src: '/portrait-lab/img-6800.jpg',
    note: 'airport side profile',
  },
  {
    id: 'pizza-night',
    label: 'pizza night',
    src: '/portrait-lab/group-pizza.jpg',
    note: 'group photo, cropped onto Islam',
  },
];

const defaultSettings: DitherSettings = {
  radius: 0.75,
  feather: 0.3,
  centerPixel: 2,
  edgePixel: 6,
  maskPixel: 5,
  colorPixel: 4,
  fineDither: 0,
  colorAmount: 0.4,
  colorDither: 0,
  sharpen: 0,
  centerX: 0.5,
  centerY: 0.49,
  cropX: 0.5,
  cropY: 0.5,
  zoom: 1,
  previewSize: rehaulDisplaySize,
  shape: 'square',
};

const defaultOverridesBySource: Record<string, Partial<DitherSettings>> = {
  frog: { cropX: 0.42, cropY: 0.18, zoom: 1.8 },
  'ramen-a': {
    radius: 0.77,
    feather: 0.26,
    centerPixel: 1,
    edgePixel: 6,
    maskPixel: 5,
    colorPixel: 1,
    fineDither: 0,
    colorAmount: 1,
    colorDither: 0.94,
    sharpen: 0.25,
    cropX: 0.81,
    cropY: 0,
    zoom: 1,
  },
  'ramen-b': { cropX: 0.38, cropY: 0.02, zoom: 1.7 },
  'side-profile': { cropX: 0.32, cropY: 0.18, zoom: 1.7 },
  'pizza-night': { cropX: 0.58, cropY: 0.29, zoom: 2.7 },
};

function settingsForSource(sourceId: string): DitherSettings {
  return {
    ...defaultSettings,
    ...(defaultOverridesBySource[sourceId] ?? {}),
  };
}

function createDefaultSettingsBySource() {
  return Object.fromEntries(
    portraitSources.map((source) => [source.id, settingsForSource(source.id)])
  ) as Record<string, DitherSettings>;
}

function createDefaultLabState(sourceIndex = 0): LabState {
  return {
    sourceIndex,
    settingsBySource: createDefaultSettingsBySource(),
  };
}

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
].map((row) => row.map((value) => (value + 0.5) / 64));

function smoothstep(edge0: number, edge1: number, value: number) {
  if (edge0 === edge1) {
    return value < edge0 ? 0 : 1;
  }

  const t = Math.max(0, Math.min(1, (value - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

function pixelate(source: HTMLCanvasElement, blockSize: number) {
  const lowSize = Math.max(1, Math.round(canvasSize / blockSize));
  const low = document.createElement('canvas');
  const output = document.createElement('canvas');

  low.width = lowSize;
  low.height = lowSize;
  output.width = canvasSize;
  output.height = canvasSize;

  const lowContext = low.getContext('2d');
  const outputContext = output.getContext('2d');

  if (!lowContext || !outputContext) {
    return source;
  }

  lowContext.imageSmoothingEnabled = false;
  lowContext.drawImage(source, 0, 0, lowSize, lowSize);

  outputContext.imageSmoothingEnabled = false;
  outputContext.drawImage(
    low,
    0,
    0,
    lowSize,
    lowSize,
    0,
    0,
    canvasSize,
    canvasSize
  );

  return output;
}

function sharpenCanvas(source: HTMLCanvasElement, amount: number) {
  if (amount <= 0) {
    return source;
  }

  const inputContext = source.getContext('2d');
  if (!inputContext) {
    return source;
  }

  const input = inputContext.getImageData(0, 0, canvasSize, canvasSize);
  const output = inputContext.createImageData(canvasSize, canvasSize);
  const strength = amount * 0.8;

  for (let y = 0; y < canvasSize; y += 1) {
    for (let x = 0; x < canvasSize; x += 1) {
      const index = (y * canvasSize + x) * 4;

      for (let channel = 0; channel < 3; channel += 1) {
        const center = input.data[index + channel];
        const left =
          input.data[(y * canvasSize + Math.max(0, x - 1)) * 4 + channel];
        const right =
          input.data[
            (y * canvasSize + Math.min(canvasSize - 1, x + 1)) * 4 + channel
          ];
        const top =
          input.data[(Math.max(0, y - 1) * canvasSize + x) * 4 + channel];
        const bottom =
          input.data[
            (Math.min(canvasSize - 1, y + 1) * canvasSize + x) * 4 + channel
          ];

        output.data[index + channel] = Math.round(
          clamp(
            center * (1 + 4 * strength) -
              (left + right + top + bottom) * strength,
            0,
            255
          )
        );
      }

      output.data[index + 3] = input.data[index + 3];
    }
  }

  const outputCanvas = document.createElement('canvas');
  outputCanvas.width = canvasSize;
  outputCanvas.height = canvasSize;
  outputCanvas.getContext('2d')?.putImageData(output, 0, 0);

  return outputCanvas;
}

function mix(start: number, end: number, amount: number) {
  return start * (1 - amount) + end * amount;
}

function orderedTone(value: number, threshold: number, step: number) {
  return Math.max(
    0,
    Math.min(255, Math.floor((value + threshold * step) / step) * step)
  );
}

function luminance(red: number, green: number, blue: number) {
  return red * 0.299 + green * 0.587 + blue * 0.114;
}

function colorizeGray(gray: number, red: number, green: number, blue: number) {
  const colorLuminance = Math.max(1, luminance(red, green, blue));
  const scale = gray / colorLuminance;

  return [
    clamp(red * scale, 0, 255),
    clamp(green * scale, 0, 255),
    clamp(blue * scale, 0, 255),
  ];
}

function clamp(value: number, min = 0, max = 1) {
  return Math.max(min, Math.min(max, value));
}

function numberInRange(
  value: unknown,
  fallback: number,
  min: number,
  max: number
) {
  return typeof value === 'number' && Number.isFinite(value)
    ? clamp(value, min, max)
    : fallback;
}

function normalizeStoredSettings(
  sourceId: string,
  settings: unknown
): DitherSettings {
  const base = settingsForSource(sourceId);
  const stored =
    settings && typeof settings === 'object'
      ? (settings as Partial<DitherSettings>)
      : {};

  return {
    radius: numberInRange(stored.radius, base.radius, 0.2, 0.95),
    feather: numberInRange(stored.feather, base.feather, 0.02, 0.6),
    centerPixel: numberInRange(stored.centerPixel, base.centerPixel, 1, 10),
    edgePixel: numberInRange(stored.edgePixel, base.edgePixel, 2, 18),
    maskPixel: numberInRange(stored.maskPixel, base.maskPixel, 1, 14),
    colorPixel: numberInRange(stored.colorPixel, base.colorPixel, 1, 14),
    fineDither: numberInRange(stored.fineDither, base.fineDither, 0, 0.5),
    colorAmount: numberInRange(stored.colorAmount, base.colorAmount, 0, 1),
    colorDither: numberInRange(stored.colorDither, base.colorDither, 0, 1),
    sharpen: numberInRange(stored.sharpen, base.sharpen, 0, 1),
    centerX: numberInRange(stored.centerX, base.centerX, 0.35, 0.65),
    centerY: numberInRange(stored.centerY, base.centerY, 0.35, 0.65),
    cropX: numberInRange(stored.cropX, base.cropX, 0, 1),
    cropY: numberInRange(stored.cropY, base.cropY, 0, 1),
    zoom: numberInRange(stored.zoom, base.zoom, 1, 4),
    previewSize: numberInRange(stored.previewSize, base.previewSize, 130, 260),
    shape: stored.shape === 'radial' ? 'radial' : 'square',
  };
}

function loadStoredLabState(): LabState | null {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const stored = window.localStorage.getItem(storageKey);
    if (!stored) {
      return null;
    }

    const parsed = JSON.parse(stored) as {
      version?: number;
      sourceId?: string;
      settingsBySource?: Record<string, unknown>;
    };

    if (parsed.version !== storageVersion) {
      return null;
    }

    const sourceIndex = Math.max(
      0,
      portraitSources.findIndex((source) => source.id === parsed.sourceId)
    );

    return {
      sourceIndex,
      settingsBySource: Object.fromEntries(
        portraitSources.map((source) => [
          source.id,
          normalizeStoredSettings(
            source.id,
            parsed.settingsBySource?.[source.id]
          ),
        ])
      ) as Record<string, DitherSettings>,
    };
  } catch {
    return null;
  }
}

function saveLabState(state: LabState) {
  if (typeof window === 'undefined') {
    return;
  }

  const source = portraitSources[state.sourceIndex] ?? portraitSources[0];

  window.localStorage.setItem(
    storageKey,
    JSON.stringify({
      version: storageVersion,
      sourceId: source.id,
      settingsBySource: state.settingsBySource,
    })
  );
}

function getCropBox(image: HTMLImageElement, settings: DitherSettings) {
  const sourceSize =
    Math.min(image.naturalWidth, image.naturalHeight) / settings.zoom;
  const maxX = Math.max(0, image.naturalWidth - sourceSize);
  const maxY = Math.max(0, image.naturalHeight - sourceSize);

  return {
    sourceX: clamp(maxX * settings.cropX, 0, maxX),
    sourceY: clamp(maxY * settings.cropY, 0, maxY),
    sourceSize,
  };
}

function maskDistance(x: number, y: number, settings: DitherSettings) {
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

function renderRawCrop(
  canvas: HTMLCanvasElement,
  image: HTMLImageElement,
  settings: DitherSettings
) {
  canvas.width = canvasSize;
  canvas.height = canvasSize;

  const context = canvas.getContext('2d');
  if (!context) {
    return;
  }

  const { sourceX, sourceY, sourceSize } = getCropBox(image, settings);

  context.imageSmoothingEnabled = true;
  context.clearRect(0, 0, canvasSize, canvasSize);
  context.drawImage(
    image,
    sourceX,
    sourceY,
    sourceSize,
    sourceSize,
    0,
    0,
    canvasSize,
    canvasSize
  );
}

function renderPortrait(
  canvas: HTMLCanvasElement,
  image: HTMLImageElement,
  settings: DitherSettings
) {
  canvas.width = canvasSize;
  canvas.height = canvasSize;

  const source = document.createElement('canvas');
  source.width = canvasSize;
  source.height = canvasSize;

  const sourceContext = source.getContext('2d');
  const context = canvas.getContext('2d');

  if (!sourceContext || !context) {
    return;
  }

  const { sourceX, sourceY, sourceSize } = getCropBox(image, settings);

  sourceContext.imageSmoothingEnabled = true;
  sourceContext.drawImage(
    image,
    sourceX,
    sourceY,
    sourceSize,
    sourceSize,
    0,
    0,
    canvasSize,
    canvasSize
  );

  const preparedSource = sharpenCanvas(source, settings.sharpen);
  const fine = pixelate(preparedSource, settings.centerPixel);
  const coarse = pixelate(preparedSource, settings.edgePixel);
  const colorLayer = pixelate(preparedSource, settings.colorPixel);
  const fineData = fine
    .getContext('2d')
    ?.getImageData(0, 0, canvasSize, canvasSize);
  const coarseData = coarse
    .getContext('2d')
    ?.getImageData(0, 0, canvasSize, canvasSize);
  const colorData = colorLayer
    .getContext('2d')
    ?.getImageData(0, 0, canvasSize, canvasSize);

  if (!fineData || !coarseData || !colorData) {
    return;
  }

  const output = context.createImageData(canvasSize, canvasSize);
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
      const distance = maskDistance(normalizedX, normalizedY, settings);
      const edgeMask = smoothstep(
        settings.radius,
        settings.radius + settings.feather,
        distance
      );
      const alphaTarget = 1 - edgeMask;
      const threshold = bayer4[maskY % 4][maskX % 4];
      const alpha = alphaTarget > threshold ? 255 : 0;
      const coarseMix = edgeMask;
      const centerMask = 1 - edgeMask;
      const fineDitherMix = settings.fineDither * centerMask;
      const toneThreshold = bayer8[y % 8][x % 8];
      const index = (y * canvasSize + x) * 4;

      const red = Math.round(
        fineData.data[index] * (1 - coarseMix) +
          coarseData.data[index] * coarseMix
      );
      const green = Math.round(
        fineData.data[index + 1] * (1 - coarseMix) +
          coarseData.data[index + 1] * coarseMix
      );
      const blue = Math.round(
        fineData.data[index + 2] * (1 - coarseMix) +
          coarseData.data[index + 2] * coarseMix
      );
      const gray = luminance(red, green, blue);
      const tonedGray = mix(
        gray,
        orderedTone(gray, toneThreshold, 10),
        fineDitherMix
      );
      const ditheredOverlay = settings.colorAmount > toneThreshold ? 1 : 0;
      const colorMask =
        centerMask *
        mix(settings.colorAmount, ditheredOverlay, settings.colorDither);
      const colorized = colorizeGray(
        tonedGray,
        colorData.data[index],
        colorData.data[index + 1],
        colorData.data[index + 2]
      );

      output.data[index] = Math.round(mix(tonedGray, colorized[0], colorMask));
      output.data[index + 1] = Math.round(
        mix(tonedGray, colorized[1], colorMask)
      );
      output.data[index + 2] = Math.round(
        mix(tonedGray, colorized[2], colorMask)
      );
      output.data[index + 3] = alpha;
    }
  }

  context.imageSmoothingEnabled = false;
  context.clearRect(0, 0, canvasSize, canvasSize);
  context.putImageData(output, 0, 0);
}

function Slider({
  label,
  value,
  min,
  max,
  step,
  testId,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  testId?: string;
  onChange: (value: number) => void;
}) {
  return (
    <label className="grid gap-1 font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
      <span className="flex items-center justify-between gap-4">
        <span>{label}</span>
        <span className="text-foreground">{Number(value.toFixed(2))}</span>
      </span>
      <input
        data-testid={testId}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.currentTarget.value))}
        className="w-full accent-roy-b"
      />
    </label>
  );
}

function ShapeButton({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`border px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.12em] ${
        active
          ? 'border-roy-b bg-roy-b text-background'
          : 'border-border text-muted-foreground hover:border-foreground hover:text-foreground'
      }`}
    >
      {children}
    </button>
  );
}

export function PortraitDitherLabSection() {
  const rawCanvasRef = useRef<HTMLCanvasElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dragStateRef = useRef<DragState | null>(null);
  const [labState, setLabState] = useState<LabState>(
    () => loadStoredLabState() ?? createDefaultLabState()
  );
  const [imageDimensions, setImageDimensions] = useState({
    width: 1,
    height: 1,
  });
  const [isDraggingCrop, setIsDraggingCrop] = useState(false);
  const source = portraitSources[labState.sourceIndex] ?? portraitSources[0];
  const settings =
    labState.settingsBySource[source.id] ?? settingsForSource(source.id);

  const setSource = (index: number) => {
    setLabState((current) => ({
      ...current,
      sourceIndex: index,
    }));
  };

  useEffect(() => {
    saveLabState(labState);
  }, [labState]);

  useEffect(() => {
    const rawCanvas = rawCanvasRef.current;
    const canvas = canvasRef.current;

    if (!rawCanvas || !canvas) {
      return;
    }

    let cancelled = false;
    const image = new Image();

    image.onload = () => {
      if (!cancelled) {
        setImageDimensions({
          width: image.naturalWidth,
          height: image.naturalHeight,
        });
        renderRawCrop(rawCanvas, image, settings);
        renderPortrait(canvas, image, settings);
      }
    };
    image.src = source.src;

    return () => {
      cancelled = true;
    };
  }, [source.src, settings]);

  const updateCurrentSettings = (
    updater: (settings: DitherSettings) => DitherSettings
  ) => {
    setLabState((current) => {
      const currentSource =
        portraitSources[current.sourceIndex] ?? portraitSources[0];
      const currentSettings =
        current.settingsBySource[currentSource.id] ??
        settingsForSource(currentSource.id);

      return {
        ...current,
        settingsBySource: {
          ...current.settingsBySource,
          [currentSource.id]: updater(currentSettings),
        },
      };
    });
  };

  const updateSetting = (
    key: keyof DitherSettings,
    value: number | MaskShape
  ) => {
    updateCurrentSettings((current) => ({ ...current, [key]: value }));
  };

  const cycle = (direction: -1 | 1) => {
    setSource(
      (labState.sourceIndex + direction + portraitSources.length) %
        portraitSources.length
    );
  };

  const dragCrop = (deltaX: number, deltaY: number) => {
    updateCurrentSettings((current) => {
      const sourceSize =
        Math.min(imageDimensions.width, imageDimensions.height) / current.zoom;
      const maxX = Math.max(0, imageDimensions.width - sourceSize);
      const maxY = Math.max(0, imageDimensions.height - sourceSize);
      const displaySize = Math.max(1, current.previewSize);

      return {
        ...current,
        cropX: maxX
          ? clamp(current.cropX - (deltaX * sourceSize) / (displaySize * maxX))
          : current.cropX,
        cropY: maxY
          ? clamp(current.cropY - (deltaY * sourceSize) / (displaySize * maxY))
          : current.cropY,
      };
    });
  };

  const handleCropPointerDown = (event: PointerEvent<HTMLCanvasElement>) => {
    if (event.pointerType === 'mouse' && event.button !== 0) {
      return;
    }

    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    dragStateRef.current = {
      pointerId: event.pointerId,
      lastX: event.clientX,
      lastY: event.clientY,
    };
    setIsDraggingCrop(true);
  };

  const handleCropPointerMove = (event: PointerEvent<HTMLCanvasElement>) => {
    const dragState = dragStateRef.current;
    if (!dragState || dragState.pointerId !== event.pointerId) {
      return;
    }

    event.preventDefault();
    const deltaX = event.clientX - dragState.lastX;
    const deltaY = event.clientY - dragState.lastY;

    if (deltaX || deltaY) {
      dragCrop(deltaX, deltaY);
      dragStateRef.current = {
        ...dragState,
        lastX: event.clientX,
        lastY: event.clientY,
      };
    }
  };

  const handleCropPointerEnd = (event: PointerEvent<HTMLCanvasElement>) => {
    const dragState = dragStateRef.current;
    if (!dragState || dragState.pointerId !== event.pointerId) {
      return;
    }

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    dragStateRef.current = null;
    setIsDraggingCrop(false);
  };

  const resetCurrentSource = () => {
    updateCurrentSettings(() => settingsForSource(source.id));
  };

  const resetAllSources = () => {
    setLabState(createDefaultLabState(labState.sourceIndex));
  };

  const download = () => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const link = document.createElement('a');
    link.download = `${source.id}-portrait-dither.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <Section
      index="2a"
      title="Portrait dither lab"
      accent="text-roy-b"
      cols={1}
      note="Same canvas treatment as the rehaul portrait: crop around Islam, make a black-and-white base, then lay a separately pixelated color layer over it."
    >
      <div
        data-testid="portrait-dither-lab"
        className="grid gap-6 bg-background p-4 md:grid-cols-[minmax(0,1fr)_18rem]"
      >
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => cycle(-1)}
              className="border border-border px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.12em] text-foreground hover:border-foreground"
            >
              prev
            </button>
            <button
              type="button"
              onClick={() => cycle(1)}
              className="border border-border px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.12em] text-foreground hover:border-foreground"
            >
              next
            </button>
            <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
              {labState.sourceIndex + 1}/{portraitSources.length} {source.label}
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {portraitSources.map((item, index) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setSource(index)}
                aria-pressed={labState.sourceIndex === index}
                title={item.note}
                className={`h-14 w-14 border bg-cover bg-center ${
                  labState.sourceIndex === index
                    ? 'border-roy-b'
                    : 'border-border'
                }`}
                style={{ backgroundImage: `url(${item.src})` }}
              >
                <span className="sr-only">{item.label}</span>
              </button>
            ))}
          </div>

          <div className="flex min-h-[260px] flex-wrap items-start gap-6">
            <div className="grid gap-1">
              <canvas
                ref={rawCanvasRef}
                data-testid="portrait-raw-crop-canvas"
                className={`touch-none select-none bg-background ${
                  isDraggingCrop ? 'cursor-grabbing' : 'cursor-grab'
                }`}
                style={{
                  width: settings.previewSize,
                  height: settings.previewSize,
                }}
                onPointerDown={handleCropPointerDown}
                onPointerMove={handleCropPointerMove}
                onPointerUp={handleCropPointerEnd}
                onPointerCancel={handleCropPointerEnd}
                aria-label={`${source.label} raw crop preview, drag to pan crop`}
              />
              <div className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                raw crop
              </div>
            </div>
            <div className="grid gap-1">
              <canvas
                ref={canvasRef}
                data-testid="portrait-dither-canvas"
                className={`touch-none select-none bg-background [image-rendering:pixelated] ${
                  isDraggingCrop ? 'cursor-grabbing' : 'cursor-grab'
                }`}
                style={{
                  width: settings.previewSize,
                  height: settings.previewSize,
                }}
                onPointerDown={handleCropPointerDown}
                onPointerMove={handleCropPointerMove}
                onPointerUp={handleCropPointerEnd}
                onPointerCancel={handleCropPointerEnd}
                aria-label={`${source.label} dithered portrait preview, drag to pan crop`}
              />
              <div className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                dithered
              </div>
            </div>
            <div className="max-w-xs font-mono text-[10px] uppercase leading-relaxed tracking-[0.12em] text-muted-foreground">
              <div className="text-foreground">{source.note}</div>
              <div>
                {settings.previewSize}px preview. {rehaulDisplaySize}px matches
                the current rehaul column image.
              </div>
              <div>Drag either preview to pan the crop.</div>
              <div>Download keeps the transparent PNG at {canvasSize}px.</div>
            </div>
          </div>
        </div>

        <div className="grid gap-3">
          <div className="flex gap-2">
            <ShapeButton
              active={settings.shape === 'square'}
              onClick={() => updateSetting('shape', 'square')}
            >
              square
            </ShapeButton>
            <ShapeButton
              active={settings.shape === 'radial'}
              onClick={() => updateSetting('shape', 'radial')}
            >
              radial
            </ShapeButton>
          </div>
          <Slider
            label="preview size"
            value={settings.previewSize}
            min={130}
            max={260}
            step={1}
            testId="portrait-preview-size-slider"
            onChange={(value) => updateSetting('previewSize', value)}
          />
          <Slider
            label="radius"
            value={settings.radius}
            min={0.2}
            max={0.95}
            step={0.01}
            onChange={(value) => updateSetting('radius', value)}
          />
          <Slider
            label="feather"
            value={settings.feather}
            min={0.02}
            max={0.6}
            step={0.01}
            onChange={(value) => updateSetting('feather', value)}
          />
          <Slider
            label="bw px"
            value={settings.centerPixel}
            min={1}
            max={10}
            step={1}
            onChange={(value) => updateSetting('centerPixel', value)}
          />
          <Slider
            label="edge px"
            value={settings.edgePixel}
            min={2}
            max={18}
            step={1}
            onChange={(value) => updateSetting('edgePixel', value)}
          />
          <Slider
            label="mask px"
            value={settings.maskPixel}
            min={1}
            max={14}
            step={1}
            onChange={(value) => updateSetting('maskPixel', value)}
          />
          <Slider
            label="color px"
            value={settings.colorPixel}
            min={1}
            max={14}
            step={1}
            onChange={(value) => updateSetting('colorPixel', value)}
          />
          <Slider
            label="bw dither"
            value={settings.fineDither}
            min={0}
            max={0.5}
            step={0.01}
            onChange={(value) => updateSetting('fineDither', value)}
          />
          <Slider
            label="color amount"
            value={settings.colorAmount}
            min={0}
            max={1}
            step={0.01}
            onChange={(value) => updateSetting('colorAmount', value)}
          />
          <Slider
            label="color dither"
            value={settings.colorDither}
            min={0}
            max={1}
            step={0.01}
            onChange={(value) => updateSetting('colorDither', value)}
          />
          <Slider
            label="sharpen"
            value={settings.sharpen}
            min={0}
            max={1}
            step={0.01}
            onChange={(value) => updateSetting('sharpen', value)}
          />
          <Slider
            label="crop x"
            value={settings.cropX}
            min={0}
            max={1}
            step={0.01}
            testId="portrait-crop-x-slider"
            onChange={(value) => updateSetting('cropX', value)}
          />
          <Slider
            label="crop y"
            value={settings.cropY}
            min={0}
            max={1}
            step={0.01}
            testId="portrait-crop-y-slider"
            onChange={(value) => updateSetting('cropY', value)}
          />
          <Slider
            label="zoom"
            value={settings.zoom}
            min={1}
            max={4}
            step={0.05}
            testId="portrait-zoom-slider"
            onChange={(value) => updateSetting('zoom', value)}
          />
          <Slider
            label="center x"
            value={settings.centerX}
            min={0.35}
            max={0.65}
            step={0.01}
            onChange={(value) => updateSetting('centerX', value)}
          />
          <Slider
            label="center y"
            value={settings.centerY}
            min={0.35}
            max={0.65}
            step={0.01}
            onChange={(value) => updateSetting('centerY', value)}
          />
          <div className="flex flex-wrap gap-2 pt-1">
            <button
              type="button"
              onClick={resetCurrentSource}
              className="border border-border px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.12em] text-foreground hover:border-foreground"
            >
              reset photo
            </button>
            <button
              type="button"
              onClick={resetAllSources}
              className="border border-border px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.12em] text-foreground hover:border-foreground"
            >
              reset all
            </button>
            <button
              type="button"
              onClick={download}
              className="border border-roy-b px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.12em] text-roy-b hover:bg-roy-b hover:text-background"
            >
              download png
            </button>
          </div>
        </div>
      </div>
    </Section>
  );
}
