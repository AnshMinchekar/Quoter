import { ChangeEvent } from "react";

type Props = {
  value: string;
  onChange: (hex: string) => void;
  className?: string;
  inputWidth?: number;
};

export default function HexColorField({ value, onChange, className, inputWidth = 90 }: Props) {
  const onHex = (e: ChangeEvent<HTMLInputElement>) => onChange(e.target.value);
  const onPick = (e: ChangeEvent<HTMLInputElement>) => onChange(e.target.value);

  return (
    <div className={["flex items-center gap-2", className].join(" ")}>
      <input
        value={value}
        onChange={onHex}
        spellCheck={false}
        className="bg-transparent outline-none text-sm"
        style={{ width: inputWidth }}
      />
      <input type="color" value={value} onChange={onPick} />
    </div>
  );
}
