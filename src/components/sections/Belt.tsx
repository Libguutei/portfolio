import { smallProjects, vesta } from "@/data/portfolio";
import { Planet } from "../Planet";
import { Mission } from "./Mission";

/** Астероидын бүс: Vesta гол төсөл, бусад жижиг төслүүд хажуугаар нь эргэлдэнэ */
export function Belt() {
  return (
    <Mission
      id="belt"
      mission={vesta}
      flip
      planet={
        <div className="relative w-[min(78%,460px)]">
          <Planet kind="vesta" className="w-full" />
          {[
            { pos: "left-[-8%] top-[6%]", w: "14%" },
            { pos: "right-[-4%] top-[28%]", w: "9%" },
            { pos: "bottom-[4%] left-[12%]", w: "7%" },
            { pos: "bottom-[-6%] right-[18%]", w: "12%" },
          ].map((r, i) => (
            <span key={i} className={`rock absolute ${r.pos}`} style={{ width: r.w, animationDelay: `${i * -1.4}s` }} />
          ))}
        </div>
      }
    >
      <div className="mt-32">
        <h3 className="font-display text-[clamp(1.6rem,3.5vw,2.75rem)] font-semibold">Smaller rocks in the same belt</h3>
        <p className="measure mt-3 text-ink/70">Projects I built on my own while learning. Each one links to its code or a live version.</p>
        <ul className="mt-12 grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {smallProjects.map((p, i) => (
            <li key={p.title} className="group">
              <a href={p.link} target="_blank" rel="noreferrer" className="block">
                {p.image && (
                  <img src={p.image} alt={`${p.title} screenshot`} loading="lazy" className="mb-4 aspect-[16/9] w-full rounded-xl object-cover" />
                )}
                <div className="flex items-center gap-3">
                  <span className="rock" style={{ animationDelay: `${i * -0.9}s` }} aria-hidden />
                  <span className="font-display text-lg font-semibold underline-offset-4 group-hover:underline">{p.title}</span>
                </div>
                <p className="mt-2 text-ink/75">{p.description}</p>
                <p className="mt-2 text-sm text-ink/50">{p.tags.join(", ")}</p>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </Mission>
  );
}
