import { stack } from "@/data/portfolio";
import { StopLabel } from "../StopLabel";
import { joinList } from "./Mission";

/** 400 км: доор 3D дэлхий эргэлдэж, stack-ийн дөрвөн дагуул тойрог замаар нисэнэ */
export function Orbit() {
  return (
    <section id="orbit" className="relative px-5 pb-[70svh] pt-32 md:px-10">
      <div className="relative z-10 md:w-1/2">
        <StopLabel id="orbit" />
        <h2 className="mt-10 font-display text-[clamp(2.2rem,5.5vw,5rem)] font-semibold leading-[1.02]">The stack in orbit</h2>
        <p className="measure mt-6 text-ink/80">
          Four groups of tools keep everything I build up here. Each satellite below carries one of them, and all of it comes
          straight from the projects on my GitHub.
        </p>
        <dl className="mt-12 space-y-8">
          {stack.map(g => (
            <div key={g.title} className="measure border-t border-ink/20 pt-4">
              <dt className="font-display text-lg font-semibold">{g.title}</dt>
              <dd className="mt-1 text-ink/60">{g.note}</dd>
              <dd className="mt-2">{joinList(g.items)}</dd>
            </div>
          ))}
        </dl>
      </div>

      {/* Дэлхий энэ цэгийн доор байрлана — 3D (three/Space.ts) */}
      <div data-body="earth" data-progress="section" className="absolute inset-x-0 bottom-0 h-[40svh]" aria-hidden />

      {/* Дагуулуудын шошго: Space.ts байрлалыг нь фрэйм бүрт шинэчилнэ */}
      <div className="pointer-events-none fixed inset-0 z-30 overflow-hidden" aria-hidden>
        {stack.map((g, i) => (
          <span
            key={g.title}
            data-sat={i}
            className="absolute left-0 top-0 whitespace-nowrap rounded-full bg-space/70 px-3 py-1 text-sm opacity-0 backdrop-blur transition-opacity duration-300"
          >
            {g.title}
          </span>
        ))}
      </div>
    </section>
  );
}
