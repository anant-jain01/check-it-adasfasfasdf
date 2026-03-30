// Initialize interactive behaviors

// Header scroll effect with enhanced animation
function initScrollEffects() {
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const currentScroll = window.scrollY;
    const header = document.getElementById('header');

    if (header) {
      header.classList.toggle('scrolled', currentScroll > 60);

      if (currentScroll > lastScroll && currentScroll > 300) {
        header.classList.add('header-hidden');
      } else {
        header.classList.remove('header-hidden');
      }
    }

    lastScroll = currentScroll;

    document.querySelectorAll('.parallax-img').forEach((el) => {
      const speed = Number(el.dataset.speed || 0.5);
      const yPos = -(currentScroll * speed);
      el.style.transform = `translateY(${yPos}px)`;
    });
  });
}

// Enhanced scroll reveal with stagger effects
function initScrollReveal() {
  if (!('IntersectionObserver' in window)) {
    document
      .querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-up, .reveal-scale')
      .forEach((el) => el.classList.add('active'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          const children = entry.target.querySelectorAll('.stagger-child');
          children.forEach((child, index) => {
            setTimeout(() => child.classList.add('active'), index * 100);
          });
        }
      });
    },
    { threshold: 0.08, rootMargin: '0px 0px -30px 0px' }
  );

  document
    .querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-up, .reveal-scale')
    .forEach((el) => observer.observe(el));
}

function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function onClick(e) {
      const href = this.getAttribute('href');
      if (!href || href.length <= 1) return;

      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();
      const headerOffset = 100;
      const elementPosition = target.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    });
  });
}

// Video caption animation for services page
function initVideoCaptionAnimation() {
  const videoElement = document.getElementById('goals-video');
  const captionWord = document.getElementById('caption-word');

  if (!videoElement || !captionWord) return;

  const captions = [
    { word: 'travel', start: 0, end: 3 },
    { word: 'marriage', start: 4, end: 9 },
    { word: 'family', start: 10, end: 18 },
    { word: 'travel', start: 19, end: 23 },
    { word: 'retirement', start: 25, end: 28 },
  ];

  videoElement.addEventListener('timeupdate', () => {
    const currentTime = Math.floor(videoElement.currentTime);

    captions.forEach((caption) => {
      if (currentTime >= caption.start && currentTime <= caption.end && captionWord.textContent !== caption.word) {
        captionWord.classList.remove('active');
        setTimeout(() => {
          captionWord.textContent = caption.word;
          captionWord.classList.add('active');
        }, 250);
      }
    });
  });
}

function animateCounter(element) {
  const target = Number.parseInt(element.getAttribute('data-target') || '0', 10);
  if (!target) return;

  const duration = 2000;
  const step = target / (duration / 16);
  let current = 0;

  const timer = setInterval(() => {
    current += step;
    if (current >= target) {
      element.textContent = target.toLocaleString('en-IN');
      clearInterval(timer);
    } else {
      element.textContent = Math.floor(current).toLocaleString('en-IN');
    }
  }, 16);
}

function initCounters() {
  if (!('IntersectionObserver' in window)) {
    document.querySelectorAll('.counter').forEach(animateCounter);
    return;
  }

  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
          animateCounter(entry.target);
          entry.target.classList.add('counted');
        }
      });
    },
    { threshold: 0.5 }
  );

  document.querySelectorAll('.counter').forEach((counter) => counterObserver.observe(counter));
}

function initMagneticButtons() {
  document.querySelectorAll('.btn-magnetic').forEach((btn) => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
    });

    btn.addEventListener('mouseleave', () => {
      btn.style.transform = 'translate(0, 0)';
    });
  });
}

function initContactForm() {
  const contactForm = document.getElementById('contact-form');
  if (!contactForm) return;

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const submitBtn = document.getElementById('submit-contact');
    if (!submitBtn) return;

    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;

    setTimeout(() => {
      submitBtn.textContent = 'Message Sent!';
      setTimeout(() => {
        contactForm.reset();
        submitBtn.textContent = 'Submit Request';
        submitBtn.disabled = false;
      }, 2000);
    }, 1500);
  });
}

function initLazyImages() {
  if (!('IntersectionObserver' in window)) return;

  document.querySelectorAll('img[data-src]').forEach((img) => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const image = entry.target;
          image.src = image.dataset.src;
          image.classList.add('loaded');
          observer.unobserve(image);
        }
      });
    });

    observer.observe(img);
  });
}


function initMobileMenu() {
  // Mobile nav is handled by the slide-in panel in header.html via components.js
  // This function is intentionally left empty to avoid conflicts.
}

document.addEventListener('DOMContentLoaded', () => {
  initScrollEffects();
  initScrollReveal();
  initSmoothScroll();
  initVideoCaptionAnimation();
  initCounters();
  initMagneticButtons();
  initContactForm();
  initLazyImages();
});
