import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { profile } from "@/data/portfolio";
import { StopLabel } from "../StopLabel";

const BANK = [
  { left: "-10%", top: "70%", w: "60vw", h: "18vw", depth: 1.4 },
  { left: "40%", top: "78%", w: "70vw", h: "20vw", depth: 1.8 },
  { left: "10%", top: "88%", w: "80vw", h: "22vw", depth: 2.2 },
  { left: "65%", top: "20%", w: "30vw", h: "9vw", depth: 0.8 },
  { left: "-5%", top: "8%", w: "24vw", h: "7vw", depth: 1 },
];

/** 10 км: үүлсийн дээгүүр. Үүлс доороо өнгөрөх тусам бид дээшилнэ */
export function About() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.utils.toArray<HTMLElement>(".ab-cloud").forEach(c => {
        const depth = Number(c.dataset.depth ?? 1);
        gsap.fromTo(
          c,
          { yPercent: 60 * depth },
          { yPercent: -160 * depth, ease: "none", scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true } },
        );
      });
    },
    { scope: root },
  );

  const facts = [
    { label: "Age", value: `${profile.age}` },
    { label: "Experience", value: profile.experience },
    { label: "Role", value: profile.role },
    { label: "Based in", value: profile.location },
  ];

  return (
    <section id="about" ref={root} className="relative min-h-[130svh] px-5 py-40 md:px-10">
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        {BANK.map((c, i) => (
          <div
            key={i}
            data-depth={c.depth}
            className="ab-cloud cloud"
            style={{ left: c.left, top: c.top, width: c.w, height: c.h, animationDuration: `${50 + i * 7}s` }}
          />
        ))}
      </div>

      <div className="relative grid gap-12 md:grid-cols-12">
        <div className="md:col-span-7">
          <StopLabel id="about" />
          <h2 className="mt-10 font-display text-[clamp(2.2rem,5.5vw,5rem)] font-semibold leading-[1.02]">
            Hi, I'm {profile.name}.
          </h2>
          <p className="measure mt-8 text-lg md:text-xl">{profile.about}</p>
        </div>
        <dl className="grid grid-cols-2 gap-x-8 gap-y-8 self-end md:col-span-4 md:col-start-9">
          {facts.map(f => (
            <div key={f.label} className="border-t border-ink/30 pt-3">
              <dt className="text-sm text-ink/70">{f.label}</dt>
              <dd className="mt-1 font-display text-lg font-semibold">{f.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
