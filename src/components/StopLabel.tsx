import { formatKm } from "@/lib/distance";
import { stops } from "@/data/portfolio";

/** Section-ийн дээрх жижиг мөр: хаана байгаа, дэлхийгээс хэр хол */
export function StopLabel({ id, className = "" }: { id: string; className?: string }) {
  const stop = stops.find(s => s.id === id);
  if (!stop) return null;
  return (
    <p className={`flex items-center gap-3 text-ink/70 ${className}`}>
      <span className="h-px w-8 bg-dawn" aria-hidden />
      {stop.place}, {formatKm(stop.km)} from Earth
    </p>
  );
}
