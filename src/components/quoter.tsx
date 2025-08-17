"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Align, buildSVG, exportPNG, exportSVG } from "@/utils/svg";

type Preset = { id: string; label: string; w: number; h: number };
const PRESETS: Preset[] = [
  { id: "ig_square", label: "Instagram Post (1080×1080)", w: 1080, h: 1080 },
  { id: "ig_story", label: "Instagram Story (1080×1920)", w: 1080, h: 1920 },
  { id: "x_post",   label: "X Post (1200×675)",            w: 1200, h: 675  },
  { id: "x_header", label: "X Header (1500×500)",          w: 1500, h: 500  },
];

export default function Quoter() {
  // keep typing fluid: store text only in a ref while typing
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [snapshot, setSnapshot] = useState(""); // captured when opening modal

  // render/export settings
  const [w, setW] = useState(1200);
  const [h, setH] = useState(675);
  const [align, setAlign] = useState<Align>("left");
  const fontCss = "var(--font-inter), ui-sans-serif, system-ui";
  const fontSize = 48;
  const lineHeight = 1.38;
  const padding = 64;
  const radius = 16;
  const bg = "#0b0f19";
  const fg = "#c7d2fe";
  const [pngScale, setPngScale] = useState(2);

  // modal
  const [open, setOpen] = useState(false);
  const [format, setFormat] = useState<"png" | "svg">("png");

  // auto focus for immediate caret
  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  // keyboard: Tab cycles alignment, Ctrl/Cmd+E opens export
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "e") {
        e.preventDefault();
        openExport();
      }
      if (e.key === "Tab") {
        e.preventDefault();
        setAlign((prev) =>
          prev === "left" ? "center" : prev === "center" ? "right" : "left"
        );
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const previewScale = useMemo(() => Math.min(720 / w, 420 / h), [w, h]);

  function openExport() {
    setSnapshot(textareaRef.current?.value ?? "");
    setOpen(true);
  }

  async function handleDownload() {
    const svg = buildSVG({
      w, h, bg, fg, radius, padding,
      fontCss, fontSize, lineHeight, align,
      text: snapshot || "start typing…",
    });
    if (format === "svg") exportSVG(svg, `quoter_${w}x${h}.svg`);
    else await exportPNG(svg, w, h, `quoter_${w}x${h}.png`, pngScale);
    setOpen(false);
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#0b0f19] text-[#c7d2fe]">
      {/* full-screen textarea editor */}
      <div className="flex-1 flex items-center justify-center px-6">
        <textarea
          ref={textareaRef}
          spellCheck={false}
          autoCorrect="off"
          autoCapitalize="off"
          placeholder="start typing…"
          className={[
            "w-full max-w-5xl h-[66vh] md:h-[72vh]",
            "bg-transparent outline-none border-0 resize-none",
            "text-[48px] leading-[1.38] font-mono caret-indigo-300",
            "selection:bg-indigo-300/25 selection:text-indigo-100",
            "placeholder:text-indigo-200/30",
          ].join(" ")}
          style={{
            fontFamily: fontCss,
            padding: `${padding}px 0`,
            textAlign: align as any,
            color: fg,
          }}
        />
      </div>

      {/* bottom bar */}
      <div className="sticky bottom-0 w-full bg-[#0b0f19]/80 backdrop-blur supports-[backdrop-filter]:bg-[#0b0f19]/60 border-t border-white/5">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-4 px-4 py-3">
          <div className="text-xs text-indigo-200/70 select-none">
            Tip: <kbd className="px-1 py-0.5 rounded bg-white/10">Tab</kbd> cycles alignment ·{" "}
            <kbd className="px-1 py-0.5 rounded bg-white/10">Ctrl/⌘</kbd>+<kbd className="px-1 py-0.5 rounded bg-white/10">E</kbd> export
          </div>
          <button
            onClick={openExport}
            className="px-4 py-2 rounded-xl bg-indigo-400 text-[#0b0f19] font-medium hover:bg-indigo-300 transition"
          >
            Export
          </button>
        </div>
      </div>

      {/* export modal */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60" onClick={() => setOpen(false)} />
          <div className="relative w-[min(680px,calc(100%-2rem))] rounded-2xl bg-[#0e1424] text-indigo-100 shadow-2xl border border-white/10 p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm uppercase tracking-wider text-indigo-200/70">Export</h2>
              <button onClick={() => setOpen(false)} className="text-indigo-200/70 hover:text-white">✕</button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-3">
                <label className="block text-sm text-indigo-200/80">Presets</label>
                <div className="flex flex-wrap gap-2">
                  {PRESETS.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => { setW(p.w); setH(p.h); }}
                      className="px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs"
                    >
                      {p.label}
                    </button>
                  ))}
                </div>

                <label className="block text-sm text-indigo-200/80 mt-4">Custom size (px)</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    className="w-28 bg-transparent border border-white/15 rounded-lg px-2 py-1 outline-none"
                    value={w}
                    onChange={(e) => setW(parseInt(e.target.value || "0"))}
                  />
                  <span>×</span>
                  <input
                    type="number"
                    className="w-28 bg-transparent border border-white/15 rounded-lg px-2 py-1 outline-none"
                    value={h}
                    onChange={(e) => setH(parseInt(e.target.value || "0"))}
                  />
                </div>

                <div className="flex items-center gap-3 mt-3">
                  <label className="text-sm text-indigo-200/80">Alignment</label>
                  <select
                    value={align}
                    onChange={(e) => setAlign(e.target.value as Align)}
                    className="bg-transparent border border-white/15 rounded-lg px-2 py-1 outline-none"
                  >
                    <option className="bg-[#0e1424]" value="left">Left</option>
                    <option className="bg-[#0e1424]" value="center">Center</option>
                    <option className="bg-[#0e1424]" value="right">Right</option>
                  </select>
                </div>

                {format === "png" && (
                  <div className="flex items-center gap-3 mt-3">
                    <label className="text-sm text-indigo-200/80">PNG scale</label>
                    <input
                      type="number"
                      min={1}
                      max={4}
                      className="w-20 bg-transparent border border-white/15 rounded-lg px-2 py-1 outline-none"
                      value={pngScale}
                      onChange={(e) => setPngScale(parseInt(e.target.value || "1"))}
                    />
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <label className="block text-sm text-indigo-200/80">Preview</label>
                <div
                  className="border border-white/10 rounded-xl overflow-hidden"
                  style={{
                    transform: `scale(${previewScale})`,
                    transformOrigin: "top left",
                    width: w,
                    height: h,
                    background: bg,
                    borderRadius: radius,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent:
                        align === "left" ? "flex-start" : align === "right" ? "flex-end" : "center",
                      width: "100%",
                      height: "100%",
                      padding,
                      textAlign: align,
                      color: fg,
                      fontFamily: fontCss,
                      fontSize,
                      lineHeight,
                      whiteSpace: "pre-wrap",
                      wordBreak: "break-word",
                    }}
                  >
                    {snapshot || "start typing…"}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <label className="text-sm text-indigo-200/80">Format</label>
                  <select
                    value={format}
                    onChange={(e) => setFormat(e.target.value as "png" | "svg")}
                    className="bg-transparent border border-white/15 rounded-lg px-2 py-1 outline-none"
                  >
                    <option className="bg-[#0e1424]" value="png">PNG</option>
                    <option className="bg-[#0e1424]" value="svg">SVG</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="mt-5 flex justify-end gap-2">
              <button onClick={() => setOpen(false)} className="px-3 py-2 rounded-xl border border-white/15">
                Cancel
              </button>
              <button onClick={handleDownload} className="px-4 py-2 rounded-xl bg-indigo-400 text-[#0b0f19] font-medium hover:bg-indigo-300">
                Download
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
