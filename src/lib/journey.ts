import { gsap } from "./gsap";
import { stops } from "@/data/portfolio";

type Listener = (index: number, direction: 1 | -1) => void;

/**
 * Аяллын төлөв: аль scene дээр байгаа (index) ба камерын тасралтгүй байрлал (progress).
 * progress нь scene хооронд GSAP-аар зөөлөн шилждэг тул 3D, тэнгэр, өндөр хэмжигч бүгд үүнийг уншина.
 */
export const journey = { progress: 0, index: 0, busy: false };

const listeners = new Set<Listener>();

export function onScene(fn: Listener): () => void {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function goTo(target: number): boolean {
  const next = Math.max(0, Math.min(stops.length - 1, target));
  if (next === journey.index || journey.busy) return false;

  const direction = next > journey.index ? 1 : -1;
  const distance = Math.abs(next - journey.index);
  journey.busy = true;
  journey.index = next;
  listeners.forEach(l => l(next, direction));

  gsap.to(journey, {
    progress: next,
    duration: Math.min(1.5 + (distance - 1) * 0.3, 2.8),
    ease: "power2.inOut",
    overwrite: true,
    onComplete: () => {
      journey.busy = false;
    },
  });
  return true;
}

export const goNext = () => goTo(journey.index + 1);
export const goPrev = () => goTo(journey.index - 1);

/** Хэрэглэгчийн дугуй, swipe, гарын товчийг scene шилжилт болгоно */
export function bindNavigation(): () => void {
  let lastNav = 0;
  let lastWheel = 0;

  // Дотроо гүйлгэж болох хэсэг (жишээ нь утсан дээрх урт жагсаалт) эхлээд өөрөө гүйлгэнэ
  const canScrollInside = (target: EventTarget | null, dir: number) => {
    const el = (target as Element | null)?.closest<HTMLElement>("[data-scroll]");
    if (!el || el.scrollHeight <= el.clientHeight + 2) return false;
    return dir > 0 ? el.scrollTop + el.clientHeight < el.scrollHeight - 2 : el.scrollTop > 2;
  };

  const onWheel = (e: WheelEvent) => {
    const now = performance.now();
    const dir = Math.sign(e.deltaY);
    const streaming = now - lastWheel < 180;
    lastWheel = now;
    if (!dir || canScrollInside(e.target, dir)) return;
    e.preventDefault();
    // Trackpad-ийн инерцийн урсгал нэг шилжилтээс илүүг өдөөхгүй
    if (journey.busy || now - lastNav < 1400 || (streaming && now - lastNav < 2400)) return;
    if (Math.abs(e.deltaY) < 8) return;
    if (dir > 0 ? goNext() : goPrev()) lastNav = now;
  };

  let touchY = 0;
  const onTouchStart = (e: TouchEvent) => {
    touchY = e.touches[0]?.clientY ?? 0;
  };
  const onTouchEnd = (e: TouchEvent) => {
    const dy = touchY - (e.changedTouches[0]?.clientY ?? touchY);
    if (Math.abs(dy) < 50 || canScrollInside(e.target, Math.sign(dy))) return;
    if (dy > 0) goNext();
    else goPrev();
  };

  const onKey = (e: KeyboardEvent) => {
    if ((e.target as HTMLElement)?.closest("input, textarea")) return;
    if (["ArrowDown", "PageDown", " "].includes(e.key)) {
      e.preventDefault();
      goNext();
    } else if (["ArrowUp", "PageUp"].includes(e.key)) {
      e.preventDefault();
      goPrev();
    } else if (e.key === "Home") goTo(0);
    else if (e.key === "End") goTo(stops.length - 1);
  };

  window.addEventListener("wheel", onWheel, { passive: false });
  window.addEventListener("touchstart", onTouchStart, { passive: true });
  window.addEventListener("touchend", onTouchEnd, { passive: true });
  window.addEventListener("keydown", onKey);
  return () => {
    window.removeEventListener("wheel", onWheel);
    window.removeEventListener("touchstart", onTouchStart);
    window.removeEventListener("touchend", onTouchEnd);
    window.removeEventListener("keydown", onKey);
  };
}
