import { useEffect, useMemo, useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { profile } from "@/data/portfolio";
import { SplitReveal } from "../motion/SplitReveal";
import { Magnetic } from "../motion/Magnetic";
import { RollText } from "../motion/RollText";

interface Day {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}

interface ContributionsResponse {
  total: Record<string, number>;
  contributions: Day[];
}

interface Summary {
  total: number;
  activeDays: number;
  longestStreak: number;
  bestDay: Day | null;
}

const LEVEL_COLORS = ["rgba(255,255,255,0.06)", "#0e4429", "#006d32", "#26a641", "#39d353"] as const;
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const API = (user: string) => `https://github-contributions-api.jogruber.de/v4/${user}?y=last`;

/** Өдрүүдийг GitHub шиг 7 мөртэй долоо хоногийн баганууд болгоно (Ням гарагаас эхэлнэ) */
function toWeeks(days: Day[]): (Day | null)[][] {
  const first = days[0];
  if (!first) return [];
  const pad: (Day | null)[] = Array.from({ length: new Date(first.date).getUTCDay() }, () => null);
  const cells = [...pad, ...days];
  const weeks: (Day | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));
  return weeks;
}

function summarize(days: Day[]): Summary {
  let longest = 0;
  let run = 0;
  let best: Day | null = null;
  for (const d of days) {
    run = d.count > 0 ? run + 1 : 0;
    longest = Math.max(longest, run);
    if (!best || d.count > best.count) best = d;
  }
  return {
    total: days.reduce((sum, d) => sum + d.count, 0),
    activeDays: days.filter(d => d.count > 0).length,
    longestStreak: longest,
    bestDay: best,
  };
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });
}

/** Ачааллаж байх үед ижил хэмжээтэй хоосон grid харуулна — layout үсрэхгүй */
const PLACEHOLDER: Day[] = Array.from({ length: 365 }, (_, i) => ({
  date: new Date(Date.UTC(2025, 0, 5 + i)).toISOString().slice(0, 10),
  count: 0,
  level: 0,
}));

export function Contributions() {
  const root = useRef<HTMLElement>(null);
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
  const summary = useMemo(() => summarize(days ?? []), [days]);

  const monthLabels = useMemo(
    () =>
      weeks.map((w, i) => {
        const firstDay = w.find(d => d)?.date;
        if (!firstDay) return "";
        const month = new Date(firstDay).getUTCMonth();
        const prev = weeks[i - 1]?.find(d => d)?.date;
        return !prev || new Date(prev).getUTCMonth() !== month ? (MONTHS[month] ?? "") : "";
      }),
    [weeks],
  );

  // Өгөгдөл ирсний дараа цэгүүд зүүнээс баруун тийш долгион шиг гарч ирнэ
  useGSAP(
    () => {
      if (!days) return;
      const cells = gsap.utils.toArray<HTMLElement>(".gh-cell");
      gsap.fromTo(
        cells,
        { scale: 0, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.5,
          ease: "back.out(3)",
          stagger: { grid: [7, weeks.length], axis: "x", from: "start", amount: 1.6 },
          scrollTrigger: { trigger: ".gh-grid", start: "top 85%" },
        },
      );

      gsap.utils.toArray<HTMLElement>(".gh-num").forEach(el => {
        const target = Number(el.dataset.value ?? 0);
        const counter = { v: 0 };
        gsap.to(counter, {
          v: target,
          duration: 2.2,
          ease: "expo.out",
          onUpdate: () => {
            el.textContent = String(Math.round(counter.v));
          },
          scrollTrigger: { trigger: el, start: "top 90%" },
        });
      });
    },
    { scope: root, dependencies: [days], revertOnUpdate: true },
  );

  const statItems = [
    { value: summary.total, label: "Contributions · last year" },
    { value: summary.activeDays, label: "Active days" },
    { value: summary.longestStreak, label: "Longest streak (days)" },
    { value: summary.bestDay?.count ?? 0, label: "Best day" },
  ];

  return (
    <section id="github" ref={root} data-bg="#0d1117" data-fg="#e6edf3" className="relative px-5 py-32 md:px-10 md:py-44">
      <div className="mb-12 flex items-center gap-4 text-xs uppercase tracking-[0.25em] opacity-60 md:text-sm">
        <span>(05)</span>
        <span className="h-px w-12 bg-current" />
        <span>GitHub insights</span>
      </div>

      <div className="mb-16 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <SplitReveal as="h2" by="chars" className="font-display text-[14vw] font-black uppercase leading-[0.85] tracking-[-0.04em] md:text-[7.5vw]">
          Commit <span className="font-serif font-normal normal-case italic text-[#39d353]">streak</span>
        </SplitReveal>
        <Magnetic>
          <a
            href={`https://github.com/${profile.github}`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-3 rounded-full border border-current px-6 py-3 text-sm uppercase tracking-[0.15em]"
          >
            <svg viewBox="0 0 16 16" className="h-5 w-5" fill="currentColor" aria-hidden>
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
            </svg>
            <RollText text={`@${profile.github}`} />
          </a>
        </Magnetic>
      </div>

      <div className="rounded-[28px] border border-white/10 bg-[#161b22] p-5 md:p-8">
        <div className="-mx-1 overflow-x-auto px-1 pb-2" data-lenis-prevent-wheel>
          <div className="gh-grid w-max">
            <div className="mb-2 flex gap-[var(--gap)] pl-9 text-[11px] opacity-60">
              {monthLabels.map((m, i) => (
                <span key={i} className="w-[var(--cell)] overflow-visible whitespace-nowrap">
                  {m}
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <div className="grid w-7 grid-rows-7 gap-[var(--gap)] text-[10px] leading-[var(--cell)] opacity-50">
                {["", "Mon", "", "Wed", "", "Fri", ""].map((d, i) => (
                  <span key={i}>{d}</span>
                ))}
              </div>
              <div className="flex gap-[var(--gap)]">
                {weeks.map((w, wi) => (
                  <div key={wi} className="grid grid-rows-7 gap-[var(--gap)]">
                    {Array.from({ length: 7 }, (_, di) => {
                      const d = w[di];
                      if (!d) return <span key={di} className="gh-cell gh-size" />;
                      return (
                        <span
                          key={di}
                          className="gh-cell gh-size rounded-[22%] outline-offset-1 hover:outline hover:outline-2 hover:outline-white/70"
                          style={{ backgroundColor: LEVEL_COLORS[d.level] }}
                          onPointerEnter={() => setHover(d)}
                          onPointerLeave={() => setHover(null)}
                        />
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-4 text-sm">
          <span className="min-h-[1.25rem] opacity-70">
            {failed
              ? "Couldn't load live data — open my GitHub to see the graph."
              : !days
                ? "Loading live contributions…"
                : hover
                  ? `${hover.count} contribution${hover.count === 1 ? "" : "s"} on ${formatDate(hover.date)}`
                  : "Hover a day to see the details"}
          </span>
          <span className="flex items-center gap-1.5 text-xs opacity-60">
            Less
            {LEVEL_COLORS.map(c => (
              <span key={c} className="h-[11px] w-[11px] rounded-[3px]" style={{ backgroundColor: c }} />
            ))}
            More
          </span>
        </div>
      </div>

      <div className="mt-16 grid grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-4">
        {statItems.map(s => (
          <div key={s.label}>
            <div className="mb-5 h-px w-full bg-current opacity-20" />
            <div className="font-display text-6xl font-black leading-none tracking-tight md:text-[6vw]">
              <span className="gh-num tabular-nums" data-value={s.value}>
                0
              </span>
            </div>
            <div className="mt-3 text-sm uppercase tracking-[0.2em] opacity-60">{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
