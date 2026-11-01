import { stack } from "@/data/portfolio";
import { StopLabel } from "../StopLabel";
import { joinList } from "./Mission";

/** Тойрог зам бүрийн өнгө — шошгон дээрх цэг ба жагсаалтад ижил */
export const RING_COLORS = ["#ffc46b", "#8fd3ff", "#ff8a5c", "#b9f5a0"];

/** 400 км: баруун талд том 3D дэлхий, түүнийг тойрон tech stack бүр нэг дагуул болж нисэнэ */
export function Orbit() {
  return (
    <section id="orbit" className="relative px-5 pb-40 pt-32 md:px-10">
      <div className="grid gap-12 md:grid-cols-2">
        <div className="relative z-10">
          <StopLabel id="orbit" />
          <h2 className="mt-10 font-display text-[clamp(2.2rem,5.5vw,5rem)] font-semibold leading-[1.02]">The stack in orbit</h2>
          <p className="measure mt-6 text-ink/80">
            Every satellite circling the Earth is one of the tools I build with. Four orbits, one for each part of the stack, all
            taken from the projects on my GitHub.
          </p>
          <dl className="mt-12 space-y-8">
            {stack.map((g, gi) => (
              <div key={g.title} className="measure border-t border-ink/20 pt-4">
                <dt className="flex items-center gap-3 font-display text-lg font-semibold">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: RING_COLORS[gi] }} aria-hidden />
                  {g.title}
                </dt>
                <dd className="mt-1 text-ink/60">{g.note}</dd>
                <dd className="mt-2">{joinList(g.items)}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Дэлхий энэ хайрцгийн төвд — desktop дээр текст гүйх хооронд байрандаа тогтоно (three/Space.ts) */}
        <div data-body="earth" data-progress="section" className="h-[80svh] md:sticky md:top-0 md:h-[100svh]" aria-hidden />
      </div>

      {/* Дагуул бүрийн шошго: Space.ts байрлалыг нь фрэйм бүрт шинэчилнэ */}
      <div className="pointer-events-none fixed inset-0 z-30 overflow-hidden" aria-hidden>
        {stack.flatMap((g, gi) =>
          g.items.map((item, i) => (
            <span
              key={`${g.title}-${item}`}
              data-sat
              data-ring={gi}
              data-slot={i}
              data-count={g.items.length}
              className="absolute left-0 top-0 flex items-center gap-1.5 whitespace-nowrap rounded-full bg-space/75 px-2.5 py-0.5 text-xs opacity-0 backdrop-blur-sm md:text-sm"
            >
              <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: RING_COLORS[gi] }} />
              {item}
            </span>
          )),
        )}
      </div>
    </section>
  );
}
