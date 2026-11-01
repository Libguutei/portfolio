import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { skills } from "@/data/portfolio";

function Star() {
  return (
    <svg viewBox="0 0 24 24" className="mx-[0.35em] inline-block h-[0.6em] w-[0.6em] align-middle" aria-hidden>
      <path d="M12 0c.6 6.6 5.4 11.4 12 12-6.6.6-11.4 5.4-12 12-.6-6.6-5.4-11.4-12-12C6.6 11.4 11.4 6.6 12 0z" fill="currentColor" />
    </svg>
  );
}

function Row({ items, outline }: { items: string[]; outline?: boolean }) {
  // Хоёр хувилж давхарлаад -50% хүртэл гүйлгэхэд тасралтгүй давтагдана
  const doubled = [...items, ...items];
  return (
    <div className="marquee-track flex w-max whitespace-nowrap will-change-transform">
      {doubled.map((s, i) => (
        <span key={i} className={`flex items-center ${outline ? "text-outline" : ""}`}>
          {s}
          <Star />
        </span>
      ))}
    </div>
  );
}

/** Скроллын хурдаар хурдасдаг, чиглэлээ сольдог, хазайдаг marquee */
export function Marquee() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const tracks = gsap.utils.toArray<HTMLElement>(".marquee-track");
      const tweens = tracks.map((t, i) => {
        const tw =
          i % 2 === 0
            ? gsap.to(t, { xPercent: -50, duration: 28, ease: "none", repeat: -1 })
            : gsap.fromTo(t, { xPercent: -50 }, { xPercent: 0, duration: 28, ease: "none", repeat: -1 });
        // Ухрааж тоглуулахад эхэн дээрээ гацахгүйн тулд дунд нь эхлүүлнэ
        tw.totalTime(tw.duration() * 50);
        return tw;
      });

      const skew = gsap.quickTo(".marquee-band", "skewX", { duration: 0.6, ease: "power3" });
      let direction = 1;

      ScrollTrigger.create({
        trigger: root.current,
        start: "top bottom",
        end: "bottom top",
        onUpdate: self => {
          const v = self.getVelocity();
          if (self.direction !== direction) direction = self.direction;
          const boost = 1 + Math.min(Math.abs(v) / 250, 6);
          tweens.forEach(tw => {
            gsap.killTweensOf(tw, "timeScale");
            tw.timeScale(boost * direction);
            gsap.to(tw, { timeScale: direction, duration: 1.2, ease: "power2.out" });
          });
          skew(gsap.utils.clamp(-12, 12, v / -150));
        },
        onLeave: () => skew(0),
        onLeaveBack: () => skew(0),
      });
    },
    { scope: root },
  );

  return (
    <div ref={root} data-bg="#f1ede4" data-fg="#0b0b0c" className="relative z-10 -my-[4vw] overflow-hidden py-[6vw]">
      <div className="marquee-band -rotate-3 scale-110 bg-[#d4ff3a] py-4 font-display text-[9vw] font-black uppercase leading-none tracking-tight text-[#0b0b0c] md:py-6 md:text-[6vw]">
        <Row items={skills.slice(0, 6)} />
      </div>
      <div className="marquee-band mt-2 rotate-2 scale-110 bg-[#0b0b0c] py-4 font-display text-[9vw] font-black uppercase leading-none tracking-tight text-[#f1ede4] md:py-6 md:text-[6vw]">
        <Row items={skills.slice(6)} outline />
      </div>
    </div>
  );
}
