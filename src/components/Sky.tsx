import { useEffect } from "react";
import { gsap } from "@/lib/gsap";
import { journey } from "@/lib/journey";

/** Хуудасны ард тогтмол тэнгэр: Улаанбаатараас тойрог зам хүрэх хооронд цэнхэрээс сансрын хар руу шилжинэ */
export function Sky() {
  useEffect(() => {
    const root = document.documentElement;
    const tl = gsap
      .timeline({ paused: true })
      .to(root, { "--sky-top": "#1747c9", "--sky-bottom": "#7fb6ff", ease: "none" })
      .to(root, { "--sky-top": "#06103a", "--sky-bottom": "#1d3f9e", ease: "none" })
      .to(root, { "--sky-top": "#04050d", "--sky-bottom": "#070a1c", ease: "none" });

    // Аялал үүлсээс (0) тойрог зам (1) хүрэх хооронд тэнгэр бүрэн харанхуйлна
    const tick = () => {
      tl.progress(Math.min(1, Math.max(0, (journey.progress + 1) / 2)));
    };
    gsap.ticker.add(tick);
    return () => {
      gsap.ticker.remove(tick);
      tl.kill();
    };
  }, []);

  return <div className="sky" aria-hidden />;
}
