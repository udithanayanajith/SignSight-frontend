import { BrowserRouter, Routes, Route } from "react-router-dom";

import MentorLogin from "./pages/kaveesha/MentorLogin";
import MentorSignUp from "./pages/kaveesha/MentorSignUp";
import StudentLearningLanding from "./pages/kaveesha/StudentLanding";
import QuizEngine from "./pages/kaveesha/learn/QuizEngine";
import Results from "./pages/kaveesha/ResultPage";
import LessonsHome from "./pages/kaveesha/lessons/LessonsHome";

import LessonPlayer from "./pages/kaveesha/lessons/LessonsPlayer";
import MentorDashboard from "./mentor/MentorDashboard";
import AdminLogin from "./pages/kaveesha/AdminLogin";
import AdminDashboard from "./pages/kaveesha/AdminDashboard";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/student/landing" element={<StudentLearningLanding />} />
        <Route path="/mentor/login" element={<MentorLogin />} />
        <Route path="/mentor/signup" element={<MentorSignUp />} />
        <Route path="/results" element={<Results />} />

        <Route path="/learn/:level" element={<QuizEngine />} />

        <Route path="/lessons" element={<LessonsHome />} />

        <Route path="/lessons" element={<LessonsHome />} />
        <Route path="/lessons/:category/:item" element={<LessonPlayer />} />
        <Route path="/mentorDash" element={<MentorDashboard />} />

        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />

        {/* <Route path="/lessons/food/:food" element={<FoodPlayer />} />
        <Route path="/lessons/numbers/:number" element={<NumberViewer />} /> */}
      </Routes>
    </BrowserRouter>
  );
}
