import { ChangeEvent, useRef } from "react";

type Props = {
  value: string;
  onChange: (hex: string) => void;
  className?: string;
  inputWidth?: number;
};

export default function HexColorField({ value, onChange, className, inputWidth = 0 }: Props) {
  const onHex = (e: ChangeEvent<HTMLInputElement>) => onChange(e.target.value.toUpperCase());
  const onPick = (e: ChangeEvent<HTMLInputElement>) => onChange(e.target.value.toUpperCase());
  const colorRef = useRef<HTMLInputElement>(null);
  const display = (value || "").toUpperCase();

  return (
    <div className={["flex items-center gap-1", className].join(" ")}>
      <input
        value={display}
        onChange={onHex}
        spellCheck={false}
        className="bg-transparent outline-none text-sm"
        size={Math.max(7, display.length || 0)}
        style={inputWidth ? { width: inputWidth } : undefined}
      />
      {/* visually hidden native color input */}
      <input
        ref={colorRef}
        type="color"
        value={value}
        onChange={onPick}
        className="sr-only"
        aria-hidden
        tabIndex={-1}
      />
      <button
        type="button"
        aria-label="Pick color"
        onClick={() => colorRef.current?.click()}
        className="w-6 h-6 rounded-full border border-white/30 shadow-[inset_0_0_0_1px_rgba(0,0,0,0.25)]"
        style={{ backgroundColor: value }}
      />
    </div>
  );
}
