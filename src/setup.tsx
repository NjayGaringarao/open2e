import React from "react";
import ReactDOM from "react-dom/client";
import "@/global.css";
import Layout from "./pages/setup/layout";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Layout />
  </React.StrictMode>
);
