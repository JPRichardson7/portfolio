// Mobile menu functionality
class MobileMenu {
  constructor() {
    debugLog('MobileMenu constructor called');

    this.isDesktop = window.innerWidth >= 1024;
    this.menuToggle = document.getElementById('menu-toggle');
    this.menuClose = document.getElementById('menu-close');
    this.mobileNav = document.getElementById('mobile-nav');
    this.isOpen = false;

    debugLog('Elements found', {
      isDesktop: this.isDesktop,
      menuToggle: !!this.menuToggle,
      menuClose: !!this.menuClose,
      mobileNav: !!this.mobileNav
    });

    // Don't initialize on desktop
    if (this.isDesktop) {
      debugLog('Desktop detected, skipping mobile menu initialization');
      return;
    }

    this.init();
    this.ensureClosedState();
    this.setupMutationObserver();
  }
  
  init() {
    // Handle menu button click
    this.menuToggle?.addEventListener('click', () => this.toggleMenu());
    
    // Handle close button click
    this.menuClose?.addEventListener('click', () => this.closeMenu());
    
    // Close on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) {
        this.closeMenu();
      }
    });
  }
  
  toggleMenu() {
    if (this.isOpen) {
      this.closeMenu();
    } else {
      this.openMenu();
    }
  }
  
  openMenu() {
    this.isOpen = true;

    debugLog('Opening menu');

    // Ensure nav is visible and positioned correctly
    this.mobileNav.style.display = '';
    this.mobileNav.style.visibility = '';
    this.mobileNav.style.opacity = '';

    // Remove translate-y-full and clear transform to slide nav up
    this.mobileNav.classList.remove('translate-y-full');
    this.mobileNav.style.transform = '';

    debugLog('Menu opened', {
      display: window.getComputedStyle(this.mobileNav).display,
      transform: window.getComputedStyle(this.mobileNav).transform,
      classList: this.mobileNav.className
    });

    // Update button states
    this.menuToggle.setAttribute('aria-expanded', 'true');
    this.menuToggle.setAttribute('aria-label', 'Close navigation menu');

    // Add active class for arrow animation
    this.menuToggle.classList.add('active');

    // Prevent body scroll
    document.body.style.overflow = 'hidden';
  }
  
  closeMenu() {
    this.isOpen = false;

    debugLog('Closing menu');

    // Force transform and add translate-y-full to slide nav down
    this.mobileNav.style.transform = 'translateY(100%)';
    this.mobileNav.classList.add('translate-y-full');

    debugLog('Menu closed', {
      transform: window.getComputedStyle(this.mobileNav).transform,
      classList: this.mobileNav.className
    });

    // Update button states
    this.menuToggle.setAttribute('aria-expanded', 'false');
    this.menuToggle.setAttribute('aria-label', 'Open navigation menu');

    // Remove active class
    this.menuToggle.classList.remove('active');

    // Restore body scroll
    document.body.style.overflow = '';
  }

  ensureClosedState() {
    // Force menu to closed state on initialization
    // This fixes Chrome-specific issues where the menu might appear open initially
    debugLog('ensureClosedState called');

    if (this.mobileNav) {
      const beforeStyles = {
        display: window.getComputedStyle(this.mobileNav).display,
        transform: window.getComputedStyle(this.mobileNav).transform,
        visibility: window.getComputedStyle(this.mobileNav).visibility,
        opacity: window.getComputedStyle(this.mobileNav).opacity,
        classList: this.mobileNav.className
      };

      debugLog('Mobile nav before ensureClosedState', beforeStyles);

      // Force immediate style update for Chrome
      this.mobileNav.style.transform = 'translateY(100%)';
      this.mobileNav.classList.add('translate-y-full');
      document.body.style.overflow = '';

      const afterStyles = {
        display: window.getComputedStyle(this.mobileNav).display,
        transform: window.getComputedStyle(this.mobileNav).transform,
        visibility: window.getComputedStyle(this.mobileNav).visibility,
        opacity: window.getComputedStyle(this.mobileNav).opacity,
        classList: this.mobileNav.className
      };

      debugLog('Mobile nav after ensureClosedState', afterStyles);
    }

    if (this.menuToggle) {
      this.menuToggle.setAttribute('aria-expanded', 'false');
      this.menuToggle.setAttribute('aria-label', 'Open navigation menu');
      this.menuToggle.classList.remove('active');
    }

    this.isOpen = false;
  }

  setupMutationObserver() {
    if (!this.mobileNav) return;

    debugLog('Setting up MutationObserver on mobile nav');

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes') {
          const styles = {
            display: window.getComputedStyle(this.mobileNav).display,
            transform: window.getComputedStyle(this.mobileNav).transform,
            classList: this.mobileNav.className,
            attributeChanged: mutation.attributeName
          };
          debugLog('Mobile nav attribute changed', styles);
        }
      });
    });

    observer.observe(this.mobileNav, {
      attributes: true,
      attributeFilter: ['class', 'style']
    });
  }
}

// Debug logging helper
const debugLog = (message, data = {}) => {
  const timestamp = performance.now().toFixed(2);
  const windowWidth = window.innerWidth;
  console.log(`[${timestamp}ms] [${windowWidth}px] ${message}`, data);
};

// Force mobile nav to be hidden immediately on script load (for Chrome compatibility)
const forceHideMobileNav = () => {
  debugLog('forceHideMobileNav called', { readyState: document.readyState });

  const mobileNav = document.getElementById('mobile-nav');
  const isDesktop = window.innerWidth >= 1024;

  if (mobileNav) {
    const beforeStyles = {
      display: window.getComputedStyle(mobileNav).display,
      transform: window.getComputedStyle(mobileNav).transform,
      visibility: window.getComputedStyle(mobileNav).visibility,
      classList: mobileNav.className
    };

    if (isDesktop) {
      // Desktop: force hide
      mobileNav.style.cssText = 'display: none !important; visibility: hidden !important; opacity: 0 !important; pointer-events: none !important;';
      debugLog('Desktop: Mobile nav force hidden');
    } else {
      // Mobile: just ensure it's translated off-screen
      mobileNav.style.transform = 'translateY(100%)';
      if (!mobileNav.classList.contains('translate-y-full')) {
        mobileNav.classList.add('translate-y-full');
      }
      if (!mobileNav.classList.contains('transition-transform')) {
        mobileNav.classList.add('transition-transform', 'duration-300', 'ease-in-out');
      }
      debugLog('Mobile: Mobile nav translated off-screen');
    }

    const afterStyles = {
      display: window.getComputedStyle(mobileNav).display,
      transform: window.getComputedStyle(mobileNav).transform,
      visibility: window.getComputedStyle(mobileNav).visibility,
      classList: mobileNav.className
    };

    debugLog('Mobile nav forced hidden', { before: beforeStyles, after: afterStyles });
  } else {
    debugLog('Mobile nav element not found yet');
  }
};

// Monitor page visibility changes
document.addEventListener('visibilitychange', () => {
  debugLog('Page visibility changed', { hidden: document.hidden });
});

// Monitor when page becomes interactive
debugLog('Script loaded', { readyState: document.readyState });

// Check if mobile nav is visible every 100ms for the first 2 seconds
let checkCount = 0;
const maxChecks = 20;
const visibilityChecker = setInterval(() => {
  checkCount++;
  const mobileNav = document.getElementById('mobile-nav');

  if (mobileNav) {
    const rect = mobileNav.getBoundingClientRect();
    const computedStyle = window.getComputedStyle(mobileNav);
    const isVisible = rect.top < window.innerHeight && rect.bottom > 0 && computedStyle.display !== 'none';

    if (isVisible) {
      debugLog('🔴 MOBILE NAV IS VISIBLE!', {
        top: rect.top,
        bottom: rect.bottom,
        windowHeight: window.innerHeight,
        display: computedStyle.display,
        transform: computedStyle.transform,
        classList: mobileNav.className
      });
    }
  }

  if (checkCount >= maxChecks) {
    clearInterval(visibilityChecker);
    debugLog('Visibility checker stopped after 2 seconds');
  }
}, 100);

// Try to hide immediately if DOM is already loaded
if (document.readyState === 'loading') {
  debugLog('DOM still loading, adding DOMContentLoaded listener');
  document.addEventListener('DOMContentLoaded', forceHideMobileNav);
} else {
  debugLog('DOM already loaded, forcing hide immediately');
  forceHideMobileNav();
}

// Track page load events
window.addEventListener('load', () => {
  debugLog('window.load event fired (all resources loaded)');
});

// Track when CSS is applied
document.addEventListener('readystatechange', () => {
  debugLog('readystatechange', { readyState: document.readyState });
});

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
  debugLog('DOMContentLoaded fired, initializing MobileMenu');
  new MobileMenu();
});