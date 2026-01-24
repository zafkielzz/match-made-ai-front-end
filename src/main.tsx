import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { AuthProvider } from "@/contexts/AuthContext";
import { MatchProvider } from "@/contexts/MatchContext";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <AuthProvider>
    <MatchProvider>
      <App />
    </MatchProvider>
  </AuthProvider>,
);
