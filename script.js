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

  /* ========== GSAP INTRO & LOADING ANIMATION ========== */
  const introLoader = document.getElementById('loader');
  
  function initIntro() {
    if (introLoader && typeof gsap !== 'undefined') {
      document.body.style.overflow = 'hidden';
      const tl = gsap.timeline({
        onComplete: () => {
          document.body.style.overflow = '';
          introLoader.style.pointerEvents = 'none';
          if (typeof initScrollAnimations === 'function') initScrollAnimations();
        }
      });
      tl.to('.intro-logo', { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' })
        .to('.progress-bar-container', { opacity: 1, duration: 0.4 }, "-=0.2")
        .to('.progress-bar', { width: '100%', duration: 1.2, ease: 'power2.inOut' })
        .to('.intro-loader', { opacity: 0, duration: 0.6, ease: 'power2.inOut', delay: 0.2 });
    } else {
      if (introLoader) introLoader.style.display = 'none';
      if (typeof initScrollAnimations === 'function') setTimeout(initScrollAnimations, 100);
    }
  }

  window.addEventListener('load', initIntro);

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

  /* ========== PROJECTS SECTION: FILTERING & GRID RENDER ========== */
  (function initProjectsGrid() {
    var grid = document.getElementById('projects-grid');
    var filterContainer = document.getElementById('projects-filter');
    var btnShowMore = document.getElementById('btn-show-more');
    if (!grid) return;
    
    if (typeof projectsData === 'undefined' || !projectsData.length) {
      grid.innerHTML = '<p class="projects-placeholder">Projects are currently being prepared. Check back soon.</p>';
      return;
    }

    var currentFilter = 'All';
    var defaultVisibleCount = 6;
    var visibleCount = defaultVisibleCount;
    var filteredProjects = [];

    // Extract unique categories
    var categories = ['All'];
    for (var i = 0; i < projectsData.length; i++) {
        var p = projectsData[i];
        if (p.category && categories.indexOf(p.category) === -1) {
            categories.push(p.category);
        }
    }

    function createCardHTML(project, index) {
      var card = document.createElement('article');
      card.className = 'project-card';

      var imgWrap = document.createElement('div');
      imgWrap.className = 'project-image';
      var img = document.createElement('img');
      img.src = project.image || '';
      img.alt = project.title || 'Project Image';
      imgWrap.appendChild(img);
      card.appendChild(imgWrap);

      var content = document.createElement('div');
      content.className = 'project-content';
      
      var h3 = document.createElement('h3');
      h3.textContent = project.title || '';
      content.appendChild(h3);

      if (project.description) {
          var desc = document.createElement('p');
          desc.textContent = project.description;
          content.appendChild(desc);
      }

      if (project.tools && project.tools.length) {
        var tagsWrap = document.createElement('div');
        tagsWrap.className = 'project-tags';
        for(var z=0; z < project.tools.length; z++) {
           var tag = document.createElement('span');
           tag.textContent = project.tools[z];
           tagsWrap.appendChild(tag);
        }
        content.appendChild(tagsWrap);
      }
      
      var link = document.createElement('a');
      link.href = project.github || '#';
      link.className = 'btn btn-github';
      link.setAttribute('target', '_blank');
      link.setAttribute('rel', 'noopener');
      link.style.marginTop = 'auto'; // push to bottom
      
      var icon = document.createElement('i');
      icon.className = 'fab fa-github';
      link.appendChild(icon);
      link.appendChild(document.createTextNode(' GitHub'));
      content.appendChild(link);

      card.appendChild(content);
      return card;
    }

    function renderFilters() {
        if (!filterContainer) return;
        filterContainer.innerHTML = '';
        
        for (var i = 0; i < categories.length; i++) {
            var cat = categories[i];
            var btn = document.createElement('button');
            btn.className = 'filter-btn' + (cat === currentFilter ? ' active' : '');
            btn.textContent = cat;
            btn.setAttribute('data-filter', cat);
            
            btn.addEventListener('click', function(e) {
                var selectedFilter = e.target.getAttribute('data-filter');
                if (currentFilter === selectedFilter) return;
                
                // Update active state
                var allBtns = filterContainer.querySelectorAll('.filter-btn');
                allBtns.forEach(function(b) { b.classList.remove('active'); });
                e.target.classList.add('active');
                
                currentFilter = selectedFilter;
                visibleCount = defaultVisibleCount; // Reset count on filter change
                renderProjects();
            });
            
            filterContainer.appendChild(btn);
        }
    }

    function renderProjects() {
        grid.innerHTML = '';
        
        // Filter projects
        if (currentFilter === 'All') {
            filteredProjects = projectsData;
        } else {
            filteredProjects = projectsData.filter(function(p) {
                return p.category === currentFilter;
            });
        }
        
        if (filteredProjects.length === 0) {
            grid.innerHTML = '<p class="projects-placeholder">No projects found in this category.</p>';
            if (btnShowMore) btnShowMore.style.display = 'none';
            return;
        }
        
        // Render up to visibleCount
        var toRender = filteredProjects.slice(0, visibleCount);
        for (var i = 0; i < toRender.length; i++) {
            grid.appendChild(createCardHTML(toRender[i], i));
        }
        
        if (typeof gsap !== 'undefined') {
            gsap.fromTo(grid.querySelectorAll('.project-card'), 
                { autoAlpha: 0, scale: 0.95, y: 30 },
                { autoAlpha: 1, scale: 1, y: 0, duration: 0.5, stagger: 0.08, ease: 'power2.out' }
            );
        }
        
        // Show More/Less button logic
        if (btnShowMore) {
            if (filteredProjects.length <= defaultVisibleCount) {
                // If 6 or fewer total, hide the button
                btnShowMore.style.display = 'none';
            } else {
                btnShowMore.style.display = 'inline-flex';
                // If we are showing all of them
                if (visibleCount >= filteredProjects.length) {
                    btnShowMore.innerHTML = 'Show Less <i class="fas fa-chevron-up"></i>';
                } else {
                    btnShowMore.innerHTML = 'Show More <i class="fas fa-chevron-down"></i>';
                }
            }
        }
    }

    if (btnShowMore) {
        btnShowMore.addEventListener('click', function() {
            if (visibleCount >= filteredProjects.length) {
                // Currently expanded, so collapse
                visibleCount = defaultVisibleCount;
                var sectionTop = document.getElementById('projects').offsetTop;
                window.scrollTo({ top: sectionTop - 50, behavior: 'smooth' });
            } else {
                // Currently collapsed, so expand
                visibleCount = filteredProjects.length;
            }
            renderProjects();
        });
    }

    renderFilters();
    renderProjects();

  })();

  // old show all projects toggle removed

  /* ========== CERTIFICATIONS SECTION: FILTERING & GRID RENDER ========== */
  document.addEventListener('DOMContentLoaded', function() {
    var grid = document.getElementById('certifications-grid');
    var filterContainer = document.getElementById('certifications-filter');
    if (!grid) return;
    
    if (typeof certificationsData === 'undefined' || !certificationsData.length) {
      grid.innerHTML = '<p class="certifications-placeholder">Certificates will be added soon.</p>';
      return;
    }

    var currentFilter = 'All';
    var filteredCerts = [];

    // Extract unique categories
    var categories = ['All'];
    for (var i = 0; i < certificationsData.length; i++) {
        var c = certificationsData[i];
        if (c.category && categories.indexOf(c.category) === -1) {
            categories.push(c.category);
        }
    }

    function createCertCardHTML(cert, index) {
      var card = document.createElement('div');
      card.className = 'cert-card';

      var img = document.createElement('img');
      img.src = cert.image || '';
      img.alt = 'Certificate';
      img.className = 'cert-img';
      card.appendChild(img);

      var info = document.createElement('div');
      info.className = 'cert-info';

      var dateSpan = document.createElement('span');
      dateSpan.className = 'cert-date';
      dateSpan.textContent = cert.date || '';
      info.appendChild(dateSpan);

      var title = document.createElement('h4');
      title.textContent = cert.title || '';
      info.appendChild(title);

      var org = document.createElement('p');
      org.textContent = cert.organization || '';
      info.appendChild(org);

      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'btn btn-cert';
      btn.setAttribute('data-cert-url', cert.image || '');
      btn.textContent = 'View Certificate';
      info.appendChild(btn);

      card.appendChild(info);
      return card;
    }

    function renderFilters() {
        if (!filterContainer) return;
        filterContainer.innerHTML = '';
        
        for (var i = 0; i < categories.length; i++) {
            var cat = categories[i];
            var btn = document.createElement('button');
            btn.className = 'filter-btn' + (cat === currentFilter ? ' active' : '');
            btn.textContent = cat;
            btn.setAttribute('data-filter', cat);
            
            btn.addEventListener('click', function(e) {
                var selectedFilter = e.target.getAttribute('data-filter');
                if (currentFilter === selectedFilter) return;
                
                // Update active state
                var allBtns = filterContainer.querySelectorAll('.filter-btn');
                allBtns.forEach(function(b) { b.classList.remove('active'); });
                e.target.classList.add('active');
                
                currentFilter = selectedFilter;
                renderCertsGrid();
            });
            
            filterContainer.appendChild(btn);
        }
    }

    function renderCertsGrid() {
        grid.innerHTML = '';
        
        // Filter certs
        if (currentFilter === 'All') {
            filteredCerts = certificationsData;
        } else {
            filteredCerts = certificationsData.filter(function(c) {
                return c.category === currentFilter;
            });
        }
        
        if (filteredCerts.length === 0) {
            grid.innerHTML = '<p class="certifications-placeholder">No certificates found in this category.</p>';
            return;
        }
        
        // Render
        for (var i = 0; i < filteredCerts.length; i++) {
            grid.appendChild(createCertCardHTML(filteredCerts[i], i));
        }

        if (typeof gsap !== 'undefined') {
            gsap.fromTo(grid.querySelectorAll('.cert-card'), 
                { autoAlpha: 0, scale: 0.95, y: 30 },
                { autoAlpha: 1, scale: 1, y: 0, duration: 0.5, stagger: 0.08, ease: 'power2.out' }
            );
        }
    }

    renderFilters();
    renderCertsGrid();

  });

  // ML demo modal removed — related elements and handlers deleted

  /* ========== GSAP SCROLL ANIMATIONS ========== */
  function initScrollAnimations() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
    gsap.registerPlugin(ScrollTrigger);

    // 1. Scroll Progress Bar
    gsap.to('#scroll-progress', {
      width: '100%',
      ease: 'none',
      scrollTrigger: {
        trigger: document.body,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.3
      }
    });

    // 2. Hero Background Parallax Elements
    gsap.utils.toArray('.shape').forEach(shape => {
      const speed = Math.random() * 0.4 + 0.1;
      gsap.to(shape, {
        y: () => (window.innerHeight * speed),
        ease: 'none',
        scrollTrigger: {
          trigger: '.hero',
          start: 'top top',
          end: 'bottom top',
          scrub: true
        }
      });
    });

    // 3. Section Titles Reveal
    gsap.utils.toArray('.section-title').forEach(title => {
      gsap.fromTo(title, 
        { autoAlpha: 0, y: 40 },
        {
          autoAlpha: 1, 
          y: 0, 
          duration: 0.8, 
          ease: 'power3.out',
          scrollTrigger: {
            trigger: title,
            start: 'top 85%'
          }
        }
      );
    });

    // 3. Stagger elements with data-reveal
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
      const reveals = section.querySelectorAll('[data-reveal]:not(.section-title)');
      if (reveals.length) {
        gsap.fromTo(reveals, 
          { autoAlpha: 0, y: 30 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: section,
              start: 'top 80%'
            }
          }
        );
      }
    });

    // 4. Experience Timeline Line
    const expTimeline = document.querySelector('.experience-timeline');
    if (expTimeline) {
      const line = document.createElement('div');
      line.style.position = 'absolute'; line.style.top = '0'; line.style.bottom = '0';
      line.style.left = '6px'; line.style.width = '2px';
      line.style.background = 'var(--accent-1)';
      line.style.transformOrigin = 'top'; line.style.transform = 'scaleY(0)';
      line.style.zIndex = '0';
      expTimeline.appendChild(line);

      gsap.to(line, {
        scaleY: 1, ease: 'none',
        scrollTrigger: { trigger: expTimeline, start: 'top 60%', end: 'bottom 40%', scrub: true }
      });
      
      const items = expTimeline.querySelectorAll('.experience-item');
      gsap.fromTo(items, 
        { autoAlpha: 0, x: -30 },
        { autoAlpha: 1, x: 0, duration: 0.6, stagger: 0.2, ease: 'power2.out',
          scrollTrigger: { trigger: expTimeline, start: 'top 70%' }
        }
      );
    }
  }

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
  const CONTACT_EMAIL = 'eslamelsaid771@gmail.com';

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
