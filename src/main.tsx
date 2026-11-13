import { hydrateRoot, createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Lets CSS apply start states that need JavaScript to finish (e.g. scroll reveals).
document.documentElement.classList.add("js");

const root = document.getElementById("root")!;

if (root.hasChildNodes()) {
  // Prerendered page: let it paint first (hero image and headline are already in the HTML),
  // then hydrate on the next task so script work never delays the first paint on slow phones.
  requestAnimationFrame(() => setTimeout(() => hydrateRoot(root, <App />), 0));
} else {
  createRoot(root).render(<App />);
}
