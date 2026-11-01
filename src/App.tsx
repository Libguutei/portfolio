import { useEffect, useState } from "react";
import { bindNavigation, onScene } from "@/lib/journey";
import { malchin, safepath, vesta } from "@/data/portfolio";
import { Sky } from "./components/Sky";
import { SpaceCanvas } from "./components/SpaceCanvas";
import { Countdown } from "./components/Countdown";
import { Altimeter } from "./components/Altimeter";
import { Nav } from "./components/Nav";
import { Launch } from "./components/sections/Launch";
import { About } from "./components/sections/About";
import { Orbit } from "./components/sections/Orbit";
import { Moon } from "./components/sections/Moon";
import { Mission } from "./components/sections/Mission";
import { Rocks } from "./components/sections/Belt";
import { Europa } from "./components/sections/Europa";
import { DeepField } from "./components/sections/DeepField";
import { Signal } from "./components/sections/Signal";
import "./index.css";

export function App() {
  const [ready, setReady] = useState(false);
  const [scene, setScene] = useState({ index: 0, direction: 1 as 1 | -1 });

  useEffect(() => onScene((index, direction) => setScene({ index, direction })), []);

  // Хөөрсний дараа л scroll, swipe, гарын товч scene шилжүүлнэ
  useEffect(() => (ready ? bindNavigation() : undefined), [ready]);

  const props = (i: number) => ({ active: scene.index === i, direction: scene.direction, ready });

  return (
    <>
      <Sky />
      <SpaceCanvas />
      <Countdown onLiftoff={() => setReady(true)} />
      <Nav current={scene.index} />
      <Altimeter current={scene.index} />
      <main className="relative h-[100svh] overflow-hidden">
        <Launch {...props(0)} />
        <About {...props(1)} />
        <Orbit {...props(2)} />
        <Moon {...props(3)} />
        <Mission id="mars" mission={malchin} body="mars" {...props(4)} />
        <Mission id="belt" mission={vesta} body="vesta" flip {...props(5)} />
        <Rocks {...props(6)} />
        <Europa {...props(7)} />
        <Mission id="saturn" mission={safepath} body="saturn" flip {...props(8)} />
        <DeepField {...props(9)} />
        <Signal {...props(10)} />
      </main>
    </>
  );
}

export default App;
