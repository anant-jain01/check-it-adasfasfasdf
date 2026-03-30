/**
 * components.js
 * Loads shared HTML components (header, footer, stats-bar) into placeholder divs.
 * Works on both file:// (local) and http(s):// (server) origins.
 */

(function () {

  /* ── Utility: XHR-based loader (works on file:// unlike fetch) ─────────── */
  function loadComponent(url, containerId, callback) {
    var container = document.getElementById(containerId);
    if (!container) return;

    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.onreadystatechange = function () {
      if (xhr.readyState !== 4) return;
      // On file:// status is 0 on success; on http status is 200
      if (xhr.status === 200 || (xhr.status === 0 && xhr.responseText)) {
        container.innerHTML = xhr.responseText;
        if (typeof callback === 'function') callback();
      } else {
        console.warn('[components.js] Failed to load ' + url + ' (status ' + xhr.status + ')');
      }
    };
    xhr.send();
  }

  /* ── Active nav link ───────────────────────────────────────────────────── */
  function setActiveNav() {
    var path = window.location.pathname;
    var file = path.split('/').pop() || 'index.html';
    var page = file.replace('.html', '') || 'index';
    document.querySelectorAll('.nav-links .nav-item[data-page]').forEach(function (link) {
      link.classList.toggle('active', link.dataset.page === page);
    });
  }

  /* ── Slide-in mobile nav panel (from header.html) ──────────────────────── */
  function initMobileNav() {
    var hamburger = document.getElementById('hamburger');
    var panel     = document.getElementById('mobilePanel');
    var overlay   = document.getElementById('mobileOverlay');
    var closeBtn  = document.getElementById('mobileClose');

    if (!hamburger || !panel) return;

    function openPanel() {
      panel.classList.add('open');
      if (overlay) overlay.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
    function closePanel() {
      panel.classList.remove('open');
      if (overlay) overlay.classList.remove('open');
      document.body.style.overflow = '';
    }

    hamburger.addEventListener('click', openPanel);
    if (closeBtn)  closeBtn.addEventListener('click',  closePanel);
    if (overlay)   overlay.addEventListener('click',   closePanel);

    // Close panel on nav link click
    panel.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', closePanel);
    });
  }

  /* ── Header scroll behaviour ───────────────────────────────────────────── */
  function initHeaderScroll() {
    var lastScroll = 0;
    window.addEventListener('scroll', function () {
      var currentScroll = window.scrollY;
      var header = document.getElementById('header');
      if (!header) return;
      header.classList.toggle('scrolled', currentScroll > 60);
      if (currentScroll > lastScroll && currentScroll > 300) {
        header.classList.add('header-hidden');
      } else {
        header.classList.remove('header-hidden');
      }
      lastScroll = currentScroll;
    });
  }

  /* ── Animated counters ─────────────────────────────────────────────────── */
  function animateCounter(el) {
    var target   = parseInt(el.getAttribute('data-target') || '0', 10);
    if (!target) return;
    var duration = 2000;
    var step     = target / (duration / 16);
    var current  = 0;
    var timer    = setInterval(function () {
      current += step;
      if (current >= target) {
        el.textContent = target.toLocaleString('en-IN');
        clearInterval(timer);
      } else {
        el.textContent = Math.floor(current).toLocaleString('en-IN');
      }
    }, 16);
  }

  function initCounters() {
    if (!('IntersectionObserver' in window)) {
      document.querySelectorAll('.counter').forEach(animateCounter);
      return;
    }
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
          animateCounter(entry.target);
          entry.target.classList.add('counted');
        }
      });
    }, { threshold: 0.5 });
    document.querySelectorAll('.counter').forEach(function (el) { obs.observe(el); });
  }

  /* ── Scroll-reveal ─────────────────────────────────────────────────────── */
  function initScrollReveal() {
    var selectors = '.reveal,.reveal-left,.reveal-right,.reveal-up,.reveal-scale';
    if (!('IntersectionObserver' in window)) {
      document.querySelectorAll(selectors).forEach(function (el) { el.classList.add('active'); });
      return;
    }
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) entry.target.classList.add('active');
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });
    document.querySelectorAll(selectors).forEach(function (el) { obs.observe(el); });
  }

  /* ── Bootstrap ─────────────────────────────────────────────────────────── */
  document.addEventListener('DOMContentLoaded', function () {

    loadComponent('header.html', 'site-header', function () {
      setActiveNav();
      initMobileNav();
      initHeaderScroll();
    });

    loadComponent('footer.html', 'site-footer', null);

    loadComponent('stats-bar.html', 'site-stats-bar', function () {
      initCounters();
      initScrollReveal();
    });
  });

})();
