/**
 * components.js — Progressive enhancement only (HTTP server usage)
 * When opened directly as a local file (file:// protocol), header/footer/stats
 * are already inlined in each HTML page. This script only runs on HTTP(S) origins.
 */

(function () {
  // Only attempt dynamic loading when served via HTTP/HTTPS (not file://)
  if (window.location.protocol === 'file:') return;

  /* ── Utility: XHR-based loader ──────────────────────────────────────────── */
  function loadComponent(url, containerId, callback) {
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

  /* ── Active nav ─────────────────────────────────────────────────────────── */
  function setActiveNav() {
    var path = window.location.pathname;
    var file = path.split('/').pop() || 'index.html';
    var page = file.replace('.html', '') || 'index';
    document.querySelectorAll('.nav-links .nav-item[data-page]').forEach(function (link) {
      link.classList.toggle('active', link.dataset.page === page);
    });
  }

  /* ── Mobile nav panel ───────────────────────────────────────────────────── */
  function initMobileNav() {
    var hamburger = document.getElementById('hamburger');
    var panel     = document.getElementById('mobilePanel');
    var overlay   = document.getElementById('mobileOverlay');
    var closeBtn  = document.getElementById('mobileClose');
    if (!hamburger || !panel) return;

    function openPanel()  { panel.classList.add('open'); if (overlay) overlay.classList.add('open'); document.body.style.overflow = 'hidden'; }
    function closePanel() { panel.classList.remove('open'); if (overlay) overlay.classList.remove('open'); document.body.style.overflow = ''; }

    hamburger.addEventListener('click', openPanel);
    if (closeBtn) closeBtn.addEventListener('click', closePanel);
    if (overlay)  overlay.addEventListener('click',  closePanel);
    panel.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', closePanel); });
  }

  /* ── Header scroll ──────────────────────────────────────────────────────── */
  function initHeaderScroll() {
    var lastScroll = 0;
    window.addEventListener('scroll', function () {
      var s = window.scrollY;
      var h = document.getElementById('header');
      if (!h) return;
      h.classList.toggle('scrolled', s > 60);
      if (s > lastScroll && s > 300) h.classList.add('header-hidden');
      else h.classList.remove('header-hidden');
      lastScroll = s;
    });
  }

  /* ── Counters ───────────────────────────────────────────────────────────── */
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
    if (!('IntersectionObserver' in window)) { document.querySelectorAll('.counter').forEach(animateCounter); return; }
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting && !e.target.classList.contains('counted')) { animateCounter(e.target); e.target.classList.add('counted'); } });
    }, { threshold: 0.5 });
    document.querySelectorAll('.counter').forEach(function (el) { obs.observe(el); });
  }

  /* ── Scroll reveal ──────────────────────────────────────────────────────── */
  function initScrollReveal() {
    var sel = '.reveal,.reveal-left,.reveal-right,.reveal-up,.reveal-scale';
    if (!('IntersectionObserver' in window)) { document.querySelectorAll(sel).forEach(function (el) { el.classList.add('active'); }); return; }
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) e.target.classList.add('active'); });
    }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });
    document.querySelectorAll(sel).forEach(function (el) { obs.observe(el); });
  }

  /* ── Bootstrap (HTTP only) ──────────────────────────────────────────────── */
  document.addEventListener('DOMContentLoaded', function () {
    loadComponent('header.html', 'site-header', function () {
      setActiveNav(); initMobileNav(); initHeaderScroll();
    });
    loadComponent('footer.html', 'site-footer', null);
    loadComponent('stats-bar.html', 'site-stats-bar', function () {
      initCounters(); initScrollReveal();
    });
  });

})();
