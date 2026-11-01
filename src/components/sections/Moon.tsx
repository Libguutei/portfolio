import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { experience } from "@/data/portfolio";
import { Planet } from "../Planet";
import { StopLabel } from "../StopLabel";

/** Сар: эхний буулт — туршлагын түүх он дарааллаар */
export function Moon() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.fromTo(
        ".mn-moon",
        { scale: 0.35, yPercent: 30 },
        {
          scale: 1,
          yPercent: -15,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true },
        },
      );
      gsap.fromTo(
        ".mn-line",
        { scaleY: 0 },
        { scaleY: 1, ease: "none", scrollTrigger: { trigger: ".mn-log", start: "top 70%", end: "bottom 60%", scrub: true } },
      );
    },
    { scope: root },
  );

  return (
    <section id="moon" ref={root} className="relative px-5 py-32 md:px-10 md:py-44">
      <div className="grid gap-16 md:grid-cols-12">
        <div className="md:col-span-6">
          <StopLabel id="moon" />
          <h2 className="mt-10 font-display text-[clamp(2.2rem,5.5vw,5rem)] font-semibold leading-[1.02]">Mission log</h2>
          <p className="measure mt-6 text-ink/80">One year, five missions, in the order they happened.</p>

          <ol className="mn-log relative mt-14 space-y-12 pl-8">
            <span className="absolute bottom-2 left-[3px] top-2 w-px bg-ink/15" aria-hidden>
              <span className="mn-line block h-full w-full origin-top bg-dawn" />
            </span>
            {experience.map(x => (
              <li key={x.company} className="relative">
                <span className="absolute -left-8 top-2 h-[7px] w-[7px] rounded-full bg-dawn" aria-hidden />
                <p className="text-sm text-ink/60">{x.period}</p>
                <h3 className="mt-1 font-display text-xl font-semibold md:text-2xl">{x.company}</h3>
                <p className="text-ink/70">{x.role}</p>
                <p className="measure mt-2">{x.description}</p>
              </li>
            ))}
          </ol>
        </div>

        <div className="relative hidden md:col-span-6 md:block">
          <div className="sticky top-[15vh] grid h-[70vh] place-items-center">
            <div className="mn-moon w-[min(34vw,440px)]">
              <Planet kind="moon" className="w-full" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
