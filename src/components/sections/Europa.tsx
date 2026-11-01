import { useRef, type RefObject } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { dusal } from "@/data/portfolio";
import { StopLabel } from "../StopLabel";
import { DeviceFrame } from "../DeviceFrame";
import { Magnetic } from "../motion/Magnetic";
import { joinList } from "./Mission";

const DRINK_ML = 350;

/** Ухаалаг суурь + аяга: scroll-оор ус "уугдаж", OLED дээрх мл өснө */
function Coaster({ mlRef }: { mlRef: RefObject<HTMLSpanElement | null> }) {
  return (
    <div className="relative mx-auto flex w-full max-w-[360px] flex-col items-center">
      <div className="relative h-[34vh] max-h-[300px] min-h-[200px] w-[58%] overflow-hidden rounded-b-[38px] rounded-t-md border-[3px] border-ink/70 bg-white/[0.06] backdrop-blur-sm">
        <div className="eu-water absolute inset-x-0 bottom-0 h-[88%]">
          <svg className="wave wave-back" viewBox="0 0 400 40" preserveAspectRatio="none" aria-hidden>
            <path d="M0 20 Q50 0 100 20 T200 20 T300 20 T400 20 V40 H0Z" />
          </svg>
          <svg className="wave wave-front" viewBox="0 0 400 40" preserveAspectRatio="none" aria-hidden>
            <path d="M0 20 Q50 40 100 20 T200 20 T300 20 T400 20 V40 H0Z" />
          </svg>
          <div className="absolute inset-0 top-[14px] bg-gradient-to-b from-[#5fb6ff] to-[#1f6bff]" />
          {[14, 40, 66].map((left, i) => (
            <span key={left} className="bubble" style={{ left: `${left}%`, animationDelay: `${i * 1.1}s` }} />
          ))}
        </div>
      </div>
      <div className="relative -mt-1 w-[86%] rounded-2xl bg-gradient-to-b from-[#1d2733] to-[#0d141c] p-3 shadow-[0_30px_60px_-20px_rgba(80,170,255,0.45)]">
        <div className="flex items-baseline justify-between rounded-md bg-black px-3 py-2 text-[#8fd3ff]">
          <span className="text-xs">Уусан</span>
          <span>
            <span ref={mlRef} className="font-display text-2xl">
              0
            </span>
            <span className="ml-1 text-xs">мл</span>
          </span>
        </div>
      </div>
    </div>
  );
}

/** Европа: мөсөн доороо далайтай дагуул. Дусал — аяганы доор load cell-тэй суурь */
export function Europa() {
  const root = useRef<HTMLElement>(null);
  const ml = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      gsap.fromTo(
        ".eu-water",
        { height: "88%" },
        {
          height: "16%",
          ease: "none",
          scrollTrigger: {
            trigger: ".eu-story",
            start: "top 60%",
            end: "bottom 70%",
            scrub: 0.6,
            onUpdate: self => {
              if (ml.current) ml.current.textContent = String(Math.round(self.progress * DRINK_ML));
            },
          },
        },
      );
      gsap.fromTo(
        ".eu-line",
        { scaleY: 0 },
        { scaleY: 1, ease: "none", scrollTrigger: { trigger: ".eu-pipeline", start: "top 70%", end: "bottom 60%", scrub: true } },
      );
    },
    { scope: root },
  );

  return (
    <section id="europa" ref={root} className="relative overflow-hidden px-5 py-32 md:px-10 md:py-44">
      <div className="relative grid gap-12 md:grid-cols-12">
        <div className="md:col-span-7">
          <StopLabel id="europa" />
          <p className="mt-10 text-ink/60">{dusal.event}</p>
          <h2 className="mt-2 font-display text-[clamp(2.75rem,7vw,6.5rem)] font-extrabold leading-[1.05]">{dusal.title}</h2>
          <p className="mt-4 font-display text-xl md:text-2xl" style={{ color: dusal.accent }}>
            {dusal.tagline}
          </p>
          <p className="measure mt-6 text-ink/80">{dusal.description}</p>
        </div>
        {/* Европа ба ард нь Бархасбадь — 3D (three/Space.ts) */}
        <div data-body="europa" className="h-[40svh] md:col-span-5 md:h-auto" aria-hidden />
      </div>

      <div className="eu-story relative mt-24 grid gap-16 md:grid-cols-12">
        <div className="md:sticky md:top-[16vh] md:col-span-5 md:h-[68vh] md:self-start">
          <div className="relative flex h-full items-center">
            <Coaster mlRef={ml} />
            <DeviceFrame shot={dusal.shot} alt="Дусал app screenshot" className="absolute bottom-0 right-0 w-[36%] max-w-[170px] rotate-6" />
          </div>
        </div>

        <div className="md:col-span-6 md:col-start-7">
          <h3 className="font-display text-sm font-semibold text-ink/60">How a sip travels</h3>
          <div className="eu-pipeline relative mt-6 pl-8">
            <span className="absolute bottom-3 left-[3px] top-3 w-px bg-ink/15" aria-hidden>
              <span className="eu-line block h-full w-full origin-top bg-[#8fd3ff]" />
            </span>
            <ol className="space-y-6">
              {dusal.pipeline.map(p => (
                <li key={p.name} className="relative">
                  <span className="absolute -left-8 top-3 h-[7px] w-[7px] rounded-full bg-[#8fd3ff]" aria-hidden />
                  <span className="font-display text-2xl font-semibold md:text-3xl">{p.name}</span>
                  <span className="ml-3 text-ink/60">{p.detail}</span>
                </li>
              ))}
            </ol>
          </div>

          <h3 className="mt-16 font-display text-sm font-semibold text-ink/60">What I built</h3>
          <ul className="measure mt-3 space-y-2">
            {dusal.role.map(r => (
              <li key={r} className="flex gap-3">
                <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#8fd3ff]" aria-hidden />
                <span>{r}</span>
              </li>
            ))}
          </ul>
          <p className="measure mt-6 text-ink/60">Built with {joinList(dusal.stack)}.</p>

          <dl className="mt-10 flex flex-wrap gap-x-12 gap-y-6">
            {dusal.facts.map(f => (
              <div key={f.label}>
                <dt className="sr-only">{f.label}</dt>
                <dd className="font-display text-3xl font-semibold md:text-4xl">{f.value}</dd>
                <dd className="text-sm text-ink/60">{f.label}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-10 flex flex-wrap gap-3">
            {dusal.links.map((l, i) => (
              <Magnetic key={l.href} strength={0.25}>
                <a
                  href={l.href}
                  target="_blank"
                  rel="noreferrer"
                  className={
                    i === 0
                      ? "block rounded-full bg-dawn px-6 py-3 font-medium text-space transition-transform hover:scale-[1.03]"
                      : "block rounded-full border border-ink/40 px-6 py-3 transition-colors hover:border-ink"
                  }
                >
                  {l.label}
                </a>
              </Magnetic>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
