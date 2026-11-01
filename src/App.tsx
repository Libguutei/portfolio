import { useEffect, useState } from "react";
import { ScrollTrigger } from "@/lib/gsap";
import { initSmoothScroll, setScrollLocked } from "@/lib/scroll";
import { malchin, safepath } from "@/data/portfolio";
import { Sky } from "./components/Sky";
import { Countdown } from "./components/Countdown";
import { Altimeter } from "./components/Altimeter";
import { Nav } from "./components/Nav";
import { Planet } from "./components/Planet";
import { Launch } from "./components/sections/Launch";
import { About } from "./components/sections/About";
import { Orbit } from "./components/sections/Orbit";
import { Moon } from "./components/sections/Moon";
import { Mission } from "./components/sections/Mission";
import { Belt } from "./components/sections/Belt";
import { Europa } from "./components/sections/Europa";
import { DeepField } from "./components/sections/DeepField";
import { Signal } from "./components/sections/Signal";
import "./index.css";

export function App() {
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

  return (
    <>
      <Sky />
      <Countdown onLiftoff={() => setReady(true)} />
      <Nav />
      <Altimeter />
      <main className="relative">
        <Launch ready={ready} />
        <About />
        <Orbit />
        <Moon />
        <Mission id="mars" mission={malchin} planet={<Planet kind="mars" className="w-[min(80%,520px)]" />} />
        <Belt />
        <Europa />
        <Mission
          id="saturn"
          mission={safepath}
          flip
          planet={<Planet kind="saturn" className="w-[min(52%,340px)]" />}
        />
        <DeepField />
        <Signal />
      </main>
    </>
  );
}

export default App;
