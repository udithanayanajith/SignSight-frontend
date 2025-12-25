import { useEffect, useState } from "react";

export default function Countdown({ onFinish }: { onFinish: () => void }) {
  const [count, setCount] = useState(3);

  useEffect(() => {
    if (count === 0) {
      onFinish();
      return;
    }
    const t = setTimeout(() => setCount(count - 1), 1000);
    return () => clearTimeout(t);
  }, [count]);

  return (
    <div className="text-6xl font-bold text-primary">
      {count === 0 ? "START" : count}
    </div>
  );
}
