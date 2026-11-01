import type { PlanetKind } from "@/data/portfolio";

interface PlanetProps {
  kind: PlanetKind | "jupiter";
  className?: string;
}

/** CSS-ээр зурсан гараг: гадаргуу нь аажуухан эргэж, нар зүүн дээрээс тусна */
export function Planet({ kind, className = "" }: PlanetProps) {
  if (kind === "vesta") {
    return <div className={`vesta-rock ${className}`} aria-hidden />;
  }

  if (kind === "saturn") {
    return (
      <div className={`saturn ${className}`} aria-hidden>
        <div className="saturn-ring" />
        <div className="planet planet-saturn h-full w-full">
          <div className="planet-surface" />
        </div>
        <div className="saturn-ring saturn-ring-front" />
      </div>
    );
  }

  return (
    <div className={`planet planet-${kind} ${className}`} aria-hidden>
      <div className="planet-surface" />
    </div>
  );
}
