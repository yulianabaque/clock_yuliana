export default class Timer extends HTMLElement {
  #intervalCallback;
  #intervalId = 0;

  constructor() {
    super();
    this.addEventListener("click", this);
    this.#intervalCallback = () => {
      const time = this.querySelector("time");
      const inputs = this.querySelectorAll("input");
      const intervals = Array.from(inputs, ({ value }) =>
        new Date(`1970-01-01T${value}Z`).getTime()
      );

      const total = intervals.reduce((a, b) => a + b, 0);

      // si no hay startTime → salir
      if (!this.startTime) return;

      let remaining = new Date(new Date() - new Date(this.startTime)).getTime();
      let ms;

      // cuenta hacia atrás
      if (remaining < total || this.loop) {
        remaining %= total;
        let i = 0;

        while (i < intervals.length && remaining > intervals[i]) {
          remaining -= intervals[i];
          i++;
        }

        ms = intervals[i] - remaining;

        // marcar intervalo activo
        inputs.forEach((input, j) => {
          input.classList.toggle("current-interval", i === j);
        });

      } else {
        // TIMER TERMINADO
        clearInterval(this.#intervalId);
        this.#intervalId = 0;
        ms = 0;

        // limpiar marcadores
        inputs.forEach((input) => input.classList.remove("current-interval"));

        // 🔥 asegurar que stop SIEMPRE se lanza
        this.dispatchEvent(new CustomEvent("stop", { bubbles: true }));

        // parar aquí
      }

      // actualizar pantalla
      time.dateTime = `PT${ms / 1000}S`;
      time.textContent = new Date(ms).toISOString().slice(11, 22);
    };
  }

  static get observedAttributes() {
    return ["paused", "start-time"];
  }

  get loop() {
    return this.hasAttribute("loop");
  }
  set loop(value) {
    this.toggleAttribute("loop", Boolean(value));
  }

  get paused() {
    return this.hasAttribute("paused");
  }
  set paused(value) {
    this.toggleAttribute("paused", Boolean(value));
  }

  get startTime() {
    return this.getAttribute("start-time");
  }
  set startTime(value) {
    this.setAttribute("start-time", value);
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) return;

    if (name === "paused" && newValue != null) {
      clearInterval(this.#intervalId);
      this.#intervalId = 0;

    } else if (name === "start-time" && !newValue) {
      clearInterval(this.#intervalId);
      this.#intervalId = 0;

    } else if (name === "start-time" && newValue && !this.#intervalId) {
      this.#intervalId = setInterval(this.#intervalCallback, 10);
    }
  }

  disconnectedCallback() {
    clearInterval(this.#intervalId);
  }

  handleEvent(event) {
    const { classList } = event.target;

    if (classList.contains("loop")) {
      this.loop = true;

    } else if (classList.contains("no-loop")) {
      this.loop = false;

    } else if (classList.contains("pause")) {
      this.pause();

    } else if (classList.contains("restart")) {
      this.restart();

    } else if (classList.contains("start")) {
      this.start();
    }
  }

  pause() {
    this.paused = true;
  }

  restart() {
    const time = this.querySelector("time");
    time.dateTime = "PT0S";
    time.textContent = "00:00:00.00";
    this.paused = false;
    this.startTime = "";
  }

  start() {
    const time = this.querySelector("time");
    time.dateTime = time.dateTime || "PT0S";
    this.paused = false;

    if (this.startTime) {
      const inputs = this.querySelectorAll("input");
      const currentInput = this.querySelector(".current-interval");

      const intervals = Array.from(inputs, ({ value }) =>
        new Date(`1970-01-01T${value}Z`).getTime(),
      );

      const cumulativeTime = intervals
        .slice(0, [...inputs].indexOf(currentInput) + 1)
        .reduce((a, b) => a + b, 0);

      const ms = time.dateTime.match(/(\d+(:?\.\d+)?)S$/)[1] * 1000;

      this.startTime = new Date(new Date() - cumulativeTime + ms).toISOString();

    } else {
      this.startTime = new Date().toISOString();
    }
  }
}
