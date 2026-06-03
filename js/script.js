/* =============================================
   DATA
   ============================================= */
const PROJECTS = [
  { id: 1, title: 'E-Commerce Platform', description: 'A full-featured e-commerce platform with product management, shopping cart, Stripe payment processing, and order tracking.', category: 'web', tech_stack: ['Laravel', 'React', 'MySQL', 'Stripe', 'Redis'], featured: true, live_url: 'https://example-ecommerce.com', github_url: 'https://github.com/munthasir/ecommerce' },
  { id: 2, title: 'Task Management API', description: 'RESTful API for task management with real-time updates, team collaboration, and role-based access control.', category: 'api', tech_stack: ['Laravel', 'Sanctum', 'WebSocket', 'PostgreSQL'], featured: true, live_url: null, github_url: 'https://github.com/munthasir/task-api' },
  { id: 3, title: 'Portfolio Website', description: 'A modern, responsive portfolio showcasing projects and skills with smooth animations and optimized performance.', category: 'web', tech_stack: ['HTML5', 'CSS3', 'JavaScript', 'Tailwind CSS'], featured: false, live_url: 'https://munthasir.dev', github_url: 'https://github.com/munthasir/portfolio' },
  { id: 4, title: 'Inventory Management System', description: 'Enterprise inventory system with barcode scanning, automated reordering, and comprehensive reporting dashboard.', category: 'web', tech_stack: ['Laravel', 'Vue.js', 'MySQL', 'Chart.js'], featured: true, live_url: null, github_url: null },
  { id: 5, title: 'Mobile Fitness App', description: 'Cross-platform fitness tracking app with workout plans, progress analytics, and social features.', category: 'mobile', tech_stack: ['React Native', 'Node.js', 'MongoDB', 'Firebase'], featured: true, live_url: null, github_url: 'https://github.com/munthasir/fitness-app' },
  { id: 6, title: 'Design System Library', description: 'Comprehensive component library and design system for consistent brand experience across all products.', category: 'design', tech_stack: ['React', 'Storybook', 'Figma', 'CSS Modules'], featured: false, live_url: null, github_url: 'https://github.com/munthasir/design-system' },
];

const SKILLS = [
  { category: 'frontend', name: 'React', level: 95 }, { category: 'frontend', name: 'TypeScript', level: 90 },
  { category: 'frontend', name: 'Vue.js', level: 82 }, { category: 'frontend', name: 'Next.js', level: 88 },
  { category: 'backend', name: 'Laravel', level: 92 }, { category: 'backend', name: 'Node.js', level: 88 },
  { category: 'backend', name: 'Python', level: 78 }, { category: 'backend', name: 'PostgreSQL', level: 85 },
  { category: 'tools', name: 'Git', level: 95 }, { category: 'tools', name: 'Docker', level: 80 },
  { category: 'tools', name: 'Figma', level: 85 }, { category: 'tools', name: 'AWS', level: 75 },
];

const TESTIMONIALS = [
  { name: 'Sarah Chen', role: 'CTO, TechCorp', content: 'Exceptional developer who consistently delivers beyond expectations. His attention to detail and problem-solving abilities make him an invaluable asset to any team.', rating: 5 },
  { name: 'James Wilson', role: 'Product Manager, StartupXYZ', content: 'Working with Munthasir was a fantastic experience. He has a rare ability to translate complex requirements into elegant, performant solutions.', rating: 5 },
  { name: 'Priya Patel', role: 'Design Lead, DigitalAgency', content: 'Munthasir bridges the gap between design and engineering seamlessly. He understands that great products are built on both technical excellence and thoughtful UX.', rating: 5 },
  { name: 'Alex Rivera', role: 'Founder, WebStudio', content: 'One of the most talented developers I\'ve worked with. His code is clean, well-documented, and he always considers edge cases before they become problems.', rating: 4 },
  { name: 'Emily Nakamura', role: 'Engineering Manager, FinTechCo', content: 'Munthasir brought structure and clarity to our messy codebase. His refactoring work improved our deployment velocity by 40%. Highly recommend.', rating: 5 },
  { name: 'David Okonkwo', role: 'CEO, SaaSPlatform', content: 'He delivered our platform ahead of schedule and under budget. The performance optimization alone saved us 60% on infrastructure costs.', rating: 5 },
];

/* =============================================
   GSAP + LENIS SETUP
   ============================================= */
let lenis;

function initLenis() {
  const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  if (isTouch) return;
  lenis = new Lenis({ duration: 1.2, easing: function (t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); }, smooth: true });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add(function (time) { if (lenis) lenis.raf(time * 1000); });
  gsap.ticker.lagSmoothing(0);
}

/* =============================================
   PRELOADER
   ============================================= */
function initPreloader() {
  const counter = document.getElementById('preloader-counter');
  const fill = document.getElementById('preloader-fill');
  const preloader = document.getElementById('preloader');
  let progress = 0;
  const interval = setInterval(function () {
    progress += Math.floor(Math.random() * 8) + 4;
    if (progress > 100) progress = 100;
    counter.textContent = progress;
    fill.style.width = progress + '%';
    if (progress >= 100) {
      clearInterval(interval);
      setTimeout(function () { preloader.classList.add('hidden'); }, 300);
    }
  }, 60);
}

/* =============================================
   NAVBAR
   ============================================= */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileLinks = document.querySelectorAll('.mobile-link');
  const navLinks = document.querySelectorAll('.navbar-link');

  hamburger.addEventListener('click', function () {
    const isOpen = this.classList.toggle('is-active');
    mobileMenu.classList.toggle('is-open');
    this.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  mobileLinks.forEach(function (link) {
    link.addEventListener('click', function () {
      hamburger.classList.remove('is-active');
      mobileMenu.classList.remove('is-open');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });

  window.addEventListener('scroll', function () {
    if (window.scrollY > 50) { navbar.classList.add('scrolled'); } else { navbar.classList.remove('scrolled'); }
  }, { passive: true });

  const sections = document.querySelectorAll('section[id]');
  let navItems = [];
  navLinks.forEach(function (l) { navItems.push(l); });
  document.querySelectorAll('.nav-dot').forEach(function (d) { navItems.push(d); });
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        var id = entry.target.getAttribute('id');
        navLinks.forEach(function (link) {
          link.classList.toggle('is-active', link.getAttribute('data-section') === id);
        });
        document.querySelectorAll('.nav-dot').forEach(function (dot) {
          dot.classList.toggle('is-active', dot.getAttribute('data-target') === id);
        });
      }
    });
  }, { rootMargin: '-20% 0px -60% 0px' });
  sections.forEach(function (s) { observer.observe(s); });
}

/* =============================================
   CURSOR
   ============================================= */
function initCursor() {
  var isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  var hover = window.matchMedia('(hover: hover) and (pointer: fine)');
  if (isTouch || !hover.matches) return;
  var dot = document.getElementById('cursor-dot');
  var ring = document.getElementById('cursor-ring');
  if (!dot || !ring) return;
  var dX = 0, dY = 0, rX = 0, rY = 0;
  document.addEventListener('mousemove', function (e) {
    dX = e.clientX; dY = e.clientY;
    rX = e.clientX; rY = e.clientY;
    dot.style.left = dX + 'px';
    dot.style.top = dY + 'px';
  });
  function animateRing() {
    ring.style.left = rX + 'px';
    ring.style.top = rY + 'px';
    rX += (dX - rX) * 0.15;
    rY += (dY - rY) * 0.15;
    requestAnimationFrame(animateRing);
  }
  animateRing();
  var interactives = document.querySelectorAll('a, button, .project-card, .testimonial-card, input, textarea');
  interactives.forEach(function (el) {
    el.addEventListener('mouseenter', function () { dot.classList.add('is-lg'); ring.classList.add('is-lg'); });
    el.addEventListener('mouseleave', function () { dot.classList.remove('is-lg'); ring.classList.remove('is-lg'); });
  });
}

/* =============================================
   HERO
   ============================================= */
function initHero() {
  var tl = gsap.timeline({ defaults: { ease: 'power4.out' } });
  tl.from('#hero-overline', { opacity: 0, y: 20, duration: 0.8 })
    .from('.hero-name .line span', { y: '110%', duration: 1.2, stagger: 0.15 }, '-=0.4')
    .from('#hero-role', { opacity: 0, y: 20, duration: 0.8 }, '-=0.6')
    .from('#hero-tagline', { opacity: 0, y: 20, duration: 0.8 }, '-=0.6')
    .from('#hero-ctas > *', { opacity: 0, y: 20, duration: 0.8, stagger: 0.1 }, '-=0.4');
}

/* =============================================
   TYPEWRITER
   ============================================= */
function initTypewriter() {
  var el = document.getElementById('typewriter-text');
  if (!el) return;
  var phrases = ['Full-Stack Developer', 'UI/UX Designer', 'Creative Technologist', 'Interface Architect'];
  var idx = 0, charIdx = 0, isDeleting = false;
  function type() {
    var current = phrases[idx];
    if (isDeleting) {
      el.textContent = current.substring(0, charIdx--);
      if (charIdx < 0) { isDeleting = false; idx = (idx + 1) % phrases.length; setTimeout(type, 400); return; }
      setTimeout(type, 40);
    } else {
      el.textContent = current.substring(0, charIdx++);
      if (charIdx > current.length) { isDeleting = true; setTimeout(type, 2000); return; }
      setTimeout(type, 80);
    }
  }
  type();
}

/* =============================================
   SCROLL ANIMATIONS
   ============================================= */
function initScrollAnimations() {
  gsap.utils.toArray('.section-header').forEach(function (h) {
    gsap.from(h, { opacity: 0, y: 40, duration: 0.8, scrollTrigger: { trigger: h, start: 'top 85%', toggleActions: 'play none none none' } });
  });
  gsap.from('.about-bio', { opacity: 0, y: 30, duration: 0.6, stagger: 0.1, scrollTrigger: { trigger: '.about-content-col', start: 'top 88%', toggleActions: 'play none none none' } });
  gsap.utils.toArray('.timeline-item').forEach(function (item, i) {
    gsap.from(item, { opacity: 0, x: -30, duration: 0.7, delay: i * 0.15, scrollTrigger: { trigger: item, start: 'top 85%', toggleActions: 'play none none none' } });
  });
  gsap.utils.toArray('.skill-category').forEach(function (cat, i) {
    gsap.from(cat, { opacity: 0, y: 40, duration: 0.7, delay: i * 0.15, scrollTrigger: { trigger: cat, start: 'top 85%', toggleActions: 'play none none none' } });
  });
  gsap.from('#stats-grid', { opacity: 0, y: 40, duration: 0.8, scrollTrigger: { trigger: '#stats', start: 'top 85%', toggleActions: 'play none none none' } });
  gsap.from('.contact-info', { opacity: 0, x: -40, duration: 0.8, scrollTrigger: { trigger: '.contact-grid', start: 'top 80%', toggleActions: 'play none none none' } });
  gsap.from('.contact-form', { opacity: 0, x: 40, duration: 0.8, scrollTrigger: { trigger: '.contact-grid', start: 'top 80%', toggleActions: 'play none none none' } });
  gsap.from('#footer', { opacity: 0, y: 30, duration: 0.6, scrollTrigger: { trigger: '#footer', start: 'top 95%', toggleActions: 'play none none none' } });
}

/* =============================================
   PROJECTS
   ============================================= */
function initProjects() {
  var grid = document.getElementById('projects-grid');
  var filterBtns = document.querySelectorAll('.btn--filter');
  var currentFilter = 'all';

  function render(filter) {
    var filtered = filter === 'all' ? PROJECTS : PROJECTS.filter(function (p) { return p.category === filter; });
    if (filtered.length === 0) {
      grid.innerHTML = '<div class="projects-state"><p>No projects found in this category.</p></div>';
      return;
    }
    grid.innerHTML = '';
    filtered.forEach(function (p) {
      var card = document.createElement('div');
      card.className = 'project-card';
      card.setAttribute('data-category', p.category);
      var liveLink = p.live_url ? '<a href="' + p.live_url + '" target="_blank" class="live-link">Live Preview →</a>' : '';
      var codeLink = p.github_url ? '<a href="' + p.github_url + '" target="_blank" class="code-link">GitHub</a>' : '';
      var tags = p.tech_stack.map(function (t) { return '<span class="project-tag">' + t + '</span>'; }).join('');
      card.innerHTML =
        '<div class="project-card-image">' +
        '<div style="font-size:48px;">📦</div>' +
        '<div class="project-card-overlay"><span>View Case Study →</span></div>' +
        '</div>' +
        '<div class="project-card-body">' +
        '<h3 class="project-card-title">' + p.title + '</h3>' +
        '<p class="project-card-desc">' + p.description + '</p>' +
        '<div class="project-card-tags">' + tags + '</div>' +
        '<div class="project-card-links">' + liveLink + codeLink + '</div>' +
        '</div>';
      grid.appendChild(card);
    });
    gsap.from('.project-card', { opacity: 0, y: 60, duration: 0.8, stagger: 0.1, ease: 'power3.out', scrollTrigger: { trigger: grid, start: 'top 85%', toggleActions: 'play none none none' } });
  }

  filterBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      filterBtns.forEach(function (b) { b.classList.remove('is-active'); });
      this.classList.add('is-active');
      currentFilter = this.getAttribute('data-filter');
      render(currentFilter);
    });
  });
  render('all');
}

/* =============================================
   SKILLS
   ============================================= */
function initSkills() {
  var grid = document.getElementById('skills-grid');
  var categories = {};
  var catNames = { frontend: 'Frontend', backend: 'Backend', tools: 'Tools & Design' };
  var catAccents = { frontend: 'border-color: var(--phosphor)', backend: 'border-color: var(--frost)', tools: 'border-color: var(--ember)' };
  SKILLS.forEach(function (s) {
    if (!categories[s.category]) categories[s.category] = [];
    categories[s.category].push(s);
  });
  Object.keys(categories).forEach(function (cat) {
    var div = document.createElement('div');
    div.className = 'skill-category';
    div.innerHTML = '<h4 style="' + (catAccents[cat] || '') + '">' + (catNames[cat] || cat) + '</h4>';
    categories[cat].forEach(function (skill) {
      div.innerHTML +=
        '<div class="skill-item">' +
        '<div class="skill-header"><span class="skill-name">' + skill.name + '</span><span class="skill-level">' + skill.level + '%</span></div>' +
        '<div class="skill-bar-track"><div class="skill-bar-fill" data-level="' + skill.level + '"></div></div>' +
        '</div>';
    });
    grid.appendChild(div);
  });
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('.skill-bar-fill').forEach(function (bar) {
          bar.style.width = bar.getAttribute('data-level') + '%';
        });
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });
  document.querySelectorAll('.skill-category').forEach(function (c) { observer.observe(c); });
}

/* =============================================
   STATS COUNTERS
   ============================================= */
function initStats() {
  var counters = document.querySelectorAll('.stat-value[data-target]');
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        var el = entry.target;
        var target = parseInt(el.getAttribute('data-target'));
        var current = 0;
        var duration = 2000;
        var step = Math.ceil(target / (duration / 16));
        function update() {
          current += step;
          if (current > target) current = target;
          el.textContent = current + (el.closest('[data-suffix]') ? el.closest('[data-suffix]').getAttribute('data-suffix') : '');
          if (current < target) requestAnimationFrame(update);
        }
        update();
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5, rootMargin: '-20%' });
  counters.forEach(function (c) { observer.observe(c); });
}

/* =============================================
   TESTIMONIALS
   ============================================= */
function initTestimonials() {
  var track = document.getElementById('testimonials-track');
  var dots = document.getElementById('testimonial-dots');
  var prevBtn = document.getElementById('testimonial-prev');
  var nextBtn = document.getElementById('testimonial-next');
  var autoplayBtn = document.getElementById('testimonial-autoplay');
  var current = 0, autoplay = true, interval;
  var slidesPerView = getSlidesPerView();

  function getSlidesPerView() {
    if (window.innerWidth >= 1024) return 3;
    if (window.innerWidth >= 768) return 2;
    return 1;
  }

  function render() {
    track.innerHTML = '';
    dots.innerHTML = '';
    TESTIMONIALS.forEach(function (t, i) {
      var slide = document.createElement('div');
      slide.className = 'testimonial-slide';
      var initial = t.name.split(' ').map(function (n) { return n[0]; }).join('');
      slide.innerHTML =
        '<div class="testimonial-card">' +
        '<div class="testimonial-rating">' + '★'.repeat(t.rating) + '☆'.repeat(5 - t.rating) + '</div>' +
        '<p class="testimonial-quote">"' + t.content + '"</p>' +
        '<div class="testimonial-author">' +
        '<div class="testimonial-avatar">' + initial + '</div>' +
        '<div><div class="testimonial-name">' + t.name + '</div><div class="testimonial-role">' + t.role + '</div></div>' +
        '</div>' +
        '</div>';
      track.appendChild(slide);
      var dot = document.createElement('button');
      dot.className = 'testimonial-dot' + (i === 0 ? ' is-active' : '');
      dot.setAttribute('data-index', i);
      dot.addEventListener('click', function () { goTo(parseInt(this.getAttribute('data-index'))); });
      dots.appendChild(dot);
    });
    updateSlide();
  }

  function updateSlide() {
    var total = TESTIMONIALS.length - slidesPerView;
    var offset = Math.min(current, total);
    if (offset < 0) offset = 0;
    track.style.transform = 'translateX(-' + (offset * (100 / slidesPerView)) + '%)';
    document.querySelectorAll('.testimonial-dot').forEach(function (d, i) {
      d.classList.toggle('is-active', i === current);
    });
  }

  function goTo(idx) {
    current = idx;
    updateSlide();
    if (autoplay) { clearInterval(interval); interval = setInterval(next, 5000); }
  }

  function next() {
    current = (current + 1) % Math.max(1, TESTIMONIALS.length - slidesPerView + 1);
    updateSlide();
  }

  function prev() {
    current = (current - 1 + TESTIMONIALS.length) % TESTIMONIALS.length;
    updateSlide();
  }

  render();
  if (autoplay) interval = setInterval(next, 5000);
  nextBtn.addEventListener('click', next);
  prevBtn.addEventListener('click', prev);
  autoplayBtn.addEventListener('click', function () {
    autoplay = !autoplay;
    this.textContent = autoplay ? '⏸' : '▶';
    if (autoplay) { interval = setInterval(next, 5000); } else { clearInterval(interval); }
  });
  window.addEventListener('resize', function () {
    var spv = getSlidesPerView();
    if (spv !== slidesPerView) { slidesPerView = spv; updateSlide(); }
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft' && isInViewport(document.getElementById('testimonials-wrapper'))) prev();
    if (e.key === 'ArrowRight' && isInViewport(document.getElementById('testimonials-wrapper'))) next();
  });
  function isInViewport(el) {
    var r = el.getBoundingClientRect();
    return r.top < window.innerHeight && r.bottom > 0;
  }
}

/* =============================================
   CONTACT FORM
   ============================================= */
function initContact() {
  var form = document.getElementById('contact-form');
  var submitBtn = document.getElementById('submit-btn');
  var statusEl = document.getElementById('form-status');

  function showError(input, msg) {
    var errorEl = document.getElementById(input.id.replace('contact-', '') + '-error');
    if (errorEl) errorEl.textContent = msg;
    input.classList.add('is-error');
    input.classList.remove('is-success');
  }

  function clearError(input) {
    var errorEl = document.getElementById(input.id.replace('contact-', '') + '-error');
    if (errorEl) errorEl.textContent = '';
    input.classList.remove('is-error');
    input.classList.add('is-success');
  }

  function validateField(input) {
    var val = input.value.trim();
    if (input.hasAttribute('required') && !val) { showError(input, 'This field is required'); return false; }
    if (input.type === 'email' && val && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) { showError(input, 'Please enter a valid email'); return false; }
    clearError(input);
    return true;
  }

  form.querySelectorAll('input, textarea').forEach(function (input) {
    input.addEventListener('blur', function () { if (this.value) validateField(this); });
    input.addEventListener('input', function () { if (this.classList.contains('is-error')) validateField(this); });
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var inputs = form.querySelectorAll('input[required], textarea[required]');
    var valid = true;
    inputs.forEach(function (i) { if (!validateField(i)) valid = false; });
    var email = document.getElementById('contact-email');
    if (email.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) { showError(email, 'Please enter a valid email'); valid = false; }
    if (!valid) return;

    var honeypot = document.getElementById('website');
    if (honeypot.value) { statusEl.style.display = 'block'; statusEl.className = 'form-message is-success'; statusEl.textContent = 'Thank you! Your message has been sent.'; return; }

    submitBtn.classList.add('is-loading');
    submitBtn.disabled = true;
    statusEl.style.display = 'none';

    setTimeout(function () {
      submitBtn.classList.remove('is-loading');
      submitBtn.classList.add('is-success');
      submitBtn.querySelector('.btn-text').textContent = 'Message Sent ✓';
      statusEl.style.display = 'block';
      statusEl.className = 'form-message is-success';
      statusEl.textContent = 'Thank you for reaching out! I\'ll get back to you within 24 hours.';
      form.reset();
      form.querySelectorAll('input, textarea').forEach(function (i) { i.classList.remove('is-success', 'is-error'); });
      setTimeout(function () {
        submitBtn.classList.remove('is-success');
        submitBtn.querySelector('.btn-text').textContent = 'Send Message →';
        submitBtn.disabled = false;
      }, 2500);
    }, 1500);
  });
}

/* =============================================
   BACK TO TOP
   ============================================= */
function initBackToTop() {
  var btn = document.getElementById('back-to-top');
  window.addEventListener('scroll', function () {
    btn.classList.toggle('is-visible', window.scrollY > 600);
  }, { passive: true });
  btn.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }); });
}

/* =============================================
   YEAR
   ============================================= */
document.getElementById('current-year').textContent = new Date().getFullYear();

/* =============================================
   INIT
   ============================================= */
document.addEventListener('DOMContentLoaded', function () {
  document.documentElement.classList.remove('no-js');
  initPreloader();
  initCursor();
  initNavbar();
  initBackToTop();
  initTypewriter();
  initProjects();
  initSkills();
  initStats();
  initTestimonials();
  initContact();
  initLenis();
  gsap.registerPlugin(ScrollTrigger);
  initHero();
  initScrollAnimations();
});