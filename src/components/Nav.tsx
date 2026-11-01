import { useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { goTo } from "@/lib/journey";
import { formatKm } from "@/lib/distance";
import { profile, stops } from "@/data/portfolio";

export function Nav({ current }: { current: number }) {
  const menu = useRef<HTMLDivElement>(null);
  const menuTl = useRef<gsap.core.Timeline | null>(null);
  const [open, setOpen] = useState(false);

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
    if (next) menuTl.current?.play();
    else menuTl.current?.reverse();
  };

  const go = (index: number) => {
    if (open) toggle(false);
    goTo(index);
  };

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-[55]">
        <nav className="flex items-center justify-between px-5 py-5 md:px-10">
          <button onClick={() => go(0)} className="font-display text-base font-semibold">
            {profile.name}
          </button>
          <div className="flex items-center gap-6">
            <button onClick={() => go(stops.length - 1)} className="hidden text-ink/80 transition-colors hover:text-ink md:block">
              Холбоо барих
            </button>
            <button
              onClick={() => toggle()}
              className="relative z-[70] rounded-full border border-ink/40 bg-space/20 px-5 py-2 text-sm backdrop-blur transition-colors hover:border-ink"
              aria-expanded={open}
            >
              {open ? "Хаах" : "Нислэгийн төлөвлөгөө"}
            </button>
          </div>
        </nav>
      </header>

      <div ref={menu} className="invisible fixed inset-0 z-[50] overflow-y-auto bg-space/95 px-5 pb-10 pt-28 backdrop-blur md:px-10" data-scroll>
        <p className="fp-item mb-8 text-ink/60">Үүлсийн дээрээс нарны аймгийн зах хүртэл, тэгээд Нар руу.</p>
        <ol className="max-w-3xl">
          {stops.map((s, i) => (
            <li key={s.id} className="fp-item border-t border-ink/15">
              <button onClick={() => go(i)} className="group flex w-full items-baseline justify-between gap-6 py-3 text-left">
                <span className={`font-display text-2xl font-semibold transition-colors group-hover:text-dawn md:text-4xl ${i === current ? "text-dawn" : ""}`}>
                  {s.place}
                </span>
                <span className="shrink-0 text-ink/60">{formatKm(s.km)}</span>
              </button>
            </li>
          ))}
        </ol>
      </div>
    </>
  );
}
