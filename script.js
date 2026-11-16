/* ==========================================================================
   PORTFOLIO – Jefferson Rodriguez
   Índice:
     1. Aparición de bloques al scrollear
     2. El dibujo sigue al mouse
     3. Fondo que cambia de color al scrollear
   ========================================================================== */


/* ==========================================================================
   1. APARICIÓN AL SCROLLEAR
   Los elementos con la clase "reveal" se muestran al entrar en pantalla.
   ========================================================================== */
const revealItems = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('show');
      revealObserver.unobserve(entry.target);   // se anima una sola vez
    }
  });
}, { threshold: 0.15 });

revealItems.forEach((el) => revealObserver.observe(el));


/* ==========================================================================
   2. EL DIBUJO SIGUE AL MOUSE
   Mientras el mouse está sobre la zona de imagen, el dibujo se mueve un poco.
   ========================================================================== */
const heroArt = document.querySelector('.hero-art');
const avatarImg = document.querySelector('.avatar-img');

if (heroArt && avatarImg) {
  heroArt.addEventListener('mousemove', (e) => {
    const box = heroArt.getBoundingClientRect();
    const x = (e.clientX - box.left) / box.width - 0.5;    // -0.5 a 0.5
    const y = (e.clientY - box.top) / box.height - 0.5;    // -0.5 a 0.5

    avatarImg.style.animation = 'none';                    // pausa el "flotar"
    avatarImg.style.transform = `translate(${x * 18}px, ${y * 18}px) rotate(${x * 4}deg)`;
  });

  heroArt.addEventListener('mouseleave', () => {
    avatarImg.style.transform = '';
    avatarImg.style.animation = '';                        // vuelve a flotar
  });
}


/* ==========================================================================
   3. FONDO QUE CAMBIA DE COLOR
   Cada sección tiene su tema. Al scrollear, el fondo pasa suavemente de un
   tema al siguiente. Para cambiar colores, editá la lista "themes".
   Valores en RGB: [rojo, verde, azul]
   ========================================================================== */
const themes = [
  { id: 'home',     bg: [18, 12, 8],  glow: [255, 106, 26], glow2: [255, 150, 60] },   // naranja
  { id: 'about',    bg: [8, 14, 24],  glow: [43, 111, 176],  glow2: [90, 170, 230] },   // azul
  { id: 'services', bg: [16, 10, 26], glow: [140, 90, 210],  glow2: [210, 110, 190] },  // violeta
  { id: 'projects', bg: [8, 18, 14],  glow: [40, 160, 110],  glow2: [120, 200, 80] },   // verde
  { id: 'contact',  bg: [18, 12, 8],  glow: [255, 106, 26],  glow2: [255, 150, 60] },   // naranja
];

const rootEl = document.documentElement;
let updatePending = false;

/* Mezcla dos colores: t=0 devuelve "a", t=1 devuelve "b" */
const mixColors = (a, b, t) => a.map((value, i) => Math.round(value + (b[i] - value) * t));

/* Suaviza la transición (empieza y termina despacio) */
const smooth = (t) => t * t * (3 - 2 * t);

function updateBackground() {
  updatePending = false;

  const sectionTops = themes.map((theme) => document.getElementById(theme.id).offsetTop);
  const y = window.scrollY + window.innerHeight * 0.5;     // el punto medio de la pantalla

  // Buscar en qué sección estamos
  let current = themes.length - 1;
  while (current > 0 && y < sectionTops[current]) current--;

  const from = themes[current];
  const to = themes[Math.min(current + 1, themes.length - 1)];
  const sectionEnd = current < themes.length - 1 ? sectionTops[current + 1] : document.body.scrollHeight;

  // Qué tan avanzados estamos dentro de la sección (0 a 1)
  const progress = (y - sectionTops[current]) / Math.max(1, sectionEnd - sectionTops[current]);

  // El cambio de color ocurre en la segunda mitad de cada sección
  const t = smooth(Math.min(1, Math.max(0, (progress - 0.5) / 0.5)));

  const bg = mixColors(from.bg, to.bg, t);
  rootEl.style.setProperty('--bgc', bg.join(','));
  rootEl.style.setProperty('--glow', mixColors(from.glow, to.glow, t).join(','));
  rootEl.style.setProperty('--glow2', mixColors(from.glow2, to.glow2, t).join(','));
  rootEl.style.setProperty('--card', 'rgb(' + mixColors(bg, [255, 255, 255], 0.06).join(',') + ')');
}

/* Evita recalcular demasiadas veces mientras se scrollea */
function onScrollOrResize() {
  if (!updatePending) {
    updatePending = true;
    requestAnimationFrame(updateBackground);
  }
}

window.addEventListener('scroll', onScrollOrResize, { passive: true });
window.addEventListener('resize', onScrollOrResize);
updateBackground();
