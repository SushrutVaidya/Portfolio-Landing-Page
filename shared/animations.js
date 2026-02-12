/*
 * DevQuest Animation Utilities
 * Lightweight JavaScript animations with iOS-inspired smoothness
 * Optimized for low memory usage and 60fps performance
 */

// ============================================
// FADE IN SEQUENCE
// ============================================

/**
 * Fades in elements sequentially with staggered delays
 * @param {NodeList|Array} elements - Elements to animate
 * @param {number} delay - Delay between each element (ms)
 */
function fadeInSequence(elements, delay = 100) {
  elements.forEach((element, index) => {
    if (!element) return; // Skip null elements

    element.style.opacity = '0';
    element.style.transform = 'translateY(-10px)';

    setTimeout(() => {
      element.style.transition = 'opacity 250ms cubic-bezier(0.25, 0.1, 0.25, 1), transform 250ms cubic-bezier(0.25, 0.1, 0.25, 1)';
      element.style.opacity = '1';
      element.style.transform = 'translateY(0)';
    }, index * delay);
  });
}

// ============================================
// SPRING ANIMATION
// ============================================

/**
 * iOS-style spring animation for modals/alerts
 * @param {HTMLElement} element - Element to animate
 * @param {number} duration - Animation duration (ms)
 */
function springIn(element, duration = 250) {
  if (!element) return; // Safety check

  element.classList.remove('hidden'); // Remove hidden class if present
  element.style.display = ''; // Ensure element is visible
  element.style.opacity = '0';
  element.style.transform = 'scale(0.95)';

  requestAnimationFrame(() => {
    element.style.transition = `opacity ${duration}ms cubic-bezier(0.68, -0.55, 0.265, 1.55), transform ${duration}ms cubic-bezier(0.68, -0.55, 0.265, 1.55)`;
    element.style.opacity = '1';
    element.style.transform = 'scale(1)';
  });
}

// ============================================
// SMOOTH HEIGHT TRANSITION
// ============================================

/**
 * Smoothly animate height changes
 * @param {HTMLElement} element - Element to animate
 * @param {number} targetHeight - Target height in pixels
 * @param {number} duration - Animation duration (ms)
 */
function smoothHeight(element, targetHeight, duration = 350) {
  const currentHeight = element.offsetHeight;
  element.style.height = currentHeight + 'px';
  element.style.overflow = 'hidden';

  requestAnimationFrame(() => {
    element.style.transition = `height ${duration}ms cubic-bezier(0.4, 0.0, 0.2, 1)';
    element.style.height = targetHeight + 'px';

    setTimeout(() => {
      element.style.height = '';
      element.style.overflow = '';
    }, duration);
  });
}

// ============================================
// SHAKE ANIMATION
// ============================================

/**
 * Shake animation for error states
 * @param {HTMLElement} element - Element to shake
 */
function shake(element) {
  if (!element) return; // Safety check

  element.style.animation = 'none';

  requestAnimationFrame(() => {
    element.style.animation = 'shake 350ms cubic-bezier(0.4, 0.0, 0.2, 1)';

    setTimeout(() => {
      element.style.animation = '';
    }, 350);
  });
}

// ============================================
// RIPPLE EFFECT
// ============================================

/**
 * Material-inspired ripple effect on click
 * @param {Event} event - Click event
 * @param {HTMLElement} element - Element to add ripple to
 */
function createRipple(event, element) {
  const ripple = document.createElement('span');
  const diameter = Math.max(element.clientWidth, element.clientHeight);
  const radius = diameter / 2;

  const rect = element.getBoundingClientRect();
  const x = event.clientX - rect.left - radius;
  const y = event.clientY - rect.top - radius;

  ripple.style.width = ripple.style.height = `${diameter}px`;
  ripple.style.left = `${x}px`;
  ripple.style.top = `${y}px`;
  ripple.style.position = 'absolute';
  ripple.style.borderRadius = '50%';
  ripple.style.background = 'rgba(9, 105, 218, 0.4)';
  ripple.style.transform = 'scale(0)';
  ripple.style.animation = 'ripple 600ms ease-out';
  ripple.style.pointerEvents = 'none';

  // Ensure element has position context
  if (getComputedStyle(element).position === 'static') {
    element.style.position = 'relative';
  }

  element.style.overflow = 'hidden';
  element.appendChild(ripple);

  setTimeout(() => {
    ripple.remove();
  }, 600);
}

// Add ripple keyframes dynamically
if (!document.querySelector('#ripple-keyframes')) {
  const style = document.createElement('style');
  style.id = 'ripple-keyframes';
  style.textContent = `
    @keyframes ripple {
      to {
        transform: scale(4);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(style);
}

// ============================================
// BACKGROUND EFFECTS MANAGER
// ============================================

class BackgroundEffects {
  constructor() {
    this.particlePool = [];
    this.activeParticles = [];
    this.maxParticles = 20;
    this.isVisible = !document.hidden;
    this.symbols = ['{', '}', '[', ']', '<', '>', '(', ')', ';', ':', '=', '+', '-'];

    // Pause animations when tab is hidden
    document.addEventListener('visibilitychange', () => {
      this.isVisible = !document.hidden;
      if (!this.isVisible) {
        this.pauseAnimations();
      } else {
        this.resumeAnimations();
      }
    });
  }

  /**
   * Create lightweight particle system with object pooling
   * @param {number} count - Number of particles
   * @param {HTMLElement} container - Container element
   */
  createParticles(count = 15, container = document.body) {
    // Create or find particle container
    let particleContainer = document.querySelector('.background-particles');
    if (!particleContainer) {
      particleContainer = document.createElement('div');
      particleContainer.className = 'background-particles';
      container.appendChild(particleContainer);
    }

    // Limit particles
    const particleCount = Math.min(count, this.maxParticles);

    for (let i = 0; i < particleCount; i++) {
      setTimeout(() => {
        this.spawnParticle(particleContainer);
      }, i * 1000); // Stagger spawn
    }
  }

  spawnParticle(container) {
    if (!this.isVisible) return;

    // Reuse particle from pool or create new one
    let particle = this.particlePool.pop();

    if (!particle) {
      particle = document.createElement('div');
      particle.className = 'particle';
    }

    // Random symbol
    particle.textContent = this.symbols[Math.floor(Math.random() * this.symbols.length)];

    // Random position
    particle.style.left = Math.random() * 100 + '%';
    particle.style.bottom = '-50px';

    // Random animation duration (20-30s)
    const duration = 20 + Math.random() * 10;
    particle.style.animationDuration = duration + 's';

    // Random delay
    particle.style.animationDelay = Math.random() * 5 + 's';

    container.appendChild(particle);
    this.activeParticles.push(particle);

    // Return to pool after animation
    setTimeout(() => {
      if (particle.parentElement) {
        particle.parentElement.removeChild(particle);
      }
      const index = this.activeParticles.indexOf(particle);
      if (index > -1) {
        this.activeParticles.splice(index, 1);
      }
      this.particlePool.push(particle);

      // Respawn if still visible
      if (this.isVisible) {
        this.spawnParticle(container);
      }
    }, (duration + 5) * 1000);
  }

  pauseAnimations() {
    this.activeParticles.forEach(particle => {
      particle.style.animationPlayState = 'paused';
    });
  }

  resumeAnimations() {
    this.activeParticles.forEach(particle => {
      particle.style.animationPlayState = 'running';
    });
  }

  destroy() {
    const container = document.querySelector('.background-particles');
    if (container) {
      container.remove();
    }
    this.activeParticles = [];
    this.particlePool = [];
  }
}

// ============================================
// SMOOTH SCROLL
// ============================================

/**
 * Smooth scroll to target element
 * @param {string|HTMLElement} target - Target element or selector
 * @param {number} duration - Animation duration (ms)
 */
function smoothScrollTo(target, duration = 500) {
  const targetElement = typeof target === 'string' ? document.querySelector(target) : target;
  if (!targetElement) return;

  const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
  const startPosition = window.pageYOffset;
  const distance = targetPosition - startPosition;
  let startTime = null;

  function animation(currentTime) {
    if (startTime === null) startTime = currentTime;
    const timeElapsed = currentTime - startTime;
    const progress = Math.min(timeElapsed / duration, 1);

    // Easing function (ease-in-out)
    const ease = progress < 0.5
      ? 4 * progress * progress * progress
      : 1 - Math.pow(-2 * progress + 2, 3) / 2;

    window.scrollTo(0, startPosition + distance * ease);

    if (timeElapsed < duration) {
      requestAnimationFrame(animation);
    }
  }

  requestAnimationFrame(animation);
}

// ============================================
// TYPEWRITER EFFECT
// ============================================

/**
 * Typewriter effect for text
 * @param {HTMLElement} element - Element to type into
 * @param {string} text - Text to type
 * @param {number} speed - Typing speed (ms per character)
 */
function typewriter(element, text, speed = 50) {
  element.textContent = '';
  let index = 0;

  function type() {
    if (index < text.length) {
      element.textContent += text.charAt(index);
      index++;
      setTimeout(type, speed);
    }
  }

  type();
}

// ============================================
// INTERSECTION OBSERVER FOR LAZY ANIMATIONS
// ============================================

/**
 * Animate elements when they enter viewport
 * @param {string} selector - CSS selector for elements
 * @param {string} animationClass - Class to add when visible
 */
function animateOnScroll(selector, animationClass = 'animate-fadeIn') {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add(animationClass);
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '50px'
  });

  document.querySelectorAll(selector).forEach(element => {
    observer.observe(element);
  });
}

// ============================================
// COPY TO CLIPBOARD WITH FEEDBACK
// ============================================

/**
 * Copy text to clipboard with visual feedback
 * @param {string} text - Text to copy
 * @param {HTMLElement} button - Button element for feedback
 */
async function copyToClipboard(text, button = null) {
  try {
    await navigator.clipboard.writeText(text);

    if (button) {
      const originalText = button.textContent;
      button.textContent = '✓ Copied!';
      button.style.color = 'var(--color-syntax-string)';

      setTimeout(() => {
        button.textContent = originalText;
        button.style.color = '';
      }, 2000);
    }

    return true;
  } catch (err) {
    console.error('Failed to copy:', err);
    return false;
  }
}

// ============================================
// LOADING STATE MANAGER
// ============================================

/**
 * Toggle loading state on button
 * @param {HTMLElement} button - Button element
 * @param {boolean} isLoading - Loading state
 */
function setButtonLoading(button, isLoading) {
  if (!button) return; // Safety check

  if (isLoading) {
    button.disabled = true;
    button.classList.add('btn-loading');
    button.dataset.originalText = button.textContent;
  } else {
    button.disabled = false;
    button.classList.remove('btn-loading');
    if (button.dataset.originalText) {
      button.textContent = button.dataset.originalText;
      delete button.dataset.originalText;
    }
  }
}

// ============================================
// EXPORTS (if using modules)
// ============================================

// For vanilla JS, functions are globally available
// If using modules, uncomment:
/*
export {
  fadeInSequence,
  springIn,
  smoothHeight,
  shake,
  createRipple,
  BackgroundEffects,
  smoothScrollTo,
  typewriter,
  animateOnScroll,
  copyToClipboard,
  setButtonLoading
};
*/
