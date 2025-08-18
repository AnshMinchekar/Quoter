import HexColorField from "./HexColorField";

type Props = {
  bg: string;
  setBg: (v: string) => void;
  onExport: () => void;
};

export default function TopBar({ bg, setBg, onExport }: Props) {
  return (
    <div className="grid grid-cols-[auto,1fr,auto] items-center gap-3 px-4 py-2 border-b border-white/15">
      <div className="justify-self-start text-white text-sm">
        <HexColorField value={bg} onChange={setBg} className="text-white" inputWidth={84} />
      </div>
      <div />
      <div className="justify-self-end">
        <button
          onClick={onExport}
          className="px-3 py-1.5 rounded-lg bg-white text-black font-medium hover:bg-white/90 transition"
        >
          Export
        </button>
      </div>
    </div>
  );
}
