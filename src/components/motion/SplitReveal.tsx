import { useRef, type ElementType, type ReactNode } from "react";
import { gsap, SplitText, useGSAP } from "@/lib/gsap";

interface SplitRevealProps {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  /** lines: мөр мөрөөрөө, chars: үсэг үсгээр */
  by?: "lines" | "chars";
  delay?: number;
  start?: string;
}

/** Скролл хийгээд харагдах үед текстийг маскаас доороос нь гаргаж ирнэ. */
export function SplitReveal({
  children,
  as: Tag = "div",
  className,
  by = "lines",
  delay = 0,
  start = "top 85%",
}: SplitRevealProps) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (!ref.current) return;
      SplitText.create(ref.current, {
        type: by === "lines" ? "lines" : "words,chars",
        mask: by === "lines" ? "lines" : "words",
        autoSplit: true,
        onSplit(self) {
          const targets = by === "lines" ? self.lines : self.chars;
          return gsap.from(targets, {
            yPercent: 110,
            rotate: by === "chars" ? 8 : 2,
            duration: 1.2,
            delay,
            ease: "expo.out",
            stagger: by === "lines" ? 0.1 : 0.025,
            scrollTrigger: { trigger: ref.current, start },
          });
        },
      });
    },
    { scope: ref },
  );

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}
