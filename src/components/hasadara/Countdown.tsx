
export default function Countdown({ value }: { value: number }) {
  return (
    <div className="flex items-center justify-center h-64">
      <span className="text-9xl font-extrabold bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent animate-bounce">
        {value}
      </span>
    </div>
  )
}
