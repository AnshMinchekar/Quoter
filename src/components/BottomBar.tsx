import SizeChip from "./SizeChip";
import FontCarousel from "./FontCarousel";
import HexColorField from "./HexColorField";

type Props = {
  fontSize: number;
  onNextFontSize: () => void;
  fontIndex: number;
  setFontIndex: (i: number) => void;
  fg: string;
  setFg: (v: string) => void;
};

export default function BottomBar({
  fontSize, onNextFontSize, fontIndex, setFontIndex, fg, setFg,
}: Props) {
  return (
    <div className="relative grid grid-cols-[auto,1fr,auto] items-center gap-3 px-4 py-3 text-white text-sm">
      {/* Left: font size */}
      <div className="justify-self-start">
        <SizeChip value={fontSize} onNext={onNextFontSize} />
      </div>

      {/* Middle grid cell left empty; real carousel is absolutely centered below */}
      <div className="justify-self-center w-full" />

      {/* Right: text color */}
      <div className="justify-self-end">
        <HexColorField value={fg} onChange={setFg} className="text-white" />
      </div>

      {/* Absolutely centered carousel overlay to align with viewport center */}
      <div className="absolute inset-0 z-10 pointer-events-none flex items-center justify-center">
        <div className="pointer-events-auto w-[512px] max-w-[calc(100vw-220px)]">
          <div className="rounded-full bg-transparent px-2 py-1 overflow-hidden">
            <FontCarousel activeIndex={fontIndex} setActiveIndex={setFontIndex} />
          </div>
        </div>
      </div>
    </div>
  );
}
