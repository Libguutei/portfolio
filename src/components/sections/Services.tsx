import { useRef, type CSSProperties } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { services } from "@/data/portfolio";
import { SplitReveal } from "../motion/SplitReveal";

const STICKY_TOP = 96;
const STACK_GAP = 28;

/** Sticky картууд бие биен дээрээ давхарлагдаж, доорх нь жижгэрч бүдгэрнэ */
export function Services() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const cards = gsap.utils.toArray<HTMLElement>(".svc-card");
      cards.forEach((card, i) => {
        const next = cards[i + 1];
        if (!next) return;
        const depth = cards.length - 1 - i;
        gsap.to(card.querySelector(".svc-inner"), {
          scale: 1 - depth * 0.04,
          rotateX: -6,
          filter: "brightness(0.6)",
          ease: "none",
          scrollTrigger: {
            trigger: next,
            start: "top bottom",
            end: `top ${STICKY_TOP + (i + 1) * STACK_GAP}px`,
            scrub: true,
          },
        });
      });

      gsap.utils.toArray<HTMLElement>(".svc-point").forEach(p => {
        gsap.from(p, {
          x: -30,
          opacity: 0,
          duration: 0.8,
          ease: "expo.out",
          scrollTrigger: { trigger: p, start: "top 92%" },
        });
      });
    },
    { scope: root },
  );

  return (
    <section id="services" ref={root} data-bg="#1a1a1d" data-fg="#f1ede4" className="relative px-5 pb-32 pt-32 md:px-10 md:pb-48">
      <div className="mb-16 flex flex-col gap-6 md:mb-24 md:flex-row md:items-end md:justify-between">
        <SplitReveal as="h2" by="chars" className="font-display text-[15vw] font-black uppercase leading-[0.85] tracking-[-0.04em] md:text-[8vw]">
          What I <span className="font-serif font-normal normal-case italic text-[#ff5b2e]">do</span>
        </SplitReveal>
        <SplitReveal as="p" className="max-w-sm text-lg opacity-70">
          (03) From concept to code — every layer of the product, with motion as a first-class citizen.
        </SplitReveal>
      </div>

      <div className="flex flex-col gap-[12vh] [perspective:1400px]">
        {services.map((s, i) => (
          <div
            key={s.title}
            className="svc-card sticky"
            style={{ top: STICKY_TOP + i * STACK_GAP }}
          >
            <div
              className="svc-inner origin-top rounded-[32px] p-7 md:p-14"
              style={{ backgroundColor: s.color, color: s.ink } as CSSProperties}
            >
              <div className="flex items-start justify-between gap-6">
                <span className="font-display text-sm font-bold uppercase tracking-[0.2em] opacity-60">
                  0{i + 1} / 0{services.length}
                </span>
                <span className="svc-icon flex h-14 w-14 items-center justify-center rounded-full border border-current text-2xl md:h-20 md:w-20">
                  ✦
                </span>
              </div>
              <div className="mt-10 grid gap-10 md:mt-20 md:grid-cols-2">
                <h3 className="font-display text-5xl font-black uppercase leading-[0.9] tracking-tight md:text-[5.5vw]">{s.title}</h3>
                <div className="flex flex-col justify-end">
                  <p className="text-lg leading-snug md:text-2xl">{s.description}</p>
                  <ul className="mt-8 border-t border-current/20">
                    {s.points.map(p => (
                      <li key={p} className="svc-point flex items-center justify-between border-b border-current/20 py-3 text-base md:text-lg">
                        {p}
                        <span>↗</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
