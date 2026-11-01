import type { Shot } from "@/data/portfolio";

interface DeviceFrameProps {
  shot: Shot;
  alt: string;
  className?: string;
}

/** Жинхэнэ screenshot-ыг browser цонх эсвэл утасны хүрээнд харуулна */
export function DeviceFrame({ shot, alt, className = "" }: DeviceFrameProps) {
  if (shot.device === "phone") {
    return (
      <div className={`device-phone rounded-[2.6rem] bg-[#0d0d0f] p-2.5 shadow-[0_40px_80px_-24px_rgba(0,0,0,0.55)] ${className}`}>
        <div className="relative overflow-hidden rounded-[2.1rem] bg-black">
          <img src={shot.src} alt={alt} loading="lazy" className="block aspect-[390/844] w-full object-cover object-top" />
          <span className="absolute left-1/2 top-2 h-5 w-20 -translate-x-1/2 rounded-full bg-black" aria-hidden />
        </div>
      </div>
    );
  }

  return (
    <div className={`device-browser overflow-hidden rounded-2xl bg-[#1c1c20] shadow-[0_40px_80px_-24px_rgba(0,0,0,0.55)] ${className}`}>
      <div className="flex items-center gap-3 px-4 py-2.5">
        <span className="flex gap-1.5" aria-hidden>
          <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
        </span>
        <span className="flex-1 truncate rounded-md bg-white/10 px-3 py-1 text-center text-xs text-white/70">{shot.url}</span>
      </div>
      <img src={shot.src} alt={alt} loading="lazy" className="block aspect-[16/9.4] w-full object-cover" />
    </div>
  );
}
