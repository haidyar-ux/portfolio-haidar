document.addEventListener('DOMContentLoaded', () => {
  /* =========================================
     1. TOPBAR SCROLL & STEPPING-STONE TRAIL PROGRESS
  ========================================= */
  const topbar = document.getElementById('topbar');
  const scrollProgress = document.getElementById('scrollProgress');
  const trailActive = document.getElementById('adventureTrailActive');

  let trailLength = 0;
  if (trailActive && typeof trailActive.getTotalLength === 'function') {
    trailLength = trailActive.getTotalLength();
    trailActive.style.strokeDasharray = `${trailLength}`;
    trailActive.style.strokeDashoffset = `${trailLength}`;
  }

  function updateScrollEffects() {
    const scrollY = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const ratio = docHeight > 0 ? Math.min(Math.max(scrollY / docHeight, 0), 1) : 0;

    if (topbar) {
      topbar.classList.toggle('scrolled', scrollY > 30);
    }

    if (scrollProgress) {
      scrollProgress.style.width = `${ratio * 100}%`;
    }

    if (trailActive && trailLength > 0) {
      trailActive.style.strokeDashoffset = `${trailLength * (1 - ratio)}`;
    }
  }

  window.addEventListener('scroll', updateScrollEffects, { passive: true });
  updateScrollEffects();

  /* =========================================
     2. HERO "SCROLL DOWN" SIGN CLICK
  ========================================= */
  const scrollDownSign = document.getElementById('scrollDownSign');
  const level01 = document.getElementById('level-01');
  if (scrollDownSign && level01) {
    scrollDownSign.addEventListener('click', () => {
      level01.scrollIntoView({ behavior: 'smooth' });
    });
  }

  /* =========================================
     3. SCROLL REVEAL ANIMATION
  ========================================= */
  const reveals = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );
  reveals.forEach((el) => observer.observe(el));

  /* =========================================
     4. INTERACTIVE LEVEL MODALS
  ========================================= */
  const modalBackdrop = document.getElementById('modalBackdrop');
  const modalTriggers = document.querySelectorAll('[data-modal]');
  const allModals = document.querySelectorAll('.level-modal');
  const closeButtons = document.querySelectorAll('.modal-close');

  function openModal(modalId) {
    const target = document.getElementById(modalId);
    if (!target || !modalBackdrop) return;

    allModals.forEach((m) => m.classList.remove('active'));
    target.classList.add('active');
    modalBackdrop.classList.add('open');
    modalBackdrop.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeAllModals() {
    if (!modalBackdrop) return;
    modalBackdrop.classList.remove('open');
    modalBackdrop.setAttribute('aria-hidden', 'true');
    allModals.forEach((m) => m.classList.remove('active'));
    document.body.style.overflow = '';
  }

  modalTriggers.forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-modal');
      openModal(id);
    });
  });

  closeButtons.forEach((btn) => {
    btn.addEventListener('click', closeAllModals);
  });

  if (modalBackdrop) {
    modalBackdrop.addEventListener('click', (e) => {
      if (e.target === modalBackdrop) closeAllModals();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeAllModals();
  });

  /* =========================================
     5. INTERACTIVE ADVENTURE MAP STAGES
  ========================================= */
  const stageDescriptions = {
    idea: '<strong>Tahap 1 — Idea & Research:</strong> Riset data produk, analisis kebutuhan pengguna, dan perumusan struktur solusi digital.',
    design: '<strong>Tahap 2 — UI/UX & Graphic Design:</strong> Perancangan wireframe, antarmuka modern, serta aset visual dengan Figma, CorelDRAW, dan Canva.',
    here: '<strong>Posisi Saat Ini:</strong> Siap berkolaborasi membangun website interaktif, sistem perangkat lunak, maupun kampanye digital untuk bisnis Anda.',
    develop: '<strong>Tahap 4 — Develop & Test:</strong> Pengkodean bersih menggunakan HTML, CSS, JavaScript, serta pengujian responsivitas lintas perangkat.',
    launch: '<strong>Tahap 5 — Launch & Grow:</strong> Publikasi ke GitHub/hosting, optimasi SEO, dan akselerasi konversi melalui strategi Digital Marketing.'
  };

  const mapStages = document.querySelectorAll('.map-stage');
  const stageDetailText = document.getElementById('stageDetailText');

  mapStages.forEach((stageBtn) => {
    stageBtn.addEventListener('click', () => {
      mapStages.forEach((s) => s.classList.remove('active'));
      stageBtn.classList.add('active');

      const key = stageBtn.getAttribute('data-stage');
      if (stageDetailText && stageDescriptions[key]) {
        stageDetailText.innerHTML = stageDescriptions[key];
      }
    });
  });

  /* =========================================
     6. COPY EMAIL TO CLIPBOARD
  ========================================= */
  const copyEmailBtn = document.getElementById('copyEmailBtn');
  const toast = document.getElementById('toast');

  if (copyEmailBtn && toast) {
    copyEmailBtn.addEventListener('click', async () => {
      const email = copyEmailBtn.getAttribute('data-email');
      try {
        await navigator.clipboard.writeText(email);
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 2800);
      } catch {
        window.location.href = `mailto:${email}`;
      }
    });
  }

  /* =========================================
     7. DAYTIME SUNLIT SPARKLE PARTICLES
  ========================================= */
  const canvas = document.getElementById('skyParticles');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let motes = [];

    function resizeSky() {
      canvas.width = canvas.parentElement.offsetWidth;
      canvas.height = canvas.parentElement.offsetHeight;
    }

    window.addEventListener('resize', resizeSky);
    resizeSky();

    class SunMote {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.radius = Math.random() * 2.6 + 1;
        this.vy = -(Math.random() * 0.35 + 0.12);
        this.vx = (Math.random() - 0.5) * 0.25;
        this.alpha = Math.random() * 0.55 + 0.25;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.y < 0) {
          this.y = canvas.height;
          this.x = Math.random() * canvas.width;
        }
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${this.alpha})`;
        ctx.fill();
      }
    }

    const count = Math.min(Math.floor(canvas.width / 24), 45);
    for (let i = 0; i < count; i++) {
      motes.push(new SunMote());
    }

    function animateSky() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      motes.forEach((m) => {
        m.update();
        m.draw();
      });
      requestAnimationFrame(animateSky);
    }

    animateSky();
  }
});
