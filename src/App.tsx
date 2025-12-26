import { BrowserRouter, Routes, Route } from "react-router-dom";
import Emotion_landing from "./pages/hasadara/Emotion_Landing";
import MentorLogin from "./pages/kaveesha/MentorLogin";
import MentorSignUp from "./pages/kaveesha/MentorSignUp";
import StudentLearningLanding from "./pages/kaveesha/StudentLanding";
import QuizEngine from "./pages/kaveesha/learn/QuizEngine";
import Results from "./pages/kaveesha/ResultPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/emotion_landing" element={<Emotion_landing />} />

        <Route path="/student/landing" element={<StudentLearningLanding />} />
        <Route path="/mentor/login" element={<MentorLogin />} />
        <Route path="/mentor/signup" element={<MentorSignUp />} />
        <Route path="/results" element={<Results />} />

        <Route path="/learn/:level" element={<QuizEngine />} />
      </Routes>
    </BrowserRouter>
  );
}
