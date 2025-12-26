
type Props = {
  children: React.ReactNode
  onClick?: () => void
  disabled?: boolean
}

export default function PrimaryButton({ children, onClick, disabled }: Props) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="px-10 py-4 rounded-full text-xl font-bold bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-lg hover:scale-110 transition disabled:opacity-50"
    >
      {children}
    </button>
  )
}
