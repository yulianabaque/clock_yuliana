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

const alarmSound = document.getElementById("alarm-sound");

document.addEventListener("ring", () => {
  alarmSound.currentTime = 0;
  alarmSound.loop = true;
  alarmSound.play();
});

document.addEventListener("stop", () => {
  alarmSound.currentTime = 0;
  alarmSound.loop = true;
  alarmSound.play();
});

document.addEventListener("click", (event) => {

  const clicked = event.target;
  const isStopping =
    clicked.classList.contains("pause") ||
    clicked.classList.contains("restart") ||
    clicked.classList.contains("delete");

  if (isStopping) {

    alarmSound.loop = false;
    alarmSound.pause();

    const alarmItem = clicked.closest(".controls")?.parentElement;

    if (alarmItem) {
      alarmItem.removeAttribute("ringing");
      alarmItem.setAttribute("paused", "");
    }
  }
});
