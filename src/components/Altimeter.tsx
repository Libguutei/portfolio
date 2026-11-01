import { useEffect, useRef, useState } from "react";
import { ScrollTrigger } from "@/lib/gsap";
import { scrollTo } from "@/lib/scroll";
import { formatKm, lerpKm } from "@/lib/distance";
import { stops } from "@/data/portfolio";

/**
 * Баруун талын өндөр хэмжигч: дэлгэцийн голд байгаа section-оос
 * дараагийнх хүртэлх явцаар бодит зайг тооцож харуулна.
 */
export function Altimeter() {
  const readout = useRef<HTMLSpanElement>(null);
  const fill = useRef<HTMLDivElement>(null);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    let last = -1;
    const update = () => {
      const mid = window.innerHeight * 0.5;
      const tops = stops.map(s => document.getElementById(s.id)?.getBoundingClientRect().top ?? Infinity);

      let i = 0;
      tops.forEach((top, idx) => {
        if (top <= mid) i = idx;
      });
      const here = stops[i];
      const next = stops[i + 1];
      const topHere = tops[i] ?? 0;
      const topNext = tops[i + 1] ?? Infinity;
      const t = next && Number.isFinite(topNext) ? Math.min(1, Math.max(0, (mid - topHere) / (topNext - topHere))) : 0;
      const km = here ? (next ? lerpKm(here.km, next.km, t) : here.km) : 0;

      if (readout.current) readout.current.textContent = formatKm(km);
      if (fill.current) fill.current.style.transform = `scaleY(${(i + t) / (stops.length - 1)})`;
      if (i !== last) {
        last = i;
        setCurrent(i);
      }
    };

    const st = ScrollTrigger.create({ start: 0, end: "max", onUpdate: update, onRefresh: update });
    update();
    return () => st.kill();
  }, []);

  const place = stops[current]?.place ?? "";

  return (
    <aside className="pointer-events-none fixed inset-0 z-40" aria-label="Distance from Earth">
      <div className="absolute bottom-6 right-8 hidden rounded-2xl bg-space/70 px-4 py-2.5 text-right backdrop-blur md:block">
        <div className="text-xs text-ink/60 md:text-sm">{place}</div>
        <span ref={readout} className="font-display text-sm font-semibold md:text-lg">
          0 km
        </span>
      </div>
      <div className="absolute right-3 top-1/2 hidden -translate-y-1/2 items-stretch gap-3 md:right-5 md:flex">
        <div className="relative w-px bg-ink/20">
          <div ref={fill} className="absolute inset-0 origin-top bg-dawn" style={{ transform: "scaleY(0)" }} />
        </div>
        <ol className="pointer-events-auto flex flex-col justify-between gap-3 py-0.5">
          {stops.map((s, i) => (
            <li key={s.id}>
              <button
                onClick={() => scrollTo(`#${s.id}`)}
                className={`block h-2 w-2 rounded-full transition-colors ${i <= current ? "bg-dawn" : "bg-ink/30 hover:bg-ink/70"}`}
                aria-label={`Fly to ${s.place}`}
                title={s.place}
              />
            </li>
          ))}
        </ol>
      </div>
    </aside>
  );
}
