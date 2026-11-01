import type { CSSProperties } from "react";
import type { FeaturedVisual } from "@/data/portfolio";

const GARMENTS = [
  { name: "Jacket", from: "#8b3dff", to: "#d9b8ff" },
  { name: "Tee", from: "#ff6fb1", to: "#ffd3e8" },
  { name: "Jeans", from: "#3d6bff", to: "#b8c8ff" },
  { name: "Sneakers", from: "#ff9f1a", to: "#ffe1b3" },
  { name: "Coat", from: "#1b0b2e", to: "#6b4a99" },
  { name: "Dress", from: "#00b894", to: "#b3f5e4" },
];

/** Vesta: 3D-ээр эргэлддэг хувцасны карусель + AI үнэлгээ */
function VestaVisual() {
  return (
    <div className="relative flex h-full w-full items-center justify-center [perspective:1100px]">
      <div className="vesta-ring relative h-[230px] w-[160px] md:h-[280px] md:w-[180px]">
        {GARMENTS.map((g, i) => (
          <div
            key={g.name}
            className="absolute inset-0 flex flex-col justify-between rounded-3xl p-4 text-white shadow-2xl [backface-visibility:hidden]"
            style={
              {
                background: `linear-gradient(160deg, ${g.from}, ${g.to})`,
                transform: `rotateY(${i * (360 / GARMENTS.length)}deg) translateZ(clamp(170px, 16vw, 240px))`,
              } as CSSProperties
            }
          >
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] opacity-80">0{i + 1}</span>
            <div className="mx-auto h-24 w-20 rounded-t-[40%] rounded-b-xl border-2 border-white/70 bg-white/20 md:h-28 md:w-24" />
            <span className="font-display text-2xl font-black uppercase">{g.name}</span>
          </div>
        ))}
      </div>
      <div className="vesta-chip absolute bottom-[12%] left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full bg-[#1b0b2e] px-5 py-2.5 text-sm text-white shadow-xl">
        <span className="h-2 w-2 rounded-full bg-[#2ee59d]" />
        AI rating <b className="font-display text-lg">8.7</b>/10
      </div>
    </div>
  );
}

const ROUTE = "M60 330 L60 230 L170 230 L170 120 L300 120 L300 60";

/** SafePath: газрын зураг дээр хүүхэд замаар гэр лүү явна, аюулгүй бүс лугшина */
function SafePathVisual() {
  return (
    <div className="relative flex h-full w-full items-center justify-center">
      <div className="relative aspect-square w-[min(80%,420px)] overflow-hidden rounded-[32px] bg-[#04261a] shadow-2xl">
        <svg viewBox="0 0 360 360" className="absolute inset-0 h-full w-full">
          {[40, 100, 160, 220, 280, 340].map(v => (
            <g key={v} stroke="#0b4d33" strokeWidth="10">
              <line x1={v} y1="0" x2={v} y2="360" />
              <line x1="0" y1={v} x2="360" y2={v} />
            </g>
          ))}
          <circle cx="300" cy="60" r="34" fill="#00a86b" opacity="0.15" className="safe-zone" />
          <circle cx="300" cy="60" r="34" fill="none" stroke="#00e08f" strokeDasharray="4 6" />
          <path d={ROUTE} fill="none" stroke="#00e08f" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" className="route-draw" pathLength={1} />
          <path d="M288 66 L300 52 L312 66 V76 H288Z" fill="#fff" />
          <g>
            <circle r="16" fill="#00e08f" opacity="0.35" />
            <circle r="8" fill="#fff" />
            <animateMotion dur="6s" repeatCount="indefinite" path={ROUTE} keyPoints="0;1;1" keyTimes="0;0.6;1" calcMode="linear" />
          </g>
        </svg>
        {/* Камерын viewfinder */}
        <div className="pointer-events-none absolute inset-4">
          {["left-0 top-0 border-l-2 border-t-2", "right-0 top-0 border-r-2 border-t-2", "bottom-0 left-0 border-b-2 border-l-2", "bottom-0 right-0 border-b-2 border-r-2"].map(c => (
            <span key={c} className={`absolute h-6 w-6 border-white/70 ${c}`} />
          ))}
        </div>
        <div className="absolute left-5 top-5 rounded-full bg-white/90 px-3 py-1.5 text-xs font-medium text-[#04261a]">AI · Гарц урд байна</div>
        <div className="absolute bottom-5 right-5 rounded-xl bg-white px-3 py-2 text-xs text-[#04261a] shadow-lg">
          🔋 64% · <b>Гэрт 320 м</b>
        </div>
      </div>
    </div>
  );
}

/** Malchin: шөнийн тал нутаг, гэр, бэлчээж буй хонь, тоглоомын HUD */
function MalchinVisual() {
  return (
    <div className="relative flex h-full w-full items-center justify-center">
      <div className="relative aspect-[4/3] w-[min(90%,520px)] overflow-hidden rounded-[28px] shadow-2xl [image-rendering:pixelated]">
        <svg viewBox="0 0 400 300" className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid slice">
          <defs>
            <linearGradient id="mc-sky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#1a1030" />
              <stop offset="0.65" stopColor="#7a3b6e" />
              <stop offset="1" stopColor="#ffb347" />
            </linearGradient>
          </defs>
          <rect width="400" height="300" fill="url(#mc-sky)" />
          {[
            [40, 30],
            [90, 60],
            [150, 20],
            [230, 45],
            [330, 25],
            [370, 70],
            [270, 15],
          ].map(([x, y], i) => (
            <rect key={i} x={x} y={y} width="3" height="3" fill="#fff" className="mc-star" style={{ animationDelay: `${i * 0.4}s` }} />
          ))}
          <circle cx="320" cy="70" r="22" fill="#fff4e0" />
          <path d="M0 200 L60 150 L110 185 L170 130 L240 190 L300 145 L400 195 V300 H0Z" fill="#3b2457" />
          <path d="M0 230 L80 205 L160 225 L260 200 L400 228 V300 H0Z" fill="#2a5a3a" />
          <rect y="250" width="400" height="50" fill="#1f4a2c" />
          {/* Гэр */}
          <g transform="translate(70 200)">
            <path d="M0 40 V18 L35 0 L70 18 V40Z" fill="#fff4e0" />
            <path d="M0 18 L35 0 L70 18" fill="none" stroke="#c0392b" strokeWidth="4" />
            <rect x="28" y="22" width="14" height="18" fill="#c0392b" />
            <rect x="33" y="-6" width="4" height="8" fill="#5a3a2a" />
          </g>
          <g className="mc-smoke" fill="#fff" opacity="0.5">
            <circle cx="107" cy="186" r="4" />
            <circle cx="112" cy="176" r="5" />
          </g>
        </svg>
        {[0, 1, 2].map(i => (
          <span key={i} className="mc-sheep" style={{ bottom: `${10 + i * 5}%`, animationDelay: `${i * -3}s`, animationDuration: `${11 + i * 3}s` }}>
            <span />
          </span>
        ))}
        {/* HUD */}
        <div className="absolute left-3 top-3 space-y-1.5 font-mono text-[11px] text-white">
          <div className="flex gap-1">
            {[1, 1, 1, 0.3].map((o, i) => (
              <span key={i} style={{ opacity: o }} className="text-[#ff5b5b]">
                ♥
              </span>
            ))}
          </div>
          <div className="h-1.5 w-24 rounded-sm bg-black/50">
            <div className="h-full w-2/3 rounded-sm bg-[#ffd166]" />
          </div>
        </div>
        <div className="absolute right-3 top-3 rounded-md bg-black/50 px-2 py-1 font-mono text-[11px] text-[#ffd166]">Өдөр 12 · 🪙 340</div>
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-md bg-black/60 px-3 py-1.5 font-mono text-[11px] text-white">
          [E] Хонь туух
        </div>
      </div>
    </div>
  );
}

export function FeaturedVisualView({ type }: { type: FeaturedVisual }) {
  if (type === "vesta") return <VestaVisual />;
  if (type === "safepath") return <SafePathVisual />;
  return <MalchinVisual />;
}
