import { useEffect, useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { scrollTo } from "@/lib/scroll";
import { profile, socials } from "@/data/portfolio";
import { Magnetic } from "../motion/Magnetic";
import { RollText } from "../motion/RollText";

function useClock(timeZone: string): string {
  const format = () =>
    new Intl.DateTimeFormat("en-GB", { timeZone, hour: "2-digit", minute: "2-digit", second: "2-digit" }).format(new Date());
  const [time, setTime] = useState(format);
  useEffect(() => {
    const id = window.setInterval(() => setTime(format()), 1000);
    return () => window.clearInterval(id);
  }, [timeZone]);
  return time;
}

const HEADLINE = ["Let's", "work", "together"];

export function Contact() {
  const root = useRef<HTMLElement>(null);
  const time = useClock(profile.timeZone);
  const [copied, setCopied] = useState(false);

  useGSAP(
    () => {
      // Дугуй хэлбэрээр тэлж ирэх өнгөт дэвсгэр
      gsap.fromTo(
        ".ct-bg",
        { clipPath: "circle(0% at 50% 100%)" },
        {
          clipPath: "circle(140% at 50% 100%)",
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top bottom", end: "top 20%", scrub: true },
        },
      );

      gsap.from(".ct-char", {
        yPercent: 120,
        rotate: 12,
        duration: 1.3,
        stagger: 0.03,
        ease: "expo.out",
        scrollTrigger: { trigger: ".ct-headline", start: "top 80%" },
      });

      gsap.from(".ct-btn", {
        scale: 0,
        rotate: -90,
        duration: 1.4,
        ease: "elastic.out(1, 0.5)",
        scrollTrigger: { trigger: ".ct-btn", start: "top 90%" },
      });

      gsap.from(".ct-giant-char", {
        yPercent: 100,
        duration: 1.2,
        stagger: 0.04,
        ease: "expo.out",
        scrollTrigger: { trigger: ".ct-giant", start: "top 95%" },
      });
    },
    { scope: root },
  );

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      window.location.href = `mailto:${profile.email}`;
    }
  };

  return (
    <section id="contact" ref={root} data-bg="#0b0b0c" data-fg="#f1ede4" className="relative overflow-hidden">
      <div className="ct-bg absolute inset-0 bg-[#d4ff3a]" />

      <div className="relative px-5 pb-8 pt-32 text-[#0b0b0c] md:px-10 md:pt-48">
        <div className="mb-12 flex items-center gap-4 text-xs uppercase tracking-[0.25em] opacity-60 md:text-sm">
          <span>(07)</span>
          <span className="h-px w-12 bg-current" />
          <span>Contact</span>
        </div>

        <h2 className="ct-headline font-display font-black uppercase leading-[0.85] tracking-[-0.04em]">
          {HEADLINE.map((word, wi) => (
            <span key={word} className={`block text-[17vw] md:text-[12vw] ${wi === 1 ? "md:pl-[12vw]" : ""}`}>
              {[...word].map((ch, ci) => (
                <span key={ci} className="inline-block overflow-hidden align-bottom">
                  <span className="ct-char ct-hover inline-block">{ch}</span>
                </span>
              ))}
              {wi === HEADLINE.length - 1 && <span className="font-serif font-normal italic">?</span>}
            </span>
          ))}
        </h2>

        <div className="mt-16 flex flex-col items-start gap-12 md:mt-20 md:flex-row md:items-center md:justify-between">
          <Magnetic strength={0.45}>
            <a
              href={`mailto:${profile.email}`}
              className="ct-btn group relative flex h-44 w-44 items-center justify-center overflow-hidden rounded-full bg-[#0b0b0c] text-[#f1ede4] md:h-60 md:w-60"
              data-cursor="Say hi"
            >
              <span className="absolute inset-0 translate-y-full rounded-full bg-[#ff5b2e] transition-transform duration-700 ease-[cubic-bezier(.19,1,.22,1)] group-hover:translate-y-0" />
              <span className="relative text-center font-display text-lg font-bold uppercase tracking-wide md:text-2xl">
                Get in
                <br />
                touch ↗
              </span>
            </a>
          </Magnetic>

          <div className="flex flex-col gap-4 md:items-end">
            <button onClick={copyEmail} className="font-display text-2xl font-bold underline decoration-2 underline-offset-8 md:text-5xl">
              <RollText text={copied ? "Copied to clipboard!" : profile.email} />
            </button>
            <div className="flex flex-wrap gap-3">
              {socials.map(s => (
                <Magnetic key={s.label} strength={0.3}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noreferrer"
                    className="block rounded-full border border-[#0b0b0c] px-5 py-2.5 text-sm uppercase tracking-[0.15em] transition-colors duration-300 hover:bg-[#0b0b0c] hover:text-[#d4ff3a]"
                  >
                    <RollText text={s.label} />
                  </a>
                </Magnetic>
              ))}
            </div>
          </div>
        </div>

        <footer className="mt-28 border-t border-[#0b0b0c]/20 pt-6">
          <div className="flex flex-wrap items-center justify-between gap-4 text-xs uppercase tracking-[0.2em]">
            <span>© {new Date().getFullYear()} {profile.name}</span>
            <span className="tabular-nums">
              UB local time — {time}
            </span>
            <button onClick={() => scrollTo(0)}>
              <RollText text="Back to top ↑" />
            </button>
          </div>
          <div className="ct-giant mt-6 overflow-hidden font-display text-[20vw] font-black uppercase leading-[0.78] tracking-[-0.05em]">
            {[...`${profile.heroLines[0]}.`].map((ch, i) => (
              <span key={i} className="ct-giant-char inline-block">
                {ch}
              </span>
            ))}
          </div>
        </footer>
      </div>
    </section>
  );
}
