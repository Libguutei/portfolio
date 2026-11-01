import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { stats } from "@/data/portfolio";

export function Stats() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.utils.toArray<HTMLElement>(".stat-num").forEach(el => {
        const target = Number(el.dataset.value ?? 0);
        const counter = { v: 0 };
        gsap.to(counter, {
          v: target,
          duration: 2.2,
          ease: "expo.out",
          onUpdate: () => {
            el.textContent = String(Math.round(counter.v));
          },
          scrollTrigger: { trigger: el, start: "top 88%" },
        });
      });

      gsap.from(".stat", {
        yPercent: 40,
        opacity: 0,
        duration: 1.2,
        stagger: 0.1,
        ease: "expo.out",
        scrollTrigger: { trigger: root.current, start: "top 80%" },
      });
      gsap.from(".stat-line", {
        scaleX: 0,
        duration: 1.4,
        stagger: 0.1,
        ease: "expo.inOut",
        scrollTrigger: { trigger: root.current, start: "top 80%" },
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} data-bg="#0b0b0c" data-fg="#f1ede4" className="px-5 py-24 md:px-10 md:py-36">
      <div className="grid grid-cols-2 gap-x-6 gap-y-14 md:grid-cols-4">
        {stats.map(s => (
          <div key={s.label} className="stat">
            <div className="stat-line mb-6 h-px w-full origin-left bg-current opacity-30" />
            <div className="font-display text-6xl font-black leading-none tracking-tight md:text-[7vw]">
              <span className="stat-num tabular-nums" data-value={s.value}>
                0
              </span>
              <span className="text-[#d4ff3a]">{s.suffix}</span>
            </div>
            <div className="mt-3 text-sm uppercase tracking-[0.2em] opacity-60">{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
