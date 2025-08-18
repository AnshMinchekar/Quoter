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
    <div className="grid grid-cols-[auto,1fr,auto] items-center gap-3 px-4 py-3 text-white text-sm">
      {/* Left: font size */}
      <div className="justify-self-start">
        <SizeChip value={fontSize} onNext={onNextFontSize} />
      </div>

      {/* Center: exact-width window so ~3 fonts show; fade mask is applied by parent CSS */}
      <div className="justify-self-center w-full">
        <div className="mx-auto w-[540px] max-w-[calc(100vw-220px)] mask-fade-x">
          <FontCarousel activeIndex={fontIndex} setActiveIndex={setFontIndex} />
        </div>
      </div>

      {/* Right: text color */}
      <div className="justify-self-end">
        <HexColorField value={fg} onChange={setFg} className="text-white" inputWidth={24} />
      </div>
    </div>
  );
}
