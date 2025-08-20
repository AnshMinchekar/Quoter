// src/quoter.tsx
import { useEffect, useRef, useState } from "react";
import TopBar from "@/components/TopBar";
import BottomBar from "@/components/BottomBar";
import TypingSurface from "@/components/TypingSurface";
import ExportModal from "@/components/ExportModal";

import { FONT_ITEMS } from "@/config/fonts";
import { FONT_SIZE_STEPS } from "@/config/presets";
import { DEFAULTS } from "@/config/theme";

import useKeyboardShortcuts from "@/hooks/useKeyboardShortcuts";
import useLocalSettings from "@/hooks/useLocalSettings";
import type { Align } from "@/utils/svg";

export default function Quoter() {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  // persisted UI settings
  const [settings, setSettings] = useLocalSettings("quoter:v1", {
    bg: DEFAULTS.bg,
    fg: DEFAULTS.fg,
    fontIndex: 1, // Times New Roman by default
    sizeIndex: 0, // 24
    align: "left" as Align,
  });

  const fontSize = FONT_SIZE_STEPS[settings.sizeIndex];

  // export dialog state
  const [exportOpen, setExportOpen] = useState(false);
  const [expW, setExpW] = useState(DEFAULTS.exportW);
  const [expH, setExpH] = useState(DEFAULTS.exportH);

  // setters
  const setBg = (bg: string) => setSettings({ ...settings, bg });
  const setFg = (fg: string) => setSettings({ ...settings, fg });
  const setFontIndex = (i: number) => setSettings({ ...settings, fontIndex: i });
  const cycleFontSize = () =>
    setSettings({
      ...settings,
      sizeIndex: (settings.sizeIndex + 1) % FONT_SIZE_STEPS.length,
    });
  const cycleAlign = () =>
    setSettings({
      ...settings,
      align:
        settings.align === "left"
          ? ("center" as Align)
          : settings.align === "center"
          ? ("right" as Align)
          : ("left" as Align),
    });

  // shortcuts: Ctrl/Cmd+E open export, Tab cycles align, Esc closes modal
  useKeyboardShortcuts({
    onExport: () => setExportOpen(true),
    onCycleAlign: cycleAlign,
    onEscape: () => setExportOpen(false),
  });

  // Keep page background in sync to avoid bottom-edge white gaps on long content
  useEffect(() => {
    if (typeof document !== "undefined") {
      document.body.style.backgroundColor = settings.bg;
      document.documentElement.style.backgroundColor = settings.bg;
    }
  }, [settings.bg]);

  return (
    <div
      className="min-h-screen grid grid-rows-[auto,auto,auto,auto] overflow-x-hidden"
      style={{ backgroundColor: settings.bg, color: settings.fg }}
    >
      {/* Top bar (bg color + export) */}
      <TopBar bg={settings.bg} setBg={setBg} onExport={() => setExportOpen(true)} />

      {/* Content area (auto-grows; page scrolls, no inner scrollbar) */}
      <div className="w-full flex justify-center px-6 py-16">
        <TypingSurface
          textareaRef={textareaRef}
          color={settings.fg}
          fontCss={FONT_ITEMS[settings.fontIndex].css}
          fontSize={fontSize}
          lineHeight={DEFAULTS.lineHeight}
          paddingX={DEFAULTS.paddingX}
          paddingY={DEFAULTS.paddingY}
          align={settings.align}
          onTabAlign={cycleAlign}
        />
      </div>

      {/* Bottom bar (size chip • 3-slot font carousel • text color) */}
      <BottomBar
        fontSize={fontSize}
        onNextFontSize={cycleFontSize}
        fontIndex={settings.fontIndex}
        setFontIndex={setFontIndex}
        fg={settings.fg}
        setFg={setFg}
      />

      {/* Footer: thin line + center label */}
      <div className="relative">
        <div className="border-t border-white/15" />
        <div className="absolute inset-0 -translate-y-1 flex items-center justify-center pointer-events-none">
          <span className="px-3 text-xs text-white/60">Made with Boredom 💙</span>
        </div>
      </div>

      {/* Export (no preview) */}
      <ExportModal
        open={exportOpen}
        onClose={() => setExportOpen(false)}
        text={textareaRef.current?.value ?? ""}
        bg={settings.bg}
        fg={settings.fg}
        fontCss={FONT_ITEMS[settings.fontIndex].css}
        w={expW}
        h={expH}
        setW={setExpW}
        setH={setExpH}
        align={settings.align}
        fontSize={fontSize}
        lineHeight={DEFAULTS.lineHeight}
        padding={Math.max(DEFAULTS.paddingX, DEFAULTS.paddingY)}
        radius={DEFAULTS.radius}
      />
    </div>
  );
}
