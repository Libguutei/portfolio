import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { goTo, journey } from "@/lib/journey";
import { formatKm, lerpKm } from "@/lib/distance";
import { stops } from "@/data/portfolio";

/** Баруун талын өндөр хэмжигч: аяллын явцаар бодит зайг тоолж, цэг бүр нь тухайн зогсоол руу нисгэнэ */
export function Altimeter({ current }: { current: number }) {
  const readout = useRef<HTMLSpanElement>(null);
  const fill = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tick = () => {
      const p = journey.progress;
      const i = Math.min(stops.length - 1, Math.floor(p));
      const here = stops[i];
      const next = stops[i + 1];
      const km = here ? (next ? lerpKm(here.km, next.km, p - i) : here.km) : 0;
      if (readout.current) readout.current.textContent = formatKm(km);
      if (fill.current) fill.current.style.transform = `scaleY(${p / (stops.length - 1)})`;
    };
    gsap.ticker.add(tick);
    return () => gsap.ticker.remove(tick);
  }, []);

  const place = stops[current]?.place ?? "";

  return (
    <aside className="pointer-events-none fixed inset-0 z-40" aria-label="Дэлхийгээс алслагдсан зай">
      <div className="absolute bottom-6 right-8 hidden rounded-2xl bg-space/70 px-4 py-2.5 text-right backdrop-blur md:block">
        <div className="text-sm text-ink/60">{place}</div>
        <span ref={readout} className="font-display text-lg font-semibold">
          0 км
        </span>
      </div>
      <div className="absolute right-5 top-1/2 hidden -translate-y-1/2 items-stretch gap-3 md:flex">
        <div className="relative w-px bg-ink/20">
          <div ref={fill} className="absolute inset-0 origin-top bg-dawn" style={{ transform: "scaleY(0)" }} />
        </div>
        <ol className="pointer-events-auto flex flex-col justify-between gap-3 py-0.5">
          {stops.map((s, i) => (
            <li key={s.id}>
              <button
                onClick={() => goTo(i)}
                className={`block h-2 w-2 rounded-full transition-all ${i === current ? "scale-150 bg-dawn" : i < current ? "bg-dawn/70" : "bg-ink/30 hover:bg-ink/70"}`}
                aria-label={`${s.place} руу нисэх`}
                aria-current={i === current ? "step" : undefined}
                title={s.place}
              />
            </li>
          ))}
        </ol>
      </div>
    </aside>
  );
}
