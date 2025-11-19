// Configuración del fondo de inversión
const INITIAL_CAPITAL = 1_000_000;       // Capital inicial en ARS
const ANNUAL_RATE = 0.30;               // 30% anual
const STORAGE_KEY = "capitalStartTime"; // Clave en localStorage

// Devuelve el timestamp de inicio (en ms). Lo guarda si no existe.
function getStartTime() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = parseInt(stored, 10);
      if (!isNaN(parsed)) return parsed;
    }
    const now = Date.now();
    localStorage.setItem(STORAGE_KEY, String(now));
    return now;
  } catch (e) {
    // Si localStorage falla (modo incógnito raro, etc.) usamos ahora
    return Date.now();
  }
}

// Formateador para pesos argentinos
const formatter = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

document.addEventListener("DOMContentLoaded", () => {
  const capitalValueEl = document.querySelector(".capital-value");
  if (!capitalValueEl) return;

  const startTime = getStartTime();

  function updateCapital() {
    const now = Date.now();
    const elapsedMs = now - startTime;
    const years = elapsedMs / (1000 * 60 * 60 * 24 * 365); // años transcurridos

    // Interés compuesto continuo: A = P * e^(r * t)
    const amount = INITIAL_CAPITAL * Math.exp(ANNUAL_RATE * years);

    capitalValueEl.textContent = formatter.format(amount);
    requestAnimationFrame(updateCapital);
  }

  updateCapital();
});
