// layout-fixes.js — defensive runtime fixes
document.addEventListener("DOMContentLoaded", () => {
  // 1) Hide accidental modal overlays (defensive)
  document.querySelectorAll('.modal-overlay, .modal-overlay.active, #modalContainer > *').forEach(el => {
    try { el.classList.remove('active'); el.style.display = 'none'; el.style.visibility = 'hidden'; } catch(e){}
  });

  // 2) Reset elements with computed min-height >= viewport (defensive, limited scope)
  document.querySelectorAll('body *').forEach(el => {
    try {
      const cs = window.getComputedStyle(el);
      if (cs.minHeight && (cs.minHeight.includes('100vh') || parseFloat(cs.minHeight) >= window.innerHeight)) {
        el.style.minHeight = 'auto';
        el.style.height = 'auto';
        el.style.overflow = 'visible';
      }
    } catch(e){}
  });

  // 3) If hero still taller than 65% of viewport, cap it (prevents pushing footer)
  const hero = document.querySelector('.hero-section');
  if (hero) {
    const heroH = hero.getBoundingClientRect().height;
    const cap = Math.round(window.innerHeight * 0.65);
    if (heroH > cap) {
      hero.style.maxHeight = cap + 'px';
      hero.style.overflow = 'hidden';
      console.warn('layout-fixes: hero capped to', cap);
    }
  }

  // 4) Debug info (optional, remove if noisy)
  const tall = [...document.querySelectorAll('body *')].filter(el => {
    try { return el.getBoundingClientRect().height > window.innerHeight * 0.9; } catch(e){ return false; }
  });
  if (tall.length) {
    console.warn('layout-fixes: elements taller than 90% viewport:', tall.slice(0,6));
  }
});
