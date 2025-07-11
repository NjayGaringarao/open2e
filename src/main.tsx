import React from "react";
import ReactDOM from "react-dom/client";
import "./global.css";
import { BrowserRouter as Router, Route, Routes } from "react-router";
import Layout from "./pages/main/layout";
import { Provider } from "./components/ui/provider";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Provider>
      <Router>
        <Routes>
          <Route path="*" element={<Layout />} />
        </Routes>
      </Router>
    </Provider>
  </React.StrictMode>
);
