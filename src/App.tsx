import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { initSmoothScroll, setScrollLocked } from "@/lib/scroll";
import { Preloader } from "./components/Preloader";
import { Cursor } from "./components/Cursor";
import { Nav } from "./components/Nav";
import { Hero } from "./components/sections/Hero";
import { Marquee } from "./components/sections/Marquee";
import { About } from "./components/sections/About";
import { Projects } from "./components/sections/Projects";
import { Stack } from "./components/sections/Stack";
import { Featured } from "./components/sections/Featured";
import { Hardware } from "./components/sections/Hardware";
import { Contributions } from "./components/sections/Contributions";
import { Experience } from "./components/sections/Experience";
import { Contact } from "./components/sections/Contact";
import "./index.css";

export function App() {
  const main = useRef<HTMLElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    history.scrollRestoration = "manual";
    window.scrollTo(0, 0);
    const destroy = initSmoothScroll();
    setScrollLocked(true);
    document.fonts.ready.then(() => ScrollTrigger.refresh());
    return destroy;
  }, []);

  useEffect(() => {
    if (!ready) return;
    setScrollLocked(false);
    ScrollTrigger.refresh();
  }, [ready]);

  // Section бүр өөрийн өнгөтэй — скроллоор body-ийн өнгө зөөлөн шилжинэ
  useGSAP(
    () => {
      const root = document.documentElement;
      gsap.utils.toArray<HTMLElement>("[data-bg]").forEach(section => {
        const apply = () =>
          gsap.to(root, {
            "--bg": section.dataset.bg,
            "--fg": section.dataset.fg,
            duration: 0.9,
            ease: "power2.out",
            overwrite: "auto",
          });
        ScrollTrigger.create({
          trigger: section,
          start: "top 55%",
          end: "bottom 55%",
          onEnter: apply,
          onEnterBack: apply,
        });
      });
    },
    { scope: main },
  );

  return (
    <>
      <Preloader onReveal={() => setReady(true)} />
      <Cursor />
      <Nav />
      <main ref={main} className="relative">
        <Hero ready={ready} />
        <Marquee />
        <About />
        <Stack />
        <Featured />
        <Hardware />
        <Projects />
        <Contributions />
        <Experience />
        <Contact />
      </main>
      <div className="grain" aria-hidden />
    </>
  );
}

export default App;
