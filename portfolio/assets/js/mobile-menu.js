// Mobile menu functionality
class MobileMenu {
  constructor() {
    this.menuToggle = document.getElementById('menu-toggle');
    this.menuClose = document.getElementById('menu-close');
    this.mobileNav = document.getElementById('mobile-nav');
    this.isOpen = false;
    
    this.init();
    this.ensureClosedState();
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
    
    // Remove translate-y-full and clear transform to slide nav up
    this.mobileNav.classList.remove('translate-y-full');
    this.mobileNav.style.transform = '';
    
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
    
    // Force transform and add translate-y-full to slide nav down
    this.mobileNav.style.transform = 'translateY(100%)';
    this.mobileNav.classList.add('translate-y-full');
    
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
    console.log('Mobile nav element:', this.mobileNav);
    console.log('Initial classes:', this.mobileNav?.className);
    
    if (this.mobileNav) {
      // Force immediate style update for Chrome
      this.mobileNav.style.transform = 'translateY(100%)';
      this.mobileNav.classList.add('translate-y-full');
      document.body.style.overflow = '';
      
      console.log('After fix classes:', this.mobileNav.className);
    }
    
    if (this.menuToggle) {
      this.menuToggle.setAttribute('aria-expanded', 'false');
      this.menuToggle.setAttribute('aria-label', 'Open navigation menu');
      this.menuToggle.classList.remove('active');
    }
    
    this.isOpen = false;
  }
}

// Force mobile nav to be hidden immediately on script load (for Chrome compatibility)
const forceHideMobileNav = () => {
  const mobileNav = document.getElementById('mobile-nav');
  if (mobileNav) {
    mobileNav.style.transform = 'translateY(100%)';
    mobileNav.classList.add('translate-y-full');
  }
};

// Try to hide immediately if DOM is already loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', forceHideMobileNav);
} else {
  forceHideMobileNav();
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
  new MobileMenu();
});