
type Props = {
  emoji: string
  label: string
  gradient: string
}

export default function EmotionTile({ emoji, label, gradient }: Props) {
  return (
    <div className={`emotion-tile bg-gradient-to-br ${gradient}`}>
      <span className="text-4xl">{emoji}</span>
      {label}
    </div>
  )
}
