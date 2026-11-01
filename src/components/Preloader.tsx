import { useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

const WORDS = ["Hello", "Сайн уу", "Design", "Code", "Motion", "Welcome"];
const PANELS = 5;

interface PreloaderProps {
  /** Хөшиг нээгдэж эхлэх мөчид дуудагдана — hero intro эхлэнэ */
  onReveal: () => void;
}

export function Preloader({ onReveal }: PreloaderProps) {
  const root = useRef<HTMLDivElement>(null);
  const num = useRef<HTMLSpanElement>(null);
  const [done, setDone] = useState(false);

  useGSAP(
    () => {
      const counter = { v: 0 };
      const load = 2.6;
      const tl = gsap.timeline({ onComplete: () => setDone(true) });

      tl.from(".pl-content > *", { y: 40, opacity: 0, duration: 0.8, stagger: 0.08, ease: "expo.out" })
        .to(
          counter,
          {
            v: 100,
            duration: load,
            ease: "power3.inOut",
            onUpdate: () => {
              if (num.current) num.current.textContent = String(Math.round(counter.v)).padStart(3, "0");
            },
          },
          0,
        )
        .to(".pl-bar", { scaleX: 1, duration: load, ease: "power3.inOut" }, 0);

      // Үгнүүд нэг нэгээр дээшээ гүйнэ
      const step = load / WORDS.length;
      WORDS.forEach((_, i) => {
        if (i === 0) return;
        tl.to(".pl-words", { yPercent: (-100 / WORDS.length) * i, duration: 0.5, ease: "expo.inOut" }, i * step);
      });

      tl.addLabel("exit")
        .to(".pl-content", { yPercent: -60, opacity: 0, duration: 0.7, ease: "expo.in" }, "exit")
        .call(onReveal, [], "exit+=0.55")
        .to(
          ".pl-panel",
          {
            yPercent: -100,
            duration: 1.1,
            ease: "expo.inOut",
            stagger: { each: 0.07, from: "center" },
          },
          "exit+=0.35",
        );
    },
    { scope: root },
  );

  if (done) return null;

  return (
    <div ref={root} className="fixed inset-0 z-[100] pointer-events-auto" aria-hidden>
      <div className="absolute inset-0 flex">
        {Array.from({ length: PANELS }, (_, i) => (
          <div key={i} className="pl-panel h-full flex-1 bg-[#0b0b0c] -mx-px" />
        ))}
      </div>

      <div className="pl-content absolute inset-0 flex flex-col justify-between p-6 md:p-10 text-[#f1ede4]">
        <div className="flex justify-between text-xs uppercase tracking-[0.25em] opacity-60">
          <span>Portfolio</span>
          <span>Edition ’26</span>
        </div>

        <div className="h-[1.1em] overflow-hidden text-5xl md:text-8xl font-display font-black leading-[1.1] tracking-tight">
          <div className="pl-words">
            {WORDS.map(w => (
              <div key={w} className="h-[1.1em]">
                {w}
                <span className="text-[#d4ff3a]">.</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-end justify-between">
            <span className="font-serif italic text-xl md:text-2xl opacity-70">loading experience</span>
            <span ref={num} className="font-display font-black text-6xl md:text-[9rem] leading-none tabular-nums">
              000
            </span>
          </div>
          <div className="mt-4 h-px w-full bg-white/15">
            <div className="pl-bar h-full w-full origin-left scale-x-0 bg-[#d4ff3a]" />
          </div>
        </div>
      </div>
    </div>
  );
}
