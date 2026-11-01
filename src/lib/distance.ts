/** Дэлхийгээс хэдэн км зайд байгааг уншихад амар хэлбэрт оруулна */
export function formatKm(km: number): string {
  if (km < 1_000_000) return `${Math.round(km).toLocaleString("en-US")} km`;
  if (km < 1_000_000_000) return `${(km / 1_000_000).toFixed(1)} million km`;
  return `${(km / 1_000_000_000).toFixed(2)} billion km`;
}

/** Хоёр зайн хооронд логарифм масштабаар шилжинэ: 0 км → тэрбум км жигд мэдрэгдэнэ */
export function lerpKm(from: number, to: number, t: number): number {
  const a = Math.log10(from + 1);
  const b = Math.log10(to + 1);
  return Math.pow(10, a + (b - a) * t) - 1;
}
