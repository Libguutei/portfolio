import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { experience } from "@/data/portfolio";
import { SplitReveal } from "../motion/SplitReveal";

export function Experience() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.fromTo(
        ".xp-line-fill",
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: { trigger: ".xp-list", start: "top 70%", end: "bottom 60%", scrub: true },
        },
      );

      gsap.utils.toArray<HTMLElement>(".xp-item").forEach(item => {
        const tl = gsap.timeline({ scrollTrigger: { trigger: item, start: "top 75%" } });
        tl.from(item.querySelector(".xp-dot"), { scale: 0, duration: 0.6, ease: "back.out(4)" })
          .from(item.querySelectorAll(".xp-reveal"), { y: 50, opacity: 0, duration: 1, stagger: 0.08, ease: "expo.out" }, 0.1)
          .from(item.querySelector(".xp-period"), { clipPath: "inset(0 100% 0 0)", duration: 1, ease: "expo.inOut" }, 0);
      });
    },
    { scope: root },
  );

  return (
    <section id="journey" ref={root} data-bg="#f1ede4" data-fg="#0b0b0c" className="px-5 py-32 md:px-10 md:py-48">
      <div className="mb-20 flex items-center gap-4 text-xs uppercase tracking-[0.25em] opacity-60 md:text-sm">
        <span>(06)</span>
        <span className="h-px w-12 bg-current" />
        <span>Journey</span>
      </div>

      <SplitReveal as="h2" by="chars" className="mb-20 font-display text-[15vw] font-black uppercase leading-[0.85] tracking-[-0.04em] md:text-[8vw]">
        Experience<span className="text-[#6b5bff]">.</span>
      </SplitReveal>

      <div className="xp-list relative pl-10 md:pl-0">
        <div className="absolute bottom-0 left-[11px] top-0 w-px bg-current/15 md:left-1/2">
          <div className="xp-line-fill h-full w-full origin-top bg-[#6b5bff]" />
        </div>

        {experience.map((x, i) => (
          <div key={x.period} className={`xp-item relative mb-24 last:mb-0 md:grid md:grid-cols-2 md:gap-20 ${i % 2 ? "" : "md:text-right"}`}>
            <span className="xp-dot absolute -left-10 top-2 h-6 w-6 rounded-full border-4 border-[#f1ede4] bg-[#6b5bff] md:left-1/2 md:-translate-x-1/2" />
            <div className={i % 2 ? "md:col-start-2" : ""}>
              <div className="xp-period inline-block rounded-full bg-[#0b0b0c] px-4 py-1.5 text-sm text-[#f1ede4]">{x.period}</div>
              <h3 className="xp-reveal mt-5 font-display text-4xl font-black uppercase tracking-tight md:text-5xl">{x.role}</h3>
              <div className="xp-reveal mt-2 font-serif text-2xl italic opacity-70">{x.company}</div>
              <p className="xp-reveal mt-4 text-lg leading-relaxed opacity-75">{x.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
