import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { profile } from "@/data/portfolio";
import { Scene } from "../Scene";

const CLOUDS = [
  { left: "6%", top: "18%", w: "26vw", h: "8vw", dur: "38s" },
  { left: "58%", top: "10%", w: "20vw", h: "6vw", dur: "46s" },
  { left: "70%", top: "42%", w: "30vw", h: "9vw", dur: "52s" },
  { left: "-6%", top: "56%", w: "22vw", h: "7vw", dur: "44s" },
];

interface Props {
  active: boolean;
  direction: 1 | -1;
  ready: boolean;
}

/** Улаанбаатарын цэнхэр тэнгэр — аялал эндээс эхэлнэ */
export function Launch({ active, direction, ready }: Props) {
  const ground = useRef<SVGSVGElement>(null);
  const clouds = useRef<HTMLDivElement>(null);
  const launched = useRef(false);

  useEffect(() => {
    if (!ready) return;
    // Хөөрөх мөч: газар чичирч, нэр үсэг үсгээрээ гарна
    if (!launched.current) {
      launched.current = true;
      gsap
        .timeline()
        .to(ground.current, { x: "random(-6, 6)", y: "random(-4, 4)", duration: 0.05, repeat: 14, yoyo: true, ease: "none" })
        .to(ground.current, { x: 0, y: 0, duration: 0.1 })
        .from(".ln-char", { yPercent: 110, duration: 1.2, stagger: 0.035, ease: "expo.out" }, 0.1);
      return;
    }
    // Дээш хөөрөхөд газар, үүл доош холдоно; буцаж ирэхэд эргэж гарна
    gsap.to(ground.current, { yPercent: active ? 0 : 115, duration: 1.5, ease: "power2.inOut" });
    gsap.to(clouds.current, { yPercent: active ? 0 : 60, opacity: active ? 1 : 0, duration: 1.5, ease: "power2.inOut" });
  }, [active, ready]);

  return (
    <>
      {/* Газар ба үүл scene-ээс тусдаа: хөөрөхөд харагдсаар доош холдоно */}
      <div className="pointer-events-none fixed inset-0" aria-hidden>
        <div ref={clouds} className="absolute inset-0">
          {CLOUDS.map((c, i) => (
            <div key={i} className="cloud opacity-80" style={{ left: c.left, top: c.top, width: c.w, height: c.h, animationDuration: c.dur }} />
          ))}
        </div>
        <svg ref={ground} className="absolute inset-x-0 bottom-0 h-[34svh] w-full" viewBox="0 0 1440 320" preserveAspectRatio="xMidYMax slice">
          <path d="M0 170 L180 120 L330 150 L520 70 L660 130 L820 95 L1000 140 L1180 85 L1440 150 V320 H0Z" fill="#8db4f2" />
          <path d="M0 220 Q220 170 420 205 T840 190 T1440 200 V320 H0Z" fill="#3a63c4" />
          <path d="M0 262 Q360 228 720 250 T1440 240 V320 H0Z" fill="#1b3a8a" />
          {[
            [210, 248],
            [262, 252],
            [980, 238],
            [1032, 236],
          ].map(([x, y]) => (
            <g key={x} transform={`translate(${x} ${y})`}>
              <path d="M0 18 V8 L16 0 L32 8 V18Z" fill="#eef4ff" />
              <rect x="13" y="10" width="6" height="8" fill="#e8a24a" />
            </g>
          ))}
        </svg>
      </div>

    <Scene id="launch" active={active} direction={direction} ready={ready}>
      <div className="relative z-10 flex h-full flex-col justify-center px-5 pb-[18svh] md:px-10">
        <p className="rv text-ink/85">Ulaanbaatar, 47.92° N, 106.92° E</p>
        <h1 className="rv mt-4 font-display text-[clamp(2.6rem,9.6vw,10rem)] font-extrabold leading-[0.95] tracking-[-0.02em]">
          <span className="sr-only">{profile.name}</span>
          <span aria-hidden>
            {[...profile.name].map((ch, i) => (
              <span key={i} className="inline-block overflow-hidden align-bottom">
                <span className="ln-char inline-block">{ch}</span>
              </span>
            ))}
          </span>
        </h1>
        <p className="rv measure mt-6 text-lg md:text-xl">{profile.intro}</p>
        <p className="rv mt-10 flex items-center gap-3 text-ink/85">
          <span className="relative block h-10 w-px overflow-hidden bg-ink/30" aria-hidden>
            <span className="absolute inset-x-0 top-0 h-1/2 animate-[scroll-cue_1.8s_ease-in-out_infinite] bg-ink" />
          </span>
          Scroll to lift off
        </p>
      </div>
    </Scene>
    </>
  );
}
