import { smallProjects } from "@/data/portfolio";
import { Scene } from "../Scene";
import { StopLabel } from "../StopLabel";

interface Props {
  active: boolean;
  direction: 1 | -1;
  ready: boolean;
}

/** Астероидын бүсийн гүнд: бие даан хийсэн жижиг төслүүд — эргэн тойронд 3D чулуунууд */
export function Rocks({ active, direction, ready }: Props) {
  return (
    <Scene id="rocks" active={active} direction={direction} ready={ready}>
      <div data-body="rocks" className="absolute inset-y-0 right-0 w-full md:w-1/2" aria-hidden />
      <div data-scroll className="relative flex h-full flex-col justify-start overflow-y-auto px-5 pb-24 pt-24 md:justify-center md:px-10 md:pb-0 md:pt-0">
        <StopLabel id="rocks" className="rv" />
        <h2 className="rv mt-8 font-display text-[clamp(2.2rem,5vw,4.5rem)] font-semibold leading-[1.02]">Smaller rocks</h2>
        <p className="rv measure mt-4 text-lg text-ink/85">Projects I built on my own while learning.</p>
        <ul className="mt-10 grid max-w-5xl gap-x-10 gap-y-7 sm:grid-cols-2 lg:grid-cols-3">
          {smallProjects.map(p => (
            <li key={p.title} className="rv">
              <a href={p.link} target="_blank" rel="noreferrer" className="group block rounded-2xl bg-space/50 p-4 backdrop-blur-sm transition-colors hover:bg-space/80">
                <span className="font-display text-lg font-semibold underline-offset-4 group-hover:underline">{p.title}</span>
                <p className="mt-1 text-sm text-ink/75">{p.description}</p>
                <p className="mt-2 text-xs text-ink/50">{p.tags.join(", ")}</p>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </Scene>
  );
}
