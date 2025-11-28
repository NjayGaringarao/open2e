import React from "react";
import ReactDOM from "react-dom/client";
import "./global.css";
import { BrowserRouter as Router, Route, Routes } from "react-router";
import Layout from "./pages/main/layout";
import { MainProvider } from "./context/MainProvider";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route
          path="*"
          element={
            <MainProvider>
              <Layout />
            </MainProvider>
          }
        />
      </Routes>
    </Router>
  </React.StrictMode>
);
