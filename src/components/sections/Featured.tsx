import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { featured } from "@/data/portfolio";
import { SplitReveal } from "../motion/SplitReveal";
import { Magnetic } from "../motion/Magnetic";
import { RollText } from "../motion/RollText";
import { FeaturedVisualView } from "./FeaturedVisuals";

/**
 * Том төслүүд: desktop дээр pin хийгдээд бүтэн дэлгэцийн панелууд
 * доороос clip-path-аар нээгдэж, өмнөх нь жижгэрч ухарна.
 */
export function Featured() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(min-width: 768px)", () => {
        const panels = gsap.utils.toArray<HTMLElement>(".ft-panel");
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: ".ft-stage",
            start: "top top",
            end: () => `+=${(panels.length - 1) * window.innerHeight * 1.3}`,
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
          },
        });

        panels.forEach((panel, i) => {
          const prev = panels[i - 1];
          if (!prev) return;
          tl.fromTo(
            panel,
            { clipPath: "inset(100% 4% 0% 4% round 48px)" },
            { clipPath: "inset(0% 0% 0% 0% round 0px)", ease: "power2.inOut", duration: 1 },
          )
            .to(prev.querySelector(".ft-inner"), { scale: 0.88, yPercent: -8, opacity: 0.2, ease: "none", duration: 1 }, "<")
            .from(panel.querySelectorAll(".ft-anim"), { y: 90, opacity: 0, stagger: 0.05, ease: "power3.out", duration: 0.6 }, "<0.45")
            .from(panel.querySelector(".ft-visual"), { scale: 0.7, rotate: -8, opacity: 0, ease: "power3.out", duration: 0.7 }, "<");
          if (i < panels.length - 1) tl.to({}, { duration: 0.35 });
        });

        // Эхний панелын контент scroll-оор орж ирнэ
        gsap.from(".ft-panel:first-child .ft-anim", {
          y: 80,
          opacity: 0,
          stagger: 0.06,
          duration: 1,
          ease: "expo.out",
          scrollTrigger: { trigger: ".ft-stage", start: "top 70%" },
        });
      });

      mm.add("(max-width: 767px)", () => {
        gsap.utils.toArray<HTMLElement>(".ft-panel").forEach(panel => {
          gsap.from(panel.querySelectorAll(".ft-anim"), {
            y: 60,
            opacity: 0,
            stagger: 0.06,
            duration: 1,
            ease: "expo.out",
            scrollTrigger: { trigger: panel, start: "top 75%" },
          });
        });
      });
    },
    { scope: root },
  );

  return (
    <section id="featured" ref={root} data-bg="#0b0b0c" data-fg="#f1ede4" className="relative pt-32 md:pt-44">
      <div className="mb-16 px-5 md:mb-24 md:px-10">
        <div className="mb-10 flex items-center gap-4 text-xs uppercase tracking-[0.25em] opacity-60 md:text-sm">
          <span>(03)</span>
          <span className="h-px w-12 bg-current" />
          <span>Big projects</span>
        </div>
        <SplitReveal as="h2" by="chars" className="font-display text-[15vw] font-black uppercase leading-[0.85] tracking-[-0.04em] md:text-[9vw]">
          Featured <span className="font-serif font-normal normal-case italic text-[#d4ff3a]">builds</span>
        </SplitReveal>
      </div>

      <div className="ft-stage relative md:h-[100svh] md:overflow-hidden">
        {featured.map((p, i) => (
          <article
            key={p.id}
            className="ft-panel relative md:absolute md:inset-0"
            style={{ backgroundColor: p.theme.bg, color: p.theme.fg, zIndex: i + 1 }}
          >
            <div className="ft-inner grid h-full origin-top gap-10 px-5 pb-20 pt-16 md:grid-cols-12 md:items-center md:gap-6 md:px-10 md:pb-10 md:pt-24">
              <div className="md:col-span-6 lg:col-span-6">
                <div className="ft-anim flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.2em] opacity-70">
                  <span className="font-mono">
                    {p.id} / 0{featured.length}
                  </span>
                  <span className="h-px w-8 bg-current" />
                  <span>{p.event}</span>
                </div>

                <h3 className="ft-anim mt-4 font-display text-[18vw] font-black uppercase leading-[0.85] tracking-[-0.05em] md:text-[clamp(4rem,8.5vw,9rem)]">
                  {p.title}
                  <span style={{ color: p.theme.accent }}>.</span>
                </h3>
                <p className="ft-anim mt-2 font-serif text-2xl italic md:text-3xl" style={{ color: p.theme.accent }}>
                  {p.tagline}
                </p>
                <p className="ft-anim mt-4 max-w-xl text-base leading-snug opacity-80 md:text-lg">{p.description}</p>

                <ul className="ft-anim mt-5 max-w-xl space-y-1.5 text-sm md:text-[15px]">
                  {p.role.map(r => (
                    <li key={r} className="flex gap-3">
                      <span style={{ color: p.theme.accent }}>✦</span>
                      <span className="opacity-85">{r}</span>
                    </li>
                  ))}
                </ul>

                <div className="ft-anim mt-5 flex flex-wrap gap-2">
                  {p.stack.map(s => (
                    <span key={s} className="rounded-full border border-current/30 px-3 py-1 text-xs">
                      {s}
                    </span>
                  ))}
                </div>

                <div className="ft-anim mt-6 flex flex-wrap items-end gap-x-10 gap-y-4 [@media(max-height:760px)]:hidden">
                  {p.stats.map(s => (
                    <div key={s.label}>
                      <div className="font-display text-3xl font-black tracking-tight md:text-4xl" style={{ color: p.theme.accent }}>
                        {s.value}
                      </div>
                      <div className="text-[11px] uppercase tracking-[0.15em] opacity-60">{s.label}</div>
                    </div>
                  ))}
                </div>

                <div className="ft-anim mt-6 flex flex-wrap gap-3">
                  {p.links.map(l => (
                    <Magnetic key={l.href}>
                      <a
                        href={l.href}
                        target="_blank"
                        rel="noreferrer"
                        className="block rounded-full px-6 py-3 text-sm font-medium uppercase tracking-[0.12em]"
                        style={{ backgroundColor: p.theme.fg, color: p.theme.bg }}
                      >
                        <RollText text={`${l.label} ↗`} />
                      </a>
                    </Magnetic>
                  ))}
                </div>
              </div>

              <div className="ft-visual h-[48svh] md:col-span-6 md:h-[78svh]">
                <FeaturedVisualView type={p.visual} />
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
