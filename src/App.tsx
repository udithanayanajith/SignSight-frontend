import { BrowserRouter, Routes, Route } from "react-router-dom";
import Emotion_landing from "./pages/hasadara/Emotion_Landing";
import Instructions from "./pages/hasadara/Instructions";
import EmotionFlow from "./pages/hasadara/EmotionFlow";
import Result from "./pages/hasadara/Result";

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
