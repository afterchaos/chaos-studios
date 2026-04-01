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

/* ── INTERNATIONALIZATION (i18n) ───────────────────────────── */
(function initI18n() {
  const translations = {
    pt: {
      "nav-about": "Sobre",
      "nav-portfolio": "Portfólio",
      "nav-services": "Serviços",
      "nav-plans": "Planos",
      "nav-testimonials": "Depoimentos",
      "nav-contact": "Contato",
      "nav-cta": "Iniciar Projeto",
      "hero-available": "Disponível para novos projetos — 2026",
      "hero-h1-1": "EDIÇÃO",
      "hero-h1-2": "QUE <span class=\"ac\">VENDE.</span>",
      "hero-h1-3": "SEMPRE.",
      "hero-p": "Entre o material bruto e um vídeo que para o scroll, existe uma arte.<br><strong style=\"color:var(--cream);font-weight:700\">Ritmo. Tensão. Retenção.</strong> Isso é o que entrego.",
      "hero-cta-1": "Ver Portfólio",
      "hero-cta-2": "Solicitar Orçamento",
      "hero-stat-1": "Projetos entregues",
      "hero-stat-2": "Views geradas",
      "hero-stat-3": "Clientes satisfeitos",
      "hero-scroll": "Scroll",
      "mq-1": "YouTube",
      "mq-2": "Curtos & Reels",
      "mq-3": "Color Grading",
      "mq-4": "Motion Graphics",
      "mq-5": "Montagens",
      "mq-6": "Sound Design",
      "mq-7": "Podcasts",
      "mq-8": "Vlogs",
      "about-tag": "Sobre",
      "about-h": "Histórias que <em>prendem</em><br>de verdade.",
      "about-badge-l": "Anos",
      "about-p1": "Somos a <strong>Chaos Studios</strong> — estúdio de edição especializado em transformar footage bruto em conteúdo que <strong>retém, engaja e converte</strong>.",
      "about-p2": "Mais de 5 anos criando vídeos para criadores que levam o digital a sério. Cada corte, cada transição e cada decisão sonora é feita com intenção.",
      "about-p3": "Não editamos apenas vídeos. <strong>Construímos narrativas</strong> que fazem o algoritmo trabalhar ao seu favor.",
      "port-tag": "Portfólio",
      "port-h": "Trabalhos <em>selecionados</em>",
      "port-f1": "Longos",
      "port-f2": "Curtos",
      "port-f3": "Montages",
      "svc-tag": "Serviços",
      "svc-h": "O que eu <em>faço</em><br>por você.",
      "svc-1-t": "Dinâmico & Intenso",
      "svc-1-s": "Gaming & Montagens",
      "svc-1-d": "Edições ágeis com cortes sincronizados no beat e efeitos de impacto. Máxima retenção do começo ao fim — o tipo de vídeo que o algoritmo adora.",
      "svc-2-t": "Orgânico & Fluido",
      "svc-2-s": "Vlogs & Lifestyle",
      "svc-2-d": "Narrativas envolventes with estética clean, correção de cor profissional e sonorização que acompanha o ritmo natural da sua história.",
      "svc-3-t": "Focado & Profissional",
      "svc-3-s": "Podcasts & Entrevistas",
      "svc-3-d": "Cortes multicâmera precisos com b-rolls estratégicos e lower thirds que mantêm a audiência presa e elevam a percepção de valor.",
      "svc-4-t": "Imersivo & Cinematográfico",
      "svc-4-s": "Narrativas Visuais",
      "svc-4-d": "Gradação de cor artística e design sonoro atmosférico para criar uma experiência que vai além do conteúdo — vira um evento.",
      "plan-tag": "Orçamentos",
      "plan-h": "🎬 Planos de <em>Edição</em>",
      "plan-unit": "/ vídeo",
      "plan-1-b": "Starter",
      "plan-1-t": "Essencial",
      "plan-1-s": "Perfeito para quem está começando sua presença online com vídeos rápidos.",
      "plan-1-f1": "Até 60 segundos",
      "plan-1-f2": "Corte preciso e ritmo fluido",
      "plan-1-f3": "Trilha sonora + sincronização",
      "plan-1-f4": "Legendas básicas (clean)",
      "plan-1-f5": "1 rodada de ajustes",
      "plan-cta-1": "Selecionar Starter",
      "plan-2-b": "Pro",
      "plan-2-t": "Otimizado",
      "plan-2-s": "Foco total em retenção e engajamento dinâmico para redes sociais.",
      "plan-2-f1": "Até 3 minutos",
      "plan-2-f2": "Edição dinâmica (cortes + zooms)",
      "plan-2-f3": "Legendas estilizadas (Reels/TikTok)",
      "plan-2-f4": "Sound effects + impacto",
      "plan-2-f5": "Correção de cor",
      "plan-2-f6": "2 rodadas de ajustes",
      "plan-cta-2": "Selecionar Pro",
      "plan-3-b": "Premium",
      "plan-3-t": "Alto Nível",
      "plan-3-s": "Para criadores que buscam crescimento real, escala e storytelling.",
      "plan-3-f1": "Até 10 minutos",
      "plan-3-f2": "Storytelling e ritmo avançado",
      "plan-3-f3": "Motion design leve",
      "plan-3-f4": "Legendas dinâmicas",
      "plan-3-f5": "Sound design completo",
      "plan-3-f6": "Color grading profissional",
      "plan-3-f7": "3 rodadas de ajustes",
      "plan-cta-3": "Selecionar Premium",
      "plan-4-b": "Long Form",
      "plan-4-t": "Sob Medida",
      "plan-4-s": "Projetos complexos, documentários ou produções cinematográficas.",
      "plan-4-p": "Budget Sob consulta",
      "plan-4-f1": "Acima de 10 minutos",
      "plan-4-f2": "Estrutura narrativa completa",
      "plan-4-f3": "Foco em watch time e retenção",
      "plan-4-f4": "Motion e visual refinado",
      "plan-4-f5": "Fluxo de revisão personalizado",
      "plan-4-f6": "Escolha total do cliente",
      "proc-tag": "Processo",
      "proc-h": "Como <em>funciona</em><br>na prática.",
      "proc-1-t": "Briefing",
      "proc-1-d": "Você me conta sobre o projeto, estilo, referências e prazos. Entendo sua marca antes de tocar no material.",
      "proc-2-t": "Edição",
      "proc-2-d": "Organizo o material, monto o ritmo, adiciono trilha, efeitos, color grade e motion graphics conforme acordado.",
      "proc-3-t": "Revisão",
      "proc-3-d": "Você revisa e aponta ajustes. Trabalho com rodadas de revisão até o resultado ser exatamente o que você imaginou.",
      "proc-4-t": "Entrega",
      "proc-4-d": "Arquivo final em alta qualidade, pronto para upload. Entrega sempre dentro do prazo combinado — sempre.",
      "testis-tag": "Depoimentos",
      "testis-h": "O que dizem<br>sobre meu <em>trabalho.</em>",
      "testi-1-txt": "\"Sem palavras para descrever a qualidade. O trabalho devolvido superou as expectativas que eu possuía, além de que a própria devolução foi antes do prazo estabelecido. A qualidade é excelente e realmente transformadora, os números subiram muito.\"",
      "testi-1-auth": "Marcos Vinicius",
      "testi-1-role": "Gestor de TI",
      "testi-2-txt": "\"A After Chaos é simplesmente incrível. O próprio dono é um dos melhores editores que já conheci na vida e editou alguns vídeos de Valorant para mim que alcançaram milhares de visualizações. Recomendo muito, não só por ser um grande amigo, mas por ser extremamente talentoso.\"",
      "testi-2-auth": "Vitor",
      "testi-2-role": "Criador de Conteúdo",
      "testi-3-txt": "\"Um dos editores mais talentosos que já trabalhei. A edição ficou impecável, com altíssimo nível de qualidade e atenção aos detalhes. O resultado foi excelente: meu engajamento aumentou significativamente e a taxa de retenção do vídeo foi excepcional.\"",
      "testi-3-auth": "Zypey",
      "testi-3-role": "Empreendedor Digital",
      "testi-4-txt": "\"Trabalhar com esse editor foi uma experiência acima do esperado! Entrega rápida, atenção aos detalhes e uma qualidade visual que realmente eleva o nível do conteúdo. Recomendo sem pensar duas vezes.\"",
      "testi-4-auth": "Clove",
      "testi-4-role": "Empreendedora Digital",
      "contact-tag": "Contato",
      "contact-h": "Vamos <em>conversar</em><br>sobre seu projeto.",
      "contact-soon": "Disponível em breve",
      "contact-direct": "Contato direto",
      "contact-comm": "Comunidade / Suporte",
      "contact-or": "ou manda uma mensagem direta",
      "form-name": "Nome",
      "form-name-ph": "Seu nome",
      "form-email": "Email",
      "form-email-ph": "seu@email.com",
      "form-service": "Serviço",
      "form-svc-opt-0": "Selecione um serviço",
      "form-svc-opt-1": "Edição YouTube",
      "form-svc-opt-2": "Shorts / Reels",
      "form-svc-opt-3": "Color Grading",
      "form-svc-opt-4": "Motion Graphics",
      "form-svc-opt-5": "Pacote Completo",
      "form-msg": "Nome",
      "form-msg-ph": "Conta sobre seu projeto, prazo e volume...",
      "form-btn": "Enviar Mensagem",
      "cta-h": "PRONTO<br>PARA <span class=\"red\">ELEVAR</span><br>SEU PROJETO?",
      "cta-p": "Vídeos que prendem, engajam e crescem canais. Edição profissional com entrega rápida e qualidade cinematográfica.",
      "cta-btn": "Começar Agora",
      "footer-copy": "© 2026 After Chaos. Todos os direitos reservados."
    },
    en: {
      "nav-about": "About",
      "nav-portfolio": "Portfolio",
      "nav-services": "Services",
      "nav-plans": "Plans",
      "nav-testimonials": "Testimonials",
      "nav-contact": "Contact",
      "nav-cta": "Start Project",
      "hero-available": "Available for new projects — 2026",
      "hero-h1-1": "EDITING",
      "hero-h1-2": "THAT <span class=\"ac\">SELLS.</span>",
      "hero-h1-3": "ALWAYS.",
      "hero-p": "Between raw footage and a scroll-stopping video, there is an art.<br><strong style=\"color:var(--cream);font-weight:700\">Rhythm. Tension. Retention.</strong> This is what I deliver.",
      "hero-cta-1": "View Portfolio",
      "hero-cta-2": "Request Quote",
      "hero-stat-1": "Projects delivered",
      "hero-stat-2": "Views generated",
      "hero-stat-3": "Satisfied clients",
      "hero-scroll": "Scroll",
      "mq-1": "YouTube",
      "mq-2": "Shorts & Reels",
      "mq-3": "Color Grading",
      "mq-4": "Motion Graphics",
      "mq-5": "Montages",
      "mq-6": "Sound Design",
      "mq-7": "Podcasts",
      "mq-8": "Vlogs",
      "about-tag": "About",
      "about-h": "Stories that <em>truly</em><br>hook you.",
      "about-badge-l": "Years",
      "about-p1": "We are <strong>Chaos Studios</strong> — an editing studio specialized in transforming raw footage into content that <strong>retains, engages, and converts</strong>.",
      "about-p2": "Over 5 years creating videos for creators who take digital seriously. Every cut, every transition, and every sound decision is made with intention.",
      "about-p3": "We don't just edit videos. <strong>We build narratives</strong> that make the algorithm work in your favor.",
      "port-tag": "Portfolio",
      "port-h": "Selected <em>Works</em>",
      "port-f1": "Long Form",
      "port-f2": "Shorts",
      "port-f3": "Montages",
      "svc-tag": "Services",
      "svc-h": "What I <em>do</em><br>for you.",
      "svc-1-t": "Dynamic & Intense",
      "svc-1-s": "Gaming & Montages",
      "svc-1-d": "Fast-paced edits with beat-synced cuts and impact effects. Maximum retention from start to finish — the type of video the algorithm loves.",
      "svc-2-t": "Organic & Fluid",
      "svc-2-s": "Vlogs & Lifestyle",
      "svc-2-d": "Engaging narratives with a clean aesthetic, professional color correction, and sound design that follows the natural rhythm of your story.",
      "svc-3-t": "Focused & Professional",
      "svc-3-s": "Podcasts & Interviews",
      "svc-3-d": "Precise multi-cam cuts with strategic b-rolls and lower thirds that keep the audience hooked and elevate perceived value.",
      "svc-4-t": "Immersive & Cinematic",
      "svc-4-s": "Visual Narratives",
      "svc-4-d": "Artistic color grading and atmospheric sound design to create an experience that goes beyond content — it becomes an event.",
      "plan-tag": "Pricing",
      "plan-h": "🎬 Editing <em>Plans</em>",
      "plan-unit": "/ video",
      "plan-1-b": "Starter",
      "plan-1-t": "Essential",
      "plan-1-s": "Perfect for those starting their online presence with quick videos.",
      "plan-1-f1": "Up to 60 seconds",
      "plan-1-f2": "Precise cutting and fluid rhythm",
      "plan-1-f3": "Soundtrack + synchronization",
      "plan-1-f4": "Basic captions (clean)",
      "plan-1-f5": "1 round of revisions",
      "plan-cta-1": "Select Starter",
      "plan-2-b": "Pro",
      "plan-2-t": "Optimized",
      "plan-2-s": "Total focus on retention and dynamic engagement for social media.",
      "plan-2-f1": "Up to 3 minutes",
      "plan-2-f2": "Dynamic editing (cuts + zooms)",
      "plan-2-f3": "Styled captions (Reels/TikTok)",
      "plan-2-f4": "Sound effects + impact",
      "plan-2-f5": "Color correction",
      "plan-2-f6": "2 rounds of revisions",
      "plan-cta-2": "Select Pro",
      "plan-3-b": "Premium",
      "plan-3-t": "High Level",
      "plan-3-s": "For creators seeking real growth, scale, and storytelling.",
      "plan-3-f1": "Up to 10 minutes",
      "plan-3-f2": "Advanced storytelling and rhythm",
      "plan-3-f3": "Light motion design",
      "plan-3-f4": "Dynamic captions",
      "plan-3-f5": "Full sound design",
      "plan-3-f6": "Professional color grading",
      "plan-3-f7": "3 rounds of revisions",
      "plan-cta-3": "Select Premium",
      "plan-4-b": "Long Form",
      "plan-4-t": "Custom Made",
      "plan-4-s": "Complex projects, documentaries, or cinematic productions.",
      "plan-4-p": "Budget on request",
      "plan-4-f1": "Above 10 minutes",
      "plan-4-f2": "Full narrative structure",
      "plan-4-f3": "Focus on watch time and retention",
      "plan-4-f4": "Refined motion and visuals",
      "plan-4-f5": "Custom revision flow",
      "plan-4-f6": "Total client choice",
      "proc-tag": "Process",
      "proc-h": "How it <em>works</em><br>in practice.",
      "proc-1-t": "Briefing",
      "proc-1-d": "You tell me about the project, style, references, and deadlines. I understand your brand before touching the material.",
      "proc-2-t": "Editing",
      "proc-2-d": "I organize the material, build the rhythm, add soundtrack, effects, color grading, and motion graphics as agreed.",
      "proc-3-t": "Review",
      "proc-3-d": "You review and point out adjustments. I work with revision rounds until the result is exactly what you imagined.",
      "proc-4-t": "Delivery",
      "proc-4-d": "Final file in high quality, ready for upload. Delivery always within the agreed deadline — always.",
      "testis-tag": "Testimonials",
      "testis-h": "What they say<br>about my <em>work.</em>",
      "testi-1-txt": "\"Beyond words to describe the quality. The delivered work exceeded my expectations, and it was delivered ahead of schedule. The quality is excellent and truly transformative; the numbers went up significantly.\"",
      "testi-1-auth": "Marcos Vinicius",
      "testi-1-role": "IT Manager",
      "testi-2-txt": "\"After Chaos is simply incredible. The owner himself is one of the best editors I've ever met and edited some Valorant videos for me that reached thousands of views. I highly recommend them, not just for being a great friend, but for being extremely talented.\"",
      "testi-2-auth": "Vitor",
      "testi-2-role": "Content Creator",
      "testi-3-txt": "\"One of the most talented editors I've ever worked with. The editing was flawless, with a very high level of quality and attention to detail. The result was excellent: my engagement increased significantly and the video's retention rate was exceptional.\"",
      "testi-3-auth": "Zypey",
      "testi-3-role": "Digital Entrepreneur",
      "testi-4-txt": "\"Working with this editor was an experience beyond expectations! Fast delivery, attention to detail, and visual quality that truly elevates the content. I recommend them without a second thought.\"",
      "testi-4-auth": "Clove",
      "testi-4-role": "Digital Entrepreneur",
      "contact-tag": "Contact",
      "contact-h": "Let's <em>talk</em><br>about your project.",
      "contact-soon": "Available soon",
      "contact-direct": "Direct contact",
      "contact-comm": "Community / Support",
      "contact-or": "or send a direct message",
      "form-name": "Name",
      "form-name-ph": "Your name",
      "form-email": "Email",
      "form-email-ph": "your@email.com",
      "form-service": "Service",
      "form-svc-opt-0": "Select a service",
      "form-svc-opt-1": "YouTube Editing",
      "form-svc-opt-2": "Shorts / Reels",
      "form-svc-opt-3": "Color Grading",
      "form-svc-opt-4": "Motion Graphics",
      "form-svc-opt-5": "Full Package",
      "form-msg": "Message",
      "form-msg-ph": "Tell us about your project, deadline, and volume...",
      "form-btn": "Send Message",
      "cta-h": "READY<br>TO <span class=\"red\">ELEVATE</span><br>YOUR PROJECT?",
      "cta-p": "Videos that hook, engage, and grow channels. Professional editing with fast delivery and cinematic quality.",
      "cta-btn": "Start Now",
      "footer-copy": "© 2026 After Chaos. All rights reserved."
    }
  };

  const langBtns = document.querySelectorAll('.lang-btn');

  function setLanguage(lang) {
    // innerHTML
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (translations[lang] && translations[lang][key]) {
        el.innerHTML = translations[lang][key];
      }
    });

    // Placeholders
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      if (translations[lang] && translations[lang][key]) {
        el.placeholder = translations[lang][key];
      }
    });

    langBtns.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.lang === lang);
    });

    document.documentElement.lang = lang === 'pt' ? 'pt-BR' : 'en';
    localStorage.setItem('preferred-lang', lang);
  }

  langBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      setLanguage(btn.dataset.lang);
    });
  });

  const savedLang = localStorage.getItem('preferred-lang');
  const browserLang = navigator.language.startsWith('en') ? 'en' : 'pt';
  setLanguage(savedLang || browserLang);
})();
