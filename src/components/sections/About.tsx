import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { profile } from "@/data/portfolio";
import { Scene } from "../Scene";
import { StopLabel } from "../StopLabel";

const BANK = [
  { left: "-10%", top: "62%", w: "60vw", h: "18vw" },
  { left: "40%", top: "72%", w: "70vw", h: "20vw" },
  { left: "10%", top: "84%", w: "80vw", h: "22vw" },
  { left: "65%", top: "14%", w: "30vw", h: "9vw" },
];

interface Props {
  active: boolean;
  direction: 1 | -1;
  ready: boolean;
}

/** 10 км: үүлсийг нэвтлэн гарах мөч */
export function About({ active, direction, ready }: Props) {
  const bank = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ready || !bank.current) return;
    if (active) {
      // Үүлс доороос гарч ирээд хажуугаар өнгөрнө
      gsap.fromTo(bank.current, { yPercent: 90 * direction, opacity: 1 }, { yPercent: 0, duration: 2, ease: "power2.out" });
    } else {
      gsap.to(bank.current, { yPercent: -110 * direction, opacity: 0, duration: 1.6, ease: "power2.in" });
    }
  }, [active, direction, ready]);

  const facts = [
    { label: "Age", value: `${profile.age}` },
    { label: "Experience", value: profile.experience },
    { label: "Based in", value: "Ulaanbaatar" },
  ];

  return (
    <>
      <div ref={bank} className="pointer-events-none fixed inset-0 opacity-0" aria-hidden>
        {BANK.map((c, i) => (
          <div key={i} className="cloud" style={{ left: c.left, top: c.top, width: c.w, height: c.h, animationDuration: `${50 + i * 7}s` }} />
        ))}
      </div>
      <Scene id="about" active={active} direction={direction} ready={ready}>
        <div className="relative flex h-full flex-col justify-center px-5 md:px-10">
          <StopLabel id="about" className="rv" />
          <h2 className="rv mt-8 font-display text-[clamp(2.4rem,6vw,5.5rem)] font-semibold leading-[1.02]">Hi, I'm {profile.name}.</h2>
          <p className="rv measure mt-6 text-lg md:text-2xl">{profile.about}</p>
          <dl className="rv mt-12 flex flex-wrap gap-x-14 gap-y-6">
            {facts.map(f => (
              <div key={f.label}>
                <dt className="text-sm text-ink/70">{f.label}</dt>
                <dd className="font-display text-2xl font-semibold">{f.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </Scene>
    </>
  );
}
