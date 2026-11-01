import type { CSSProperties } from "react";

interface RollTextProps {
  text: string;
  className?: string;
}

/** Hover хийхэд үсэг бүр дээшээ эргэлдэж солигдох текст (CSS-ээр). */
export function RollText({ text, className = "" }: RollTextProps) {
  return (
    <span className={`roll ${className}`} aria-label={text}>
      {[...text].map((ch, i) => (
        <span key={i} className="roll-char" style={{ "--i": i } as CSSProperties} aria-hidden>
          <span data-ch={ch === " " ? " " : ch}>{ch === " " ? " " : ch}</span>
        </span>
      ))}
    </span>
  );
}
