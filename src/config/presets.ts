export type SizePreset = { id: string; label: string; w: number; h: number };

export const EXPORT_PRESETS: SizePreset[] = [
  { id: "ig_square", label: "Instagram 1080×1080", w: 1080, h: 1080 },
  { id: "ig_story",  label: "Story 1080×1920",     w: 1080, h: 1920 },
  { id: "x_post",    label: "X 1200×675",          w: 1200, h: 675  },
  { id: "x_header",  label: "X Header 1500×500",   w: 1500, h: 500  },
];

export const FONT_SIZE_STEPS = [24, 32, 40, 48, 56, 64, 72];
