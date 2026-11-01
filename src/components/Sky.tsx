import { useEffect, useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

interface Star {
  x: number;
  y: number;
  r: number;
  phase: number;
  layer: number;
}

const LAYER_SPEED = [0.04, 0.09, 0.16];

/**
 * Хуудасны ард тогтмол байх тэнгэр: өдрийн цэнхэрээс сансрын хар руу шилжинэ,
 * одод canvas дээр анивчиж, scroll-оор давхаргаараа өөр өөр хурдтай гүйнэ.
 */
export function Sky() {
  const canvas = useRef<HTMLCanvasElement>(null);

  // Тэнгэрийн өнгө: хөөрөхөөс тойрог зам хүртэл аажмаар харанхуйлна
  useGSAP(() => {
    const root = document.documentElement;
    gsap
      .timeline({
        scrollTrigger: { trigger: "#launch", start: "top top", endTrigger: "#orbit", end: "top 40%", scrub: true },
      })
      .to(root, { "--sky-top": "#1747c9", "--sky-bottom": "#7fb6ff", "--sun": 0.7, ease: "none" })
      .to(root, { "--sky-top": "#06103a", "--sky-bottom": "#1d3f9e", "--stars": 0.55, "--sun": 0.3, ease: "none" })
      .to(root, { "--sky-top": "#04050d", "--sky-bottom": "#070a1c", "--stars": 1, "--sun": 0, ease: "none" });
  });

  useEffect(() => {
    const el = canvas.current;
    const ctx = el?.getContext("2d");
    if (!el || !ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const stars: Star[] = Array.from({ length: 420 }, () => {
      const layer = Math.floor(Math.random() * 3);
      return { x: Math.random(), y: Math.random(), r: 0.4 + layer * 0.45 + Math.random() * 0.5, phase: Math.random() * 6.28, layer };
    });

    let w = 0;
    let h = 0;
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      el.width = w * dpr;
      el.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    let frame = 0;
    const draw = (t: number) => {
      ctx.clearRect(0, 0, w, h);
      const sy = window.scrollY;
      for (const s of stars) {
        // Дээшээ нисэх тусам одод доошоо урсана
        const y = (((s.y * h + sy * (LAYER_SPEED[s.layer] ?? 0.1)) % h) + h) % h;
        const twinkle = reduced ? 1 : 0.55 + 0.45 * Math.sin(t / 900 + s.phase);
        ctx.globalAlpha = twinkle * (0.45 + s.layer * 0.25);
        ctx.beginPath();
        ctx.arc(s.x * w, y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = "#f4f6ff";
        ctx.fill();
      }
      if (!reduced) frame = requestAnimationFrame(draw);
    };
    frame = requestAnimationFrame(draw);
    const onScroll = () => reduced && draw(0);
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <>
      <div className="sky" aria-hidden>
        <div className="sky-sun" />
      </div>
      <canvas ref={canvas} className="stars" aria-hidden />
    </>
  );
}
