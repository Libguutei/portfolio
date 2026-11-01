import { gsap, useGSAP } from "@/lib/gsap";

/** Хуудасны ард тогтмол тэнгэр: хөөрөхөөс тойрог зам хүртэл өдрийн цэнхэрээс сансрын хар руу шилжинэ */
export function Sky() {
  useGSAP(() => {
    const root = document.documentElement;
    gsap
      .timeline({
        scrollTrigger: { trigger: "#launch", start: "top top", endTrigger: "#orbit", end: "top 40%", scrub: true },
      })
      .to(root, { "--sky-top": "#1747c9", "--sky-bottom": "#7fb6ff", "--sun": 0.7, ease: "none" })
      .to(root, { "--sky-top": "#06103a", "--sky-bottom": "#1d3f9e", "--sun": 0.3, ease: "none" })
      .to(root, { "--sky-top": "#04050d", "--sky-bottom": "#070a1c", "--sun": 0, ease: "none" });
  });

  return (
    <div className="sky" aria-hidden>
      <div className="sky-sun" />
    </div>
  );
}
