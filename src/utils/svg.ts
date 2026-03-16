export type Align = "left" | "center" | "right";

export function escapeHtml(s: string) {
  return s
    .replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;").replaceAll("'", "&#39;");
}

export function buildSVG(opts: {
  w: number; h: number; bg: string; fg: string;
  radius: number; padding: number; align: Align;
  fontCss: string; fontSize: number; lineHeight: number; text: string;
}) {
  const { w,h,bg,fg,radius,padding,align,fontCss,fontSize,lineHeight,text } = opts;
  const justify = align === "left" ? "flex-start" : align === "right" ? "flex-end" : "center";
  return `<?xml version="1.0" encoding="UTF-8"?>\n<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <rect width="${w}" height="${h}" rx="${radius}" ry="${radius}" fill="${bg}"/>
  <foreignObject x="0" y="0" width="${w}" height="${h}">
    <div xmlns="http://www.w3.org/1999/xhtml" style="display:flex;align-items:center;justify-content:${justify};width:100%;height:100%;text-align:${align};">
      <div style="padding:${padding}px;width:100%;color:${fg};font-size:${fontSize}px;line-height:${lineHeight};font-family:${fontCss};white-space:pre-wrap;word-break:break-word;">${escapeHtml(text)}</div>
    </div>
  </foreignObject>
</svg>`;
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}

export function exportSVG(svgString: string, filename = "quoter.svg") {
  downloadBlob(new Blob([svgString], { type: "image/svg+xml;charset=utf-8" }), filename);
}

/** Word-wrap a single paragraph into lines that fit within maxWidth. */
function wrapParagraph(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  if (!text) return [""];
  const words = text.split(" ");
  const lines: string[] = [];
  let current = "";
  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (ctx.measureText(candidate).width > maxWidth && current) {
      lines.push(current);
      current = word;
    } else {
      current = candidate;
    }
  }
  if (current) lines.push(current);
  return lines;
}

/**
 * Export PNG using the Canvas API.
 * Uses already-loaded browser fonts so the rendered text exactly matches
 * what the user sees in the editor (no SVG-foreignObject / CSS-variable issues).
 */
export async function exportPNG(opts: {
  w: number; h: number; bg: string; fg: string;
  radius: number; padding: number; align: Align;
  /** Actual CSS font-family, no CSS variables — e.g. "'Bebas Neue', Impact, sans-serif" */
  fontFamily: string;
  fontSize: number; lineHeight: number; text: string;
}, filename: string, scale = 2) {
  // Wait for all web fonts (loaded via next/font) to be painted-ready
  await document.fonts.ready;

  const { w, h, bg, fg, radius, padding, align, fontFamily, fontSize, lineHeight, text } = opts;

  const canvas = document.createElement("canvas");
  canvas.width  = Math.max(1, Math.floor(w * scale));
  canvas.height = Math.max(1, Math.floor(h * scale));
  const ctx = canvas.getContext("2d")!;

  ctx.scale(scale, scale);

  // ── Background ──────────────────────────────────────────────────────────────
  ctx.fillStyle = bg;
  if (radius > 0 && typeof ctx.roundRect === "function") {
    ctx.beginPath();
    ctx.roundRect(0, 0, w, h, radius);
    ctx.fill();
  } else {
    ctx.fillRect(0, 0, w, h);
  }

  // ── Text setup ──────────────────────────────────────────────────────────────
  const body = (text || "Let it flow…").trimEnd();
  const lh   = fontSize * lineHeight;
  const maxW  = w - padding * 2;

  ctx.font         = `${fontSize}px ${fontFamily}`;
  ctx.fillStyle    = fg;
  ctx.textAlign    = align;
  ctx.textBaseline = "top";

  // Wrap each hard line individually
  const allLines: string[] = [];
  for (const para of body.split("\n")) {
    const wrapped = wrapParagraph(ctx, para, maxW);
    allLines.push(...wrapped);
  }

  // Vertically center the text block, clamped to padding
  const blockH  = allLines.length * lh;
  const startY  = Math.max(padding, (h - blockH) / 2);
  const startX  = align === "center" ? w / 2 : align === "right" ? w - padding : padding;

  allLines.forEach((line, i) => {
    ctx.fillText(line, startX, startY + i * lh, maxW);
  });

  // ── Download ─────────────────────────────────────────────────────────────────
  await new Promise<void>((resolve) => {
    canvas.toBlob((blob) => {
      if (blob) downloadBlob(blob, filename);
      resolve();
    }, "image/png");
  });
}
