// Portfolio piece expand/collapse functionality
document.addEventListener('DOMContentLoaded', function() {
  const portfolioPieces = document.querySelectorAll('.portfolio-piece');

  portfolioPieces.forEach(piece => {
    const imageContainer = piece.querySelector('.portfolio-image-container');
    const image = piece.querySelector('.portfolio-image');
    const toggleBtn = piece.querySelector('.portfolio-toggle-btn');
    const dividerContainer = piece.querySelector('.portfolio-divider-container');
    const content = piece.querySelector('.portfolio-piece-content');

    if (!toggleBtn || !image) return;

    // Track expanded state
    let isExpanded = false;

    // Click handler for button and image
    const toggleExpand = function() {
      isExpanded = !isExpanded;

      if (isExpanded) {
        // Expand: switch to contain, show content, move divider after content
        image.classList.remove('object-cover');
        image.classList.add('object-contain');

        if (content) {
          content.style.maxHeight = content.scrollHeight + 'px';
          // Move divider after content
          if (dividerContainer) {
            content.parentNode.insertBefore(dividerContainer, content.nextSibling);
          }
        }

        toggleBtn.textContent = 'Read Less';
      } else {
        // Collapse: switch to cover, hide content, move divider before content
        image.classList.remove('object-contain');
        image.classList.add('object-cover');

        if (content) {
          content.style.maxHeight = '0';
          // Move divider before content
          if (dividerContainer) {
            content.parentNode.insertBefore(dividerContainer, content);
          }
        }

        toggleBtn.textContent = 'Read More';
      }
    };

    toggleBtn.addEventListener('click', toggleExpand);
    if (imageContainer) {
      imageContainer.addEventListener('click', toggleExpand);
    }
  });
});
