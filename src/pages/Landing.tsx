
import Navbar from '../components/Navbar'
import PrimaryButton from '../components/PrimaryButton'
import { useNavigate } from 'react-router-dom'

export default function Landing() {
  const nav = useNavigate()
  return (
    <div className="min-h-screen bg-gradient-to-br from-peach via-orange-100 to-yellow-50">
      <Navbar />
      <section className="flex flex-col items-center text-center mt-16 px-6">
        <h1 className="text-5xl font-extrabold text-orange-600">
          Unlocking Emotions <br />
          <span className="text-pink-500">for Deaf Children</span>
        </h1>
        <p className="mt-6 max-w-xl text-lg text-gray-700">
          🎨 Fun cartoons + 🤖 AI help parents understand children emotions.
        </p>
        <div className="mt-8">
          <PrimaryButton onClick={() => nav('/instructions')}>
            Find emotions 🌈
          </PrimaryButton>
        </div>
      </section>
    </div>
  )
}
