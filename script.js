/* ═══════════════════════════════════════════════════
   VITAPET — CLÍNICA VETERINÁRIA
   JavaScript — Interactivity & Animations
   ═══════════════════════════════════════════════════ */

'use strict';

// ── Nav scroll behaviour ──────────────────────────────
const nav = document.getElementById('main-nav');
let lastScroll = 0;

window.addEventListener('scroll', () => {
  const current = window.scrollY;
  if (current > 60) {
    nav.classList.add('scrolled');
  } else {
    nav.classList.remove('scrolled');
  }
  lastScroll = current;
}, { passive: true });

// ── Mobile nav toggle ─────────────────────────────────
const navToggle = document.getElementById('nav-toggle');
const navMenu   = document.getElementById('nav-menu');

navToggle.addEventListener('click', () => {
  const isOpen = navMenu.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', isOpen);
  navToggle.setAttribute('aria-label', isOpen ? 'Fechar menu' : 'Abrir menu');
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

// Close mobile nav on link click
navMenu.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    navMenu.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-label', 'Abrir menu');
    document.body.style.overflow = '';
  });
});

// ── Smooth scroll for anchor links ───────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const navH = nav.offsetHeight;
    const top  = target.getBoundingClientRect().top + window.scrollY - navH - 16;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

// ── Scroll reveal ─────────────────────────────────────
const revealElems = document.querySelectorAll(
  '.feature-card, .service-card, .testimonial-card, .faq-item, .partner-badge, .about-image-wrap, .about-content, .section-header, .contact-info, .booking-form-wrap'
);

revealElems.forEach(el => el.classList.add('reveal'));

const observer = new IntersectionObserver(
  entries => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('revealed');
        }, i * 60);
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
);

revealElems.forEach(el => observer.observe(el));

// ── Back to top button ────────────────────────────────
const backToTop = document.getElementById('back-to-top');

window.addEventListener('scroll', () => {
  if (window.scrollY > 400) {
    backToTop.hidden = false;
  } else {
    backToTop.hidden = true;
  }
}, { passive: true });

backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ── FAQ accordion — close others on open ─────────────
const faqItems = document.querySelectorAll('.faq-item');

faqItems.forEach(item => {
  item.addEventListener('toggle', () => {
    if (item.open) {
      faqItems.forEach(other => {
        if (other !== item && other.open) {
          other.removeAttribute('open');
        }
      });
    }
  });
});

// ── Booking form submit ───────────────────────────────
const form        = document.getElementById('booking-form');
const formSuccess = document.getElementById('form-success');
const submitBtn   = document.getElementById('form-submit-btn');

form.addEventListener('submit', e => {
  e.preventDefault();

  // Basic validation
  const requiredFields = form.querySelectorAll('[required]');
  let valid = true;

  requiredFields.forEach(field => {
    field.style.borderColor = '';
    if (!field.value.trim()) {
      field.style.borderColor = 'hsl(0, 70%, 55%)';
      field.style.boxShadow   = '0 0 0 3px hsla(0, 70%, 55%, 0.2)';
      valid = false;
    } else {
      field.style.borderColor = 'hsl(168, 65%, 42%)';
      field.style.boxShadow   = '';
    }
  });

  if (!valid) {
    // Shake the submit button
    submitBtn.style.animation = 'none';
    submitBtn.offsetHeight; // reflow
    submitBtn.style.animation = 'shake 0.4s ease';
    return;
  }

  // Simulate submit
  submitBtn.querySelector('span').textContent = 'A enviar…';
  submitBtn.disabled = true;

  setTimeout(() => {
    form.hidden = true;
    formSuccess.hidden = false;

    // Scroll to success message
    formSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, 1200);
});

// ── Active nav link on scroll ─────────────────────────
const sections = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nav-link:not(.nav-cta)');

const sectionObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${entry.target.id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  },
  { threshold: 0.35 }
);

sections.forEach(section => sectionObserver.observe(section));

// ── Typing effect on hero headline ───────────────────
// Add shake animation dynamically
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    20%       { transform: translateX(-6px); }
    40%       { transform: translateX(6px); }
    60%       { transform: translateX(-4px); }
    80%       { transform: translateX(4px); }
  }

  .nav-link.active {
    color: #fff !important;
  }
  .nav-link.active::after {
    width: 100% !important;
  }
`;
document.head.appendChild(styleSheet);

// ── Number counter animation ──────────────────────────
function animateCounters() {
  const stats = document.querySelectorAll('.stat-item strong');

  stats.forEach(stat => {
    const text  = stat.textContent;
    const match = text.match(/[\d.,]+/);
    if (!match) return;

    const numStr   = match[0].replace(/\./g, '').replace(',', '.');
    const num      = parseFloat(numStr);
    const prefix   = text.startsWith('+') ? '+' : '';
    const suffix   = text.replace(/[\+\d.,\s]/g, '').trim();
    const isDecimal = numStr.includes('.');

    let start = 0;
    const duration = 1800;
    const step = (timestamp) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 4); // ease-out-quart
      const current = Math.round(ease * num * (isDecimal ? 10 : 1)) / (isDecimal ? 10 : 1);
      stat.textContent = `${prefix}${isDecimal ? current.toFixed(0) : current.toLocaleString('pt-PT')}${suffix ? ' ' + suffix : ''}`;
      if (progress < 1) requestAnimationFrame(step);
    };

    const counterObserver = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        requestAnimationFrame(step);
        counterObserver.disconnect();
      }
    }, { threshold: 0.5 });

    counterObserver.observe(stat.closest('.hero-stats'));
  });
}

animateCounters();

// ── Feature cards stagger on hover ───────────────────
document.querySelectorAll('.feature-card').forEach((card, i) => {
  card.style.transitionDelay = `${i * 0.04}s`;
});

// ── Parallax on hero image ────────────────────────────
const heroImg = document.querySelector('.hero-img');

if (heroImg && window.matchMedia('(min-width: 768px)').matches) {
  window.addEventListener('scroll', () => {
    const offset = window.scrollY * 0.3;
    heroImg.style.transform = `translateY(${offset}px)`;
  }, { passive: true });
}

console.log('%c🐾 VitaPet — Clínica Veterinária', 'font-size:14px;font-weight:bold;color:#3bbfa0;');
console.log('%cDesenvolvido com 💚 e tecnologia de ponta.', 'font-size:11px;color:#555;');
