/**
 * ROM Technology — rom-tech.js
 * Built to Last — jeROMe Allen
 *
 * Features:
 * - Shrinking sticky header with logo transition
 * - Scroll-triggered fade-in animations
 * - Mobile nav toggle
 * - Active nav link highlighting
 * - Smooth scroll for anchor links
 */

(function () {
  'use strict';

  // ── Wait for DOM ─────────────────────────────────────────────
  document.addEventListener('DOMContentLoaded', function () {
    initShrinkingHeader();
    initScrollAnimations();
    initMobileNav();
    initActiveNavLinks();
    initSmoothScroll();
    initLogoSwitch();
  });

  // ═══════════════════════════════════════════════════════════
  // SHRINKING HEADER
  // Logo shrinks as user scrolls down
  // ═══════════════════════════════════════════════════════════

  function initShrinkingHeader() {
    const header = document.querySelector(
      'header.wp-block-template-part, .rom-header, header'
    );
    if (!header) return;

    const SCROLL_THRESHOLD = 80;   // px before header shrinks
    const HIDE_THRESHOLD   = 300;  // px before header hides on scroll down

    let lastScrollY = 0;

    function updateHeader() {
      const currentY  = window.scrollY;
      const scrolled  = currentY > SCROLL_THRESHOLD;
      const scrollingDown = currentY > lastScrollY;

      // Shrink after 80px
      header.classList.toggle('scrolled', scrolled);

      // Hide when scrolling down past 300px, show when scrolling up
      if (currentY > HIDE_THRESHOLD && scrollingDown) {
        header.classList.add('hidden');
      } else if (!scrollingDown) {
        header.classList.remove('hidden');
      }

      lastScrollY = currentY;
    }

    let ticking = false;
    window.addEventListener('scroll', function () {
      if (!ticking) {
        window.requestAnimationFrame(function () {
          updateHeader();
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });

    // Run on load
    updateHeader();
  }

  // ═══════════════════════════════════════════════════════════
  // LOGO SWITCH
  // Hero shows full master logo → scrolls to favicon size
  // ═══════════════════════════════════════════════════════════

  function initLogoSwitch() {
    const heroLogoFigure = document.querySelector('.rom-hero-logo');
    if (!heroLogoFigure) return;

    // Target the img inside the figure
    const heroLogo = heroLogoFigure.querySelector('img') || heroLogoFigure;

    // Wait until user scrolls past the full hero section (100vh)
    const SWITCH_THRESHOLD = window.innerHeight * 0.95;

    let isSmall = false;

    function updateLogo() {
      const scrolled = window.scrollY > SWITCH_THRESHOLD;

      if (scrolled && !isSmall) {
        isSmall = true;
        heroLogoFigure.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
        heroLogoFigure.style.width      = '80px';
        heroLogoFigure.style.opacity    = '0.7';
      } else if (!scrolled && isSmall) {
        isSmall = false;
        heroLogoFigure.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
        heroLogoFigure.style.width      = '';
        heroLogoFigure.style.opacity    = '1';
      }
    }

    let ticking = false;
    window.addEventListener('scroll', function () {
      if (!ticking) {
        window.requestAnimationFrame(function () {
          updateLogo();
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  // ═══════════════════════════════════════════════════════════
  // SCROLL ANIMATIONS
  // Elements fade in as they enter the viewport
  // ═══════════════════════════════════════════════════════════

  function initScrollAnimations() {
    // Auto-add fade-in to common content blocks
    const targets = document.querySelectorAll(
      '.rom-card, .rom-section-title, .rom-section-subtitle, ' +
      '.wp-block-group:not(.rom-hero), .wp-block-columns, ' +
      '.wp-block-image, .wp-block-heading, .wp-block-paragraph'
    );

    targets.forEach(function (el, i) {
      if (!el.classList.contains('rom-fade-in')) {
        el.classList.add('rom-fade-in');
        // Stagger delay for grid items
        el.style.transitionDelay = Math.min(i * 0.05, 0.4) + 's';
      }
    });

    // Intersection Observer
    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target); // animate once
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    document.querySelectorAll('.rom-fade-in').forEach(function (el) {
      observer.observe(el);
    });
  }

  // ═══════════════════════════════════════════════════════════
  // MOBILE NAV TOGGLE
  // ═══════════════════════════════════════════════════════════

  function initMobileNav() {
    const toggle = document.querySelector('.rom-nav-toggle');
    const nav    = document.querySelector('.rom-nav');
    if (!toggle || !nav) return;

    toggle.addEventListener('click', function () {
      const isOpen = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', isOpen);
      toggle.textContent = isOpen ? '✕' : '☰';
    });

    // Close on outside click
    document.addEventListener('click', function (e) {
      if (!toggle.contains(e.target) && !nav.contains(e.target)) {
        nav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.textContent = '☰';
      }
    });

    // Close on nav link click
    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        nav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.textContent = '☰';
      });
    });
  }

  // ═══════════════════════════════════════════════════════════
  // ACTIVE NAV LINKS
  // Highlight current page in navigation
  // ═══════════════════════════════════════════════════════════

  function initActiveNavLinks() {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll(
      '.rom-nav a, .wp-block-navigation a'
    );

    navLinks.forEach(function (link) {
      const linkPath = new URL(link.href, window.location.origin).pathname;
      if (linkPath === currentPath ||
          (currentPath !== '/' && linkPath !== '/' && currentPath.startsWith(linkPath))) {
        link.classList.add('active');
        link.setAttribute('aria-current', 'page');
      }
    });
  }

  // ═══════════════════════════════════════════════════════════
  // SMOOTH SCROLL
  // Smooth scroll for anchor links
  // ═══════════════════════════════════════════════════════════

  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
      anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href').slice(1);
        if (!targetId) return;

        const target = document.getElementById(targetId);
        if (!target) return;

        e.preventDefault();

        const headerHeight = parseInt(
          getComputedStyle(document.documentElement)
            .getPropertyValue('--rom-header-height-small')
        ) || 56;

        const targetTop = target.getBoundingClientRect().top
          + window.scrollY
          - headerHeight
          - 16;

        window.scrollTo({
          top: targetTop,
          behavior: 'smooth'
        });
      });
    });
  }

  // ═══════════════════════════════════════════════════════════
  // CIRCUIT DOTS ANIMATION (subtle background effect)
  // ═══════════════════════════════════════════════════════════

  function initCircuitDots() {
    const hero = document.querySelector('.rom-hero');
    if (!hero) return;

    // Create a few animated circuit dots
    const dots = [
      { x: '15%', y: '20%', delay: '0s' },
      { x: '85%', y: '30%', delay: '0.5s' },
      { x: '10%', y: '70%', delay: '1s' },
      { x: '90%', y: '65%', delay: '1.5s' },
      { x: '50%', y: '85%', delay: '0.8s' },
    ];

    dots.forEach(function (dot) {
      const el = document.createElement('div');
      el.style.cssText = `
        position: absolute;
        left: ${dot.x};
        top: ${dot.y};
        width: 4px;
        height: 4px;
        border-radius: 50%;
        background: #2d6a4f;
        opacity: 0;
        animation: romDotPulse 3s ${dot.delay} infinite;
        pointer-events: none;
      `;
      hero.appendChild(el);
    });

    // Add keyframes if not already present
    if (!document.getElementById('rom-dot-keyframes')) {
      const style = document.createElement('style');
      style.id = 'rom-dot-keyframes';
      style.textContent = `
        @keyframes romDotPulse {
          0%, 100% { opacity: 0; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.5); }
        }
      `;
      document.head.appendChild(style);
    }
  }

  // Run circuit dots after a short delay
  setTimeout(initCircuitDots, 500);

})();