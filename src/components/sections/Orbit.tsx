import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { stack } from "@/data/portfolio";
import { Planet } from "../Planet";
import { StopLabel } from "../StopLabel";
import { joinList } from "./Mission";

/** Тойрог зам бүрт нэг хиймэл дагуул — stack-ийн нэг бүлэг */
const ORBITS = [
  { size: "64%", duration: "26s" },
  { size: "82%", duration: "38s" },
  { size: "100%", duration: "52s" },
  { size: "118%", duration: "70s" },
];

/** 400 км: доор дэлхийн муруй, эргэн тойронд stack-ийн дагуулууд */
export function Orbit() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.fromTo(
        ".or-limb",
        { yPercent: 20 },
        { yPercent: -10, ease: "none", scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true } },
      );
      gsap.from(".or-earth", {
        scale: 0.6,
        opacity: 0,
        duration: 1.6,
        ease: "expo.out",
        scrollTrigger: { trigger: ".or-earth", start: "top 85%" },
      });
    },
    { scope: root },
  );

  return (
    <section id="orbit" ref={root} className="relative overflow-hidden px-5 pb-[40vw] pt-32 md:px-10 md:pb-[24vw]">
      <div className="relative z-10 grid gap-16 md:grid-cols-12">
        <div className="md:col-span-6">
          <StopLabel id="orbit" />
          <h2 className="mt-10 font-display text-[clamp(2.2rem,5.5vw,5rem)] font-semibold leading-[1.02]">The stack in orbit</h2>
          <p className="measure mt-6 text-ink/80">
            Four groups of tools keep everything I build up here. All of them come straight from the projects on my GitHub.
          </p>
          <dl className="mt-12 space-y-8">
            {stack.map(g => (
              <div key={g.title} className="measure border-t border-ink/20 pt-4">
                <dt className="font-display text-lg font-semibold">{g.title}</dt>
                <dd className="mt-1 text-ink/60">{g.note}</dd>
                <dd className="mt-2">{joinList(g.items)}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="relative hidden aspect-square self-center md:col-span-6 md:block">
          <div className="or-earth absolute inset-[30%]">
            <Planet kind="earth" className="h-full w-full" />
          </div>
          {stack.map((g, i) => {
            const o = ORBITS[i] ?? ORBITS[0]!;
            return (
              <div key={g.title} className="orbit-ring" style={{ width: o.size, height: o.size, animationDuration: o.duration }}>
                <div className="sat">
                  <span className="flex items-center gap-2 whitespace-nowrap rounded-full bg-space/80 px-3 py-1 text-sm backdrop-blur">
                    <span className="h-2 w-2 rounded-full bg-dawn" aria-hidden />
                    {g.title}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Дэлхийн муруй */}
      <div className="or-limb pointer-events-none absolute left-1/2 top-[calc(100%-36vw)] w-[180vw] -translate-x-1/2 md:top-[calc(100%-20vw)]" aria-hidden>
        <Planet kind="earth" className="w-full" />
      </div>
    </section>
  );
}
