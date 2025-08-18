import { useRef, useState } from "react";
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
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // persistent UI settings
  const [settings, setSettings] = useLocalSettings("quoter:v1", {
    bg: DEFAULTS.bg,
    fg: DEFAULTS.fg,
    fontIndex: 2,  // Open Sans
    sizeIndex: 1,  // 32
    align: "left" as Align,
  });

  const fontSize = FONT_SIZE_STEPS[settings.sizeIndex];

  // export modal state
  const [exportOpen, setExportOpen] = useState(false);
  const [expW, setExpW] = useState(DEFAULTS.exportW);
  const [expH, setExpH] = useState(DEFAULTS.exportH);

  const setBg = (bg: string) => setSettings({ ...settings, bg });
  const setFg = (fg: string) => setSettings({ ...settings, fg });
  const setFontIndex = (i: number) => setSettings({ ...settings, fontIndex: i });
  const cycleFontSize = () =>
    setSettings({ ...settings, sizeIndex: (settings.sizeIndex + 1) % FONT_SIZE_STEPS.length });
  const cycleAlign = () =>
    setSettings({
      ...settings,
      align:
        settings.align === "left" ? "center" :
        settings.align === "center" ? "right" : "left",
    });

  useKeyboardShortcuts({
    onExport: () => setExportOpen(true),
    onCycleAlign: cycleAlign,
    onEscape: () => setExportOpen(false),
  });

  return (
    <div
      className="min-h-screen grid grid-rows-[auto,auto,auto,auto]"
      style={{ backgroundColor: settings.bg, color: settings.fg }}
    >
      {/* Top bar */}
      <TopBar bg={settings.bg} setBg={setBg} onExport={() => setExportOpen(true)} />

      {/* Content (auto-grows; page scrolls) */}
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

      {/* Bottom bar */}
      <BottomBar
        fontSize={fontSize}
        onNextFontSize={cycleFontSize}
        fontIndex={settings.fontIndex}
        setFontIndex={setFontIndex}
        fg={settings.fg}
        setFg={setFg}
      />

      {/* Footer line + note */}
      <div className="relative">
        <div className="border-t border-white/15" />
        <div className="absolute inset-0 -translate-y-1 flex items-center justify-center pointer-events-none">
          <span className="px-3 text-xs text-white/60">Made with boredom 💙</span>
        </div>
      </div>

      {/* Export modal (no preview) */}
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
