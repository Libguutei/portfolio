import { useRef, useState } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { scrollTo, setScrollLocked } from "@/lib/scroll";
import { navLinks, profile, socials } from "@/data/portfolio";
import { Magnetic } from "./motion/Magnetic";
import { RollText } from "./motion/RollText";

export function Nav() {
  const bar = useRef<HTMLElement>(null);
  const menu = useRef<HTMLDivElement>(null);
  const menuTl = useRef<gsap.core.Timeline | null>(null);
  const [open, setOpen] = useState(false);

  // Доош скролл хийхэд нуугдаж, дээш гүйлгэхэд гарч ирнэ + progress bar
  useGSAP(() => {
    const show = gsap.quickTo(bar.current, "yPercent", { duration: 0.6, ease: "expo.out" });
    ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: self => show(self.direction === 1 && self.scroll() > 240 ? -110 : 0),
    });
    gsap.to(".nav-progress", {
      scaleX: 1,
      ease: "none",
      scrollTrigger: { start: 0, end: "max", scrub: 0.3 },
    });
  });

  // Fullscreen menu: дугуй clip-path-аар тэлж нээгдэнэ
  useGSAP(
    () => {
      menuTl.current = gsap
        .timeline({ paused: true })
        .set(menu.current, { visibility: "visible" })
        .fromTo(
          menu.current,
          { clipPath: "circle(0% at calc(100% - 3rem) 2.5rem)" },
          { clipPath: "circle(150% at calc(100% - 3rem) 2.5rem)", duration: 1, ease: "expo.inOut" },
        )
        .from(".menu-link-inner", { yPercent: 120, rotate: 6, duration: 0.9, stagger: 0.06, ease: "expo.out" }, "-=0.45")
        .from(".menu-foot > *", { y: 20, opacity: 0, stagger: 0.05, duration: 0.6 }, "-=0.7");
    },
    { scope: menu },
  );

  const toggle = (next = !open) => {
    setOpen(next);
    setScrollLocked(next);
    if (next) menuTl.current?.timeScale(1).play();
    else menuTl.current?.timeScale(1.6).reverse();
  };

  const go = (target: string) => {
    if (open) toggle(false);
    scrollTo(target);
  };

  return (
    <>
      <div className="fixed left-0 right-0 top-0 z-[60] h-[3px] pointer-events-none">
        <div className="nav-progress h-full origin-left scale-x-0 bg-[#d4ff3a]" />
      </div>

      <header ref={bar} className="fixed inset-x-0 top-0 z-[55] mix-blend-difference text-[#f1ede4]">
        <nav className="flex items-center justify-between px-5 py-5 md:px-10">
          <button onClick={() => go("#home")} className="font-display font-black text-xl tracking-tight">
            <RollText text={`${profile.heroLines[0][0]}.${profile.heroLines[1][0]}®`.toUpperCase()} />
          </button>

          <ul className="hidden md:flex gap-8 text-sm uppercase tracking-[0.18em]">
            {navLinks.slice(1).map(l => (
              <li key={l.target}>
                <button onClick={() => go(l.target)}>
                  <RollText text={l.label} />
                </button>
              </li>
            ))}
          </ul>

          <Magnetic>
            <button
              onClick={() => toggle()}
              className="relative z-[70] flex h-12 w-12 flex-col items-center justify-center gap-1.5 rounded-full border border-current"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
            >
              <span className={`h-px w-5 bg-current transition-transform duration-500 ${open ? "translate-y-[3.5px] rotate-45" : ""}`} />
              <span className={`h-px w-5 bg-current transition-transform duration-500 ${open ? "-translate-y-[3.5px] -rotate-45" : ""}`} />
            </button>
          </Magnetic>
        </nav>
      </header>

      <div
        ref={menu}
        className="invisible fixed inset-0 z-[50] flex flex-col justify-between bg-[#d4ff3a] px-5 pb-8 pt-28 text-[#0b0b0c] md:px-10"
      >
        <ul className="space-y-1">
          {navLinks.map((l, i) => (
            <li key={l.target} className="overflow-hidden">
              <button
                onClick={() => go(l.target)}
                className="menu-link-inner group flex items-baseline gap-4 font-display font-black uppercase leading-[0.95] tracking-tight text-[11vw] md:text-[6vw]"
              >
                <span className="font-sans text-sm font-medium tracking-normal opacity-50">0{i + 1}</span>
                <RollText text={l.label} />
              </button>
            </li>
          ))}
        </ul>
        <div className="menu-foot flex flex-wrap items-end justify-between gap-4 text-sm uppercase tracking-[0.15em]">
          <span>{profile.location}</span>
          <div className="flex gap-6">
            {socials.map(s => (
              <a key={s.label} href={s.href} target="_blank" rel="noreferrer">
                <RollText text={s.label} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
