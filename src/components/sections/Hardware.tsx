import { useRef, type RefObject } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { hardware } from "@/data/portfolio";
import { SplitReveal } from "../motion/SplitReveal";
import { Magnetic } from "../motion/Magnetic";
import { RollText } from "../motion/RollText";
import { DeviceFrame } from "../DeviceFrame";

const DRINK_ML = 350;

/** Ухаалаг суурь + аяга: скроллоор ус "уугдаж", OLED дээрх мл өснө */
function Coaster({ mlRef }: { mlRef: RefObject<HTMLSpanElement | null> }) {
  return (
    <div className="hw-device relative mx-auto flex w-full max-w-[420px] flex-col items-center">
      {/* Bluetooth долгион */}
      <div className="absolute -right-2 top-[18%] flex flex-col items-start gap-1 md:right-0" aria-hidden>
        {[0, 1, 2].map(i => (
          <span key={i} className="ble-wave" style={{ animationDelay: `${i * 0.35}s`, width: 18 + i * 14, height: 18 + i * 14 }} />
        ))}
        <span className="mt-2 font-mono text-[10px] uppercase tracking-[0.2em] text-[#5ec8ff]">BLE</span>
      </div>

      {/* Аяга */}
      <div className="relative h-[42vh] max-h-[360px] min-h-[220px] w-[58%] overflow-hidden rounded-b-[38px] rounded-t-md border-[3px] border-[#e8f4ff]/70 bg-white/[0.04] backdrop-blur-sm">
        <div className="hw-water absolute inset-x-0 bottom-0 h-[88%]">
          <svg className="wave wave-back" viewBox="0 0 400 40" preserveAspectRatio="none" aria-hidden>
            <path d="M0 20 Q50 0 100 20 T200 20 T300 20 T400 20 V40 H0Z" />
          </svg>
          <svg className="wave wave-front" viewBox="0 0 400 40" preserveAspectRatio="none" aria-hidden>
            <path d="M0 20 Q50 40 100 20 T200 20 T300 20 T400 20 V40 H0Z" />
          </svg>
          <div className="absolute inset-0 top-[14px] bg-gradient-to-b from-[#3fb4ff] to-[#0a5cff]" />
          {[12, 34, 58, 76].map((left, i) => (
            <span key={left} className="bubble" style={{ left: `${left}%`, animationDelay: `${i * 0.9}s` }} />
          ))}
        </div>
        <div className="pointer-events-none absolute inset-y-0 left-[12%] w-[8%] rounded-full bg-white/15" />
      </div>

      {/* Суурь */}
      <div className="relative -mt-1 w-[86%] rounded-2xl bg-gradient-to-b from-[#1d2733] to-[#0d141c] p-3 shadow-[0_30px_60px_-20px_rgba(0,140,255,0.45)]">
        <div className="flex items-center justify-between gap-3">
          <div className="hw-oled flex flex-1 items-baseline justify-between rounded-md bg-black px-3 py-2 font-mono text-[#7fe0ff]">
            <span className="text-[10px] uppercase opacity-70">Uusan</span>
            <span>
              <span ref={mlRef} className="text-2xl tabular-nums">
                0
              </span>
              <span className="ml-1 text-xs">ml</span>
            </span>
          </div>
          <span className="h-3 w-3 animate-pulse rounded-full bg-[#2ee59d] shadow-[0_0_12px_#2ee59d]" />
        </div>
        <div className="mt-2 flex justify-between px-1 font-mono text-[9px] uppercase tracking-[0.2em] text-white/40">
          <span>ESP32 · HX711</span>
          <span>5 kg cell</span>
        </div>
      </div>
    </div>
  );
}

export function Hardware() {
  const root = useRef<HTMLElement>(null);
  const ml = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const story = { trigger: ".hw-story", start: "top 60%", end: "bottom 70%", scrub: 0.6 } as const;

      // Ус уугдах тусам түвшин буурч, мл тоологдоно
      gsap.fromTo(
        ".hw-water",
        { height: "88%" },
        {
          height: "16%",
          ease: "none",
          scrollTrigger: {
            ...story,
            onUpdate: self => {
              if (ml.current) ml.current.textContent = String(Math.round(self.progress * DRINK_ML));
            },
          },
        },
      );

      gsap.fromTo(".hw-line-fill", { scaleY: 0 }, { scaleY: 1, ease: "none", scrollTrigger: { trigger: ".hw-pipeline", start: "top 70%", end: "bottom 60%", scrub: true } });

      gsap.utils.toArray<HTMLElement>(".hw-node").forEach(node => {
        gsap.fromTo(
          node,
          { opacity: 0.25, x: -20 },
          { opacity: 1, x: 0, duration: 0.6, ease: "expo.out", scrollTrigger: { trigger: node, start: "top 70%", toggleActions: "play none none reverse" } },
        );
      });

      gsap.utils.toArray<HTMLElement>(".hw-task").forEach(task => {
        gsap.from(task, { y: 40, opacity: 0, duration: 0.9, ease: "expo.out", scrollTrigger: { trigger: task, start: "top 88%" } });
      });

      gsap.from(".hw-device", {
        y: 120,
        rotate: -8,
        opacity: 0,
        duration: 1.4,
        ease: "expo.out",
        scrollTrigger: { trigger: root.current, start: "top 60%" },
      });

      gsap.from(".hw-phone", {
        y: 180,
        rotate: 24,
        opacity: 0,
        duration: 1.6,
        delay: 0.2,
        ease: "expo.out",
        scrollTrigger: { trigger: root.current, start: "top 55%" },
      });

      gsap.from(".hw-stat", {
        yPercent: 60,
        opacity: 0,
        stagger: 0.1,
        duration: 1,
        ease: "expo.out",
        scrollTrigger: { trigger: ".hw-stats", start: "top 85%" },
      });
    },
    { scope: root },
  );

  return (
    <section id="pinequest" ref={root} data-bg="#06121f" data-fg="#e8f4ff" className="relative px-5 py-32 md:px-10 md:py-48">
      <div className="mb-12 flex flex-wrap items-center gap-4 text-xs uppercase tracking-[0.25em] opacity-60 md:text-sm">
        <span>(04)</span>
        <span className="h-px w-12 bg-current" />
        <span>{hardware.event}</span>
      </div>

      <div className="mb-20 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <SplitReveal as="h2" by="chars" className="font-display text-[26vw] font-black leading-[1.05] tracking-[-0.05em] md:text-[15vw]">
          {hardware.title}
          <span className="text-[#3fb4ff]">.</span>
        </SplitReveal>
        <div className="max-w-md">
          <div className="font-serif text-3xl italic text-[#3fb4ff] md:text-4xl">{hardware.tagline}</div>
          <p className="mt-3 text-lg leading-snug opacity-75">{hardware.description}</p>
        </div>
      </div>

      <div className="hw-story grid gap-16 md:grid-cols-2 md:gap-10">
        <div className="md:sticky md:top-[14vh] md:h-[72vh] md:self-start">
          <div className="relative flex h-full items-center">
            <Coaster mlRef={ml} />
            <DeviceFrame
              shot={hardware.shot}
              alt="Дусал app screenshot"
              className="hw-phone absolute bottom-0 right-0 w-[34%] max-w-[190px] rotate-6"
            />
          </div>
        </div>

        <div>
          <h3 className="mb-8 text-xs uppercase tracking-[0.25em] opacity-60">How it works</h3>
          <div className="hw-pipeline relative pl-10">
            <div className="absolute bottom-3 left-[11px] top-3 w-px bg-white/15">
              <div className="hw-line-fill h-full w-full origin-top bg-gradient-to-b from-[#3fb4ff] to-[#2ee59d]" />
            </div>
            <ol className="space-y-6">
            {hardware.pipeline.map((p, i) => (
              <li key={p.name} className="hw-node relative">
                <span className="absolute -left-10 top-1 flex h-6 w-6 items-center justify-center rounded-full border border-[#3fb4ff] bg-[#06121f] font-mono text-[10px] text-[#3fb4ff]">
                  {i + 1}
                </span>
                <div className="font-display text-3xl font-black uppercase tracking-tight md:text-5xl">{p.name}</div>
                <div className="font-mono text-sm uppercase tracking-[0.15em] opacity-60">{p.detail}</div>
              </li>
            ))}
            </ol>
          </div>

          <h3 className="mb-6 mt-24 text-xs uppercase tracking-[0.25em] opacity-60">What I built</h3>
          <ul className="border-t border-white/15">
            {hardware.contributions.map((c, i) => (
              <li key={c} className="hw-task flex gap-5 border-b border-white/15 py-5 text-lg leading-snug md:text-xl">
                <span className="font-mono text-sm text-[#3fb4ff]">0{i + 1}</span>
                <span>{c}</span>
              </li>
            ))}
          </ul>

          <div className="hw-stats mt-16 grid grid-cols-3 gap-4 overflow-hidden">
            {hardware.stats.map(s => (
              <div key={s.label} className="hw-stat">
                <div className="font-display text-4xl font-black tracking-tight text-[#3fb4ff] md:text-6xl">{s.value}</div>
                <div className="mt-1 text-xs uppercase tracking-[0.15em] opacity-60">{s.label}</div>
              </div>
            ))}
          </div>

          <div className="mt-14 flex flex-wrap gap-4">
            <Magnetic>
              <a
                href={hardware.repo}
                target="_blank"
                rel="noreferrer"
                className="block rounded-full bg-[#3fb4ff] px-7 py-4 font-medium uppercase tracking-[0.12em] text-[#06121f]"
              >
                <RollText text="View repo ↗" />
              </a>
            </Magnetic>
            <Magnetic>
              <a
                href={hardware.site}
                target="_blank"
                rel="noreferrer"
                className="block rounded-full border border-current px-7 py-4 font-medium uppercase tracking-[0.12em]"
              >
                <RollText text="Live app ↗" />
              </a>
            </Magnetic>
          </div>
        </div>
      </div>
    </section>
  );
}
