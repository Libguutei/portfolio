import { useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

const STEPS = ["3", "2", "1", "Хөөрлөө"];

/** Хуудас нээгдэх ганц мөч: 3, 2, 1, хөөрөлт — дараа нь hero гарч ирнэ */
export function Countdown({ onLiftoff }: { onLiftoff: () => void }) {
  const root = useRef<HTMLDivElement>(null);
  const [done, setDone] = useState(false);

  useGSAP(
    () => {
      const tl = gsap.timeline({ onComplete: () => setDone(true) });
      gsap.utils.toArray<HTMLElement>(".cd-step").forEach((step, i) => {
        tl.fromTo(step, { opacity: 0, scale: 1.4 }, { opacity: 1, scale: 1, duration: 0.35, ease: "power3.out" }, i * 0.55).to(
          step,
          { opacity: 0, scale: 0.8, duration: 0.25, ease: "power2.in" },
          i * 0.55 + 0.4,
        );
      });
      tl.call(onLiftoff, [], "-=0.2").to(root.current, { opacity: 0, duration: 0.5 }, "<");
    },
    { scope: root },
  );

  if (done) return null;

  return (
    <div ref={root} className="fixed inset-0 z-[100] grid place-items-center bg-[#2f6cf6]/40 backdrop-blur-sm" aria-hidden>
      {STEPS.map(s => (
        <span key={s} className="cd-step col-start-1 row-start-1 font-display text-[22vw] font-extrabold opacity-0 md:text-[14vw]">
          {s === "Хөөрлөө" ? <span className="text-[9vw] md:text-[6vw]">{s}</span> : s}
        </span>
      ))}
    </div>
  );
}
