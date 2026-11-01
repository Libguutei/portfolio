import { stack } from "@/data/portfolio";
import { Scene } from "../Scene";
import { Split } from "../Split";
import { StopLabel } from "../StopLabel";

/** Тойрог зам бүрийн өнгө — шошгон дээрх цэг ба тайлбарт ижил */
export const RING_COLORS = ["#ffc46b", "#8fd3ff", "#ff8a5c", "#b9f5a0"];

interface Props {
  active: boolean;
  direction: 1 | -1;
  ready: boolean;
}

/** 400 км: том 3D дэлхий, түүнийг тойрон tech stack бүр нэг дагуул болж нисэнэ */
export function Orbit({ active, direction, ready }: Props) {
  return (
    <>
      <Scene id="orbit" active={active} direction={direction} ready={ready}>
        <Split visual={<div data-body="earth" className="absolute inset-0" aria-hidden />}>
          <StopLabel id="orbit" className="rv" />
          <h2 className="rv mt-8 font-display text-[clamp(2.2rem,5vw,4.5rem)] font-semibold leading-[1.02]">My stack in orbit</h2>
          <p className="rv measure mt-5 text-lg text-ink/85">Every satellite around the Earth is a tool I build with.</p>
          <ul className="rv mt-10 grid grid-cols-2 gap-x-8 gap-y-3">
            {stack.map((g, gi) => (
              <li key={g.title} className="flex items-center gap-3">
                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: RING_COLORS[gi] }} aria-hidden />
                {g.title}
              </li>
            ))}
          </ul>
        </Split>
      </Scene>

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
              className="absolute left-0 top-0 flex items-center gap-1.5 whitespace-nowrap rounded-full bg-space/75 px-2.5 py-0.5 text-xs opacity-0 backdrop-blur-sm transition-opacity duration-300 md:text-sm"
            >
              <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: RING_COLORS[gi] }} />
              {item}
            </span>
          )),
        )}
      </div>
    </>
  );
}
