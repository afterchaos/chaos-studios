/* ============================================================
   AFTER CHAOS — main.js
   Módulos: cursor · nav · scroll · mobile · reveal · filter · counter · form
   ============================================================ */

/* ── CURSOR PERSONALIZADO ───────────────────────────────────── */
(function initCursor() {
  // Não inicializa cursor customizado em dispositivos touch
  if (window.matchMedia('(pointer: coarse)').matches) return;

  const cur  = document.getElementById('cur');
  const ring = document.getElementById('cur-r');
  if (!cur || !ring) return;

  let mx = 0, my = 0, rx = 0, ry = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    cur.style.left = mx + 'px';
    cur.style.top  = my + 'px';
  });

  (function raf() {
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(raf);
  })();
})();

/* ── NAV — sticky ao scroll ────────────────────────────────── */
(function initNav() {
  const nav = document.getElementById('nav');
  if (!nav) return;

  window.addEventListener('scroll', () => {
    nav.classList.toggle('stuck', window.scrollY > 80);
  }, { passive: true });
})();

/* ── SMOOTH SCROLL ──────────────────────────────────────────── */
(function initSmoothScroll() {
  function scrollTo(id) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  }

  // Botão "Iniciar Projeto" no nav
  window.goto = scrollTo;

  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const hash = a.getAttribute('href');
      if (hash === '#') { e.preventDefault(); return; }
      const el = document.querySelector(hash);
      if (el) { e.preventDefault(); el.scrollIntoView({ behavior: 'smooth' }); }
    });
  });
})();

/* ── MOBILE MENU ────────────────────────────────────────────── */
(function initMobileMenu() {
  const mobOv  = document.getElementById('mobOv');
  const mobBtn = document.getElementById('mobBtn');
  const mobCls = document.getElementById('mobCls');
  if (!mobOv) return;

  function closeMob() { mobOv.classList.remove('open'); }
  window.closeMob = closeMob;                         // expõe para inline onclick

  mobBtn?.addEventListener('click', () => mobOv.classList.add('open'));
  mobCls?.addEventListener('click', closeMob);
})();

/* ── REVEAL ON SCROLL ───────────────────────────────────────── */
(function initReveal() {
  const ro = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('vis');
        ro.unobserve(e.target);
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.rev').forEach(el => ro.observe(el));
})();

/* ── PORTFOLIO FILTER ───────────────────────────────────────── */
(function initPortfolioFilter() {
  const fBtns  = document.querySelectorAll('.f-btn');
  const pItems = document.querySelectorAll('.p-item');
  if (!fBtns.length) return;

  function applyFilter(cat) {
    pItems.forEach(item => {
      const match = item.dataset.cat === cat;
      if (match) {
        item.style.display = 'block';
        setTimeout(() => { item.style.opacity = '1'; item.style.transform = 'scale(1)'; }, 10);
      } else {
        item.style.opacity  = '0';
        item.style.transform = 'scale(0.95)';
        setTimeout(() => { item.style.display = 'none'; }, 400);
      }
    });
  }

  fBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      fBtns.forEach(b => b.classList.remove('on'));
      btn.classList.add('on');
      applyFilter(btn.dataset.f);
    });
  });

  // Filtro inicial
  applyFilter('youtube');
})();

/* ── COUNTER ANIMADO ────────────────────────────────────────── */
(function initCounter() {
  function countUp() {
    document.querySelectorAll('.a-stat-n, .h-stat-n').forEach(el => {
      const raw   = el.innerHTML;
      const num   = parseFloat(raw.replace(/[^0-9.]/g, ''));
      const hasM  = raw.includes('M');
      const hasP  = raw.includes('+');
      const hasPct = raw.includes('%');

      let c = 0;
      const steps = 60;
      const inc   = num / steps;

      const iv = setInterval(() => {
        c = Math.min(c + inc, num);
        const b = Math.floor(c);

        if (el.querySelector('sup')) {
          el.childNodes[0].textContent = b + (hasM ? 'M' : '');
        } else if (el.querySelector('span')) {
          el.childNodes[0].textContent = b + (hasM ? 'M' : '');
        } else {
          el.textContent =
            b +
            (hasM  ? 'M' : '') +
            (hasP  ? '+' : '') +
            (hasPct ? '%' : '');
        }

        if (c >= num) clearInterval(iv);
      }, 30);
    });
  }

  let counted = false;
  const statEl = document.querySelector('.about-stats');
  if (!statEl) return;

  new IntersectionObserver(entries => {
    if (entries[0].isIntersecting && !counted) {
      countUp();
      counted = true;
    }
  }, { threshold: 0.3 }).observe(statEl);
})();

/* ── PARALLAX ───────────────────────────────────────────────── */
(function initParallax() {
  const heroTxt   = document.querySelector('.hero-bg-txt');
  const parallaxImgs = document.querySelectorAll('.parallax-img');

  window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;

    if (heroTxt) {
      heroTxt.style.transform = `translateX(-${scrolled * 0.1}px)`;
    }

    parallaxImgs.forEach(img => {
      const rect = img.parentElement.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        const shift = (window.innerHeight - rect.top) * 0.05;
        img.style.transform = `scale(1.1) translateY(${shift}px)`;
      }
    });
  }, { passive: true });
})();

/* ── FORMULÁRIO DE CONTATO ──────────────────────────────────── */
(function initContactForm() {
  const form = document.getElementById('cf');
  if (!form) return;

  form.addEventListener('submit', async e => {
    e.preventDefault();
    const btn  = form.querySelector('.f-sub');
    const orig = btn.textContent;

    btn.textContent = 'Enviando…';
    btn.disabled    = true;

    try {
      const res = await fetch(form.action, {
        method:  'POST',
        body:    new FormData(form),
        headers: { 'Accept': 'application/json' }
      });

      if (res.ok) {
        btn.textContent        = 'Mensagem Enviada ✓';
        btn.style.background   = '#1a5c38';
        form.reset();
      } else {
        throw new Error('server error');
      }
    } catch {
      btn.textContent      = 'Erro ao enviar ✗';
      btn.style.background = '#e61919';
    } finally {
      setTimeout(() => {
        btn.textContent      = orig;
        btn.style.background = '';
        btn.disabled         = false;
      }, 3000);
    }
  });
})();
