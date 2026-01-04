export default function LessonBackground({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* 🌈 BACKGROUND LAYER */}
      <div
        className="fixed inset-0 -z-10
        bg-gradient-to-br from-pink-200 via-orange-100 to-yellow-100"
      />

      {/* 🫧 BLOBS */}
      <div
        className="fixed -top-32 -left-32 w-[500px] h-[500px]
        bg-pink-400/30 rounded-full blur-3xl -z-10"
      />

      <div
        className="fixed top-1/3 -right-32 w-[500px] h-[500px]
        bg-orange-400/30 rounded-full blur-3xl -z-10"
      />

      <div
        className="fixed bottom-[-200px] left-1/3 w-[500px] h-[500px]
        bg-yellow-400/30 rounded-full blur-3xl -z-10"
      />

      {/* 🌟 CONTENT */}
      <div className="relative z-10 min-h-screen">{children}</div>
    </div>
  );
}
