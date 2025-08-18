import { useState } from "react";
import { EXPORT_PRESETS } from "@/config/presets";
import { buildSVG, exportPNG, exportSVG } from "@/utils/svg";
import type { Align } from "@/utils/svg";

type Props = {
  open: boolean;
  onClose: () => void;

  text: string;
  bg: string;
  fg: string;
  fontCss: string;

  w: number;
  h: number;
  setW: (n: number) => void;
  setH: (n: number) => void;

  align: Align;
  fontSize: number;
  lineHeight: number;
  padding: number;
  radius: number;
};

export default function ExportModal(props: Props) {
  const {
    open, onClose, text, bg, fg, fontCss,
    w, h, setW, setH,
    align, fontSize, lineHeight, padding, radius,
  } = props;

  const [pngScale, setPngScale] = useState(2);
  if (!open) return null;

  async function doExport(kind: "png" | "svg") {
    const svg = buildSVG({
      w, h, bg, fg, radius, padding,
      align, fontCss, fontSize, lineHeight, text: text || "Let it flow…",
    });
    if (kind === "svg") exportSVG(svg, `quoter_${w}x${h}.svg`);
    else await exportPNG(svg, w, h, `quoter_${w}x${h}.png`, pngScale);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative w-[min(560px,calc(100%-2rem))] rounded-2xl bg-[#111] text-white shadow-2xl border border-white/15 p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm uppercase tracking-wider text-white/70">Export</h2>
          <button onClick={onClose} className="text-white/70 hover:text-white">✕</button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm text-white/80">Presets</label>
            <div className="mt-2 flex flex-wrap gap-2">
              {EXPORT_PRESETS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => { setW(p.w); setH(p.h); }}
                  className="px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-xs"
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm text-white/80">Custom size (px)</label>
            <div className="mt-2 flex items-center gap-2">
              <input
                type="number"
                className="w-28 bg-transparent border border-white/20 rounded-lg px-2 py-1 outline-none"
                value={w}
                onChange={(e) => setW(parseInt(e.target.value || "0"))}
              />
              <span>×</span>
              <input
                type="number"
                className="w-28 bg-transparent border border-white/20 rounded-lg px-2 py-1 outline-none"
                value={h}
                onChange={(e) => setH(parseInt(e.target.value || "0"))}
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <label className="text-sm text-white/80">PNG scale</label>
            <input
              type="number"
              min={1}
              max={4}
              className="w-20 bg-transparent border border-white/20 rounded-lg px-2 py-1 outline-none"
              value={pngScale}
              onChange={(e) => setPngScale(parseInt(e.target.value || "1"))}
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              onClick={() => doExport("svg")}
              className="px-4 py-2 rounded-xl border border-white/20 hover:bg-white/10"
            >
              Export SVG
            </button>
            <button
              onClick={() => doExport("png")}
              className="px-4 py-2 rounded-xl bg-white text-black font-medium hover:bg-white/90"
            >
              Export PNG
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
