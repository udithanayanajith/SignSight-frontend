type Props = {
  current: number;
  total: number;
};

export default function ProgressIndicator({ current, total }: Props) {
  const percent = (current / total) * 100;

  return (
    <div className="w-full max-w-md mx-auto mb-6">
      <div className="flex justify-between text-sm font-bold text-gray-700 mb-1">
        <span>Step {current}</span>
        <span>{total}</span>
      </div>

      <div className="h-4 bg-white/50 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-orange-400 to-pink-500 transition-all"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
