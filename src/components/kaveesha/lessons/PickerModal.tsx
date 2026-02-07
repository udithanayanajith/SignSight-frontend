type Item = {
  label: string;
  color?: string;
  image?: string;
};

export default function PickerModal({
  title,
  items,
  onSelect,
  onClose,
}: {
  title: string;
  items: Item[];
  onSelect: (item: Item) => void;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
      <div className="bg-white rounded-3xl p-8 w-full max-w-lg shadow-2xl">
        <h2 className="text-2xl font-bold text-center mb-6">{title}</h2>

        <div className="grid grid-cols-4 gap-6">
          {items.map((item) => (
            <button
              key={item.label}
              onClick={() => onSelect(item)}
              className="flex flex-col items-center gap-2"
            >
              {item.color && (
                <div
                  className="w-16 h-16 rounded-full shadow-lg border"
                  style={{ backgroundColor: item.color }}
                />
              )}

              {item.image && (
                <img
                  src={item.image}
                  className="w-16 h-16 rounded-full object-cover shadow-lg"
                />
              )}

              <span className="text-sm font-semibold">{item.label}</span>
            </button>
          ))}
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={onClose}
            className="px-6 py-3 rounded-full bg-gray-200 hover:bg-gray-300"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
