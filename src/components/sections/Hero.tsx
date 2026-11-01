import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { scrollTo } from "@/lib/scroll";
import { profile } from "@/data/portfolio";

function Chars({ text }: { text: string }) {
  return (
    <>
      {[...text].map((ch, i) => (
        <span key={i} className="inline-block overflow-hidden pb-[0.06em] -mb-[0.06em] align-bottom">
          <span className="hero-char inline-block will-change-transform">{ch}</span>
        </span>
      ))}
    </>
  );
}

export function Hero({ ready }: { ready: boolean }) {
  const root = useRef<HTMLElement>(null);

  // Хулганыг дагах өнгөт бөмбөлгүүд
  useGSAP(
    (_, contextSafe) => {
      if (!contextSafe) return;
      const blobs = gsap.utils.toArray<HTMLElement>(".hero-blob");
      const movers = blobs.map((b, i) => ({
        x: gsap.quickTo(b, "x", { duration: 1.6 + i * 0.6, ease: "power3" }),
        y: gsap.quickTo(b, "y", { duration: 1.6 + i * 0.6, ease: "power3" }),
        depth: (i + 1) * 40,
      }));
      const onMove = contextSafe((e: PointerEvent) => {
        const nx = e.clientX / window.innerWidth - 0.5;
        const ny = e.clientY / window.innerHeight - 0.5;
        movers.forEach(m => {
          m.x(nx * m.depth * 4);
          m.y(ny * m.depth * 4);
        });
      });
      window.addEventListener("pointermove", onMove);
      return () => window.removeEventListener("pointermove", onMove);
    },
    { scope: root },
  );

  // Intro + scroll parallax
  useGSAP(
    () => {
      if (!ready) return;

      const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
      tl.from(".hero-char", { yPercent: 115, rotate: 10, duration: 1.6, stagger: 0.045 })
        .from(".hero-blob", { scale: 0, opacity: 0, duration: 2.2, stagger: 0.15 }, 0)
        .from(".hero-role", { clipPath: "inset(0 100% 0 0)", duration: 1.4, ease: "expo.inOut" }, 0.5)
        .from(".hero-meta > *", { y: 30, opacity: 0, duration: 1, stagger: 0.08 }, 0.8)
        .from(".hero-badge", { scale: 0, rotate: -180, duration: 1.4 }, 0.9)
        .from(".hero-line", { scaleX: 0, duration: 1.4, ease: "expo.inOut" }, 0.6);

      const st = { trigger: root.current, start: "top top", end: "bottom top", scrub: true } as const;
      gsap.to(".hero-row-1", { xPercent: -18, ease: "none", scrollTrigger: st });
      gsap.to(".hero-row-2", { xPercent: 14, ease: "none", scrollTrigger: st });
      gsap.to(".hero-inner", { scale: 0.86, yPercent: 18, opacity: 0.15, ease: "none", scrollTrigger: st });
      gsap.to(".hero-blobs", { yPercent: 35, rotate: 25, ease: "none", scrollTrigger: st });
      gsap.to(".hero-badge-spin", { rotate: 360, ease: "none", scrollTrigger: { ...st, scrub: 0.5 } });
    },
    { scope: root, dependencies: [ready] },
  );

  return (
    <section
      id="home"
      ref={root}
      data-bg="#0b0b0c"
      data-fg="#f1ede4"
      className="relative flex min-h-[100svh] items-center overflow-hidden"
    >
      <div className="hero-blobs pointer-events-none absolute inset-0" aria-hidden>
        <div className="hero-blob blob blob-a" />
        <div className="hero-blob blob blob-b" />
        <div className="hero-blob blob blob-c" />
      </div>

      <div className="hero-inner relative w-full px-5 pt-24 md:px-10">
        <div className="hero-meta mb-6 flex flex-wrap items-center justify-between gap-3 text-xs uppercase tracking-[0.25em] opacity-70 md:text-sm">
          <span>Portfolio — Edition ’26</span>
          <span className="flex items-center gap-2">
            <span className="h-2 w-2 animate-pulse rounded-full bg-[#d4ff3a]" />
            Available for work
          </span>
        </div>

        <h1 className="font-display font-black uppercase leading-[0.82] tracking-[-0.04em]">
          <span className="hero-row-1 block whitespace-nowrap text-[19vw] md:text-[17vw]">
            <Chars text={profile.heroLines[0]} />
          </span>
          <span className="hero-row-2 block whitespace-nowrap text-right text-[19vw] md:text-[17vw]">
            <span className="hero-role mr-[2vw] inline-block align-top font-serif text-[4.2vw] font-normal normal-case italic leading-none tracking-normal text-[#d4ff3a] md:text-[3vw]">
              ({profile.role})
            </span>
            <Chars text={profile.heroLines[1]} />
          </span>
        </h1>

        <div className="hero-line mt-8 h-px w-full origin-left bg-current opacity-25" />

        <div className="hero-meta mt-6 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <p className="max-w-md text-lg leading-snug opacity-80 md:text-xl">{profile.intro}</p>
          <span className="text-sm uppercase tracking-[0.2em] opacity-60 md:pr-44">
            {profile.age} y/o · {profile.experience} exp · {profile.location}
          </span>
        </div>
      </div>

      <button
        onClick={() => scrollTo("#about")}
        className="hero-badge absolute bottom-8 right-5 h-28 w-28 md:right-10 md:h-36 md:w-36"
        data-cursor="Scroll"
        aria-label="Scroll down"
      >
        <svg viewBox="0 0 100 100" className="hero-badge-spin h-full w-full">
          <g className="badge-rotate">
            <defs>
              <path id="badge-circle" d="M50,50 m-38,0 a38,38 0 1,1 76,0 a38,38 0 1,1 -76,0" />
            </defs>
            <text className="fill-current text-[9.5px] uppercase tracking-[0.3em]">
              <textPath href="#badge-circle">scroll down • scroll down • scroll down •</textPath>
            </text>
          </g>
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-2xl text-[#d4ff3a]">↓</span>
      </button>
    </section>
  );
}
