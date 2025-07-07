import React from "react";
import ReactDOM from "react-dom/client";
import "./global.css";
import { BrowserRouter as Router, Route, Routes } from "react-router";
import App from "./App";
import Index from "./pages/index";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="*" element={<App />} />
      </Routes>
    </Router>
  </React.StrictMode>
);
