// src/Routes.js
import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import About from "./pages/About";
import AppContent from "./AppContent";
import DayCounter from "./DayCounter";
import StudyTimer from "./StudyTimer";

function AppRoutes() {
  return (
    <Router>
      <nav>
        <ul>
          <li>
            <Link to="/dday">디데이</Link>
          </li>
          <li>
            <Link to="/StudyTimer">공부시간측정</Link>
          </li>
          <li>
            <Link to="/app">앱</Link>
          </li>
        </ul>
      </nav>
      <Routes>
        <Route path="/dday" element={<DayCounter />} />
        <Route path="/StudyTimer" element={<StudyTimer />} />
        <Route path="/app" element={<AppContent />} />
      </Routes>
    </Router>
  );
}

export default AppRoutes;
