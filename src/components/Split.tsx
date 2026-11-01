import type { ReactNode } from "react";

interface SplitProps {
  /** Дэлгэцийн нэг тал — ихэвчлэн 3D гарагийн байрлал заагч */
  visual: ReactNode;
  /** true бол визуал зүүн талд */
  flip?: boolean;
  children: ReactNode;
}

/**
 * Scene-ийн үндсэн layout: нэг талд текст, нөгөө талд гараг.
 * Утсан дээр визуал дээд талд, текст доор нь (шаардлагатай бол дотроо гүйлгэнэ).
 */
export function Split({ visual, flip = false, children }: SplitProps) {
  return (
    <div className="grid h-full grid-rows-[38svh_1fr] px-5 pt-20 md:grid-cols-2 md:grid-rows-1 md:gap-10 md:px-10 md:pt-0">
      <div className={`relative ${flip ? "md:order-first" : "md:order-last"}`}>{visual}</div>
      <div data-scroll className="flex min-h-0 flex-col justify-start overflow-y-auto pb-24 md:justify-center md:pb-0">
        <div className="max-w-xl">{children}</div>
      </div>
    </div>
  );
}
