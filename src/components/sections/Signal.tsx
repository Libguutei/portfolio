import { useEffect, useState } from "react";
import { scrollTo } from "@/lib/scroll";
import { profile, socials } from "@/data/portfolio";
import { StopLabel } from "../StopLabel";
import { Magnetic } from "../motion/Magnetic";

function useClock(timeZone: string): string {
  const format = () => new Intl.DateTimeFormat("en-GB", { timeZone, hour: "2-digit", minute: "2-digit" }).format(new Date());
  const [time, setTime] = useState(format);
  useEffect(() => {
    const id = window.setInterval(() => setTime(format()), 10_000);
    return () => window.clearInterval(id);
  }, [timeZone]);
  return time;
}

/** Voyager 1-ийн зайнаас: дохио илгээх — холбоо барих хэсэг */
export function Signal() {
  const time = useClock(profile.timeZone);
  const [copied, setCopied] = useState(false);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      window.location.href = `mailto:${profile.email}`;
    }
  };

  return (
    <section id="signal" className="relative px-5 pb-10 pt-32 md:px-10 md:pt-44">
      <div className="grid gap-16 md:grid-cols-12">
        <div className="md:col-span-7">
          <StopLabel id="signal" />
          <h2 className="mt-10 font-display text-[clamp(2.6rem,7vw,7rem)] font-extrabold leading-[0.98]">Send a signal</h2>
          <p className="measure mt-6 text-lg text-ink/80">
            A message from Voyager 1 takes almost a day to reach Earth. Mine reach Ulaanbaatar a lot faster. I'm open to junior roles,
            internships and interesting side projects.
          </p>

          <div className="mt-12 flex flex-wrap items-center gap-4">
            <Magnetic strength={0.3}>
              <a href={`mailto:${profile.email}`} className="block rounded-full bg-dawn px-8 py-4 font-display font-semibold text-space">
                Email me
              </a>
            </Magnetic>
            <button onClick={copyEmail} className="rounded-full border border-ink/40 px-6 py-4 transition-colors hover:border-ink" aria-live="polite">
              {copied ? "Address copied" : `Copy ${profile.email}`}
            </button>
          </div>

          <ul className="mt-10 flex flex-wrap gap-x-8 gap-y-3">
            {socials.map(s => (
              <li key={s.label}>
                <a href={s.href} target="_blank" rel="noreferrer" className="underline underline-offset-4 hover:text-dawn">
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Дохионы долгион */}
        <div className="relative hidden aspect-square w-full max-w-[420px] self-center justify-self-center md:col-span-5 md:block" aria-hidden>
          {[0, 1.2, 2.4].map(d => (
            <span key={d} className="signal-ring" style={{ animationDelay: `${d}s` }} />
          ))}
          <span className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-dawn shadow-[0_0_24px_#ffc46b]" />
        </div>
      </div>

      <footer className="mt-40 flex flex-wrap items-end justify-between gap-6 border-t border-ink/15 pt-8 text-sm text-ink/60">
        <div className="flex items-center gap-3">
          <span className="h-1.5 w-1.5 rounded-full bg-sky shadow-[0_0_8px_#3d7bff]" aria-hidden />
          That pale blue dot is home. It's {time} in Ulaanbaatar.
        </div>
        <div className="flex items-center gap-6">
          <span>© {new Date().getFullYear()} {profile.name}</span>
          <button onClick={() => scrollTo(0)} className="underline underline-offset-4 hover:text-ink">
            Fly back home
          </button>
        </div>
      </footer>
    </section>
  );
}
