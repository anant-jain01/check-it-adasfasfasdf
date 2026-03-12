// Load header and footer
async function loadComponent(elementId, file) {
  try {
    const response = await fetch(file);
    const html = await response.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const component = doc.querySelector('header, footer');
    if (component) {
      document.getElementById(elementId).innerHTML = component.innerHTML;
    }
  } catch (error) {
    console.error(`Error loading ${file}:`, error);
  }
}

// Initialize components
document.addEventListener('DOMContentLoaded', async () => {
  await loadComponent('header-container', 'header.html');
  await loadComponent('footer-container', 'footer.html');
  
  // Set active nav link
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-item').forEach(link => {
    if (link.getAttribute('href') === currentPage) {
      link.classList.add('active');
    }
  });
  
  // Initialize scroll effects
  initScrollEffects();
  initScrollReveal();
  initSmoothScroll();
  
  // Initialize video caption animation if on services page
  if (currentPage === 'services.html') {
    initVideoCaptionAnimation();
  }
});

// Header scroll effect with enhanced animation
function initScrollEffects() {
  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    const currentScroll = window.scrollY;
    const header = document.getElementById('header');
    
    if (header) {
      // Add scrolled class
      header.classList.toggle('scrolled', currentScroll > 60);
      
      // Hide/show on scroll
      if (currentScroll > lastScroll && currentScroll > 300) {
        header.classList.add('header-hidden');
      } else {
        header.classList.remove('header-hidden');
      }
    }
    
    lastScroll = currentScroll;
    
    // Parallax effect for hero images
    const parallaxElements = document.querySelectorAll('.parallax-img');
    parallaxElements.forEach(el => {
      const speed = el.dataset.speed || 0.5;
      const yPos = -(currentScroll * speed);
      el.style.transform = `translateY(${yPos}px)`;
    });
  });
}

// Enhanced scroll reveal with stagger effects
function initScrollReveal() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        
        // Stagger children if they exist
        const children = entry.target.querySelectorAll('.stagger-child');
        children.forEach((child, index) => {
          setTimeout(() => {
            child.classList.add('active');
          }, index * 100);
        });
      }
    });
  }, observerOptions);
  
  // Observe all reveal elements
  document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-up, .reveal-scale').forEach(el => {
    observer.observe(el);
  });
}

// Smooth scroll for anchor links
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href.length > 1) {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          const headerOffset = 100;
          const elementPosition = target.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
          
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      }
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
    { word: 'retirement', start: 25, end: 28 }
  ];
  
  videoElement.addEventListener('timeupdate', () => {
    const currentTime = Math.floor(videoElement.currentTime);
    
    captions.forEach(caption => {
      if (currentTime >= caption.start && currentTime <= caption.end) {
        if (captionWord.textContent !== caption.word) {
          captionWord.classList.remove('active');
          setTimeout(() => {
            captionWord.textContent = caption.word;
            captionWord.classList.add('active');
          }, 300);
        }
      }
    });
  });
  
  // Play video when in viewport
  const videoObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        videoElement.play();
      } else {
        videoElement.pause();
      }
    });
  }, { threshold: 0.5 });
  
  videoObserver.observe(videoElement);
}

// Number counter animation
function animateCounter(element) {
  const target = parseInt(element.getAttribute('data-target'));
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

// Initialize counters when visible
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
      animateCounter(entry.target);
      entry.target.classList.add('counted');
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.counter').forEach(counter => {
  counterObserver.observe(counter);
});

// Magnetic button effect
document.querySelectorAll('.btn-magnetic').forEach(btn => {
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

// Contact form submission
const contactForm = document.getElementById('contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const submitBtn = document.getElementById('submit-contact');
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;
    
    // Simulate form submission
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

// Image lazy loading with fade-in
document.querySelectorAll('img[data-src]').forEach(img => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
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