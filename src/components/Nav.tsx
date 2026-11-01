import { useRef, useState } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { scrollTo, setScrollLocked } from "@/lib/scroll";
import { formatKm } from "@/lib/distance";
import { profile, stops } from "@/data/portfolio";

export function Nav() {
  const bar = useRef<HTMLElement>(null);
  const menu = useRef<HTMLDivElement>(null);
  const menuTl = useRef<gsap.core.Timeline | null>(null);
  const [open, setOpen] = useState(false);

  // Доош гүйлгэхэд нуугдаж, дээш гүйлгэхэд гарч ирнэ
  useGSAP(() => {
    const show = gsap.quickTo(bar.current, "yPercent", { duration: 0.6, ease: "expo.out" });
    ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: self => show(self.direction === 1 && self.scroll() > 240 ? -110 : 0),
    });
  });

  useGSAP(
    () => {
      menuTl.current = gsap
        .timeline({ paused: true })
        .set(menu.current, { visibility: "visible" })
        .fromTo(menu.current, { opacity: 0 }, { opacity: 1, duration: 0.4 })
        .from(".fp-item", { x: -30, opacity: 0, stagger: 0.04, duration: 0.5, ease: "power3.out" }, "-=0.2");
    },
    { scope: menu },
  );

  const toggle = (next = !open) => {
    setOpen(next);
    setScrollLocked(next);
    if (next) menuTl.current?.play();
    else menuTl.current?.reverse();
  };

  const go = (target: string) => {
    if (open) toggle(false);
    scrollTo(target);
  };

  return (
    <>
      <header ref={bar} className="fixed inset-x-0 top-0 z-[55]">
        <nav className="flex items-center justify-between px-5 py-5 md:px-10">
          <button onClick={() => go("#launch")} className="font-display text-base font-semibold">
            {profile.name}
          </button>
          <div className="flex items-center gap-6">
            <button onClick={() => go("#signal")} className="hidden text-ink/80 transition-colors hover:text-ink md:block">
              Contact
            </button>
            <button
              onClick={() => toggle()}
              className="relative z-[70] rounded-full border border-ink/40 px-5 py-2 text-sm transition-colors hover:border-ink"
              aria-expanded={open}
            >
              {open ? "Close" : "Flight plan"}
            </button>
          </div>
        </nav>
      </header>

      <div ref={menu} className="invisible fixed inset-0 z-[50] overflow-y-auto bg-space/95 px-5 pb-10 pt-28 backdrop-blur md:px-10">
        <p className="fp-item mb-8 text-ink/60">Ten stops from Ulaanbaatar to the edge of the solar system.</p>
        <ol className="max-w-3xl">
          {stops.map(s => (
            <li key={s.id} className="fp-item border-t border-ink/15">
              <button onClick={() => go(`#${s.id}`)} className="group flex w-full items-baseline justify-between gap-6 py-3 text-left">
                <span className="font-display text-2xl font-semibold transition-colors group-hover:text-dawn md:text-4xl">{s.place}</span>
                <span className="shrink-0 text-ink/60">{formatKm(s.km)}</span>
              </button>
            </li>
          ))}
        </ol>
      </div>
    </>
  );
}
