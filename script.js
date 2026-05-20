const canvas = document.getElementById('particleCanvas');
let ctx, particles, mouse, animationId, particleActive = true;

function initParticles() {
  if (!canvas) return;
  const hero = document.querySelector('.hero');
  const rect = hero.getBoundingClientRect();
  canvas.width = rect.width;
  canvas.height = rect.height;
  ctx = canvas.getContext('2d');
  particles = [];
  mouse = { x: null, y: null, radius: 150 };
  const particleCount = Math.min(Math.floor((canvas.width * canvas.height) / 8000), 80);

  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.8,
      vy: (Math.random() - 0.5) * 0.8,
      size: Math.random() * 2 + 0.5,
      color: ['rgba(108,92,231,', 'rgba(0,206,201,', 'rgba(253,121,168,'][Math.floor(Math.random() * 3)]
    });
  }

  canvas.addEventListener('mousemove', (e) => {
    const canvasRect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - canvasRect.left;
    mouse.y = e.clientY - canvasRect.top;
  });

  canvas.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  animateParticles();
}

function animateParticles() {
  if (!particleActive) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < particles.length; i++) {
    const p = particles[i];
    p.x += p.vx;
    p.y += p.vy;

    if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
    if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

    if (mouse.x !== null) {
      const dx = mouse.x - p.x;
      const dy = mouse.y - p.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < mouse.radius) {
        const force = (mouse.radius - dist) / mouse.radius;
        p.vx -= (dx / dist) * force * 0.02;
        p.vy -= (dy / dist) * force * 0.02;
      }
    }

    p.vx = Math.max(-2, Math.min(2, p.vx));
    p.vy = Math.max(-2, Math.min(2, p.vy));

    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fillStyle = p.color + '0.6)';
    ctx.fill();

    for (let j = i + 1; j < particles.length; j++) {
      const p2 = particles[j];
      const dx = p.x - p2.x;
      const dy = p.y - p2.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 120) {
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.strokeStyle = `rgba(108,92,231,${0.08 * (1 - dist / 120)})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    }
  }

  animationId = requestAnimationFrame(animateParticles);
}

function resizeCanvas() {
  const hero = document.querySelector('.hero');
  const rect = hero.getBoundingClientRect();
  if (canvas) {
    canvas.width = rect.width;
    canvas.height = rect.height;
  }
}

let cursorGlow = document.getElementById('cursorGlow');

function initCursorGlow() {
  if (!cursorGlow) {
    cursorGlow = document.createElement('div');
    cursorGlow.id = 'cursorGlow';
    document.body.appendChild(cursorGlow);
  }

  let glowX = window.innerWidth / 2;
  let glowY = window.innerHeight / 2;
  let targetX = glowX;
  let targetY = glowY;

  document.addEventListener('mousemove', (e) => {
    targetX = e.clientX;
    targetY = e.clientY;
  });

  document.addEventListener('mouseleave', () => {
    cursorGlow.style.opacity = '0';
  });

  document.addEventListener('mouseenter', () => {
    cursorGlow.style.opacity = '1';
  });

  function animateGlow() {
    glowX += (targetX - glowX) * 0.08;
    glowY += (targetY - glowY) * 0.08;
    cursorGlow.style.transform = `translate(${glowX - 150}px, ${glowY - 150}px)`;
    requestAnimationFrame(animateGlow);
  }

  animateGlow();
}

function initMatrixRain() {
  const container = document.getElementById('matrixRain');
  if (!container) return;
  const chars = '01{}[]<>()/\\|;:.,~-+=*&^%$#@!';
  const cols = Math.floor(window.innerWidth / 20);
  const drops = [];

  for (let i = 0; i < cols; i++) {
    drops[i] = Math.floor(Math.random() * -100);
  }

  function drawRain() {
    container.innerHTML = '';
    for (let i = 0; i < cols; i++) {
      if (Math.random() > 0.98) {
        const char = document.createElement('span');
        char.textContent = chars[Math.floor(Math.random() * chars.length)];
        char.style.cssText = `
          position: absolute;
          left: ${i * 20}px;
          top: ${drops[i] * 20}px;
          font-family: 'JetBrains Mono', monospace;
          font-size: 14px;
          color: rgba(108, 92, 231, 0.5);
          text-shadow: 0 0 5px rgba(108, 92, 231, 0.3);
          transition: none;
        `;
        container.appendChild(char);
      }
      drops[i]++;
      if (drops[i] * 20 > window.innerHeight && Math.random() > 0.98) {
        drops[i] = 0;
      }
    }
    setTimeout(drawRain, 80);
  }
  drawRain();
}

function initRippleEffect() {
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
      const rect = this.getBoundingClientRect();
      const ripple = document.createElement('span');
      ripple.className = 'ripple-effect';
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;
      ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        background: rgba(255,255,255,0.3);
        border-radius: 50%;
        transform: scale(0);
        animation: rippleAnim 0.6s ease-out forwards;
        pointer-events: none;
      `;
      this.style.position = 'relative';
      this.style.overflow = 'hidden';
      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);
    });
  });
}

function initStarField() {
  const starContainer = document.createElement('div');
  starContainer.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:0;overflow:hidden;';
  starContainer.id = 'starField';
  document.body.appendChild(starContainer);

  for (let i = 0; i < 100; i++) {
    const star = document.createElement('div');
    const size = Math.random() * 2 + 1;
    star.style.cssText = `
      position: absolute;
      left: ${Math.random() * 100}%;
      top: ${Math.random() * 100}%;
      width: ${size}px;
      height: ${size}px;
      background: #fff;
      border-radius: 50%;
      opacity: ${Math.random() * 0.5 + 0.1};
      animation: twinkle ${2 + Math.random() * 4}s ease-in-out infinite;
      animation-delay: ${Math.random() * 4}s;
    `;
    starContainer.appendChild(star);
  }
}

function initScrollProgress() {
  const bar = document.createElement('div');
  bar.id = 'scrollProgress';
  bar.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    height: 3px;
    background: var(--gradient);
    z-index: 1001;
    width: 0;
    transition: width 0.1s linear;
  `;
  document.body.appendChild(bar);

  window.addEventListener('scroll', () => {
    const scrollTop = document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (scrollTop / scrollHeight) * 100;
    bar.style.width = progress + '%';
  });
}

function initParallaxShapes() {
  const shapes = document.querySelectorAll('.shape');
  window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;
    shapes.forEach((shape, i) => {
      const speed = 0.1 + (i * 0.05);
      shape.style.transform = `translateY(${scrollY * speed}px)`;
    });
  });
}

function initMagneticButtons() {
  document.querySelectorAll('.btn-primary, .btn-outline').forEach(btn => {
    btn.addEventListener('mousemove', function(e) {
      const rect = this.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      this.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
    });

    btn.addEventListener('mouseleave', function() {
      this.style.transform = '';
    });
  });
}

function initCodeTyping() {
  const container = document.getElementById('codeDisplay');
  const cursor = document.querySelector('.code-cursor');
  if (!container) return;

  const codeLines = [
    'const app = {',
    '  mission: "Empower business",',
    '  tech: ["JS", "Python", "Go"],',
    '  team: 7,',
    '  projects: 150,',
    '  happy: true',
    '};',
    'while (app.happy) {',
    '  app.build();',
    '}'
  ];

  const syntaxMap = [
    { pattern: /\b(const|while)\b/g, cls: 'code-keyword' },
    { pattern: /\b(app|build)\b/g, cls: 'code-var' },
    { pattern: /"(?:[^"\\]|\\.)*"/g, cls: 'code-string' },
    { pattern: /\b(JS|Python|Go)\b/g, cls: 'code-string' },
    { pattern: /\b(true|false)\b/g, cls: 'code-boolean' },
    { pattern: /\b(\d+)\b/g, cls: 'code-number' }
  ];

  function highlight(text) {
    let html = text;
    for (const s of syntaxMap) {
      html = html.replace(s.pattern, (match) => `<span class="${s.cls}">${match}</span>`);
    }
    return html;
  }

  let completedLines = [];
  let currentLine = 0;
  let currentChar = 0;
  let isRunning = true;
  let typingTimeout = null;
  let pauseTimeout = null;

  function render() {
    let html = completedLines.join('\n');
    if (currentLine < codeLines.length) {
      if (html.length > 0) html += '\n';
      const partial = codeLines[currentLine].slice(0, currentChar);
      html += highlight(partial);
      cursor.classList.add('active');
    } else {
      cursor.classList.remove('active');
    }
    container.innerHTML = html;
  }

  function typeNextChar() {
    if (!isRunning) return;

    if (currentLine >= codeLines.length) {
      cursor.classList.remove('active');
      pauseTimeout = setTimeout(() => {
        completedLines = [];
        currentLine = 0;
        currentChar = 0;
        container.innerHTML = '';
        cursor.classList.add('active');
        typeNextChar();
      }, 1500);
      return;
    }

    const line = codeLines[currentLine];
    currentChar++;

    if (currentChar <= line.length) {
      render();
      const ch = line[currentChar - 1];
      const delay = ch === ' ' ? 15 : 20 + Math.random() * 35;
      typingTimeout = setTimeout(typeNextChar, delay);
    } else {
      completedLines.push(highlight(line));
      currentLine++;
      currentChar = 0;
      if (currentLine < codeLines.length) {
        render();
        typingTimeout = setTimeout(typeNextChar, 180);
      } else {
        render();
        cursor.classList.remove('active');
        pauseTimeout = setTimeout(() => {
          completedLines = [];
          currentLine = 0;
          currentChar = 0;
          container.innerHTML = '';
          cursor.classList.add('active');
          typeNextChar();
        }, 2000);
      }
    }
  }

  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting && isRunning) {
        typeNextChar();
        observer.unobserve(entry.target);
      }
    }
  }, { threshold: 0.3 });

  const wrapper = document.getElementById('aboutCode');
  if (wrapper) observer.observe(wrapper);
}

document.addEventListener('DOMContentLoaded', () => {

  const styleSheet = document.createElement('style');
  styleSheet.textContent = `
    @keyframes rippleAnim {
      to { transform: scale(4); opacity: 0; }
    }
    @keyframes twinkle {
      0%, 100% { opacity: 0.1; }
      50% { opacity: 0.8; }
    }
    #scrollProgress {
      background: linear-gradient(90deg, #6c5ce7, #00cec9, #fd79a8);
      background-size: 200% auto;
      animation: shimmer 2s linear infinite;
    }
  `;
  document.head.appendChild(styleSheet);

  initCursorGlow();
  initParticles();
  initMatrixRain();
  initStarField();
  initScrollProgress();
  initParallaxShapes();
  initRippleEffect();
  initMagneticButtons();
  initCodeTyping();

  window.addEventListener('resize', resizeCanvas);
  

  const loader = document.getElementById('loader');
  setTimeout(() => {
    loader.classList.add('hidden');
  }, 1800);

  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  const navLinkEls = document.querySelectorAll('.nav-link');

  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    lastScroll = currentScroll;
    updateActiveLink();
  });

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('open');
  });

  navLinkEls.forEach(link => {
    link.addEventListener('click', (e) => {
      hamburger.classList.remove('active');
      navLinks.classList.remove('open');

      const targetId = link.getAttribute('href');
      if (targetId && targetId.startsWith('#')) {
        e.preventDefault();
        const target = document.querySelector(targetId);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  });

  function updateActiveLink() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPos = window.pageYOffset + 120;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        navLinkEls.forEach(link => link.classList.remove('active'));
        const activeLink = document.querySelector(`.nav-link[href="#${id}"]`);
        if (activeLink) activeLink.classList.add('active');
      }
    });
  }

  const revealEls = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = entry.target.dataset.delay || 0;
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, parseInt(delay));
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  revealEls.forEach(el => revealObserver.observe(el));

  const typingElement = document.getElementById('typing');
  let typingTimer = null;
  let typingWords = ['napędzają Twój biznes', 'zwiększają konwersję', 'są szybkie i bezpieczne', 'wyróżniają Cię na rynku', 'skalują się z Tobą'];
  let typingWordIndex = 0;
  let typingCharIndex = 0;
  let typingDeleting = false;
  let typingSpeed = 80;

  function typeEffect() {
    if (!typingElement) return;
    const currentWord = typingWords[typingWordIndex];

    if (typingDeleting) {
      typingElement.textContent = currentWord.substring(0, typingCharIndex--);
      typingSpeed = 40;
    } else {
      typingElement.textContent = currentWord.substring(0, typingCharIndex++);
      typingSpeed = 80;
    }

    if (!typingDeleting && typingCharIndex === currentWord.length + 1) {
      typingDeleting = true;
      typingSpeed = 1500;
    } else if (typingDeleting && typingCharIndex === 0) {
      typingDeleting = false;
      typingWordIndex = (typingWordIndex + 1) % typingWords.length;
      typingSpeed = 300;
    }

    typingTimer = setTimeout(typeEffect, typingSpeed);
  }

  function startTyping() {
    if (typingTimer) clearTimeout(typingTimer);
    typingTimer = setTimeout(typeEffect, 2000);
  }

  window.restartTyping = function(newWords) {
    if (typingTimer) clearTimeout(typingTimer);
    typingWords = newWords;
    typingWordIndex = 0;
    typingCharIndex = 0;
    typingDeleting = false;
    typingSpeed = 80;
    if (typingElement) typingElement.textContent = '';
    typingTimer = setTimeout(typeEffect, 500);
  };

  if (typingElement) startTyping();

  const statNumbers = document.querySelectorAll('.stat-number');

  const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = parseInt(entry.target.dataset.target);
        animateCounter(entry.target, target);
        statObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  statNumbers.forEach(el => statObserver.observe(el));

  function animateCounter(element, target) {
    let current = 0;
    const increment = Math.ceil(target / 40);
    const duration = 1500;
    const stepTime = Math.floor(duration / 40);

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      element.textContent = current + '+';
    }, stepTime);
  }

  const testimonialBtns = document.querySelectorAll('.testimonial-btn');
  const testimonialTrack = document.getElementById('testimonialTrack');
  let currentTestimonial = 0;
  let testimonialInterval;

  function goToTestimonial(index) {
    currentTestimonial = index;
    testimonialTrack.style.transform = `translateX(-${index * 100}%)`;
    testimonialBtns.forEach(btn => btn.classList.remove('active'));
    testimonialBtns[index].classList.add('active');
  }

  testimonialBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      goToTestimonial(parseInt(btn.dataset.index));
      resetTestimonialInterval();
    });
  });

  function startTestimonialInterval() {
    testimonialInterval = setInterval(() => {
      const next = (currentTestimonial + 1) % testimonialBtns.length;
      goToTestimonial(next);
    }, 5000);
  }

  function resetTestimonialInterval() {
    clearInterval(testimonialInterval);
    startTestimonialInterval();
  }

  startTestimonialInterval();

  function getTranslation(lang, key) {
    return (translations[lang] && translations[lang][key]) || (translations.pl && translations.pl[key]) || key;
  }

  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      const btn = contactForm.querySelector('button[type="submit"]');
      const sendingText = getTranslation(currentLang, 'form.sending');
      btn.innerHTML = `${sendingText} <i class="fas fa-spinner fa-spin"></i>`;
      btn.disabled = true;
    });
  }

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  const heroTitle = document.querySelector('.hero-title');
  if (heroTitle) {
    heroTitle.addEventListener('mousemove', (e) => {
      const rect = heroTitle.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = (y - centerY) / 20;
      const rotateY = (centerX - x) / 20;

      heroTitle.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    heroTitle.addEventListener('mouseleave', () => {
      heroTitle.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
    });
  }

  const mouse = document.querySelector('.mouse');
  if (mouse) {
    mouse.addEventListener('click', () => {
      const servicesSection = document.getElementById('services');
      if (servicesSection) {
        servicesSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  const translations = {
    pl: {
      'nav.start': 'Start', 'nav.services': 'Usługi', 'nav.xbot': 'Xbot', 'nav.portfolio': 'Portfolio',
      'nav.about': 'O nas', 'nav.workflow': 'Workflow', 'nav.tech': 'Technologie', 'nav.faq': 'FAQ', 'nav.contact': 'Kontakt', 'nav.cta': 'Wycena', 'nav.blog': 'Blog', 'nav.careers': 'Kariera',
      'hero.badge': 'Premium Web Development & Software Solutions',
      'hero.title1': 'Tworzymy', 'hero.title2': 'cyfrowe rozwiązania', 'hero.title3': 'które',
      'hero.desc': 'Od prostych stron wizytówek po zaawansowane platformy webowe. Łączymy design, technologie i strategię, aby Twój biznes osiągnął więcej.',
      'hero.btn1': 'Zamów wycenę', 'hero.btn2': 'Zobacz realizacje',
      'hero.stat1': '+ zrealizowanych projektów', 'hero.stat2': '+ klientów', 'hero.stat3': 'lat na rynku',
      'hero.stats_note': 'Dane na podstawie projektów zrealizowanych od 2021 r.',
      'hero.scroll': 'Scroll',
      'services.tag': 'Co robimy', 'services.title': 'Kompleksowe usługi', 'services.title2': 'programistyczne',
      'services.desc': 'Oferujemy pełen zakres usług związanych z tworzeniem oprogramowania — od koncepcji po wdrożenie i utrzymanie.',
      'services.card1.title': 'Strony WWW', 'services.card1.desc': 'Nowoczesne, szybkie strony internetowe zoptymalizowane pod SEO i wydajność.',
      'services.card1.f1': 'Responsywność', 'services.card1.f2': 'Optymalizacja SEO', 'services.card1.f3': 'Szybkość ładowania',
      'services.card2.title': 'Sklepy internetowe', 'services.card2.desc': 'Profesjonalne sklepy online z integracją płatności, magazynów i systemów ERP.',
      'services.card2.f1': 'WooCommerce / Shopify', 'services.card2.f2': 'Płatności online', 'services.card2.f3': 'Zarządzanie produktami',
      'services.card3.title': 'Aplikacje webowe', 'services.card3.desc': 'Zaawansowane aplikacje biznesowe, dashboardy, systemy CRM i platformy SaaS.',
      'services.card3.f1': 'React / Vue / Angular', 'services.card3.f2': 'Node.js / Python / PHP', 'services.card3.f3': 'Bazy danych',
      'services.card4.title': 'UI/UX Design',
      'services.card4.desc': 'Projektowanie interfejsów i doświadczeń użytkownika, które angażują i konwertują.',
      'services.card4.f1': 'Wireframes & prototypy', 'services.card4.f2': 'Design system', 'services.card4.f3': 'Badania UX',
      'services.card5.title': 'SEO & Marketing',
      'services.card5.desc': 'Kompleksowa optymalizacja pod kątem wyszukiwarek i strategie marketingu cyfrowego.',
      'services.card5.f1': 'Audyt SEO', 'services.card5.f2': 'Content marketing', 'services.card5.f3': 'Google Ads / Meta Ads',
      'services.card6.title': 'Doradztwo IT & Audyt', 'services.card6.desc': 'Konsultacje techniczne, audyt kodu i infrastruktury, optymalizacja kosztów IT.',
      'services.card6.f1': 'Audyt kodu i bezpieczeństwa', 'services.card6.f2': 'Architektura systemów', 'services.card6.f3': 'Optymalizacja kosztów',
      'xbot.tag': 'Produkt', 'xbot.title1': 'Xbot', 'xbot.title2': 'inteligentny asystent AI',
      'xbot.desc': 'Zaawansowany czat AI dla Twojej strony internetowej. Trenowany na Twoich danych, mówiący w 140+ językach, działający 24/7.',
      'xbot.subtitle': 'Profesjonalny asystent AI dla Twojego biznesu',
      'xbot.p1': '<strong>Xbot</strong> to zaawansowany asystent konwersacyjny AI, który działa na Twojej stronie 24/7.',
      'xbot.f1': 'Trenowany na Twoich danych — strona WWW, PDF, baza wiedzy',
      'xbot.f2': 'Obsługa 140+ języków z automatycznym wykrywaniem lokalizacji',
      'xbot.f3': 'Rozmowy głosowe w czasie rzeczywistym z wyborem głosu',
      'xbot.f4': 'Live chat z nieograniczoną liczbą agentów',
      'xbot.f5': 'Rezerwacja spotkań i wizyt bez zewnętrznych aplikacji',
      'xbot.f6': 'Analiza rozmów, leadów i zachowań użytkowników',
      'xbot.f7': 'Budowanie lejków sprzedażowych przez drag & drop',
      'xbot.f8': 'Integracja przez Zapier z 5000+ aplikacji',
      'xbot.f9': 'Avatar AI z funkcją mowy — wybierz wygląd i głos asystenta',
      'xbot.f10': 'Gotowe szablony czatów — uruchom w 1 kliknięcie',
      'xbot.f11': 'Wyzwalacze czasowe — pokaż czat w idealnym momencie',
      'xbot.f12': 'Personalizacja wiadomości — imię, lokalizacja, historia',
      'xbot.btn': 'Zamów Xbot',
      'xbot.input': 'Napisz wiadomość...',
      'xbot.msg1': 'Cześć! Jestem Xbot, AI asystent X-DEV. Jak mogę Ci pomóc?',
      'xbot.msg2': 'Szukam informacji o waszych usługach programistycznych.',
      'xbot.msg3': 'Pozwól że sprawdzę w bazie wiedzy... Xbot znalazł: oferujemy strony WWW, sklepy, aplikacje webowe i doradztwo IT. Który obszar Cię interesuje?',
      'xbot.badge1': 'Najpopularniejsze',
      'xbot.per1': '/ miesiąc',
      'xbot.setup_label': 'jednorazowa opłata wdrożeniowa',
      'xbot.pf1': 'Pełna konfiguracja i trenowanie AI', 'xbot.pf2': 'Wdrożenie na stronie WWW',
      'xbot.pf3': 'Wszystkie funkcje Xbot', 'xbot.pf4': 'Wsparcie techniczne 24/7',
      'xbot.pf5': 'Aktualizacje i optymalizacje',
      'xbot.choose1': 'Wybieram',
      'portfolio.tag': 'Portfolio', 'portfolio.title1': 'Nasze ostatnie', 'portfolio.title2': 'realizacje',
      'portfolio.desc': 'Każdy projekt to historia sukcesu. Zobacz, co stworzyliśmy dla naszych klientów.',
      'portfolio.p1': 'Platforma e-commerce dla mody', 'portfolio.p2': 'System zarządzania przychodnią',
      'portfolio.p3': 'Dashboard analityczny w chmurze', 'portfolio.p4': 'Aplikacja do zarządzania finansami',
      'portfolio.see': 'Zobacz',
      'portfolio.note': 'Wybrane realizacje i case studies. Szczegóły dostępne na życzenie.',
      'about.tag': 'O nas', 'about.title1': 'Jesteśmy', 'about.title2': 'inżynierami', 'about.title3': 'z pasją',
      'about.p1': '<strong>X-DEV</strong> to zespół doświadczonych programistów, project managerów i designerów, działający w strukturach <strong>Dvbxtreme Sp. z o.o.</strong> (KRS: 0001097759, NIP: 7632152469, REGON: 528239270). Od 2021 roku pomagamy firmom w cyfrowej transformacji, tworząc oprogramowanie, które realnie wpływa na ich biznes.',
      'about.p2': 'Stawiamy na jakość, transparentność i terminowość. Każdy projekt traktujemy indywidualnie, dobierając najlepsze narzędzia do konkretnych potrzeb.',
      'about.team': 'Nasz zespół to obecnie 7 osób: programiści, designer i project manager. Poznaj nas osobiście — napisz, a umówimy spotkanie.',
      'about.v1t': 'Jakość', 'about.v1d': 'Kod przechodzi wielostopniowy code review',
      'about.v2t': 'Terminowość', 'about.v2d': 'Dotrzymujemy terminów w 98% przypadków',
      'about.v3t': 'Wsparcie', 'about.v3d': 'Opieka posprzedażowa i wsparcie techniczne 24/7',
      'process.tag': 'Proces', 'process.title1': 'Jak', 'process.title2': 'działamy',
      'process.desc': 'Od pomysłu do wdrożenia — przejrzysty proces, który daje Ci pełną kontrolę.',
      'process.s1': 'Konsultacja', 'process.s1d': 'Poznajemy Twój biznes, cele i wyzwania.',
      'process.s2': 'Strategia', 'process.s2d': 'Przygotowujemy plan działania i wycenę.',
      'process.s3': 'Design', 'process.s3d': 'Projektujemy UI/UX z myślą o użytkowniku.',
      'process.s4': 'Development', 'process.s4d': 'Piszemy kod, testujemy i optymalizujemy.',
      'process.s5': 'Wdrożenie', 'process.s5d': 'Deploy, monitoring i szkolenie Twojego zespołu.',
      'tech.tag': 'Technologie', 'tech.title1': 'Nasz', 'tech.title2': 'stack', 'tech.title3': 'technologiczny',
      'tech.desc': 'Korzystamy ze sprawdzonych narzędzi i nowoczesnych technologii, aby dostarczać rozwiązania na najwyższym poziomie.',
      'tech.cat1': 'Frontend', 'tech.cat2': 'Backend', 'tech.cat3': 'Bazy danych', 'tech.cat4': 'DevOps & Cloud',
      'testi.tag': 'Opinie', 'testi.title1': 'Co mówią', 'testi.title2': 'klienci',
      'testi.q1': '"X-DEV zaprojektowal i wdrozyli nasza platforme e-commerce. Konwersja wzrosla o 40% w 3 miesiace. Profesjonalne podejscie od briefu po deploy."',
      'testi.n1': 'Marek R.',
      'testi.q2': '"Wspolpracujemy z X-DEV od 2 lat. Zrealizowali dla nas system CRM i dashboard analityczny. Terminowosc i jakosc kodu na wysokim poziomie."',
      'testi.n2': 'Agnieszka K.',
      'testi.q3': '"Potrzebowalismy szybkiego MVP dla startupu. X-DEV dostarczyl dzialajaca aplikacje w 5 tygodni."',
      'testi.n3': 'Tomasz N.',
      'testi.r1': 'Wlasciciel, sklep z moda meska', 'testi.r2': 'COO, platforma SaaS', 'testi.r3': 'Founder, startup FinTech',
      'cta.title': 'Gotowy na <span class="gradient-text">rozwój</span> swojego biznesu?',
      'cta.desc': 'Skontaktuj się z nami i otrzymaj darmową wycenę swojego projektu.',
      'cta.btn': 'Zamów darmową wycenę',
      'contact.tag': 'Kontakt', 'contact.title1': 'Napisz do', 'contact.title2': 'nas',
      'contact.desc': 'Masz pomysł na projekt? Chcesz zapytać o wycenę? Napisz — odpowiemy w ciągu 24h.',
      'contact.email': 'Email', 'contact.phone': 'Telefon', 'contact.address': 'Siedziba', 'contact.registry': 'Dane rejestrowe',
      'form.name': 'Imię i nazwisko', 'form.namePl': 'Jan Kowalski',
      'form.email': 'Adres e-mail', 'form.emailPl': 'jan@example.com',
      'form.subject': 'Temat', 'form.subjectPl': 'Czego dotyczy Twoja wiadomość?',
      'form.message': 'Wiadomość', 'form.messagePl': 'Opisz swój projekt...',
      'form.btn': 'Wyślij wiadomość', 'form.sending': 'Wysyłanie...', 'form.sent': 'Wiadomość wysłana!', 'form.error': 'Błąd wysyłania',
      'form.rodo': 'Wyrażam zgodę na przetwarzanie moich danych osobowych w celu odpowiedzi na zapytanie. Administratorem jest Dvbxtreme Sp. z o.o. Polityka prywatności',
      'footer.desc': 'Nowoczesne rozwiązania programistyczne dla Twojego biznesu.',
      'footer.col1': 'Usługi', 'footer.col2': 'Firma', 'footer.col3': 'Kontakt', 'footer.col4': 'Rejestr',
      'footer.f1': 'Strony WWW', 'footer.f2': 'Sklepy internetowe', 'footer.f3': 'Aplikacje webowe',
      'footer.ab': 'O nas', 'footer.pf': 'Portfolio', 'footer.cr': 'Kariera', 'footer.ct': 'Kontakt',
      'footer.copy': '© 2026 X-DEV / Dvbxtreme Sp. z o.o. Wszelkie prawa zastrzeżone.',
      'footer.pp': 'Polityka prywatności', 'footer.tos': 'Regulamin',
      'workflow.tag': 'Workflow', 'workflow.title1': 'Nasz', 'workflow.title2': 'proces', 'workflow.title3': 'i narzędzia',
      'workflow.desc': 'Łączymy sprawdzone metodologie z nowoczesnymi narzędziami, by dostarczać jakość na każdym etapie.',
      'workflow.m1': 'Agile / Scrum', 'workflow.d1': 'Pracujemy w sprintach, codzienne standupy i retrospektywy. Pełna transparentność procesu.',
      'workflow.m2': 'Git Flow & CI/CD', 'workflow.d2': 'Każda zmiana przechodzi przez code review, automatyczne testy i deployment.',
      'workflow.m3': 'Code Review & Audit', 'workflow.d3': 'Dwustopniowy code review, testy jednostkowe i integracyjne, audyt bezpieczeństwa.',
      'workflow.m4': 'Deploy & Monitoring', 'workflow.d4': 'Automatyczny deployment na produkcję, monitoring 24/7, alarmy i auto-scaling.',
      'workflow.tools_title': 'Narzędzia, których używamy:',
      'faq.tag': 'FAQ', 'faq.title1': 'Często', 'faq.title2': 'zadawane pytania', 'faq.desc': 'Masz pytania? Oto odpowiedzi na najczęściej zadawane pytania.',
      'faq.q1': 'Ile kosztuje strona WWW?', 'faq.a1': 'Cena zależy od złożoności projektu. Proste strony wizytówki zaczynają się od 3 000 zł, zaawansowane platformy i sklepy to koszt od 10 000 zł. Zapraszamy do kontaktu po darmową wycenę.',
      'faq.q2': 'Jak długo trwa stworzenie strony?', 'faq.a2': 'Standardowa strona wizytówka to 2-4 tygodnie. Sklep internetowy lub aplikacja webowa to zwykle 6-12 tygodni. Każdy projekt ma indywidualny harmonogram.',
      'faq.q3': 'Czy oferujecie wsparcie techniczne po wdrożeniu?', 'faq.a3': 'Tak, oferujemy pakiety utrzymaniowe obejmujące aktualizacje, kopie zapasowe, monitoring i wsparcie techniczne 24/7.',
      'faq.q4': 'Czym jest Xbot i jak działa?', 'faq.a4': 'Xbot to inteligentny asystent AI, który można wytrenować na danych Twojej firmy. Działa 24/7 na stronie, odpowiada na pytania klientów, rezerwuje spotkania i zbiera leady.',
      'faq.q5': 'Czy pracujecie z klientami z zagranicy?', 'faq.a5': 'Tak, obsługujemy klientów z Polski, UK, USA i całej Europy. Prowadzimy projekty w języku polskim i angielskim.',
      'loader.text': 'creative solutions for business & beyond',
      'filter.all': 'Wszystkie', 'filter.web': 'Strony WWW', 'filter.ecommerce': 'E-commerce', 'filter.app': 'Aplikacje', 'filter.dashboard': 'Dashboardy',
      'clients.tag': 'Klienci i partnerzy', 'clients.title1': 'Zaufali', 'clients.title2': 'nam',
      'clients.desc': 'Współpracujemy z firmami z Polski, UK i USA z branż e-commerce, FinTech, medycyny, logistyki i SaaS. Nazwy klientów udostępniamy po podpisaniu NDA.',
      'cookie.text': 'Ta strona używa plików cookie, aby świadczyć usługi na najwyższym poziomie. Korzystając ze strony, zgadzasz się na ich użycie.',
      'cookie.accept': 'Akceptuję', 'cookie.decline': 'Odmawiam',
      'newsletter.title': 'Newsletter', 'newsletter.desc': 'Bądź na bieżąco z nowinkami technologicznymi.', 'newsletter.placeholder': 'Twój email',
      typingWords: ['napędzają Twój biznes', 'zwiększają konwersję', 'są szybkie i bezpieczne', 'wyróżniają Cię na rynku', 'skalują się z Tobą']
    },
    en: {
      'nav.start': 'Home', 'nav.services': 'Services', 'nav.xbot': 'Xbot', 'nav.portfolio': 'Portfolio',
      'nav.about': 'About', 'nav.workflow': 'Workflow', 'nav.tech': 'Tech Stack', 'nav.faq': 'FAQ', 'nav.contact': 'Contact', 'nav.cta': 'Quote', 'nav.blog': 'Blog', 'nav.careers': 'Careers',
      'hero.badge': 'Premium Web Development & Software Solutions',
      'hero.title1': 'We build', 'hero.title2': 'digital solutions', 'hero.title3': 'that',
      'hero.desc': 'From simple landing pages to advanced web platforms. We combine design, technology and strategy to help your business achieve more.',
      'hero.btn1': 'Get a quote', 'hero.btn2': 'See our work',
      'hero.stat1': '+ completed projects', 'hero.stat2': '+ clients', 'hero.stat3': 'years on market',
      'hero.stats_note': 'Based on projects delivered since 2021.',
      'hero.scroll': 'Scroll',
      'services.tag': 'What we do', 'services.title': 'Full-stack', 'services.title2': 'development services',
      'services.desc': 'We offer a full range of software development services — from concept to deployment and maintenance.',
      'services.card1.title': 'Websites', 'services.card1.desc': 'Modern, fast websites optimized for SEO and performance.',
      'services.card1.f1': 'Responsive design', 'services.card1.f2': 'SEO optimization', 'services.card1.f3': 'Fast loading',
      'services.card2.title': 'E-commerce', 'services.card2.desc': 'Professional online stores with payment, inventory and ERP integration.',
      'services.card2.f1': 'WooCommerce / Shopify', 'services.card2.f2': 'Online payments', 'services.card2.f3': 'Product management',
      'services.card3.title': 'Web Apps', 'services.card3.desc': 'Advanced business applications, dashboards, CRM and SaaS platforms.',
      'services.card3.f1': 'React / Vue / Angular', 'services.card3.f2': 'Node.js / Python / PHP', 'services.card3.f3': 'Databases',
      'services.card4.title': 'UI/UX Design',
      'services.card4.desc': 'Designing interfaces and user experiences that engage and convert.',
      'services.card4.f1': 'Wireframes & prototypes', 'services.card4.f2': 'Design system', 'services.card4.f3': 'UX research',
      'services.card5.title': 'SEO & Marketing',
      'services.card5.desc': 'Comprehensive search engine optimization and digital marketing strategies.',
      'services.card5.f1': 'SEO audit', 'services.card5.f2': 'Content marketing', 'services.card5.f3': 'Google Ads / Meta Ads',
      'services.card6.title': 'IT Consulting & Audit', 'services.card6.desc': 'Technical consulting, code and infrastructure audit, IT cost optimization.',
      'services.card6.f1': 'Code & security audit', 'services.card6.f2': 'System architecture', 'services.card6.f3': 'Cost optimization',
      'xbot.tag': 'Product', 'xbot.title1': 'Xbot', 'xbot.title2': 'smart AI assistant',
      'xbot.desc': 'Advanced AI chat for your website. Trained on your data, speaking 140+ languages, working 24/7.',
      'xbot.subtitle': 'Professional AI assistant for your business',
      'xbot.p1': '<strong>Xbot</strong> is an advanced conversational AI assistant, running on your website 24/7.',
      'xbot.f1': 'Trained on your data — website, PDF, knowledge base',
      'xbot.f2': '140+ languages with automatic location detection',
      'xbot.f3': 'Real-time voice conversations with voice selection',
      'xbot.f4': 'Live chat with unlimited agents',
      'xbot.f5': 'Appointment booking without third-party apps',
      'xbot.f6': 'Conversation, lead and user behavior analytics',
      'xbot.f7': 'Drag & drop sales funnel builder',
      'xbot.f8': 'Zapier integration with 5000+ apps',
      'xbot.f9': 'AI Human avatar with voice — choose look and voice',
      'xbot.f10': 'Ready-made chat templates — launch in 1 click',
      'xbot.f11': 'Time-delayed triggers — show chat at the perfect moment',
      'xbot.f12': 'Personalized messages — name, location, history',
      'xbot.btn': 'Order Xbot',
      'xbot.input': 'Type a message...',
      'xbot.msg1': 'Hi! I am Xbot, AI assistant of X-DEV. How can I help you?',
      'xbot.msg2': 'I am looking for information about your development services.',
      'xbot.msg3': 'Let me check the knowledge base... Xbot found: we offer websites, e-commerce, web apps and IT consulting. Which area interests you?',
      'xbot.badge1': 'Most popular',
      'xbot.per1': '/ month',
      'loader.text': 'creative solutions for business & beyond',
      'xbot.setup_label': 'one-time setup fee',
      'xbot.pf1': 'Full configuration and AI training', 'xbot.pf2': 'Website deployment',
      'xbot.pf3': 'All Xbot features', 'xbot.pf4': '24/7 technical support',
      'xbot.pf5': 'Updates and optimization',
      'xbot.choose1': 'Choose',
      'portfolio.tag': 'Portfolio', 'portfolio.title1': 'Our latest', 'portfolio.title2': 'projects',
      'portfolio.desc': 'Every project is a success story. See what we have built for our clients.',
      'portfolio.p1': 'E-commerce platform for fashion', 'portfolio.p2': 'Clinic management system',
      'portfolio.p3': 'Cloud analytics dashboard', 'portfolio.p4': 'Finance management app',
      'portfolio.see': 'View',
      'portfolio.note': 'Selected projects and case studies. Details available on request.',
      'about.tag': 'About us', 'about.title1': 'We are', 'about.title2': 'engineers', 'about.title3': 'with passion',
      'about.p1': '<strong>X-DEV</strong> is a team of experienced developers, project managers and designers, operating within <strong>Dvbxtreme Sp. z o.o.</strong> (KRS: 0001097759, NIP: 7632152469, REGON: 528239270). Since 2021 we help businesses with digital transformation, building software that makes a real impact.',
      'about.p2': 'We value quality, transparency and deadlines. Every project is approached individually, using the best tools for the job.',
      'about.team': 'Our team currently consists of 7 people: developers, a designer and a project manager. Meet us in person — write to us and we will arrange a meeting.',
      'about.v1t': 'Quality', 'about.v1d': 'Code goes through multi-stage review',
      'about.v2t': 'Reliability', 'about.v2d': 'We meet deadlines in 98% of cases',
      'about.v3t': 'Support', 'about.v3d': 'Post-sale care and 24/7 technical support',
      'process.tag': 'Process', 'process.title1': 'How we', 'process.title2': 'work',
      'process.desc': 'From idea to deployment — a transparent process that gives you full control.',
      'process.s1': 'Consultation', 'process.s1d': 'We learn about your business, goals and challenges.',
      'process.s2': 'Strategy', 'process.s2d': 'We prepare an action plan and quote.',
      'process.s3': 'Design', 'process.s3d': 'We design UI/UX with the user in mind.',
      'process.s4': 'Development', 'process.s4d': 'We code, test and optimize.',
      'process.s5': 'Launch', 'process.s5d': 'Deploy, monitoring and training your team.',
      'tech.tag': 'Tech Stack', 'tech.title1': 'Our', 'tech.title2': 'tech', 'tech.title3': 'stack',
      'tech.desc': 'We use proven tools and modern technologies to deliver top-quality solutions.',
      'tech.cat1': 'Frontend', 'tech.cat2': 'Backend', 'tech.cat3': 'Databases', 'tech.cat4': 'DevOps & Cloud',
      'testi.tag': 'Testimonials', 'testi.title1': 'What our', 'testi.title2': 'clients say',
      'testi.q1': '"X-DEV designed and built our e-commerce platform. Conversion increased by 40% in 3 months. Professional from brief to deploy."',
      'testi.n1': 'Mark R.',
      'testi.q2': '"We have been working with X-DEV for 2 years. They built our CRM system and analytics dashboard. Great code quality and timely delivery."',
      'testi.n2': 'Agnes K.',
      'testi.q3': '"We needed a fast MVP for our startup. X-DEV delivered a working app in 5 weeks. Impressed by speed and quality."',
      'testi.n3': 'Thomas N.',
      'testi.r1': 'Owner, mens fashion store', 'testi.r2': 'COO, SaaS platform', 'testi.r3': 'Founder, FinTech startup',
      'cta.title': 'Ready to <span class="gradient-text">grow</span> your business?',
      'cta.desc': 'Contact us and get a free quote for your project.',
      'cta.btn': 'Get free quote',
      'contact.tag': 'Contact', 'contact.title1': 'Write to', 'contact.title2': 'us',
      'contact.desc': 'Have a project idea? Want to ask about pricing? Write us — we reply within 24h.',
      'contact.email': 'Email', 'contact.phone': 'Phone', 'contact.address': 'Office', 'contact.registry': 'Company data',
      'form.name': 'Full name', 'form.namePl': 'John Doe',
      'form.email': 'Email address', 'form.emailPl': 'john@example.com',
      'form.subject': 'Subject', 'form.subjectPl': 'What is your message about?',
      'form.message': 'Message', 'form.messagePl': 'Describe your project...',
      'form.btn': 'Send message', 'form.sending': 'Sending...', 'form.sent': 'Message sent!', 'form.error': 'Send error',
      'form.rodo': 'I consent to the processing of my personal data for the purpose of responding to my inquiry. The administrator is Dvbxtreme Sp. z o.o. Privacy policy',
      'footer.desc': 'Modern software solutions for your business.',
      'footer.col1': 'Services', 'footer.col2': 'Company', 'footer.col3': 'Contact', 'footer.col4': 'Registry',
      'footer.f1': 'Websites', 'footer.f2': 'E-commerce', 'footer.f3': 'Web Apps',
      'footer.ab': 'About us', 'footer.pf': 'Portfolio', 'footer.cr': 'Careers', 'footer.ct': 'Contact',
      'footer.copy': '© 2026 X-DEV / Dvbxtreme Sp. z o.o. All rights reserved.',
      'footer.pp': 'Privacy policy', 'footer.tos': 'Terms of service',
      'workflow.tag': 'Workflow', 'workflow.title1': 'Our', 'workflow.title2': 'process', 'workflow.title3': '& tools',
      'workflow.desc': 'We combine proven methodologies with modern tools to deliver quality at every stage.',
      'workflow.m1': 'Agile / Scrum', 'workflow.d1': 'We work in sprints, daily standups and retrospectives. Full process transparency.',
      'workflow.m2': 'Git Flow & CI/CD', 'workflow.d2': 'Every change goes through code review, automated tests and deployment.',
      'workflow.m3': 'Code Review & Audit', 'workflow.d3': 'Two-stage code review, unit and integration tests, security audit.',
      'workflow.m4': 'Deploy & Monitoring', 'workflow.d4': 'Automated production deployment, 24/7 monitoring, alerts and auto-scaling.',
      'workflow.tools_title': 'Tools we use:',
      'faq.tag': 'FAQ', 'faq.title1': 'Frequently', 'faq.title2': 'asked questions', 'faq.desc': 'Have questions? Here are the answers to the most common ones.',
      'faq.q1': 'How much does a website cost?', 'faq.a1': 'The price depends on complexity. Simple landing pages start from $1,500, advanced platforms and stores from $5,000. Contact us for a free quote.',
      'faq.q2': 'How long does it take to build a website?', 'faq.a2': 'A standard landing page takes 2-4 weeks. An e-commerce store or web app usually takes 6-12 weeks. Each project has its own timeline.',
      'faq.q3': 'Do you offer post-launch technical support?', 'faq.a3': 'Yes, we offer maintenance packages including updates, backups, monitoring and 24/7 technical support.',
      'faq.q4': 'What is Xbot and how does it work?', 'faq.a4': 'Xbot is an intelligent AI assistant that can be trained on your company data. It works 24/7 on your website, answers customer questions, books appointments and collects leads.',
      'faq.q5': 'Do you work with international clients?', 'faq.a5': 'Yes, we serve clients from Poland, UK, USA and across Europe. We run projects in Polish and English.',
      'filter.all': 'All', 'filter.web': 'Websites', 'filter.ecommerce': 'E-commerce', 'filter.app': 'Apps', 'filter.dashboard': 'Dashboards',
      'clients.tag': 'Clients & partners', 'clients.title1': 'Trusted', 'clients.title2': 'by',
      'clients.desc': 'We work with companies from Poland, UK and USA in e-commerce, FinTech, healthcare, logistics and SaaS. Client names disclosed under NDA.',
      'cookie.text': 'This website uses cookies to provide the best experience. By continuing to browse, you agree to our use of cookies.',
      'cookie.accept': 'Accept', 'cookie.decline': 'Decline',
      'newsletter.title': 'Newsletter', 'newsletter.desc': 'Stay up to date with tech news.', 'newsletter.placeholder': 'Your email',
      typingWords: ['drive your business', 'boost conversion', 'are fast and secure', 'make you stand out', 'scale with you']
    }
  };

  const regionPrices = {
    pl: { monthly: '1 497 zł', setup: '+ 7 497 zł' },
    uk: { monthly: '£297', setup: '+ £1 497' },
    usa: { monthly: '$397', setup: '+ $1 997' }
  };

  function applyRegion(region) {
    document.querySelectorAll('.region-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.region === region);
    });
    const data = regionPrices[region];
    document.getElementById('region-monthly').textContent = data.monthly;
    document.getElementById('region-setup-price').textContent = data.setup;
    localStorage.setItem('xdev-region', region);
  }

  document.querySelectorAll('.region-btn').forEach(btn => {
    btn.addEventListener('click', () => applyRegion(btn.dataset.region));
  });

  const savedRegion = localStorage.getItem('xdev-region') || 'pl';
  applyRegion(savedRegion);

  let currentLang = localStorage.getItem('xdev-lang') || 'pl';

  function applyLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('xdev-lang', lang);
    document.documentElement.lang = lang === 'pl' ? 'pl-PL' : 'en';

    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.dataset.i18n;
      if (translations[lang][key]) {
        el.innerHTML = translations[lang][key];
      }
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.dataset.i18nPlaceholder;
      if (translations[lang][key]) {
        el.placeholder = translations[lang][key];
      }
    });

    document.querySelectorAll('.lang-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.lang === lang);
    });

    const typingEl = document.getElementById('typing');
    if (typingEl) {
      const words = translations[lang].typingWords || translations.pl.typingWords;
      if (window.restartTyping) window.restartTyping(words);
    }

    document.querySelectorAll('.stat-number').forEach(el => {
      el.textContent = '0';
    });
    const statObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const target = parseInt(entry.target.dataset.target);
          animateCounter(entry.target, target);
          statObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    document.querySelectorAll('.stat-number').forEach(el => statObserver.observe(el));
  }

  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      applyLanguage(btn.dataset.lang);
    });
  });

  applyLanguage(currentLang);

  const yearSpan = document.getElementById('footerYear');
  if (yearSpan) yearSpan.textContent = new Date().getFullYear();

  const themeToggle = document.getElementById('themeToggle');
  const themeColorMeta = document.getElementById('themeColorMeta');
  const savedTheme = localStorage.getItem('xdev-theme');
  if (savedTheme === 'light') {
    document.body.classList.add('light-mode');
    if (themeColorMeta) themeColorMeta.content = '#f5f5fa';
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      document.body.classList.toggle('light-mode');
      const isLight = document.body.classList.contains('light-mode');
      localStorage.setItem('xdev-theme', isLight ? 'light' : 'dark');
      if (themeColorMeta) themeColorMeta.content = isLight ? '#f5f5fa' : '#0a0a0f';
    });
  }

  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach((item, idx) => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    question.setAttribute('aria-expanded', 'false');
    question.setAttribute('aria-controls', `faq-answer-${idx}`);
    if (answer) answer.id = `faq-answer-${idx}`;
    question.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      faqItems.forEach(i => {
        i.classList.remove('open');
        i.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
      });
      if (!isOpen) {
        item.classList.add('open');
        question.setAttribute('aria-expanded', 'true');
      }
    });
  });

  const cookieConsent = document.getElementById('cookieConsent');
  if (cookieConsent) {
    if (localStorage.getItem('xdev-cookie')) {
      cookieConsent.classList.add('hidden');
    }
    document.getElementById('cookieAccept').addEventListener('click', () => {
      localStorage.setItem('xdev-cookie', 'accepted');
      cookieConsent.classList.add('hidden');
    });
    document.getElementById('cookieDecline').addEventListener('click', () => {
      localStorage.setItem('xdev-cookie', 'declined');
      cookieConsent.classList.add('hidden');
    });
  }

  const backToTop = document.getElementById('backToTop');
  if (backToTop) {
    window.addEventListener('scroll', () => {
      if (window.pageYOffset > 400) {
        backToTop.classList.add('visible');
      } else {
        backToTop.classList.remove('visible');
      }
    });
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  const filterBtns = document.querySelectorAll('.filter-btn');
  const portfolioItems = document.querySelectorAll('.portfolio-item');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      portfolioItems.forEach(item => {
        if (filter === 'all' || item.dataset.category === filter) {
          item.style.display = 'block';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });

  const modalOverlay = document.getElementById('serviceModal');
  const modalBody = document.getElementById('modalBody');
  const modalClose = document.getElementById('modalClose');

  const projectDetails = {
    shopflow: {
      title: 'ShopFlow – Platforma e-commerce',
      desc: 'Nowoczesna platforma e-commerce dla branzy fashion. System obsluguje zarzadzanie produktami, koszyk, platnosci online oraz integracje z systemami magazynowymi i kurierskimi.',
      features: ['Katalog produktow z filtrowaniem', 'Koszyk i platnosci online (Przelewy24, BLIK, karta)', 'Panel zarzadzania zamowieniami', 'Integracja z WMS i kurierami', 'Responsywny design'],
      tech: 'React, Node.js, MongoDB',
      link: 'https://github.com/xdev'
    },
    medicare: {
      title: 'MediCare – System zarzadzania przychodnia',
      desc: 'Kompleksowy system do zarzadzania przychodnia lekarska. Obejmuje rejestracje pacjentow, harmonogram wizyt, dokumentacje medyczna i rozliczenia z NFZ.',
      features: ['Rejestracja pacjentow online', 'Harmonogram wizyt i przypomnienia SMS', 'Elektroniczna dokumentacja medyczna', 'Rozliczenia z NFZ', 'Panel dla lekarzy i personelu'],
      tech: 'Vue.js, Django, PostgreSQL',
      link: 'https://github.com/xdev'
    },
    clouddash: {
      title: 'CloudDash – Dashboard analityczny',
      desc: 'Zaawansowany dashboard analityczny w chmurze do monitorowania kluczowych metryk biznesowych w czasie rzeczywistym. Laczny dane z wielu zrodel w jednym miejscu.',
      features: ['Wykresy i wizualizacje danych na zywo', 'Integracja z Google Analytics, CRM, ERP', 'Automatyczne raporty e-mail', 'Personalizowane widoki dla uzytkownikow', 'Eksport do CSV/PDF'],
      tech: 'Next.js, TypeScript, AWS',
      link: 'https://github.com/xdev'
    },
    fintracker: {
      title: 'FinTracker – Aplikacja finansowa',
      desc: 'Mobilna aplikacja do zarzadzania finansami osobistymi. Sledzenie wydatkow, budzetowanie, kategorie, cele oszczednosciowe i analiza wydatkow.',
      features: ['Sledzenie wydatkow i przychodow', 'Kategorie i budzetowanie', 'Cele oszczednosciowe', 'Wykresy i statystyki', 'Synchronizacja miedzy urzadzeniami'],
      tech: 'React Native, Firebase',
      link: 'https://github.com/xdev'
    }
  };

  function openModal(projectId) {
    const data = projectDetails[projectId];
    if (!data) return;
    modalBody.innerHTML = `
      <h3>${data.title}</h3>
      <p>${data.desc}</p>
      <h4 style="font-size:14px;font-weight:600;margin-bottom:8px;color:var(--accent)">Kluczowe funkcje:</h4>
      <ul>${data.features.map(f => `<li><i class="fas fa-check"></i> ${f}</li>`).join('')}</ul>
      <p><strong>Stack technologiczny:</strong> ${data.tech}</p>
      ${data.link ? `<p style="margin-top:12px;"><a href="${data.link}" target="_blank" rel="noopener" class="btn btn-sm btn-outline"><i class="fab fa-github"></i> Zobacz na GitHub</a></p>` : ''}
    `;
    modalOverlay.classList.add('open');
  }

  document.querySelectorAll('.case-study-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openModal(btn.dataset.project);
    });
  });

  if (modalClose) {
    modalClose.addEventListener('click', () => modalOverlay.classList.remove('open'));
  }
  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) modalOverlay.classList.remove('open');
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay.classList.contains('open')) {
      modalOverlay.classList.remove('open');
    }
  });

  const newsletterForm = document.getElementById('newsletterForm');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      const btn = newsletterForm.querySelector('button');
      btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
      btn.disabled = true;
    });
  }

  console.log('%c X-DEV %c Dvbxtreme Sp. z o.o. | KRS: 0001097759 ',
    'background:#6c5ce7; color:#fff; padding:8px 4px; font-size:16px; font-weight:bold; border-radius:4px 0 0 4px; font-family:monospace;',
    'background:#00cec9; color:#0a0a0f; padding:8px 4px; font-size:16px; font-weight:bold; border-radius:0 4px 4px 0; font-family:monospace;'
  );
  console.log('💻 Zapraszamy do wspolpracy: support@dvbxtreme.com.pl | tel: +48 884 516 135');
});
