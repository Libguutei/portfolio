import { useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

/**
 * Custom cursor: жижиг цэг + хоцорч дагах цагираг.
 * `data-cursor="View"` атрибуттай элемент дээр томорч, текст харуулна.
 */
export function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState("");

  useGSAP((_, contextSafe) => {
    if (!dot.current || !ring.current || !contextSafe) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    document.documentElement.classList.add("has-cursor");
    gsap.set([dot.current, ring.current], { xPercent: -50, yPercent: -50, opacity: 0 });

    const dx = gsap.quickTo(dot.current, "x", { duration: 0.12, ease: "power3" });
    const dy = gsap.quickTo(dot.current, "y", { duration: 0.12, ease: "power3" });
    const rx = gsap.quickTo(ring.current, "x", { duration: 0.55, ease: "power3" });
    const ry = gsap.quickTo(ring.current, "y", { duration: 0.55, ease: "power3" });

    let current: Element | null = null;

    const onMove = contextSafe((e: PointerEvent) => {
      gsap.to([dot.current, ring.current], { opacity: 1, duration: 0.3, overwrite: "auto" });
      dx(e.clientX);
      dy(e.clientY);
      rx(e.clientX);
      ry(e.clientY);
    });

    const onOver = contextSafe((e: PointerEvent) => {
      const target = (e.target as Element).closest<HTMLElement>("[data-cursor], a, button");
      if (target === current) return;
      current = target;

      const text = target?.dataset.cursor ?? "";
      setLabel(text);
      const size = text ? 96 : target ? 64 : 40;
      gsap.to(ring.current, {
        width: size,
        height: size,
        backgroundColor: text ? "rgba(212,255,58,1)" : "rgba(212,255,58,0)",
        duration: 0.5,
        ease: "expo.out",
      });
      gsap.to(dot.current, { scale: target ? 0 : 1, duration: 0.3 });
    });

    const onLeave = contextSafe(() => gsap.to([dot.current, ring.current], { opacity: 0, duration: 0.3 }));
    const onDown = contextSafe(() => gsap.to(ring.current, { scale: 0.8, duration: 0.2 }));
    const onUp = contextSafe(() => gsap.to(ring.current, { scale: 1, duration: 0.4, ease: "back.out(3)" }));

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerover", onOver);
    document.addEventListener("pointerleave", onLeave);
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    return () => {
      document.documentElement.classList.remove("has-cursor");
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerover", onOver);
      document.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
    };
  });

  return (
    <>
      <div ref={ring} className="cursor-ring" aria-hidden>
        <span className={label ? "is-visible" : ""}>{label}</span>
      </div>
      <div ref={dot} className="cursor-dot" aria-hidden />
    </>
  );
}
