import { useState } from "react";
import { FONT_ITEMS } from "@/config/fonts";

type Props = {
  activeIndex: number;
  setActiveIndex: (i: number) => void;
};

export default function FontCarousel({ activeIndex, setActiveIndex }: Props) {
  const COUNT = FONT_ITEMS.length;
  const mod = (i: number) => ((i % COUNT) + COUNT) % COUNT;

  const prev = mod(activeIndex - 1);
  const next = mod(activeIndex + 1);
  const prev2 = mod(activeIndex - 2);
  const next2 = mod(activeIndex + 2);

  // animation state: idle | left (to previous) | right (to next) | snap (instant recenter)
  const [anim, setAnim] = useState<"idle" | "left" | "right" | "snap">("idle");

  // one logical step
  const step = (dir: -1 | 1) => {
    if (anim !== "idle") return;
    setAnim(dir === -1 ? "left" : "right");
  };

  // keyboard navigation disabled (arrow keys no-op)

  // after the slide finishes, update activeIndex and reset animation
  const onTransitionEnd: React.TransitionEventHandler<HTMLDivElement> = (e) => {
    // Only react to the sliding container's transform transition, not children
    if (e.target !== e.currentTarget || e.propertyName !== "transform") return;
    const newIndex = anim === "left" ? prev : anim === "right" ? next : activeIndex;
    // 1) Snap lane to the centered pose first (no transition)
    setAnim("snap");
    // 2) In the next frame, swap the active index while still snapped
    requestAnimationFrame(() => {
      if (newIndex !== activeIndex) setActiveIndex(newIndex);
      // 3) One more frame later, re-enable transitions for subsequent moves
      requestAnimationFrame(() => setAnim("idle"));
    });
  };

  // layout constants (match BottomBar)
  const ITEM_W = 160;               // button width
  const GAP = 16;                   // gap-4 (1rem)
  const STEP = ITEM_W + GAP;        // distance per slot

  // Track translation with 5 items rendered: [prev2, prev, active, next, next2]
  // Viewport shows the middle 3. Idle is positioned so the middle item (index 2) is centered.
  const transform =
    anim === "idle" || anim === "snap"
      ? `translateX(-${STEP}px)` // show [prev, active, next]
      : anim === "left"
      ? "translateX(0px)" // slide so previous becomes center
      : `translateX(-${STEP * 2}px)`; // slide so next becomes center

  return (
    <div className="mx-auto">
      {/* viewport ~3 items; no fades needed for 3-slot */}
      <div
        className="overflow-hidden"
        style={{ width: STEP * 3 - GAP /* 540px by default */ }}
        onWheel={(e) => {
          if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) step(e.deltaY > 0 ? 1 : -1);
        }}
      >
        <div
          className="flex items-center mask-fade-x"
          style={{ gap: GAP }}
        >
          <div
            className={[
              "flex items-center",
              anim === "snap" ? "transition-none" : "transition-transform duration-200 ease-out",
            ].join(" ")}
            style={{ transform }}
            onTransitionEnd={onTransitionEnd}
          >
            {[prev2, prev, activeIndex, next, next2].map((idx, slot) => (
              <button
                key={`${slot}`}
                onClick={() => {
                  if (slot === 1) step(-1); // left visible item
                  if (slot === 3) step(1);  // right visible item
                }}
                className={[
                  "shrink-0 h-10 w-[160px] text-center transition-transform duration-200 ease-out",
                  slot === 2
                    ? "scale-125 text-white"
                    : slot === 0 || slot === 4
                    ? "text-transparent pointer-events-none"
                    : "text-white/60 hover:text-white/80 scale-95",
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
