import { StrictMode } from "react";
import { Toaster } from "./components/ui/sonner.jsx";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { SocketProvider } from "./context/SocketContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <SocketProvider>
      <App />
      <Toaster closeButton />
    </SocketProvider>
  </StrictMode>
);
