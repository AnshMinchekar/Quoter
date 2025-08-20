type Props = { value: number; onNext: () => void };

export default function SizeChip({ value, onNext }: Props) {
  return (
    <button
      onClick={onNext}
      className="relative w-10 h-10 rounded-full border border-white/40 bg-white/5 hover:bg-white/10 transition flex items-center justify-center"
      title="Cycle font size"
    >
      <span className="text-xs text-white/80">{value}</span>
    </button>
  );
}
