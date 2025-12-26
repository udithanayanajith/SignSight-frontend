import { BrowserRouter, Routes, Route } from "react-router-dom";
import Emotion_landing from "./pages/Emotion_landing";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/emotion_landing" element={<Emotion_landing />} />
      </Routes>
    </BrowserRouter>
  );
}
