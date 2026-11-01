import { dusal } from "@/data/portfolio";
import { Mission } from "./Mission";

interface Props {
  active: boolean;
  direction: 1 | -1;
  ready: boolean;
}

/** Европа: мөсөн доороо далайтай дагуул. Дусал — аяганы доор load cell-тэй суурь */
export function Europa(props: Props) {
  // Ус ууснаас утсанд хүрэх хүртэлх дамжлага
  const pipeline = (
    <ol className="rv mt-6 flex flex-wrap items-center gap-y-2 text-sm" aria-label="Балгалт хэрхэн дамждаг вэ">
      {dusal.pipeline.map((p, i) => (
        <li key={p.name} className="flex items-center">
          <span className="rounded-full border border-[#8fd3ff]/50 bg-space/40 px-3 py-1" title={p.detail}>
            {p.name}
          </span>
          {i < dusal.pipeline.length - 1 && <span className="mx-1.5 h-px w-4 bg-[#8fd3ff]/60" aria-hidden />}
        </li>
      ))}
    </ol>
  );

  return <Mission id="europa" mission={dusal} body="europa" extra={pipeline} {...props} />;
}
