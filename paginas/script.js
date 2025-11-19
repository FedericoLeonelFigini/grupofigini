// Configuración del fondo de inversión
const INITIAL_CAPITAL = 1_000_000; // Capital inicial en ARS
const ANNUAL_RATE = 0.30;         // 30% anual

// FECHA DE INICIO GLOBAL DEL FONDO (CAMBIABLE)
// Ejemplo: 1 de enero de 2025, 00:00 en Argentina (UTC-3)
const GLOBAL_START_DATE = new Date("2025-01-01T00:00:00-03:00").getTime();

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

  function updateCapital() {
    const now = Date.now();
    const elapsedMs = now - GLOBAL_START_DATE;
    const years = elapsedMs / (1000 * 60 * 60 * 24 * 365); // años transcurridos

    // Si por alguna razón la fecha actual es anterior al inicio, no mostramos negativo
    const t = Math.max(years, 0);

    // Interés compuesto continuo: A = P * e^(r * t)
    const amount = INITIAL_CAPITAL * Math.exp(ANNUAL_RATE * t);

    capitalValueEl.textContent = formatter.format(amount);
    requestAnimationFrame(updateCapital);
  }

  updateCapital();
});
