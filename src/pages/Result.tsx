import Navbar from "../components/Navbar";
export default function Result() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100">
      <Navbar />
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-200 via-yellow-100 to-pink-200">
   
      <h1 className="text-5xl font-extrabold text-green-700">🎉 All Done!</h1>
      <p className="mt-4 text-xl">Results sent to guardian email 💌</p>
    </div>
    </div>
  );
}
