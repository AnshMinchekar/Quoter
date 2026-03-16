export type FontItem = {
  label: string;
  /** CSS font-family used in the live textarea (may include CSS vars) */
  css: string;
  /** CSS font-family used when painting to canvas for PNG export (no CSS vars) */
  exportFamily: string;
};

export const FONT_ITEMS: FontItem[] = [
  { label: "Bebas Neue",      css: "var(--font-bebas), Impact, sans-serif",          exportFamily: "'Bebas Neue', Impact, sans-serif" },
  { label: "Times New Roman", css: "'Times New Roman', Times, serif",                exportFamily: "'Times New Roman', Times, serif" },
  { label: "Open Sans",       css: "var(--font-open), Arial, Helvetica, sans-serif", exportFamily: "'Open Sans', Arial, sans-serif" },
  { label: "Playfair",        css: "var(--font-playfair), Georgia, serif",           exportFamily: "'Playfair Display', Georgia, serif" },
  { label: "Inter",           css: "var(--font-inter), system-ui, sans-serif",       exportFamily: "'Inter', system-ui, sans-serif" },
  { label: "Roboto Slab",     css: "var(--font-slab), Georgia, serif",               exportFamily: "'Roboto Slab', Georgia, serif" },
  { label: "Space Mono",      css: "var(--font-mono), ui-monospace, monospace",      exportFamily: "'Space Mono', ui-monospace, monospace" },
];
