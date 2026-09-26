import { createRoot, hydrateRoot } from "react-dom/client";
import App from "./App.tsx";
import "./globals.css";

const container = document.getElementById("root");
if (container) {
  // index.html ships prerendered home-page markup; every other route gets an empty shell
  if (container.hasChildNodes() && window.location.pathname === "/") {
    hydrateRoot(container, <App />);
  } else {
    createRoot(container).render(<App />);
  }
}
