import { RefObject, useEffect, useRef } from "react";
import type { CSSProperties } from "react";

type Props = {
  textareaRef: RefObject<HTMLTextAreaElement | null>;
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
    if (textareaRef?.current !== undefined) {
      (textareaRef as React.MutableRefObject<HTMLTextAreaElement | null>).current = node;
    }
  };

  const autoresize = () => {
    const el = localRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  };

  useEffect(() => {
    autoresize();
  }, []);

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
        textAlign: align as CSSProperties["textAlign"],
        minHeight: "42vh",
        "--placeholder-color": color,
      } as CSSProperties}
      onKeyDown={(e) => {
        if (e.key === "Tab") {
          e.preventDefault();
          onTabAlign();
        }
      }}
    />
  );
}
