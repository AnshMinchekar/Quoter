export type Align = "left" | "center" | "right";

interface SVGParams {
  w: number;
  h: number;
  bg: string;
  fg: string;
  radius: number;
  padding: number;
  fontCss: string;
  fontSize: number;
  lineHeight: number;
  align: Align;
  text: string;
}

export function buildSVG(params: SVGParams): string {
  const { w, h, bg, fg, radius, padding, fontCss, fontSize, lineHeight, align, text } = params;
  
  const textAnchor = align === "left" ? "start" : align === "right" ? "end" : "middle";
  const x = align === "left" ? padding : align === "right" ? w - padding : w / 2;
  
  return `
    <svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="${bg}" rx="${radius}"/>
      <text 
        x="${x}" 
        y="${h / 2}" 
        text-anchor="${textAnchor}" 
        dominant-baseline="middle"
        fill="${fg}"
        font-family="${fontCss}"
        font-size="${fontSize}"
        line-height="${lineHeight}"
        style="white-space: pre-wrap; word-break: break-word;"
      >${text}</text>
    </svg>
  `;
}

export function exportSVG(svg: string, filename: string): void {
  const blob = new Blob([svg], { type: "image/svg+xml" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export async function exportPNG(svg: string, width: number, height: number, filename: string, scale: number = 2): Promise<void> {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  canvas.width = width * scale;
  canvas.height = height * scale;
  ctx.scale(scale, scale);

  const img = new Image();
  const svgBlob = new Blob([svg], { type: "image/svg+xml" });
  const url = URL.createObjectURL(svgBlob);

  return new Promise((resolve) => {
    img.onload = () => {
      ctx.drawImage(img, 0, 0, width, height);
      canvas.toBlob((blob) => {
        if (blob) {
          const downloadUrl = URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = downloadUrl;
          link.download = filename;
          link.click();
          URL.revokeObjectURL(downloadUrl);
        }
        URL.revokeObjectURL(url);
        resolve();
      }, "image/png");
    };
    img.src = url;
  });
}
