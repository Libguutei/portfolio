import { useEffect, useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
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

/** Аяллын төгсгөл: нар руу ниснэ, дэлгэц дулаан гэрэлд автна — холбоо барих хэсэг */
export function Signal() {
  const root = useRef<HTMLElement>(null);
  const time = useClock(profile.timeZone);
  const [copied, setCopied] = useState(false);

  // Нар ойртох тусам дэлгэц нарны гэрэлд автна
  useGSAP(
    () => {
      gsap.fromTo(
        ".sg-light",
        { opacity: 0 },
        { opacity: 1, ease: "none", scrollTrigger: { trigger: root.current, start: "top 80%", end: "bottom bottom", scrub: true } },
      );
    },
    { scope: root },
  );

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
    <section id="signal" ref={root} className="relative px-5 pb-10 pt-32 md:px-10 md:pb-32 md:pt-44">
      <div
        className="sg-light pointer-events-none fixed inset-0 -z-[1] opacity-0"
        style={{ background: "radial-gradient(ellipse 70% 80% at 75% 45%, rgb(255 160 70 / 0.28), rgb(255 110 40 / 0.1) 50%, transparent 78%)" }}
        aria-hidden
      />

      <div className="grid gap-16 md:min-h-[80svh] md:grid-cols-12">
        <div className="relative z-10 self-center md:col-span-6">
          <StopLabel id="signal" />
          <h2 className="mt-10 font-display text-[clamp(2.6rem,7vw,7rem)] font-extrabold leading-[0.98]">Send a signal</h2>
          <p className="measure mt-6 text-lg text-ink/85">
            The last stop is the Sun. Its light needs eight minutes to reach Ulaanbaatar; an email to me gets there faster. I'm
            open to junior roles, internships and interesting side projects.
          </p>

          <div className="mt-12 flex flex-wrap items-center gap-4">
            <Magnetic strength={0.3}>
              <a href={`mailto:${profile.email}`} className="block rounded-full bg-dawn px-8 py-4 font-display font-semibold text-space">
                Email me
              </a>
            </Magnetic>
            <button
              onClick={copyEmail}
              className="rounded-full border border-ink/40 bg-space/30 px-6 py-4 backdrop-blur transition-colors hover:border-ink"
              aria-live="polite"
            >
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

        {/* Нар энэ хайрцгийн төвд — 3D (three/Space.ts) */}
        <div data-body="sun" className="h-[50svh] md:col-span-6 md:h-auto" aria-hidden />
      </div>

      <footer className="relative z-10 mt-32 flex flex-wrap items-end justify-between gap-6 border-t border-ink/20 pt-8 text-sm text-ink/70">
        <div className="flex items-center gap-3">
          <span className="h-1.5 w-1.5 rounded-full bg-sky shadow-[0_0_8px_#3d7bff]" aria-hidden />
          Home is the pale blue dot behind us. It's {time} in Ulaanbaatar.
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
