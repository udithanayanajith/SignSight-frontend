import { BrowserRouter, Routes, Route } from "react-router-dom";
import Emotion_landing from "./pages/Emotion_landing";
import Instructions from "./pages/Instructions";
import EmotionFlow from "./pages/EmotionFlow";
import Result from "./pages/Result";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/emotion_landing" element={<Emotion_landing />} />
        <Route path="/instructions" element={<Instructions />} />
        <Route path="/emotion" element={<EmotionFlow />} />
        <Route path="/result" element={<Result />} />
      </Routes>
    </BrowserRouter>
  );
}
