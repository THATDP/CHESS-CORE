import * as THREE from 'three';

/** Deterministic PRNG so every visit renders the same crafted surfaces. */
export function mulberry32(seed: number) {
  return () => {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function makeCanvas(size: number): [HTMLCanvasElement, CanvasRenderingContext2D] {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas 2D indisponível para texturas procedurais.');
  return [canvas, ctx];
}

function toTexture(canvas: HTMLCanvasElement, repeat = 1): THREE.CanvasTexture {
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(repeat, repeat);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  texture.needsUpdate = true;
  return texture;
}

function grainNoise(ctx: CanvasRenderingContext2D, size: number, rnd: () => number, amount: number) {
  const image = ctx.getImageData(0, 0, size, size);
  const data = image.data;
  for (let i = 0; i < data.length; i += 4) {
    const n = (rnd() - 0.5) * amount;
    data[i] += n;
    data[i + 1] += n;
    data[i + 2] += n;
  }
  ctx.putImageData(image, 0, 0);
}

/** Dark walnut used for the board frame and furniture. */
export function woodTexture(options: {
  size?: number; base?: string; dark?: string; light?: string; seed?: number; repeat?: number;
} = {}): THREE.CanvasTexture {
  const {
    size = 1024, base = '#2b1c11', dark = '#150d07', light = '#4a3320', seed = 11, repeat = 1,
  } = options;
  const [canvas, ctx] = makeCanvas(size);
  const rnd = mulberry32(seed);

  const gradient = ctx.createLinearGradient(0, 0, size, size);
  gradient.addColorStop(0, base);
  gradient.addColorStop(0.5, '#241709');
  gradient.addColorStop(1, base);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);

  // Long flowing grain.
  for (let i = 0; i < 260; i += 1) {
    const x = rnd() * size;
    const drift = (rnd() - 0.5) * 90;
    ctx.strokeStyle = rnd() > 0.45 ? dark : light;
    ctx.globalAlpha = 0.04 + rnd() * 0.1;
    ctx.lineWidth = 0.6 + rnd() * 3.2;
    ctx.beginPath();
    ctx.moveTo(x, -30);
    ctx.bezierCurveTo(x + drift, size * 0.3, x - drift, size * 0.62, x + (rnd() - 0.5) * 40, size + 30);
    ctx.stroke();
  }

  // Occasional knots.
  for (let i = 0; i < 8; i += 1) {
    const x = rnd() * size;
    const y = rnd() * size;
    const radius = 5 + rnd() * 18;
    const ring = ctx.createRadialGradient(x, y, 1, x, y, radius);
    ring.addColorStop(0, 'rgba(10,6,3,0.55)');
    ring.addColorStop(1, 'rgba(10,6,3,0)');
    ctx.globalAlpha = 1;
    ctx.fillStyle = ring;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.globalAlpha = 1;
  grainNoise(ctx, size, rnd, 16);
  return toTexture(canvas, repeat);
}

/** Veined marble for the light squares (bone) and dark squares (charcoal). */
export function marbleTexture(options: {
  size?: number; base?: string; vein?: string; blotch?: string; seed?: number; repeat?: number; veins?: number;
} = {}): THREE.CanvasTexture {
  const {
    size = 1024,
    base = '#e6dfd0',
    vein = 'rgba(116,108,92,',
    blotch = 'rgba(178,168,146,',
    seed = 5,
    repeat = 1,
    veins = 30,
  } = options;
  const [canvas, ctx] = makeCanvas(size);
  const rnd = mulberry32(seed);

  ctx.fillStyle = base;
  ctx.fillRect(0, 0, size, size);

  // Soft mineral clouds.
  for (let i = 0; i < 46; i += 1) {
    const x = rnd() * size;
    const y = rnd() * size;
    const radius = 40 + rnd() * 190;
    const cloud = ctx.createRadialGradient(x, y, 1, x, y, radius);
    cloud.addColorStop(0, `${blotch}${0.05 + rnd() * 0.07})`);
    cloud.addColorStop(1, `${blotch}0)`);
    ctx.fillStyle = cloud;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
  }

  // Veins: slow random walkers with branching.
  for (let i = 0; i < veins; i += 1) {
    let x = rnd() * size;
    let y = rnd() * size;
    let angle = rnd() * Math.PI * 2;
    ctx.strokeStyle = `${vein}${0.05 + rnd() * 0.09})`;
    ctx.lineWidth = 0.5 + rnd() * 1.5;
    ctx.beginPath();
    ctx.moveTo(x, y);
    const steps = 90 + Math.floor(rnd() * 90);
    for (let s = 0; s < steps; s += 1) {
      angle += (rnd() - 0.5) * 0.65;
      const step = 4 + rnd() * 5;
      x += Math.cos(angle) * step;
      y += Math.sin(angle) * step;
      ctx.lineTo(x, y);
      if (rnd() > 0.965) {
        ctx.moveTo(x, y);
        angle += (rnd() - 0.5) * 1.6;
      }
    }
    ctx.stroke();
  }

  grainNoise(ctx, size, rnd, 10);
  return toTexture(canvas, repeat);
}

/** Neutral grayscale break-up map used as roughnessMap on polished pieces. */
export function microSurfaceTexture(size = 512, seed = 21): THREE.CanvasTexture {
  const [canvas, ctx] = makeCanvas(size);
  const rnd = mulberry32(seed);
  ctx.fillStyle = '#7d7d7d';
  ctx.fillRect(0, 0, size, size);
  for (let i = 0; i < 2600; i += 1) {
    const x = rnd() * size;
    const y = rnd() * size;
    const r = 1 + rnd() * 6;
    ctx.fillStyle = `rgba(${rnd() > 0.5 ? 200 : 60},${rnd() > 0.5 ? 200 : 60},${rnd() > 0.5 ? 200 : 60},${0.04 + rnd() * 0.08})`;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.anisotropy = 4;
  return texture;
}

/** Soft radial sprite for dust, glows and light shafts. */
export function glowTexture(size = 256, inner = 'rgba(255,255,255,1)', outer = 'rgba(255,255,255,0)'): THREE.CanvasTexture {
  const [canvas, ctx] = makeCanvas(size);
  const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  gradient.addColorStop(0, inner);
  gradient.addColorStop(0.35, inner.replace(',1)', ',0.55)'));
  gradient.addColorStop(1, outer);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/** Architectural floor grid that dissolves into the fog at the edges. */
export function gridTexture(size = 1024, cells = 8, tint = 'rgba(120,190,160,', alpha = 0.5): THREE.CanvasTexture {
  const [canvas, ctx] = makeCanvas(size);
  const step = size / cells;
  ctx.clearRect(0, 0, size, size);
  ctx.strokeStyle = `${tint}${alpha})`;
  ctx.lineWidth = 1.4;
  for (let i = 0; i <= cells; i += 1) {
    const position = i * step;
    ctx.beginPath();
    ctx.moveTo(position, 0);
    ctx.lineTo(position, size);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, position);
    ctx.lineTo(size, position);
    ctx.stroke();
  }
  // Radial falloff so the grid melts into the dark instead of ending abruptly.
  const fade = ctx.createRadialGradient(size / 2, size / 2, size * 0.12, size / 2, size / 2, size * 0.52);
  fade.addColorStop(0, 'rgba(5,7,10,0)');
  fade.addColorStop(1, 'rgba(5,7,10,1)');
  ctx.globalCompositeOperation = 'destination-out';
  ctx.fillStyle = fade;
  ctx.fillRect(0, 0, size, size);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  return texture;
}

/** Vertical gradient used by fake volumetric shafts. */
export function shaftTexture(width = 128, height = 512, tint = '255,244,224'): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas 2D indisponível.');
  const gradient = ctx.createLinearGradient(0, 0, 0, height);
  gradient.addColorStop(0, `rgba(${tint},0.55)`);
  gradient.addColorStop(0.55, `rgba(${tint},0.12)`);
  gradient.addColorStop(1, `rgba(${tint},0)`);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
  // Horizontal falloff so the shaft has soft edges.
  const horizontal = ctx.createLinearGradient(0, 0, width, 0);
  horizontal.addColorStop(0, 'rgba(0,0,0,1)');
  horizontal.addColorStop(0.5, 'rgba(0,0,0,0)');
  horizontal.addColorStop(1, 'rgba(0,0,0,1)');
  ctx.globalCompositeOperation = 'destination-out';
  ctx.fillStyle = horizontal;
  ctx.fillRect(0, 0, width, height);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}
