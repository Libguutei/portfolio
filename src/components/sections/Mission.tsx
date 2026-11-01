import { useRef, type ReactNode } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import type { Mission as MissionData } from "@/data/portfolio";
import { StopLabel } from "../StopLabel";
import { DeviceFrame } from "../DeviceFrame";
import { Magnetic } from "../motion/Magnetic";

interface MissionProps {
  id: string;
  mission: MissionData;
  /** Гарагийн дүрс — scroll хийх тусам алсаас ойртоно */
  planet: ReactNode;
  /** true бол гараг зүүн талд */
  flip?: boolean;
  children?: ReactNode;
}

/** Нэг гараг дээрх нэг төсөл: зүүн/баруун талд гараг, нөгөө талд түүх */
export function Mission({ id, mission, planet, flip = false, children }: MissionProps) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      // Гараг алсаас ойртож ирээд, өнгөрөхдөө дээшээ гарна
      gsap.fromTo(
        ".ms-planet",
        { scale: 0.3, yPercent: 40, rotate: -10 },
        {
          scale: 1.08,
          yPercent: -25,
          rotate: 6,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true },
        },
      );
      gsap.fromTo(
        ".ms-device",
        { yPercent: 30 },
        { yPercent: -20, ease: "none", scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true } },
      );
    },
    { scope: root },
  );

  const shot = mission.shot;

  return (
    <section id={id} ref={root} className="relative px-5 py-32 md:px-10 md:py-44">
      <div className="grid items-center gap-16 md:grid-cols-12 md:gap-8">
        <div className={`relative h-[60svh] md:col-span-6 md:h-[80svh] ${flip ? "md:order-first" : "md:order-last"}`}>
          <div className={`ms-planet absolute inset-0 grid justify-items-center ${shot?.device === "browser" ? "items-start pt-[2%]" : "items-center"}`}>{planet}</div>
          {shot && (
            <DeviceFrame
              shot={shot}
              alt={`${mission.title} screenshot`}
              className={
                shot.device === "phone"
                  ? "ms-device absolute bottom-[6%] right-[6%] w-[38%] max-w-[220px] rotate-6"
                  : "ms-device absolute bottom-0 right-0 w-[78%] -rotate-2"
              }
            />
          )}
        </div>

        <div className="md:col-span-6 lg:col-span-5 lg:col-start-auto">
          <StopLabel id={id} />
          <p className="mt-10 text-ink/60">{mission.event}</p>
          <h2 className="mt-2 font-display text-[clamp(2.75rem,7vw,6.5rem)] font-extrabold leading-[0.95]">{mission.title}</h2>
          <p className="mt-4 font-display text-xl font-normal leading-snug md:text-2xl" style={{ color: mission.accent }}>
            {mission.tagline}
          </p>
          <p className="measure mt-6 text-ink/80">{mission.description}</p>

          <h3 className="mt-10 font-display text-sm font-semibold text-ink/60">What I built</h3>
          <ul className="measure mt-3 space-y-2">
            {mission.role.map(r => (
              <li key={r} className="flex gap-3">
                <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: mission.accent }} aria-hidden />
                <span>{r}</span>
              </li>
            ))}
          </ul>
          <p className="measure mt-6 text-ink/60">Built with {joinList(mission.stack)}.</p>

          <dl className="mt-10 flex flex-wrap gap-x-12 gap-y-6">
            {mission.facts.map(f => (
              <div key={f.label}>
                <dt className="sr-only">{f.label}</dt>
                <dd className="font-display text-3xl font-semibold md:text-4xl">{f.value}</dd>
                <dd className="text-sm text-ink/60">{f.label}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-10 flex flex-wrap gap-3">
            {mission.links.map((l, i) => (
              <Magnetic key={l.href} strength={0.25}>
                <a
                  href={l.href}
                  target="_blank"
                  rel="noreferrer"
                  className={
                    i === 0
                      ? "block rounded-full bg-dawn px-6 py-3 font-medium text-space transition-transform hover:scale-[1.03]"
                      : "block rounded-full border border-ink/40 px-6 py-3 transition-colors hover:border-ink"
                  }
                >
                  {l.label}
                </a>
              </Magnetic>
            ))}
          </div>
        </div>
      </div>
      {children}
    </section>
  );
}

/** ["a","b","c"] → "a, b and c" */
export function joinList(items: string[]): string {
  if (items.length < 2) return items.join("");
  return `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;
}
