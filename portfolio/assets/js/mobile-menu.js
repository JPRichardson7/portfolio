// Mobile menu functionality
class MobileMenu {
  constructor() {
    this.menuToggle = document.getElementById('menu-toggle');
    this.menuClose = document.getElementById('menu-close');
    this.mobileNav = document.getElementById('mobile-nav');
    this.isOpen = false;
    
    this.init();
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
    
    // Remove translate-y-full to slide nav up
    this.mobileNav.classList.remove('translate-y-full');
    
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
    
    // Add translate-y-full to slide nav down
    this.mobileNav.classList.add('translate-y-full');
    
    // Update button states
    this.menuToggle.setAttribute('aria-expanded', 'false');
    this.menuToggle.setAttribute('aria-label', 'Open navigation menu');
    
    // Remove active class
    this.menuToggle.classList.remove('active');
    
    // Restore body scroll
    document.body.style.overflow = '';
  }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
  new MobileMenu();
});