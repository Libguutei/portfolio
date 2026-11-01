import { useEffect, useRef, type ReactNode } from "react";
import { gsap } from "@/lib/gsap";
import { stops } from "@/data/portfolio";

interface SceneProps {
  id: string;
  active: boolean;
  /** Сүүлийн шилжилтийн чиглэл: 1 бол урагш (доош scroll) */
  direction: 1 | -1;
  /** Анх ачаалахад анимацгүйгээр нуух/харуулах */
  ready: boolean;
  className?: string;
  children: ReactNode;
}

/**
 * Бүтэн дэлгэцийн нэг зогсоол. Идэвхжихэд `.rv` элементүүд доороос гарч ирж,
 * гарахдаа дээшээ (буцахад доошоо) бүдгэрч алга болно.
 */
export function Scene({ id, active, direction, ready, className = "", children }: SceneProps) {
  const root = useRef<HTMLElement>(null);
  const first = useRef(true);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const items = el.querySelectorAll(".rv");
    const ctx = gsap.context(() => {
      if (active) {
        gsap.set(el, { visibility: "visible", pointerEvents: "auto" });
        if (!ready) {
          gsap.set(items, { opacity: 0 });
          return;
        }
        gsap.fromTo(
          items,
          { y: 50 * direction, opacity: 0, filter: "blur(8px)" },
          {
            y: 0,
            opacity: 1,
            filter: "blur(0px)",
            duration: 1,
            ease: "expo.out",
            stagger: 0.07,
            // Камер нисч дуустал хүлээгээд текст гарна
            delay: first.current ? 0.2 : 0.75,
            overwrite: true,
          },
        );
        first.current = false;
      } else {
        gsap.set(el, { pointerEvents: "none" });
        gsap.to(items, {
          y: -40 * direction,
          opacity: 0,
          filter: "blur(6px)",
          duration: 0.45,
          ease: "power2.in",
          stagger: 0.03,
          overwrite: true,
          onComplete: () => {
            gsap.set(el, { visibility: "hidden" });
          },
        });
      }
    }, el);
    return () => ctx.kill();
  }, [active, direction, ready]);

  return (
    <section
      id={id}
      ref={root}
      data-scene={stops.findIndex(s => s.id === id)}
      aria-hidden={!active}
      className={`invisible absolute inset-0 h-[100svh] w-full overflow-hidden ${className}`}
    >
      {children}
    </section>
  );
}
