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

export async function exportPNG(svgString: string, w: number, h: number, filename = "quoter.png", scale = 1) {
  const svgBlob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(svgBlob);
  await new Promise<void>((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = Math.max(1, Math.floor(w * scale));
      canvas.height = Math.max(1, Math.floor(h * scale));
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.scale(scale, scale);
        ctx.drawImage(img, 0, 0);
        canvas.toBlob((blob) => { if (blob) downloadBlob(blob, filename); URL.revokeObjectURL(url); resolve(); }, "image/png");
      } else { URL.revokeObjectURL(url); resolve(); }
    };
    img.onerror = () => resolve();
    img.src = url;
  });
}
