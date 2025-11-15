import Alarm from "./Alarm.js";
import Clock from "./Clock.js";
import Stopwatch from "./Stopwatch.js";
import Timer from "./Timer.js";

customElements.define("x-alarm", Alarm);
customElements.define("x-clock", Clock);
customElements.define("x-stopwatch", Stopwatch);
customElements.define("x-timer", Timer);

const root = document.documentElement;
const toggle = document.getElementById("theme-switch");

const saved = localStorage.getItem("theme");

if (saved === "dark" || saved === "light") {
  root.setAttribute("data-theme", saved);
  toggle.checked = (saved === "dark");
} else {
  const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  if (systemDark) {
    root.setAttribute("data-theme", "dark");
  }
  toggle.checked = systemDark;
}

toggle.addEventListener("change", () => {
  const mode = toggle.checked ? "dark" : "light";
  root.setAttribute("data-theme", mode);
  localStorage.setItem("theme", mode);
});

