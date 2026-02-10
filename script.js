/**
 * ESLAM ELSAIED - PORTFOLIO
 * Vanilla JavaScript: typing, scroll reveal, carousel, modal, nav
 */

(function () {
  'use strict';

  /* ========== CONFIG: Edit typing text here ========== */
  const TYPING_STRINGS = [
    'Machine Learning Engineer & Data Analyst',
    'Python | NumPy | Pandas | scikit-learn',
    'Data Science & AI Enthusiast'
  ];
  const TYPING_SPEED = 80;
  const TYPING_DELETE_SPEED = 50;
  const TYPING_PAUSE_AFTER_TYPE = 2000;
  const TYPING_PAUSE_AFTER_DELETE = 500;

  /* ========== LOADING ANIMATION ========== */
  const loader = document.getElementById('loader');
  if (loader) {
    window.addEventListener('load', function () {
      setTimeout(function () {
        loader.classList.add('hidden');
      }, 600);
    });
  }

  /* ========== TYPING ANIMATION (continuous loop) ========== */
  const typingEl = document.getElementById('typing-text');
  if (typingEl) {
    let stringIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let timeoutId;

    function type() {
      const current = TYPING_STRINGS[stringIndex];
      if (isDeleting) {
        typingEl.textContent = current.substring(0, charIndex - 1);
        charIndex--;
        timeoutId = setTimeout(type, TYPING_DELETE_SPEED);
      } else {
        typingEl.textContent = current.substring(0, charIndex + 1);
        charIndex++;
        timeoutId = setTimeout(type, TYPING_SPEED);
      }

      if (!isDeleting && charIndex === current.length) {
        timeoutId = setTimeout(function () {
          isDeleting = true;
          type();
        }, TYPING_PAUSE_AFTER_TYPE);
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        stringIndex = (stringIndex + 1) % TYPING_STRINGS.length;
        timeoutId = setTimeout(type, TYPING_PAUSE_AFTER_DELETE);
      }
    }

    type();
  }

  /* ========== NAVBAR: sticky + scroll class ========== */
  const navbar = document.getElementById('navbar');
  if (navbar) {
    function updateNavbar() {
      if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }
    window.addEventListener('scroll', updateNavbar);
    updateNavbar();
  }

  /* ========== ACTIVE SECTION HIGHLIGHTING ========== */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  function setActiveSection() {
    const scrollY = window.scrollY;
    let current = '';

    sections.forEach(function (section) {
      const top = section.offsetTop - 100;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');
      if (scrollY >= top && scrollY < top + height) {
        current = id;
      }
    });

    navLinks.forEach(function (link) {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', setActiveSection);
  setActiveSection();

  /* ========== SMOOTH SCROLL (for anchor links) ========== */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        /* Close mobile menu if open */
        const navMenu = document.querySelector('.nav-menu');
        const navToggle = document.getElementById('nav-toggle');
        if (navMenu && navMenu.classList.contains('active')) {
          navMenu.classList.remove('active');
          if (navToggle) navToggle.classList.remove('active');
        }
      }
    });
  });

  /* ========== MOBILE HAMBURGER MENU ========== */
  const navToggle = document.getElementById('nav-toggle');
  const navMenu = document.querySelector('.nav-menu');
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', function () {
      navMenu.classList.toggle('active');
      navToggle.classList.toggle('active');
    });
  }

  /* ========== PROJECTS SECTION: RENDER CARDS FROM projectsData ========== */
  (function renderProjects() {
    var grid = document.getElementById('projects-grid');
    if (!grid) return;
    if (typeof projectsData === 'undefined' || !projectsData.length) {
      var placeholder = document.createElement('p');
      placeholder.className = 'projects-placeholder';
      placeholder.textContent = 'Projects are currently being prepared. Check back soon.';
      grid.appendChild(placeholder);
      return;
    }
    var i, p, card, imgWrap, img, content, title, desc, tagsWrap, tag, link, icon;
    for (i = 0; i < projectsData.length; i++) {
      p = projectsData[i];
      card = document.createElement('article');
      card.className = 'project-card';
      card.setAttribute('data-reveal', '');

      imgWrap = document.createElement('div');
      imgWrap.className = 'project-image';
      img = document.createElement('img');
      img.src = p.image || '';
      img.alt = p.title || 'Project';
      imgWrap.appendChild(img);
      card.appendChild(imgWrap);

      content = document.createElement('div');
      content.className = 'project-content';
      title = document.createElement('h3');
      title.textContent = p.title || '';
      content.appendChild(title);
      desc = document.createElement('p');
      desc.textContent = p.description || '';
      content.appendChild(desc);

      tagsWrap = document.createElement('div');
      tagsWrap.className = 'project-tags';
      if (p.tools && p.tools.length) {
        for (var t = 0; t < p.tools.length; t++) {
          tag = document.createElement('span');
          tag.textContent = p.tools[t];
          tagsWrap.appendChild(tag);
        }
      }
      content.appendChild(tagsWrap);

      link = document.createElement('a');
      link.href = p.github || '#';
      link.className = 'btn btn-github';
      link.setAttribute('target', '_blank');
      link.setAttribute('rel', 'noopener');
      icon = document.createElement('i');
      icon.className = 'fab fa-github';
      link.appendChild(icon);
      link.appendChild(document.createTextNode(' GitHub'));
      content.appendChild(link);

      if (p.demoType === 'classification') {
        var demoBtn = document.createElement('button');
        demoBtn.type = 'button';
        demoBtn.className = 'btn btn-demo';
        demoBtn.innerHTML = '<i class="fas fa-play"></i> Try Demo';
        demoBtn.addEventListener('click', function () { openDemoModal(); });
        content.appendChild(demoBtn);
      }

      card.appendChild(content);
      grid.appendChild(card);
    }
  })();

  /* ========== CERTIFICATIONS SECTION: RENDER CARDS FROM certificationsData ========== */
  (function renderCertifications() {
    var grid = document.getElementById('certifications-grid');
    if (!grid) return;
    if (typeof certificationsData === 'undefined' || !certificationsData.length) {
      var placeholder = document.createElement('p');
      placeholder.className = 'certifications-placeholder';
      placeholder.textContent = 'Certificates will be added soon.';
      grid.appendChild(placeholder);
      return;
    }
    var i, c, card, img, info, dateSpan, title, org, btn;
    for (i = 0; i < certificationsData.length; i++) {
      c = certificationsData[i];
      card = document.createElement('div');
      card.className = 'cert-card';
      card.setAttribute('data-reveal', '');

      img = document.createElement('img');
      img.src = c.image || '';
      img.alt = 'Certificate';
      img.className = 'cert-img';
      card.appendChild(img);

      info = document.createElement('div');
      info.className = 'cert-info';

      dateSpan = document.createElement('span');
      dateSpan.className = 'cert-date';
      dateSpan.textContent = c.date || '';
      info.appendChild(dateSpan);

      title = document.createElement('h4');
      title.textContent = c.title || '';
      info.appendChild(title);

      org = document.createElement('p');
      org.textContent = c.organization || '';
      info.appendChild(org);

      btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'btn btn-cert';
      btn.setAttribute('data-cert-url', c.image || '');
      btn.textContent = 'View Certificate';
      info.appendChild(btn);

      card.appendChild(info);
      grid.appendChild(card);
    }
  })();

  /* ========== ML DEMO MODAL (classification simulation) ========== */
  (function demoModal() {
    var demoModalEl = document.getElementById('demo-modal');
    var demoOverlay = document.getElementById('demo-modal-overlay');
    var demoCloseBtn = document.getElementById('demo-modal-close');
    var demoForm = document.getElementById('demo-form');
    var demoResult = document.getElementById('demo-result');
    var demoResultProbText = document.getElementById('demo-result-prob-text');
    var demoResultPredText = document.getElementById('demo-result-pred-text');

    function openDemoModal() {
      if (demoModalEl) {
        demoModalEl.classList.add('active');
        document.body.style.overflow = 'hidden';
        if (demoResult) {
          demoResult.hidden = true;
          demoResult.classList.remove('revealed');
        }
      }
    }

    function closeDemoModal() {
      if (demoModalEl) {
        demoModalEl.classList.remove('active');
        document.body.style.overflow = '';
      }
    }

    function weightedSurvivalProbability(age, fare, pclass, gender) {
      var base = 0.5;
      if (pclass === 1) base += 0.22;
      else if (pclass === 2) base += 0.08;
      else base -= 0.15;
      if (gender === 'female') base += 0.28;
      else base -= 0.1;
      var ageNorm = Math.max(0, Math.min(80, age));
      base += (1 - ageNorm / 80) * 0.15;
      var fareNorm = Math.min(100, fare) / 100;
      base += fareNorm * 0.08;
      base += (Math.random() - 0.5) * 0.08;
      return Math.max(0, Math.min(1, base));
    }

    if (demoForm) {
      demoForm.addEventListener('submit', function (e) {
        e.preventDefault();
        var age = parseInt(document.getElementById('demo-age').value, 10) || 30;
        var fare = parseFloat(document.getElementById('demo-fare').value) || 32;
        var pclass = parseInt(document.getElementById('demo-pclass').value, 10) || 1;
        var gender = document.getElementById('demo-gender').value || 'male';
        var prob = weightedSurvivalProbability(age, fare, pclass, gender);
        var pct = Math.round(prob * 100);
        var survived = prob >= 0.5;
        if (demoResultProbText) demoResultProbText.textContent = 'Survival Probability: ' + pct + '%';
        if (demoResultPredText) demoResultPredText.textContent = 'Prediction: ' + (survived ? 'Survived' : 'Did Not Survive');
        if (demoResult) {
          demoResult.hidden = false;
          demoResult.removeAttribute('hidden');
          demoResult.offsetHeight;
          demoResult.classList.add('revealed');
        }
      });
    }

    if (demoCloseBtn) demoCloseBtn.addEventListener('click', closeDemoModal);
    if (demoOverlay) demoOverlay.addEventListener('click', closeDemoModal);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && demoModalEl && demoModalEl.classList.contains('active')) {
        closeDemoModal();
      }
    });
  })();

  /* ========== SCROLL REVEAL ANIMATIONS ========== */
  const revealOffset = 80;

  function reveal() {
    var revealEls = document.querySelectorAll('[data-reveal]');
    revealEls.forEach(function (el) {
      const top = el.getBoundingClientRect().top;
      const winHeight = window.innerHeight;
      if (top < winHeight - revealOffset) {
        el.classList.add('revealed');
      }
    });
  }

  window.addEventListener('scroll', reveal);
  window.addEventListener('load', reveal);
  reveal();

  /* ========== SKILL PROGRESS BARS (animate when visible) ========== */
  const skillFills = document.querySelectorAll('.skill-fill');
  const skillsSection = document.getElementById('skills');
  let skillsAnimated = false;

  function animateSkillBars() {
    if (skillsAnimated || !skillsSection) return;
    const rect = skillsSection.getBoundingClientRect();
    if (rect.top < window.innerHeight - 100) {
      skillsAnimated = true;
      skillFills.forEach(function (fill) {
        const level = fill.getAttribute('data-level') || 0;
        fill.style.width = level + '%';
      });
    }
  }

  window.addEventListener('scroll', animateSkillBars);
  window.addEventListener('load', animateSkillBars);

  /* ========== ABOUT: Interactive mouse movement background ========== */
  const aboutMouseBg = document.getElementById('about-mouse-bg');
  if (aboutMouseBg) {
    const colors = ['#6366f1', '#8b5cf6', '#06b6d4', '#ec4899'];
    const orbCount = 5;

    for (let i = 0; i < orbCount; i++) {
      const orb = document.createElement('div');
      orb.className = 'orb';
      orb.style.width = (80 + Math.random() * 120) + 'px';
      orb.style.height = orb.style.width;
      orb.style.background = colors[i % colors.length];
      orb.style.left = (Math.random() * 100) + '%';
      orb.style.top = (Math.random() * 100) + '%';
      aboutMouseBg.appendChild(orb);
    }

    const orbs = aboutMouseBg.querySelectorAll('.orb');
    document.getElementById('about').addEventListener('mousemove', function (e) {
      const rect = this.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      orbs.forEach(function (orb, i) {
        const dx = (x - 50) * 0.1 * (i + 1);
        const dy = (y - 50) * 0.1 * (i + 1);
        orb.style.transform = 'translate(' + dx + 'px, ' + dy + 'px)';
      });
    });
  }

  /* ========== CERTIFICATE MODAL ========== */
  const certModal = document.getElementById('cert-modal');
  const modalImg = document.getElementById('modal-cert-img');
  const modalClose = document.getElementById('modal-close');
  const certGrid = document.getElementById('certifications-grid');

  function openCertModal(url) {
    if (modalImg && certModal) {
      modalImg.src = url;
      certModal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeCertModal() {
    if (certModal) {
      certModal.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  if (certGrid) {
    certGrid.addEventListener('click', function (e) {
      var btn = e.target && e.target.closest ? e.target.closest('.btn-cert') : null;
      if (btn) {
        var url = btn.getAttribute('data-cert-url');
        if (url) openCertModal(url);
      }
    });
  }

  if (modalClose) {
    modalClose.addEventListener('click', closeCertModal);
  }

  if (certModal) {
    certModal.querySelector('.modal-overlay').addEventListener('click', closeCertModal);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && certModal.classList.contains('active')) {
        closeCertModal();
      }
    });
  }

  /* ========== TESTIMONIALS CAROUSEL ========== */
  const track = document.querySelector('.testimonial-track');
  const slides = document.querySelectorAll('.testimonial-slide');
  const dotsContainer = document.getElementById('carousel-dots');
  const totalSlides = slides.length;
  let currentSlide = 0;
  let carouselInterval;

  if (track && slides.length && dotsContainer) {
    /* Create dots */
    for (let i = 0; i < totalSlides; i++) {
      const dot = document.createElement('button');
      dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', 'Go to testimonial ' + (i + 1));
      dot.addEventListener('click', function () {
        goToSlide(i);
        resetCarouselInterval();
      });
      dotsContainer.appendChild(dot);
    }

    const dots = dotsContainer.querySelectorAll('.carousel-dot');

    function goToSlide(index) {
      currentSlide = (index + totalSlides) % totalSlides;
      track.style.transform = 'translateX(-' + currentSlide * 100 + '%)';
      dots.forEach(function (d, i) {
        d.classList.toggle('active', i === currentSlide);
      });
    }

    function nextSlide() {
      goToSlide(currentSlide + 1);
    }

    function resetCarouselInterval() {
      clearInterval(carouselInterval);
      carouselInterval = setInterval(nextSlide, 5000);
    }

    carouselInterval = setInterval(nextSlide, 5000);
  }

  /* ========== SCROLL-TO-TOP BUTTON ========== */
  const scrollTopBtn = document.getElementById('scroll-top');
  if (scrollTopBtn) {
    window.addEventListener('scroll', function () {
      if (window.scrollY > 400) {
        scrollTopBtn.classList.add('visible');
      } else {
        scrollTopBtn.classList.remove('visible');
      }
    });

    scrollTopBtn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ========== CONTACT FORM (mailto) ========== */
  const contactForm = document.getElementById('contact-form');
  const contactFormSuccess = document.getElementById('contact-form-success');
  const CONTACT_EMAIL = 'your_email@example.com';

  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      var nameInput = document.getElementById('contact-name');
      var emailInput = document.getElementById('contact-email');
      var subjectInput = document.getElementById('contact-subject');
      var messageInput = document.getElementById('contact-message');

      var name = nameInput ? nameInput.value.trim() : '';
      var email = emailInput ? emailInput.value.trim() : '';
      var subject = subjectInput ? subjectInput.value.trim() : '';
      var message = messageInput ? messageInput.value.trim() : '';

      if (!name || !email || !subject || !message) {
        contactForm.reportValidity();
        return;
      }

      var body = 'Name: ' + name + '\nEmail: ' + email + '\nMessage:\n' + message;
      var mailtoLink = 'mailto:' + encodeURIComponent(CONTACT_EMAIL) +
        '?subject=' + encodeURIComponent(subject) +
        '&body=' + encodeURIComponent(body);

      window.location.href = mailtoLink;

      if (contactFormSuccess) {
        contactFormSuccess.hidden = false;
        contactFormSuccess.removeAttribute('hidden');
        setTimeout(function () {
          contactFormSuccess.hidden = true;
          contactFormSuccess.setAttribute('hidden', '');
        }, 4000);
      }
    });
  }

  /* ========== FOOTER YEAR ========== */
  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  /* ========== HERO NEURAL NETWORK CANVAS BACKGROUND ========== */
  /* Set to false to disable the neural network animation */
  var HERO_NEURAL_ENABLED = true;

  (function neuralBackground() {
    if (!HERO_NEURAL_ENABLED) return;

    var canvas = document.getElementById('hero-neural-canvas');
    var heroSection = document.getElementById('home');
    if (!canvas || !heroSection) return;

    var ctx = canvas.getContext('2d');
    var particles = [];
    var mouseX = -9999;
    var mouseY = -9999;
    var animationId = null;
    var startTime = Date.now();

    /* Tuning: particle count scales with width, capped for performance (reduced on small screens) */
    function getParticleCount() {
      var w = window.innerWidth;
      if (w <= 480) return Math.min(28, Math.floor(w / 18));
      if (w <= 768) return Math.min(42, Math.floor(w / 20));
      return Math.min(70, Math.floor(w / 24));
    }

    var CONNECT_DISTANCE = 140;
    var PARTICLE_RADIUS = 1.5;
    var PARTICLE_SPEED = 0.12;
    var MOUSE_INFLUENCE_RADIUS = 180;
    var MOUSE_STRENGTH = 0.08;
    var LINE_OPACITY_MAX = 0.18;
    var GLOW_OPACITY = 0.4;
    var BREATH_SPEED = 0.5;
    var BREATH_AMOUNT = 0.04;
    var WAVE_PERIOD = 6;
    var WAVE_WIDTH = 100;
    var WAVE_PEAK = 0.45;
    var PARALLAX_FACTOR = 0.1;

    function getRect() {
      return heroSection.getBoundingClientRect();
    }

    function resize() {
      var rect = getRect();
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = rect.width + 'px';
      canvas.style.height = rect.height + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      initParticles(rect.width, rect.height);
    }

    function initParticles(w, h) {
      var n = getParticleCount();
      particles = [];
      for (var i = 0; i < n; i++) {
        particles.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * PARTICLE_SPEED * 2,
          vy: (Math.random() - 0.5) * PARTICLE_SPEED * 2,
          radius: PARTICLE_RADIUS
        });
      }
    }

    function setMouseFromEvent(e) {
      var rect = getRect();
      if (e.touches && e.touches.length) {
        mouseX = e.touches[0].clientX - rect.left;
        mouseY = e.touches[0].clientY - rect.top;
      } else {
        mouseX = e.clientX - rect.left;
        mouseY = e.clientY - rect.top;
      }
    }

    function clearMouse() {
      mouseX = -9999;
      mouseY = -9999;
    }

    function tick() {
      var rect = getRect();
      var w = rect.width;
      var h = rect.height;
      var time = (Date.now() - startTime) * 0.001;

      ctx.clearRect(0, 0, w, h);

      /* Breathing: subtle sine scale (expand/contract) */
      var breathScale = 1 + BREATH_AMOUNT * Math.sin(time * BREATH_SPEED);
      var cx = w * 0.5;
      var cy = h * 0.5;
      ctx.save();
      ctx.translate(cx, cy);
      ctx.scale(breathScale, breathScale);
      ctx.translate(-cx, -cy);

      /* Scroll parallax: vertical shift for depth */
      var parallaxOffsetY = -rect.top * PARALLAX_FACTOR;

      /* Wave pulse: position of wave (moves across over WAVE_PERIOD seconds) */
      var waveT = (time % WAVE_PERIOD) / WAVE_PERIOD;
      var waveX = waveT * (w + 200) - 100;

      /* Update positions: continuous drift with wrap (no hard bounce), mouse influence optional */
      var i, p, dx, dy, dist, force;
      for (i = 0; i < particles.length; i++) {
        p = particles[i];
        if (mouseX > -9999) {
          dx = mouseX - p.x;
          dy = mouseY - p.y;
          dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < MOUSE_INFLUENCE_RADIUS && dist > 0) {
            force = MOUSE_STRENGTH * (1 - dist / MOUSE_INFLUENCE_RADIUS);
            p.vx += (dx / dist) * force;
            p.vy += (dy / dist) * force;
          }
        }
        p.vx *= 0.99;
        p.vy *= 0.99;
        p.x += p.vx;
        p.y += p.vy;
        /* Smooth wrap: continuous motion, no abrupt bounce */
        p.x = ((p.x % w) + w) % w;
        p.y = ((p.y % h) + h) % h;
      }

      /* Draw connections with distance-based opacity (soft fade in/out) */
      var drawY0, drawY1, lineOpacity;
      ctx.lineWidth = 0.8;
      for (i = 0; i < particles.length; i++) {
        for (var j = i + 1; j < particles.length; j++) {
          dx = particles[j].x - particles[i].x;
          dy = particles[j].y - particles[i].y;
          dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < CONNECT_DISTANCE) {
            lineOpacity = LINE_OPACITY_MAX * (1 - dist / CONNECT_DISTANCE);
            ctx.strokeStyle = 'rgba(255,255,255,' + lineOpacity + ')';
            drawY0 = particles[i].y + parallaxOffsetY;
            drawY1 = particles[j].y + parallaxOffsetY;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, drawY0);
            ctx.lineTo(particles[j].x, drawY1);
            ctx.stroke();
          }
        }
      }

      /* Draw nodes: glow + wave pulse brightening */
      var pulse, glowOpacity, drawY;
      for (i = 0; i < particles.length; i++) {
        p = particles[i];
        drawY = p.y + parallaxOffsetY;
        pulse = 1 + WAVE_PEAK * Math.exp(-Math.pow(p.x - waveX, 2) / (WAVE_WIDTH * WAVE_WIDTH));
        glowOpacity = Math.min(0.85, GLOW_OPACITY * pulse);
        var gradient = ctx.createRadialGradient(
          p.x, drawY, 0,
          p.x, drawY, p.radius * 4
        );
        gradient.addColorStop(0, 'rgba(255,255,255,' + glowOpacity + ')');
        gradient.addColorStop(0.5, 'rgba(99,102,241,0.15)');
        gradient.addColorStop(1, 'rgba(99,102,241,0)');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(p.x, drawY, p.radius * 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = 'rgba(255,255,255,' + (0.5 + 0.25 * pulse) + ')';
        ctx.beginPath();
        ctx.arc(p.x, drawY, p.radius, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
      animationId = requestAnimationFrame(tick);
    }

    function start() {
      startTime = Date.now();
      resize();
      tick();
    }

    function stop() {
      if (animationId) cancelAnimationFrame(animationId);
      animationId = null;
    }

    window.addEventListener('resize', function () {
      resize();
    });

    heroSection.addEventListener('mousemove', setMouseFromEvent);
    heroSection.addEventListener('mouseleave', clearMouse);
    heroSection.addEventListener('touchmove', setMouseFromEvent, { passive: true });
    heroSection.addEventListener('touchend', clearMouse);

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', start);
    } else {
      start();
    }
  })();
})();
