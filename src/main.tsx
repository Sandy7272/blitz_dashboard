import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

const rootEl = document.documentElement;
const storedTheme = localStorage.getItem("user_theme");
const initialTheme = storedTheme === "light" || storedTheme === "dark" ? storedTheme : "dark";
rootEl.setAttribute("data-theme", initialTheme);
if (initialTheme === "dark") {
  rootEl.classList.add("dark");
} else {
  rootEl.classList.remove("dark");
}

createRoot(document.getElementById("root")!).render(<App />);
