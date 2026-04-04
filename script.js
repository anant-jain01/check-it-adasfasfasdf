// ============================================================
// 3K Investment Partners — Unified script.js
// Merges: components.js, script.js (all site-wide JS in one file)
// ============================================================

(function () {
  'use strict';

  /* ── Component loader (HTTP/HTTPS only) ──────────────────────────────────── */
  function loadComponent(url, containerId, callback) {
    if (window.location.protocol === 'file:') return; // skip for local file:// opens
    var container = document.getElementById(containerId);
    if (!container) return;
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.onreadystatechange = function () {
      if (xhr.readyState !== 4) return;
      if (xhr.status === 200) {
        container.innerHTML = xhr.responseText;
        if (typeof callback === 'function') callback();
      }
    };
    xhr.send();
  }

  /* ── Active nav link ─────────────────────────────────────────────────────── */
  function setActiveNav() {
    var path = window.location.pathname;
    var file = path.split('/').pop() || 'index.html';
    var page = file.replace('.html', '') || 'index';
    document.querySelectorAll('.nav-links .nav-item[data-page]').forEach(function (link) {
      link.classList.toggle('active', link.dataset.page === page);
    });
  }

  /* ── Header scroll hide/show ─────────────────────────────────────────────── */
  function initScrollEffects() {
    var lastScroll = 0;
    window.addEventListener('scroll', function () {
      var s = window.scrollY;
      var h = document.getElementById('header');
      if (!h) return;
      h.classList.toggle('scrolled', s > 60);
      if (s > lastScroll && s > 300) h.classList.add('header-hidden');
      else h.classList.remove('header-hidden');
      lastScroll = s;

      // Parallax images
      document.querySelectorAll('.parallax-img').forEach(function (el) {
        var speed = Number(el.dataset.speed || 0.5);
        el.style.transform = 'translateY(' + (-(s * speed)) + 'px)';
      });
    });
  }

  /* ── Scroll reveal ───────────────────────────────────────────────────────── */
  function initScrollReveal() {
    var sel = '.reveal,.reveal-left,.reveal-right,.reveal-up,.reveal-scale';
    if (!('IntersectionObserver' in window)) {
      document.querySelectorAll(sel).forEach(function (el) { el.classList.add('active'); });
      return;
    }
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('active');
          e.target.querySelectorAll('.stagger-child').forEach(function (child, i) {
            setTimeout(function () { child.classList.add('active'); }, i * 100);
          });
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });
    document.querySelectorAll(sel).forEach(function (el) { obs.observe(el); });
  }

  /* ── Smooth scroll for anchor links ─────────────────────────────────────── */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
      anchor.addEventListener('click', function (e) {
        var href = this.getAttribute('href');
        if (!href || href.length <= 1) return;
        var target = document.querySelector(href);
        if (!target) return;
        e.preventDefault();
        window.scrollTo({ top: target.getBoundingClientRect().top + window.pageYOffset - 100, behavior: 'smooth' });
      });
    });
  }

  /* ── Counters ────────────────────────────────────────────────────────────── */
  function animateCounter(el) {
    var target = parseInt(el.getAttribute('data-target') || '0', 10);
    if (!target) return;
    var step = target / (2000 / 16), current = 0;
    var t = setInterval(function () {
      current += step;
      if (current >= target) { el.textContent = target.toLocaleString('en-IN'); clearInterval(t); }
      else el.textContent = Math.floor(current).toLocaleString('en-IN');
    }, 16);
  }

  function initCounters() {
    if (!('IntersectionObserver' in window)) {
      document.querySelectorAll('.counter').forEach(animateCounter);
      return;
    }
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting && !e.target.classList.contains('counted')) {
          animateCounter(e.target);
          e.target.classList.add('counted');
        }
      });
    }, { threshold: 0.5 });
    document.querySelectorAll('.counter').forEach(function (el) { obs.observe(el); });
  }

  /* ── Magnetic buttons ────────────────────────────────────────────────────── */
  function initMagneticButtons() {
    document.querySelectorAll('.btn-magnetic').forEach(function (btn) {
      btn.addEventListener('mousemove', function (e) {
        var rect = btn.getBoundingClientRect();
        var x = e.clientX - rect.left - rect.width / 2;
        var y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = 'translate(' + (x * 0.2) + 'px,' + (y * 0.2) + 'px)';
      });
      btn.addEventListener('mouseleave', function () { btn.style.transform = ''; });
    });
  }

  /* ── Mobile slide-in nav panel ───────────────────────────────────────────── */
  function initMobileMenu() {
    var hamburger = document.getElementById('hamburger');
    var panel     = document.getElementById('mobilePanel');
    var overlay   = document.getElementById('mobileOverlay');
    var closeBtn  = document.getElementById('mobileClose');
    if (!hamburger || !panel) return;

    function openPanel()  { panel.classList.add('open'); if (overlay) overlay.classList.add('open'); document.body.style.overflow = 'hidden'; }
    function closePanel() { panel.classList.remove('open'); if (overlay) overlay.classList.remove('open'); document.body.style.overflow = ''; }

    hamburger.addEventListener('click', openPanel);
    if (closeBtn) closeBtn.addEventListener('click', closePanel);
    if (overlay)  overlay.addEventListener('click', closePanel);
    if (panel) panel.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', closePanel); });
  }

  /* ── Contact form → backend ──────────────────────────────────────────────── */
  function initContactForm() {
    var contactForm = document.getElementById('contact-form');
    if (!contactForm) return;

    contactForm.addEventListener('submit', async function (e) {
      e.preventDefault();
      var submitBtn = document.getElementById('submit-contact');
      if (!submitBtn) return;

      var firstName = (document.getElementById('contact-firstname') || {}).value?.trim() || '';
      var lastName  = (document.getElementById('contact-lastname')  || {}).value?.trim() || '';
      var email     = (document.getElementById('contact-email')     || {}).value?.trim() || '';
      var phone     = (document.getElementById('contact-phone')     || {}).value?.trim() || '';
      var message   = (document.getElementById('contact-message')   || {}).value?.trim() || '';

      submitBtn.textContent = 'Sending…';
      submitBtn.disabled = true;

      try {
        var response = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ firstName, lastName, email, phone, message })
        });
        var data = await response.json();
        if (data.success) {
          submitBtn.textContent = '✓ Message Sent!';
          submitBtn.style.background = '#2e7d32';
          contactForm.reset();
        } else {
          submitBtn.textContent = 'Error — Try Again';
          submitBtn.style.background = '#c62828';
        }
      } catch (err) {
        submitBtn.textContent = '✓ Request Received!';
        submitBtn.style.background = '#2e7d32';
        contactForm.reset();
      }
      setTimeout(function () {
        submitBtn.textContent = 'Submit Request';
        submitBtn.style.background = '';
        submitBtn.disabled = false;
      }, 3000);
    });
  }

  /* ── Lazy images ─────────────────────────────────────────────────────────── */
  function initLazyImages() {
    if (!('IntersectionObserver' in window)) return;
    document.querySelectorAll('img[data-src]').forEach(function (img) {
      var obs = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { e.target.src = e.target.dataset.src; e.target.classList.add('loaded'); obs.unobserve(e.target); }
        });
      });
      obs.observe(img);
    });
  }

  /* ── Video caption animation (services page) ─────────────────────────────── */
  function initVideoCaptionAnimation() {
    var videoEl = document.getElementById('goals-video');
    var captionWord = document.getElementById('caption-word');
    if (!videoEl || !captionWord) return;
    var captions = [
      { word: 'travel',     start: 0,  end: 3  },
      { word: 'marriage',   start: 4,  end: 9  },
      { word: 'family',     start: 10, end: 18 },
      { word: 'travel',     start: 19, end: 23 },
      { word: 'retirement', start: 25, end: 28 },
    ];
    videoEl.addEventListener('timeupdate', function () {
      var t = Math.floor(videoEl.currentTime);
      captions.forEach(function (cap) {
        if (t >= cap.start && t <= cap.end && captionWord.textContent !== cap.word) {
          captionWord.classList.remove('active');
          setTimeout(function () { captionWord.textContent = cap.word; captionWord.classList.add('active'); }, 250);
        }
      });
    });
  }

  /* ── FAQ accordion (faq.html) ────────────────────────────────────────────── */
  function initFaqAccordion() {
    var items = document.querySelectorAll('.faq-item');
    if (!items.length) return;
    items.forEach(function (item) {
      var btn = item.querySelector('.faq-question');
      if (!btn) return;
      btn.addEventListener('click', function () {
        var isActive = item.classList.contains('active');
        items.forEach(function (i) { i.classList.remove('active'); });
        if (!isActive) item.classList.add('active');
      });
    });
  }

  /* ── Contact popup (index.html) ──────────────────────────────────────────── */
  function initContactPopup() {
    var overlay = document.getElementById('contact-popup-overlay');
    if (!overlay) return;

    // Show popup after 5 seconds on first visit
    if (!sessionStorage.getItem('popup-shown')) {
      setTimeout(function () {
        overlay.style.display = 'flex';
        sessionStorage.setItem('popup-shown', '1');
      }, 5000);
    }

    // Close when clicking outside the modal box
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) overlay.style.display = 'none';
    });
  }

  /* ── Bootstrap ───────────────────────────────────────────────────────────── */
  document.addEventListener('DOMContentLoaded', function () {
    // Dynamic component injection (HTTP only)
    loadComponent('header.html', 'site-header', function () {
      setActiveNav();
      initMobileMenu();
      initScrollEffects();
    });
    loadComponent('footer.html', 'site-footer', null);
    loadComponent('stats-bar.html', 'site-stats-bar', function () {
      initCounters();
      initScrollReveal();
    });

    // Run everything else
    setActiveNav();
    initScrollEffects();
    initScrollReveal();
    initSmoothScroll();
    initVideoCaptionAnimation();
    initCounters();
    initMagneticButtons();
    initContactForm();
    initLazyImages();
    initMobileMenu();
    initFaqAccordion();
    initContactPopup();
  });

})();
