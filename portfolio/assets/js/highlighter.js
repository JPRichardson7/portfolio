---
---
// Highlighter randomization utility
function randomizeHighlights() {
  const highlights = document.querySelectorAll('.highlight-marker');
  
  highlights.forEach(highlight => {
    // Random skew between -12deg and -4deg (keeps the left-leaning look)
    const skew = Math.random() * -8 - 4;
    
    // Random rotation between -0.9deg and +0.9deg
    const rotate = Math.random() * 1.8 - 0.9;
    
    // Random border-radius values (5px to 15px for organic look)
    const r1 = Math.floor(Math.random() * 10) + 5;
    const r2 = Math.floor(Math.random() * 10) + 5;
    const r3 = Math.floor(Math.random() * 10) + 5;
    const r4 = Math.floor(Math.random() * 10) + 5;
    
    // Apply random values via CSS custom properties
    highlight.style.setProperty(
      '--highlight-transform', 
      `skew(${skew}deg) rotate(${rotate}deg)`
    );
    highlight.style.setProperty(
      '--highlight-radius', 
      `${r1}px ${r2}px ${r3}px ${r4}px`
    );
  });
}

// Auto-initialize on page load
document.addEventListener('DOMContentLoaded', randomizeHighlights);

// Export for manual use if needed
window.randomizeHighlights = randomizeHighlights;