import { useEffect } from "react";

type Handlers = {
  onExport?: () => void;
  onCycleAlign?: () => void;
  onEscape?: () => void;
};

export default function useKeyboardShortcuts(h: Handlers) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();

      if ((e.ctrlKey || e.metaKey) && k === "e") {
        e.preventDefault(); h.onExport?.(); return;
      }
      if (e.key === "Tab") {
        e.preventDefault(); h.onCycleAlign?.(); return;
      }
      if (k === "escape") {
        h.onEscape?.();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [h.onExport, h.onCycleAlign, h.onEscape]);
}
