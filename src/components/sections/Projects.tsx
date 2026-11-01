import { useRef, type CSSProperties, type PointerEvent } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { projects, type Project } from "@/data/portfolio";
import { SplitReveal } from "../motion/SplitReveal";

function ProjectCard({ project }: { project: Project }) {
  const card = useRef<HTMLAnchorElement>(null);
  const [c1, c2, c3] = project.palette;

  // 3D tilt + гэрлийн тусгал хулганыг дагана
  const onMove = (e: PointerEvent<HTMLAnchorElement>) => {
    const el = card.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    gsap.to(el, { rotateY: (px - 0.5) * 12, rotateX: (0.5 - py) * 12, duration: 0.6, ease: "power3.out" });
    el.style.setProperty("--mx", `${px * 100}%`);
    el.style.setProperty("--my", `${py * 100}%`);
  };
  const onLeave = () => {
    if (card.current) gsap.to(card.current, { rotateX: 0, rotateY: 0, duration: 1, ease: "elastic.out(1, 0.4)" });
  };

  return (
    <div className="pj-card shrink-0 [perspective:1200px]">
      <a
        ref={card}
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        href={project.link}
        target="_blank"
        rel="noreferrer"
        data-cursor="GitHub"
        className="pj-tilt group relative flex h-[68svh] w-[82vw] flex-col overflow-hidden rounded-[28px] md:w-[46vw] lg:w-[38vw]"
        style={{ "--c1": c1, "--c2": c2, "--c3": c3 } as CSSProperties}
      >
        <div className="pj-media relative flex-1 overflow-hidden">
          <div className="pj-media-inner absolute -inset-x-[20%] inset-y-0">
            {project.image ? (
              <img src={project.image} alt={`${project.title} screenshot`} loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
            ) : (
              <>
                <div className="pj-art absolute inset-0" />
                <div className="pj-orb pj-orb-1" />
                <div className="pj-orb pj-orb-2" />
                <div className="pj-rings" />
              </>
            )}
          </div>
          <span className="pj-num absolute -bottom-[0.18em] left-4 font-display text-[30vw] font-black leading-none md:text-[14vw]">
            {project.id}
          </span>
          <div className="pj-shine pointer-events-none absolute inset-0" />
        </div>

        <div className="relative bg-[#141416] p-6 text-[#f1ede4] md:p-8">
          <div className="flex items-center justify-between text-xs uppercase tracking-[0.2em] opacity-60">
            <span>{project.category}</span>
            <span>{project.year}</span>
          </div>
          <h3 className="pj-title mt-3 font-display text-4xl font-black uppercase tracking-tight md:text-5xl">
            {project.title}
            <span className="ml-2 inline-block transition-transform duration-500 group-hover:-rotate-45" style={{ color: c1 }}>
              →
            </span>
          </h3>
          <p className="mt-3 max-w-md text-sm leading-relaxed opacity-70 md:text-base">{project.description}</p>
          <div className="mt-5 flex flex-wrap gap-2">
            {project.tags.map(t => (
              <span key={t} className="rounded-full border border-white/20 px-3 py-1 text-xs">
                {t}
              </span>
            ))}
          </div>
        </div>
      </a>
    </div>
  );
}

/** Pin хийгдээд хэвтээ чиглэлд гүйдэг ажлын хэсэг */
export function Projects() {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = track.current;
      if (!el) return;
      const distance = () => el.scrollWidth - window.innerWidth;

      const scroll = gsap.to(el, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });

      gsap.to(".pj-progress", {
        scaleX: 1,
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top top", end: () => `+=${distance()}`, scrub: true },
      });

      gsap.utils.toArray<HTMLElement>(".pj-card").forEach(card => {
        const inner = card.querySelector(".pj-media-inner");
        const num = card.querySelector(".pj-num");
        const tilt = card.querySelector(".pj-tilt");
        const base = { trigger: card, containerAnimation: scroll, scrub: true } as const;

        gsap.fromTo(inner, { xPercent: -10 }, { xPercent: 10, ease: "none", scrollTrigger: { ...base, start: "left right", end: "right left" } });
        gsap.fromTo(num, { yPercent: 60 }, { yPercent: 0, ease: "none", scrollTrigger: { ...base, start: "left right", end: "center center" } });
        gsap.fromTo(
          tilt,
          { scale: 0.82, rotateZ: 4 },
          { scale: 1, rotateZ: 0, ease: "none", scrollTrigger: { ...base, start: "left right", end: "left 40%" } },
        );
      });
    },
    { scope: root },
  );

  return (
    <section id="work" ref={root} data-bg="#0b0b0c" data-fg="#f1ede4" className="relative h-[100svh] overflow-hidden">
      <div className="absolute inset-x-5 top-6 z-10 flex items-center justify-between text-xs uppercase tracking-[0.25em] opacity-60 md:inset-x-10 md:top-24 md:text-sm">
        <span>(05) More work</span>
        <div className="h-px w-40 bg-white/15 md:w-64">
          <div className="pj-progress h-full origin-left scale-x-0 bg-[#d4ff3a]" />
        </div>
      </div>

      <div ref={track} className="flex h-full items-center gap-[4vw] pl-5 pr-[10vw] md:pl-10">
        <div className="flex w-[82vw] shrink-0 flex-col justify-center md:w-[44vw]">
          <SplitReveal as="h2" by="chars" className="font-display text-[13vw] font-black uppercase leading-[0.85] tracking-[-0.04em] md:text-[6.8vw]">
            Selected
            <br />
            <span className="font-serif font-normal normal-case italic text-[#d4ff3a]">works</span>
          </SplitReveal>
          <p className="mt-8 max-w-sm text-lg opacity-70">
            Real projects from my GitHub — built end-to-end with TypeScript. Keep scrolling →
          </p>
        </div>

        {projects.map(p => (
          <ProjectCard key={p.id} project={p} />
        ))}

        <div className="flex w-[70vw] shrink-0 items-center justify-center md:w-[30vw]">
          <p className="font-serif text-5xl italic leading-tight opacity-80 md:text-6xl">
            More coming
            <br />
            soon<span className="text-[#d4ff3a]">…</span>
          </p>
        </div>
      </div>
    </section>
  );
}
