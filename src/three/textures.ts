import * as THREE from "three";
import { fbm } from "./noise";

type RGB = [number, number, number];
type Shader = (n: (f: number, o?: number) => number, lat: number, u: number, v: number) => RGB | [number, number, number, number];

const mix = (a: RGB, b: RGB, t: number): RGB => {
  const k = Math.min(1, Math.max(0, t));
  return [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k, a[2] + (b[2] - a[2]) * k];
};

/**
 * Equirectangular текстур зурна: пиксел бүрийг бөмбөрцөг дээрх цэг болгож noise-оос өнгө авна,
 * тиймээс зүүн/баруун ирмэг заадалгүй нийлнэ.
 */
function paint(w: number, h: number, shader: Shader, after?: (ctx: CanvasRenderingContext2D) => void): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d")!;
  const img = ctx.createImageData(w, h);
  for (let y = 0; y < h; y++) {
    const v = y / h;
    const lat = (v - 0.5) * Math.PI;
    const cy = Math.sin(lat);
    const r = Math.cos(lat);
    for (let x = 0; x < w; x++) {
      const u = (x / w) * Math.PI * 2;
      const px = Math.cos(u) * r;
      const pz = Math.sin(u) * r;
      const n = (f: number, o = 4) => fbm(px * f + 11.3, cy * f + 3.7, pz * f + 7.1, o);
      const c = shader(n, lat, u, v);
      const i = (y * w + x) * 4;
      img.data[i] = c[0];
      img.data[i + 1] = c[1];
      img.data[i + 2] = c[2];
      img.data[i + 3] = c.length === 4 ? c[3] : 255;
    }
  }
  ctx.putImageData(img, 0, 0);
  after?.(ctx);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}

export function earthTexture() {
  return paint(1024, 512, (n, lat) => {
    const h = n(1.8, 5) + 0.12 * Math.cos(lat * 2);
    const polar = Math.abs(lat) > 1.25 + n(4, 2) * 0.2;
    if (polar) return [236, 242, 250];
    if (h > 0.06) {
      const dry = n(3, 3);
      return mix(mix([58, 120, 64], [104, 140, 70], h * 3), [168, 140, 96], dry * 2 + Math.abs(lat) * 0.1);
    }
    return mix([14, 46, 120], [36, 104, 196], 1 + h * 4);
  });
}

export function cloudTexture() {
  return paint(1024, 512, n => {
    const c = n(3.2, 5);
    const a = Math.max(0, Math.min(1, (c - 0.02) * 4));
    return [255, 255, 255, Math.round(a * 220)];
  });
}

export function moonTexture() {
  return paint(
    512,
    256,
    n => {
      const g = 150 + n(3, 5) * 120 + n(0.8, 2) * 60;
      return [g, g, g + 6];
    },
    ctx => {
      // Тогоонууд
      for (let i = 0; i < 70; i++) {
        const x = Math.random() * 512;
        const y = 30 + Math.random() * 196;
        const r = 2 + Math.random() ** 2 * 18;
        ctx.fillStyle = "rgba(60,60,66,0.35)";
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "rgba(235,235,240,0.35)";
        ctx.lineWidth = Math.max(1, r * 0.15);
        ctx.beginPath();
        ctx.arc(x + r * 0.12, y - r * 0.12, r, Math.PI, Math.PI * 1.8);
        ctx.stroke();
      }
    },
  );
}

export function marsTexture() {
  return paint(1024, 512, (n, lat) => {
    if (Math.abs(lat) > 1.32 + n(5, 2) * 0.15) return [248, 236, 228];
    const base = mix([196, 92, 50], [226, 128, 74], n(2, 5) + 0.5);
    const dark = n(1.2, 4);
    return dark > 0.12 ? mix(base, [110, 46, 26], (dark - 0.12) * 4) : base;
  });
}

export function vestaTexture() {
  return paint(512, 256, n => {
    const g = n(5, 5);
    return mix([108, 96, 84], [196, 182, 160], g + 0.55);
  });
}

export function europaTexture() {
  return paint(
    1024,
    512,
    n => mix([226, 214, 190], [246, 240, 226], n(3, 4) + 0.5),
    ctx => {
      // Мөсөн хагарлууд (lineae)
      for (let i = 0; i < 60; i++) {
        ctx.strokeStyle = `rgba(150,92,52,${0.25 + Math.random() * 0.35})`;
        ctx.lineWidth = 1 + Math.random() * 2.5;
        ctx.beginPath();
        let x = Math.random() * 1024;
        let y = 60 + Math.random() * 392;
        ctx.moveTo(x, y);
        const dir = Math.random() * Math.PI * 2;
        for (let s = 0; s < 14; s++) {
          x += Math.cos(dir + Math.sin(s * 0.6) * 0.5) * 22;
          y += Math.sin(dir + Math.sin(s * 0.6) * 0.5) * 12;
          ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
    },
  );
}

const JUPITER_BANDS: RGB[] = [
  [236, 220, 194],
  [196, 152, 110],
  [240, 228, 206],
  [180, 128, 88],
  [232, 214, 182],
  [164, 112, 76],
  [242, 230, 210],
  [200, 150, 106],
];

function bands(palette: RGB[], count: number, turbulence: number): Shader {
  return (n, lat) => {
    const t = (lat / Math.PI + 0.5) * count + n(2.5, 4) * turbulence;
    const i = Math.floor(t);
    const f = t - i;
    const a = palette[((i % palette.length) + palette.length) % palette.length]!;
    const b = palette[(((i + 1) % palette.length) + palette.length) % palette.length]!;
    return mix(a, b, f * f * (3 - 2 * f));
  };
}

export function jupiterTexture() {
  return paint(1024, 512, bands(JUPITER_BANDS, 16, 1.4), ctx => {
    // Их улаан толбо
    const g = ctx.createRadialGradient(680, 330, 4, 680, 330, 46);
    g.addColorStop(0, "rgba(196,82,46,0.95)");
    g.addColorStop(0.7, "rgba(206,110,70,0.7)");
    g.addColorStop(1, "rgba(206,110,70,0)");
    ctx.fillStyle = g;
    ctx.save();
    ctx.translate(680, 330);
    ctx.scale(1.6, 1);
    ctx.translate(-680, -330);
    ctx.beginPath();
    ctx.arc(680, 330, 46, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  });
}

export function saturnTexture() {
  return paint(
    1024,
    512,
    bands(
      [
        [244, 228, 186],
        [226, 198, 140],
        [248, 236, 200],
        [214, 182, 124],
        [240, 222, 176],
      ],
      14,
      0.5,
    ),
  );
}

/** Цагирагийн текстур: u нь дотоод ирмэгээс гадна руу */
export function ringTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 4;
  const ctx = canvas.getContext("2d")!;
  for (let x = 0; x < 512; x++) {
    const t = x / 512;
    const gap = t > 0.62 && t < 0.67; // Cassini gap
    const a = gap ? 0.05 : 0.35 + 0.5 * Math.abs(Math.sin(t * 40) * Math.sin(t * 7));
    const fadeEdge = Math.min(1, t * 8, (1 - t) * 6);
    ctx.fillStyle = `rgba(${220 - t * 40},${200 - t * 40},${160 - t * 30},${a * fadeEdge})`;
    ctx.fillRect(x, 0, 1, 4);
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/** Одны дугуй гэрэлтэлт */
export function starSprite() {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 64;
  const ctx = canvas.getContext("2d")!;
  const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  g.addColorStop(0, "rgba(255,255,255,1)");
  g.addColorStop(0.25, "rgba(255,244,226,0.8)");
  g.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 64, 64);
  return new THREE.CanvasTexture(canvas);
}
