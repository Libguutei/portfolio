import { useRef } from "react";
import { gsap, SplitText, useGSAP } from "@/lib/gsap";
import { profile } from "@/data/portfolio";
import { SplitReveal } from "../motion/SplitReveal";

export function About() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      // Үг бүр скроллоор аажмаар гэрэлтэнэ
      SplitText.create(".about-text", {
        type: "words",
        autoSplit: true,
        onSplit: self =>
          gsap.fromTo(
            self.words,
            { opacity: 0.12, filter: "blur(4px)" },
            {
              opacity: 1,
              filter: "blur(0px)",
              stagger: 0.1,
              ease: "none",
              scrollTrigger: { trigger: ".about-text", start: "top 80%", end: "bottom 45%", scrub: true },
            },
          ),
      });

      // Зураг: clip-path-аар нээгдэж, дотор нь parallax
      gsap.fromTo(
        ".about-photo",
        { clipPath: "inset(18% 18% 18% 18% round 24px)" },
        {
          clipPath: "inset(0% 0% 0% 0% round 24px)",
          ease: "none",
          scrollTrigger: { trigger: ".about-photo", start: "top 90%", end: "center 55%", scrub: true },
        },
      );
      gsap.fromTo(
        ".about-photo-inner",
        { yPercent: -12, scale: 1.25 },
        {
          yPercent: 12,
          scale: 1,
          ease: "none",
          scrollTrigger: { trigger: ".about-photo", start: "top bottom", end: "bottom top", scrub: true },
        },
      );

      gsap.from(".about-fact", {
        y: 60,
        opacity: 0,
        duration: 1,
        stagger: 0.12,
        ease: "expo.out",
        scrollTrigger: { trigger: ".about-facts", start: "top 85%" },
      });
    },
    { scope: root },
  );

  const initials = `${profile.heroLines[0][0]}${profile.heroLines[1][0]}`.toUpperCase();

  return (
    <section id="about" ref={root} data-bg="#f1ede4" data-fg="#0b0b0c" className="relative px-5 py-32 md:px-10 md:py-48">
      <div className="mb-16 flex items-center gap-4 text-xs uppercase tracking-[0.25em] opacity-60 md:text-sm">
        <span>(01)</span>
        <span className="h-px w-12 bg-current" />
        <span>About me</span>
      </div>

      <div className="grid gap-16 md:grid-cols-12 md:gap-10">
        <div className="md:col-span-5">
          <div className="about-photo relative aspect-[4/5] w-full overflow-hidden rounded-3xl" data-cursor="Hi!">
            <div className="about-photo-inner absolute inset-0 photo-art">
              <span className="absolute inset-0 flex items-center justify-center font-display text-[28vw] font-black text-[#0b0b0c]/90 md:text-[14vw]">
                {initials}
              </span>
            </div>
          </div>
        </div>

        <div className="md:col-span-7 md:pl-8">
          <SplitReveal as="h2" by="chars" className="font-display text-5xl font-black uppercase leading-[0.9] tracking-tight md:text-7xl">
            Hello, I'm {profile.name}
            <span className="text-[#ff5b2e]">.</span>
          </SplitReveal>

          <p className="about-text mt-10 font-display text-2xl font-medium leading-[1.25] tracking-tight md:text-4xl">
            {profile.about}
          </p>

          <div className="about-facts mt-16 grid grid-cols-2 gap-x-6 gap-y-8 border-t border-current/15 pt-8 text-sm">
            {[
              { label: "Age", value: `${profile.age} years old` },
              { label: "Experience", value: profile.experience },
              { label: "Role", value: profile.role },
              { label: "Based in", value: profile.location },
            ].map(f => (
              <div key={f.label} className="about-fact">
                <div className="text-xs uppercase tracking-[0.2em] opacity-50">{f.label}</div>
                <div className="mt-2 font-serif text-2xl italic md:text-3xl">{f.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
