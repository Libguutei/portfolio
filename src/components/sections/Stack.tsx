import { useRef, type CSSProperties } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { stack } from "@/data/portfolio";
import { SplitReveal } from "../motion/SplitReveal";

const STICKY_TOP = 96;
const STACK_GAP = 28;

/** Dev stack: sticky картууд бие биен дээрээ давхарлагдаж, доорх нь жижгэрч бүдгэрнэ */
export function Stack() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const cards = gsap.utils.toArray<HTMLElement>(".stk-card");
      cards.forEach((card, i) => {
        const next = cards[i + 1];
        if (next) {
          const depth = cards.length - 1 - i;
          gsap.to(card.querySelector(".stk-inner"), {
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
        }

        gsap.from(card.querySelectorAll(".stk-pill"), {
          y: 40,
          scale: 0.6,
          opacity: 0,
          rotate: () => gsap.utils.random(-12, 12),
          duration: 0.9,
          stagger: 0.05,
          ease: "back.out(2)",
          scrollTrigger: { trigger: card, start: "top 70%" },
        });
      });
    },
    { scope: root },
  );

  return (
    <section id="stack" ref={root} data-bg="#1a1a1d" data-fg="#f1ede4" className="relative px-5 pb-32 pt-32 md:px-10 md:pb-48">
      <div className="mb-16 flex flex-col gap-6 md:mb-24 md:flex-row md:items-end md:justify-between">
        <SplitReveal as="h2" by="chars" className="font-display text-[15vw] font-black uppercase leading-[0.85] tracking-[-0.04em] md:text-[8vw]">
          Dev <span className="font-serif font-normal normal-case italic text-[#d4ff3a]">stack</span>
        </SplitReveal>
        <SplitReveal as="p" className="max-w-sm text-lg opacity-70">
          (02) The tools I actually ship with — pulled straight from the projects on my GitHub.
        </SplitReveal>
      </div>

      <div className="flex flex-col gap-[12vh] [perspective:1400px]">
        {stack.map((g, i) => (
          <div key={g.title} className="stk-card sticky" style={{ top: STICKY_TOP + i * STACK_GAP }}>
            <div className="stk-inner origin-top rounded-[32px] p-7 md:p-14" style={{ backgroundColor: g.color, color: g.ink }}>
              <div className="flex items-start justify-between gap-6">
                <span className="font-display text-sm font-bold uppercase tracking-[0.2em] opacity-60">
                  0{i + 1} / 0{stack.length}
                </span>
                <span className="flex h-14 w-14 items-center justify-center rounded-full border border-current text-2xl md:h-20 md:w-20">
                  ✦
                </span>
              </div>
              <div className="mt-10 grid gap-10 md:mt-16 md:grid-cols-2">
                <div>
                  <h3 className="font-display text-6xl font-black uppercase leading-[0.9] tracking-tight md:text-[6vw]">{g.title}</h3>
                  <p className="mt-6 max-w-md text-lg leading-snug opacity-80 md:text-xl">{g.description}</p>
                </div>
                <ul className="flex flex-wrap content-end gap-2 md:gap-3">
                  {g.items.map(item => (
                    <li
                      key={item}
                      className="stk-pill rounded-full border border-current px-4 py-2 text-base font-medium transition-colors duration-300 hover:bg-[var(--ink)] hover:text-[var(--paper)] md:px-5 md:py-2.5 md:text-xl"
                      style={{ "--ink": g.ink, "--paper": g.color } as CSSProperties}
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
