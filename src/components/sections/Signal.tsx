import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { goTo } from "@/lib/journey";
import { profile, socials } from "@/data/portfolio";
import { Scene } from "../Scene";
import { Split } from "../Split";
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

interface Props {
  active: boolean;
  direction: 1 | -1;
  ready: boolean;
}

/** Аяллын төгсгөл: нар руу ниснэ, дэлгэц дулаан гэрэлд автна — холбоо барих хэсэг */
export function Signal({ active, direction, ready }: Props) {
  const light = useRef<HTMLDivElement>(null);
  const time = useClock(profile.timeZone);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    gsap.to(light.current, { opacity: active ? 1 : 0, duration: 1.6, delay: active ? 0.4 : 0, ease: "power2.inOut" });
  }, [active]);

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
    <>
      <div
        ref={light}
        className="pointer-events-none fixed inset-0 -z-[1] opacity-0"
        style={{ background: "radial-gradient(ellipse 60% 70% at 75% 50%, rgb(255 160 70 / 0.26), rgb(255 110 40 / 0.08) 50%, transparent 78%)" }}
        aria-hidden
      />
      <Scene id="signal" active={active} direction={direction} ready={ready}>
        <Split visual={<div data-body="sun" className="absolute inset-0" aria-hidden />}>
          <StopLabel id="signal" className="rv" />
          <h2 className="rv mt-8 font-display text-[clamp(2.6rem,6.5vw,6rem)] font-extrabold leading-[0.98]">Дохио илгээ</h2>
          <p className="rv measure mt-5 text-lg text-ink/85">
            Нарны гэрэл Улаанбаатарт хүрэхэд найман минут зарцуулдаг. Над руу бичсэн имэйл үүнээс ч хурдан хүрнэ.
          </p>

          <div className="rv mt-10 flex flex-wrap items-center gap-3">
            <Magnetic strength={0.3}>
              <a href={`mailto:${profile.email}`} className="block rounded-full bg-dawn px-8 py-4 font-display font-semibold text-space">
                Имэйл бичих
              </a>
            </Magnetic>
            <button
              onClick={copyEmail}
              className="rounded-full border border-ink/40 bg-space/30 px-6 py-4 backdrop-blur transition-colors hover:border-ink"
              aria-live="polite"
            >
              {copied ? "Хаяг хуулагдлаа" : "Хаяг хуулах"}
            </button>
          </div>

          <ul className="rv mt-8 flex flex-wrap gap-x-8 gap-y-3">
            {socials.map(s => (
              <li key={s.label}>
                <a href={s.href} target="_blank" rel="noreferrer" className="underline underline-offset-4 hover:text-dawn">
                  {s.label}
                </a>
              </li>
            ))}
          </ul>

          <p className="rv mt-14 text-sm text-ink/60">
            Улаанбаатарт одоо {time} болж байна.{" "}
            <button onClick={() => goTo(0)} className="underline underline-offset-4 hover:text-ink">
              Гэр лүүгээ буцах
            </button>
          </p>
        </Split>
      </Scene>
    </>
  );
}
