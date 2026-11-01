import { useEffect, useRef } from "react";
import { Space } from "@/three/Space";

/** 3D сансрын canvas — тэнгэрийн градиентийн дээр, контентын ард */
export function SpaceCanvas() {
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvas.current) return;
    let space: Space | null = null;
    try {
      space = new Space(canvas.current);
    } catch {
      // WebGL байхгүй бол CSS тэнгэр л харагдана
      canvas.current.style.display = "none";
    }
    return () => space?.dispose();
  }, []);

  return <canvas ref={canvas} className="pointer-events-none fixed inset-0 z-[-1] h-full w-full" aria-hidden />;
}
