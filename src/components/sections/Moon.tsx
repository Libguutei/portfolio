import { experience } from "@/data/portfolio";
import { Scene } from "../Scene";
import { Split } from "../Split";
import { StopLabel } from "../StopLabel";

interface Props {
  active: boolean;
  direction: 1 | -1;
  ready: boolean;
}

/** Сар: туршлагын түүх он дарааллаар — нэг мөрөөр */
export function Moon({ active, direction, ready }: Props) {
  return (
    <Scene id="moon" active={active} direction={direction} ready={ready}>
      <Split visual={<div data-body="moon" className="absolute inset-0" aria-hidden />}>
        <StopLabel id="moon" className="rv" />
        <h2 className="rv mt-8 font-display text-[clamp(2.2rem,5vw,4.5rem)] font-semibold leading-[1.02]">Аяллын тэмдэглэл</h2>
        <ol className="relative mt-10 space-y-5 border-l border-ink/20 pl-6">
          {experience.map(x => (
            <li key={x.company} className="rv relative">
              <span className="absolute -left-[28px] top-2 h-[7px] w-[7px] rounded-full bg-dawn" aria-hidden />
              <p className="text-sm text-ink/60">{x.period}</p>
              <p className="font-display text-lg font-semibold md:text-xl">{x.company}</p>
            </li>
          ))}
        </ol>
      </Split>
    </Scene>
  );
}
