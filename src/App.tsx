import { BrowserRouter, Routes, Route } from "react-router-dom";
import Emotion_Landing from "./pages/Emotion_Landing";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/emotion_landing" element={<Emotion_Landing />} />
      </Routes>
    </BrowserRouter>
  );
}
