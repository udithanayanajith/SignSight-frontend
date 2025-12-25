import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Instructions from "./pages/Instructions";
import EmotionSession from "./pages/EmotionSession";
import Completed from "./pages/Completed";

export default function App() {
  return (/*  */
    <BrowserRouter>QQ
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/instructions" element={<Instructions />} />
        <Route path="/session" element={<EmotionSession />} />
        <Route path="/done" element={<Completed />} />
      </Routes>
    </BrowserRouter>
  );
}
