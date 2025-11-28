import React from "react";
import ReactDOM from "react-dom/client";
import "@/global.css";
import Layout from "./pages/setup/layout";
import { SetupProvider } from "./context/SetupProvider";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <SetupProvider>
      <Layout />
    </SetupProvider>
  </React.StrictMode>
);
