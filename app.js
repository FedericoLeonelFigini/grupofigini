// Activa visualmente el item clickeado en la barra inferior
document.addEventListener('click', (e) => {
  const link = e.target.closest('.gf-nav-item');
  if (!link) return;

  document.querySelectorAll('.gf-nav-item').forEach(a => a.classList.remove('is-active'));
  link.classList.add('is-active');
});

// Mejora accesibilidad con teclado: marcar activo al enfocar con Enter/Espacio
document.addEventListener('keydown', (e) => {
  if ((e.key === 'Enter' || e.key === ' ') && document.activeElement?.classList.contains('gf-nav-item')) {
    e.preventDefault();
    document.activeElement.click();
  }
});
// ==== Fondo dinámico por sección con IntersectionObserver ====

// Selecciona capa de fondo y secciones que cambian el fondo
const bgLayer = document.getElementById('site-bg');
const swappables = Array.from(document.querySelectorAll('.bg-swap'));

// Si no hay nada para observar, salimos
if (bgLayer && swappables.length) {
  // Lleva el control de qué secciones están visibles al mismo tiempo
  const visible = new Set();

  // Función que aplica la imagen + degradado
  const applyBackground = (imgUrl) => {
    // Degradado sutil por encima de la imagen (oscurece levemente para legibilidad)
    const grad = 'linear-gradient( to bottom, rgba(255,255,255,0.0) 0%, rgba(255,255,255,0.25) 35%, rgba(255,255,255,0.45) 100% )';
    // Inyectamos ambos como background-image en una sola propiedad
    bgLayer.style.backgroundImage = `${grad}, url("${imgUrl}")`;
    // Activa el fade-in
    requestAnimationFrame(() => bgLayer.classList.add('is-active'));
  };

  // Limpia la imagen (fade-out)
  const clearBackground = () => {
    bgLayer.classList.remove('is-active');
    // Opcional: quitar la url tras el fade para liberar memoria (espera el fin de la transición)
    const onEnd = () => {
      bgLayer.style.backgroundImage = '';
      bgLayer.removeEventListener('transitionend', onEnd);
    };
    bgLayer.addEventListener('transitionend', onEnd);
  };

  // Elige qué sección visible tiene prioridad (la más centrada)
  const chooseTopVisible = () => {
    if (!visible.size) return null;
    // Convertimos a array y elegimos la que tenga mayor intersección actual
    let best = null, bestRatio = 0;
    for (const el of visible) {
      const rect = el.getBoundingClientRect();
      const viewport = Math.max(1, window.innerHeight);
      // ratio simple: alto visible relativo
      const top = Math.max(0, rect.top);
      const bottom = Math.min(viewport, rect.bottom);
      const visiblePx = Math.max(0, bottom - top);
      const ratio = visiblePx / Math.max(1, rect.height);
      if (ratio > bestRatio) { bestRatio = ratio; best = el; }
    }
    return best;
  };

  // Observador: umbral medio para que el cambio se sienta natural
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const el = entry.target;
      if (entry.isIntersecting) {
        visible.add(el);
      } else {
        visible.delete(el);
      }
    });

    // Tras actualizar el set visible, decidimos qué mostrar
    const current = chooseTopVisible();
    if (current) {
      const url = current.getAttribute('data-bg');
      if (url) applyBackground(url);
    } else {
      clearBackground();
    }
  }, { threshold: [0.35, 0.5, 0.65] });

  swappables.forEach(el => io.observe(el));

  // Recalcular en resize para priorizar correctamente
  window.addEventListener('resize', () => {
    const current = chooseTopVisible();
    if (current) {
      const url = current.getAttribute('data-bg');
      if (url) applyBackground(url);
    }
  });
}
