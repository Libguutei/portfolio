import { useEffect, useMemo, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { profile } from "@/data/portfolio";
import { Scene } from "../Scene";
import { StopLabel } from "../StopLabel";

interface Day {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}

interface ContributionsResponse {
  contributions: Day[];
}

/** Түвшин бүрийн одны хэмжээ (нүдний хувиар) ба гэрэлтэлт */
const STAR = [
  { size: 18, glow: 0 },
  { size: 34, glow: 4 },
  { size: 50, glow: 7 },
  { size: 68, glow: 11 },
  { size: 88, glow: 16 },
] as const;

const API = (user: string) => `https://github-contributions-api.jogruber.de/v4/${user}?y=last`;

/** Өдрүүдийг 7 мөртэй долоо хоногийн баганууд болгоно (Ням гарагаас эхэлнэ) */
function toWeeks(days: Day[]): (Day | null)[][] {
  const first = days[0];
  if (!first) return [];
  const pad: (Day | null)[] = Array.from({ length: new Date(first.date).getUTCDay() }, () => null);
  const cells = [...pad, ...days];
  const weeks: (Day | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));
  return weeks;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" });
}

const PLACEHOLDER: Day[] = Array.from({ length: 365 }, (_, i) => ({
  date: new Date(Date.UTC(2025, 0, 5 + i)).toISOString().slice(0, 10),
  count: 0,
  level: 0,
}));

interface Props {
  active: boolean;
  direction: 1 | -1;
  ready: boolean;
}

/** Гүн сансар: GitHub дээрх contribution бүр нэг од */
export function DeepField({ active, direction, ready }: Props) {
  const grid = useRef<HTMLDivElement>(null);
  const [days, setDays] = useState<Day[] | null>(null);
  const [failed, setFailed] = useState(false);
  const [hover, setHover] = useState<Day | null>(null);

  useEffect(() => {
    const ctrl = new AbortController();
    fetch(API(profile.github), { signal: ctrl.signal })
      .then(r => (r.ok ? (r.json() as Promise<ContributionsResponse>) : Promise.reject(new Error(String(r.status)))))
      .then(data => setDays(data.contributions))
      .catch(err => {
        if ((err as Error).name !== "AbortError") setFailed(true);
      });
    return () => ctrl.abort();
  }, []);

  const weeks = useMemo(() => toWeeks(days ?? PLACEHOLDER), [days]);
  const total = useMemo(() => (days ?? []).reduce((s, d) => s + d.count, 0), [days]);
  const activeDays = useMemo(() => (days ?? []).filter(d => d.count > 0).length, [days]);
  const best = useMemo(() => (days ?? []).reduce<Day | null>((b, d) => (!b || d.count > b.count ? d : b), null), [days]);

  // Энэ scene идэвхжих бүрт одод зүүнээс баруун тийш асна
  useEffect(() => {
    if (!active || !days || !grid.current) return;
    const stars = grid.current.querySelectorAll(".df-star");
    const tween = gsap.fromTo(
      stars,
      { opacity: 0, scale: 0 },
      { opacity: 1, scale: 1, duration: 0.6, ease: "power2.out", delay: 0.9, stagger: { grid: [7, weeks.length], axis: "x", from: "start", amount: 1.6 } },
    );
    return () => {
      tween.kill();
    };
  }, [active, days, weeks.length]);

  const status = failed
    ? "The live data didn't load. Open my GitHub profile to see the full graph."
    : !days
      ? "Loading live contributions from GitHub."
      : hover
        ? `${hover.count} contribution${hover.count === 1 ? "" : "s"} on ${formatDate(hover.date)}`
        : "Hover a star to see its day.";

  return (
    <Scene id="deep" active={active} direction={direction} ready={ready}>
      <div data-scroll className="flex h-full flex-col justify-center overflow-y-auto px-5 md:px-10">
        <StopLabel id="deep" className="rv" />
        <h2 className="rv mt-8 max-w-4xl font-display text-[clamp(2.2rem,5vw,4.5rem)] font-semibold leading-[1.02]">
          {days ? `${total} contributions, one star each` : "A year of commits, one star each"}
        </h2>

        <div className="rv mt-10 overflow-x-auto pb-2">
          <div ref={grid} className="gh-grid flex w-max gap-[var(--gap)]">
            {weeks.map((w, wi) => (
              <div key={wi} className="grid grid-rows-7 gap-[var(--gap)]">
                {Array.from({ length: 7 }, (_, di) => {
                  const d = w[di];
                  if (!d) return <span key={di} className="gh-size" />;
                  const s = STAR[d.level];
                  return (
                    <span key={di} className="gh-size grid place-items-center" onPointerEnter={() => setHover(d)} onPointerLeave={() => setHover(null)}>
                      <span
                        className="df-star block rounded-full bg-ink"
                        style={{
                          width: `${s.size}%`,
                          height: `${s.size}%`,
                          opacity: d.level === 0 ? 0.25 : 1,
                          boxShadow: s.glow ? `0 0 ${s.glow}px rgb(255 214 150 / 0.9)` : undefined,
                          backgroundColor: d.level >= 3 ? "#ffe3b0" : undefined,
                        }}
                      />
                    </span>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
        <p className="rv mt-3 min-h-[1.6em] text-ink/70" aria-live="polite">
          {status}
        </p>

        <dl className="rv mt-10 flex flex-wrap gap-x-14 gap-y-6">
          <div>
            <dt className="text-sm text-ink/60">Active days</dt>
            <dd className="font-display text-3xl font-semibold">{days ? activeDays : "–"}</dd>
          </div>
          <div>
            <dt className="text-sm text-ink/60">Brightest day</dt>
            <dd className="font-display text-3xl font-semibold">{best ? best.count : "–"}</dd>
          </div>
          <div>
            <dt className="text-sm text-ink/60">Profile</dt>
            <dd className="mt-1.5">
              <a href={`https://github.com/${profile.github}`} target="_blank" rel="noreferrer" className="font-display text-lg underline underline-offset-4 hover:text-dawn">
                github.com/{profile.github}
              </a>
            </dd>
          </div>
        </dl>
      </div>
    </Scene>
  );
}
