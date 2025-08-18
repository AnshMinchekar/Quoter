import { RefObject, useEffect, useRef } from "react";

type Props = {
  textareaRef: RefObject<HTMLTextAreaElement>;
  placeholder?: string;
  color: string;
  fontCss: string;
  fontSize: number;
  lineHeight: number;
  paddingX: number;
  paddingY: number;
  align: "left" | "center" | "right";
  onTabAlign: () => void;
};

export default function TypingSurface({
  textareaRef,
  placeholder = "Let it flow...",
  color,
  fontCss,
  fontSize,
  lineHeight,
  paddingX,
  paddingY,
  align,
  onTabAlign,
}: Props) {
  const localRef = useRef<HTMLTextAreaElement | null>(null);
  const ref = (node: HTMLTextAreaElement) => {
    localRef.current = node;
    if (textareaRef) (textareaRef as any).current = node;
  };

  // Resize the textarea to fit content (no inner scrollbar)
  const autoresize = () => {
    const el = localRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  };

  useEffect(() => {
    autoresize(); // on mount
  }, []);

  // Recompute height when typography or padding changes
  useEffect(() => {
    autoresize();
  }, [fontSize, lineHeight, paddingX, paddingY, align]);

  return (
    <textarea
      ref={ref}
      autoFocus
      placeholder={placeholder}
      spellCheck={false}
      onInput={autoresize}
      className="w-full max-w-4xl bg-transparent resize-none overflow-hidden selection:bg-white/20"
      style={{
        color,
        caretColor: color,
        fontFamily: fontCss,
        fontSize,
        lineHeight,
        padding: `${paddingY}px ${paddingX}px`,
        textAlign: align as any,
        minHeight: "42vh", // feels substantial when empty, then grows
        // pass placeholder color down
        ["--placeholder-color" as any]: color,
      }}
      onKeyDown={(e) => {
        if (e.key === "Tab") {
          e.preventDefault();
          onTabAlign();
        }
      }}
    />
  );
}
