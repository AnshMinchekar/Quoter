import { useEffect, useState } from "react";
import { FONT_ITEMS } from "@/config/fonts";

type Props = {
  activeIndex: number;
  setActiveIndex: (i: number) => void;
};

/**
 * Closed-loop, 3-slot picker:
 * - Always renders [prev, active, next]
 * - Slide animation left/right, then re-center with new neighbors
 * - Active font is only scaled (no pill)
 * - Click left/right item, arrow keys, or mouse wheel to step
 */
export default function FontCarousel({ activeIndex, setActiveIndex }: Props) {
  const COUNT = FONT_ITEMS.length;
  const mod = (i: number) => ((i % COUNT) + COUNT) % COUNT;

  const prev = mod(activeIndex - 1);
  const next = mod(activeIndex + 1);

  // animation state: idle | left (to previous) | right (to next)
  const [anim, setAnim] = useState<"idle" | "left" | "right">("idle");

  // one logical step
  const step = (dir: -1 | 1) => {
    if (anim !== "idle") return;
    setAnim(dir === -1 ? "left" : "right");
  };

  // keys + wheel
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") step(-1);
      if (e.key === "ArrowRight") step(1);
    };
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) step(e.deltaY > 0 ? 1 : -1);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("wheel", onWheel, { passive: true });
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("wheel", onWheel);
    };
  }, [anim]);

  // after the slide finishes, update activeIndex and reset animation
  const onTransitionEnd = () => {
    if (anim === "left") setActiveIndex(prev);
    if (anim === "right") setActiveIndex(next);
    setAnim("idle");
  };

  // layout constants (match BottomBar)
  const ITEM_W = 160;               // button width
  const GAP = 16;                   // gap-4 (1rem)
  const STEP = ITEM_W + GAP;        // distance per slot

  // track x: center = -STEP; left = 0; right = -STEP*2
  const transform =
    anim === "idle"
      ? `translateX(-${STEP}px)`
      : anim === "left"
      ? "translateX(0px)"
      : `translateX(-${STEP * 2}px)`;

  return (
    <div className="mx-auto">
      {/* viewport ~3 items; no fades needed for 3-slot */}
      <div className="overflow-hidden" style={{ width: STEP * 3 - GAP /* 540px by default */ }}>
        <div
          className="flex items-center"
          style={{ gap: GAP }}
        >
          <div
            className="flex items-center transition-transform duration-200 ease-out"
            style={{ transform }}
            onTransitionEnd={onTransitionEnd}
          >
            {[prev, activeIndex, next].map((idx, slot) => (
              <button
                key={`${idx}-${slot}`}
                onClick={() => {
                  if (slot === 0) step(-1);
                  if (slot === 2) step(1);
                }}
                className={[
                  "shrink-0 h-10 w-[160px] text-center transition-transform duration-200 ease-out",
                  slot === 1 ? "scale-110 text-white" : "text-white/75 hover:text-white",
                ].join(" ")}
                style={{ fontFamily: FONT_ITEMS[idx].css }}
                title={FONT_ITEMS[idx].label}
              >
                {FONT_ITEMS[idx].label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
