// Header scroll effect
window.addEventListener('scroll', () => {
  const h = document.getElementById('header');
  if (h) h.classList.toggle('scrolled', window.scrollY > 60);
});

// Scroll reveal via IntersectionObserver
document.querySelectorAll('.reveal,.reveal-left,.reveal-right').forEach(el => {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(i => { if (i.isIntersecting) i.target.classList.add('active'); });
  }, { threshold: 0.15 });
  obs.observe(el);
});

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href');
    if (id.length > 1) {
      e.preventDefault();
      const t = document.querySelector(id);
      if (t) t.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});
