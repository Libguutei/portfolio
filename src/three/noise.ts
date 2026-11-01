// Жижиг 3D Perlin noise — гарагийн гадаргуу, чулууны хэлбэр үүсгэхэд

const PERM = new Uint8Array(512);
{
  const p = Array.from({ length: 256 }, (_, i) => i);
  // Тогтмол seed — хуудас ачаалах бүрт ижил гарагууд гарна
  let seed = 1337;
  const rand = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;
  for (let i = 255; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [p[i], p[j]] = [p[j]!, p[i]!];
  }
  for (let i = 0; i < 512; i++) PERM[i] = p[i & 255]!;
}

const fade = (t: number) => t * t * t * (t * (t * 6 - 15) + 10);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

function grad(hash: number, x: number, y: number, z: number): number {
  const h = hash & 15;
  const u = h < 8 ? x : y;
  const v = h < 4 ? y : h === 12 || h === 14 ? x : z;
  return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v);
}

export function noise3(x: number, y: number, z: number): number {
  const X = Math.floor(x) & 255;
  const Y = Math.floor(y) & 255;
  const Z = Math.floor(z) & 255;
  x -= Math.floor(x);
  y -= Math.floor(y);
  z -= Math.floor(z);
  const u = fade(x);
  const v = fade(y);
  const w = fade(z);
  const A = PERM[X]! + Y;
  const AA = PERM[A]! + Z;
  const AB = PERM[A + 1]! + Z;
  const B = PERM[X + 1]! + Y;
  const BA = PERM[B]! + Z;
  const BB = PERM[B + 1]! + Z;
  return lerp(
    lerp(lerp(grad(PERM[AA]!, x, y, z), grad(PERM[BA]!, x - 1, y, z), u), lerp(grad(PERM[AB]!, x, y - 1, z), grad(PERM[BB]!, x - 1, y - 1, z), u), v),
    lerp(
      lerp(grad(PERM[AA + 1]!, x, y, z - 1), grad(PERM[BA + 1]!, x - 1, y, z - 1), u),
      lerp(grad(PERM[AB + 1]!, x, y - 1, z - 1), grad(PERM[BB + 1]!, x - 1, y - 1, z - 1), u),
      v,
    ),
    w,
  );
}

/** Fractal noise: хэд хэдэн давтамжийг нийлүүлж байгалийн хэлбэр гаргана (≈ -1..1) */
export function fbm(x: number, y: number, z: number, octaves = 4): number {
  let sum = 0;
  let amp = 0.5;
  let freq = 1;
  for (let i = 0; i < octaves; i++) {
    sum += amp * noise3(x * freq, y * freq, z * freq);
    freq *= 2;
    amp *= 0.5;
  }
  return sum;
}
