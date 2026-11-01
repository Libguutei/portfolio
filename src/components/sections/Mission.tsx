import type { ReactNode } from "react";
import type { Mission as MissionData } from "@/data/portfolio";
import type { BodyKind } from "@/three/Space";
import { Scene } from "../Scene";
import { Split } from "../Split";
import { StopLabel } from "../StopLabel";
import { DeviceFrame } from "../DeviceFrame";
import { Magnetic } from "../motion/Magnetic";

interface MissionProps {
  id: string;
  mission: MissionData;
  /** Энэ scene-д 3D сансарт гарч ирэх гараг */
  body: BodyKind;
  flip?: boolean;
  active: boolean;
  direction: 1 | -1;
  ready: boolean;
  /** Тайлбарын доор нэмэлт контент (жишээ нь дамжлагын схем) */
  extra?: ReactNode;
}

/** Нэг гараг дээрх нэг төсөл: гараг, жинхэнэ зураг, товч түүх */
export function Mission({ id, mission, body, flip = false, active, direction, ready, extra }: MissionProps) {
  const shot = mission.shot;

  const visual = (
    <>
      <div data-body={body} className={`absolute inset-x-0 ${shot?.device === "browser" ? "top-0 h-1/2" : "inset-y-0"}`} aria-hidden />
      {shot && (
        <DeviceFrame
          shot={shot}
          alt={`${mission.title} дэлгэцийн зураг`}
          className={
            shot.device === "phone"
              ? "rv absolute bottom-[8%] right-[6%] hidden w-[30%] max-w-[200px] rotate-6 md:block"
              : "rv absolute bottom-[10%] right-0 hidden w-[80%] -rotate-2 md:block"
          }
        />
      )}
    </>
  );

  return (
    <Scene id={id} active={active} direction={direction} ready={ready}>
      <Split visual={visual} flip={flip}>
        <StopLabel id={id} className="rv" />
        <p className="rv mt-8 text-ink/60">{mission.event}</p>
        <h2 className="rv mt-1 font-display text-[clamp(2.6rem,6vw,5.5rem)] font-extrabold leading-[1]">{mission.title}</h2>
        <p className="rv mt-3 font-display text-lg md:text-2xl" style={{ color: mission.accent }}>
          {mission.tagline}
        </p>
        <p className="rv measure mt-5 text-ink/85">{mission.description}</p>
        <p className="rv measure mt-3 text-ink/60">
          <span className="text-ink">Миний хэсэг: </span>
          {mission.part}
        </p>
        {extra}

        <dl className="rv mt-8 flex flex-wrap gap-x-10 gap-y-4">
          {mission.facts.map(f => (
            <div key={f.label}>
              <dt className="sr-only">{f.label}</dt>
              <dd className="font-display text-2xl font-semibold md:text-3xl">{f.value}</dd>
              <dd className="text-sm text-ink/60">{f.label}</dd>
            </div>
          ))}
        </dl>

        <div className="rv mt-8 flex flex-wrap gap-3">
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
      </Split>
    </Scene>
  );
}
