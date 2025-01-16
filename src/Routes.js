// src/Routes.js
import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import About from "./pages/About";
import AppContent from "./AppContent";

function AppRoutes() {
  return (
    <Router>
      <nav>
        <ul>
          <li>
            <Link to="/about">어바웃</Link>
          </li>
          <li>
            <Link to="/app">앱</Link>
          </li>
        </ul>
      </nav>
      <Routes>
        <Route path="/about" element={<About />} />
        <Route path="/app" element={<AppContent />} />
      </Routes>
    </Router>
  );
}

export default AppRoutes;
