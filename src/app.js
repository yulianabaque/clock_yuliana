import Alarm from "./Alarm.js";
import Clock from "./Clock.js";
import Stopwatch from "./Stopwatch.js";
import Timer from "./Timer.js";

customElements.define("x-alarm", Alarm);
customElements.define("x-clock", Clock);
customElements.define("x-stopwatch", Stopwatch);
customElements.define("x-timer", Timer);

  const saved = localStorage.getItem('theme');
  if (saved === 'dark' || saved === 'light') {
    root.setAttribute('data-theme', saved);
    toggle.checked = (saved === 'dark');
  }

  toggle.addEventListener('change', () => {
    const mode = toggle.checked ? 'dark' : 'light';
    root.setAttribute('data-theme', mode);
    localStorage.setItem('theme', mode);
  }); 
