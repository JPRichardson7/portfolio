// Portfolio Inline Carousel
document.addEventListener('DOMContentLoaded', function() {
  // Initialize portfolio pieces
  const portfolioPieces = document.querySelectorAll('.portfolio-piece');

  // Helper to check if we're on desktop (lg breakpoint = 1024px)
  function isDesktop() {
    return window.matchMedia('(min-width: 1024px)').matches;
  }

  portfolioPieces.forEach(piece => {
    const imageContainer = piece.querySelector('.portfolio-image-container');
    const toggleBtn = piece.querySelector('.portfolio-toggle-btn');
    const content = piece.querySelector('.portfolio-piece-content');
    const dividerContainer = piece.querySelector('.portfolio-divider-container');
    const filmstrip = piece.querySelector('.portfolio-filmstrip');

    if (!imageContainer) return;

    // Get carousel images from data attribute
    let carouselImages = [];
    if (imageContainer.dataset.carouselImages) {
      try {
        carouselImages = JSON.parse(imageContainer.dataset.carouselImages);
        console.log('Carousel images loaded:', carouselImages);
      } catch (e) {
        console.error('Failed to parse carousel images:', e);
      }
    }

    // Track expanded state for content (mobile only)
    let isExpanded = false;
    let controls = null;
    let currentIndex = 0;

    // Setup inline carousel if multiple images exist
    if (carouselImages.length > 1) {
      let touchStartX = 0;
      let touchEndX = 0;

      // Create carousel controls (hidden initially for mobile)
      controls = document.createElement('div');
      controls.className = 'carousel-controls';
      controls.style.display = 'none';
      controls.innerHTML = `
        <div class="carousel-dots"></div>
      `;
      imageContainer.appendChild(controls);
      console.log('Carousel controls created for', carouselImages.length, 'images');

      const dotsContainer = controls.querySelector('.carousel-dots');

      // Create dots
      carouselImages.forEach((_, i) => {
        const dot = document.createElement('span');
        dot.className = 'carousel-dot';
        dot.addEventListener('click', (e) => {
          e.stopPropagation();
          showImage(i);
        });
        dotsContainer.appendChild(dot);
      });

      function showImage(index) {
        if (index < 0 || index >= carouselImages.length) return;
        currentIndex = index;

        // Update image src
        const imgData = carouselImages[index];
        console.log('Showing image', index, ':', imgData);

        // Find the current picture or img element
        const currentPictureOrImg = imageContainer.querySelector('picture') || imageContainer.querySelector('.portfolio-image');

        if (currentPictureOrImg) {
          // Create a new simple img element
          const newImg = document.createElement('img');
          newImg.className = 'portfolio-image w-full h-full transition-all duration-300';

          // Apply correct object-fit based on device type and expanded state
          if (isDesktop()) {
            // Desktop: always use object-contain (fit)
            newImg.classList.add('object-contain');
          } else {
            // Mobile: use object-fit based on expanded state
            if (isExpanded) {
              newImg.classList.add('object-contain');
            } else {
              newImg.classList.add('object-cover');
            }
          }

          newImg.src = imgData.src;
          newImg.alt = imgData.alt || '';

          // Replace the picture/img element
          currentPictureOrImg.replaceWith(newImg);
          console.log('Image replaced with:', imgData.src, 'desktop:', isDesktop());
        }

        // Update dots (mobile)
        const dots = dotsContainer.querySelectorAll('.carousel-dot');
        dots.forEach((dot, i) => {
          dot.classList.toggle('active', i === currentIndex);
        });

        // Update filmstrip thumbnails (desktop)
        if (filmstrip) {
          const thumbs = filmstrip.querySelectorAll('.filmstrip-thumb');
          thumbs.forEach((thumb, i) => {
            if (i === currentIndex) {
              thumb.classList.add('border-light-blue', 'border-opacity-100');
              thumb.classList.remove('border-transparent');
            } else {
              thumb.classList.remove('border-light-blue', 'border-opacity-100');
              thumb.classList.add('border-transparent');
            }
          });
        }
      }

      function nextImage() {
        const newIndex = (currentIndex + 1) % carouselImages.length;
        showImage(newIndex);
      }

      function prevImage() {
        const newIndex = (currentIndex - 1 + carouselImages.length) % carouselImages.length;
        showImage(newIndex);
      }

      // Click image to toggle expanded state (mobile only)
      imageContainer.addEventListener('click', function(e) {
        // Don't toggle if clicking on carousel controls (dots)
        if (e.target.closest('.carousel-controls')) {
          return;
        }
        // Only toggle on mobile
        if (!isDesktop()) {
          toggleExpandedState();
        }
      });

      // Filmstrip click handlers (desktop only)
      if (filmstrip) {
        const filmstripThumbs = filmstrip.querySelectorAll('.filmstrip-thumb');
        filmstripThumbs.forEach((thumb, index) => {
          thumb.addEventListener('click', function() {
            if (isDesktop()) {
              showImage(index);
            }
          });
        });
      }

      // Touch swipe support (only when expanded)
      imageContainer.addEventListener('touchstart', function(e) {
        if (!isExpanded) return;
        touchStartX = e.changedTouches[0].screenX;
      }, { passive: true });

      imageContainer.addEventListener('touchend', function(e) {
        if (!isExpanded) return;
        touchEndX = e.changedTouches[0].screenX;
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;

        if (Math.abs(diff) > swipeThreshold) {
          if (diff > 0) {
            nextImage();
          } else {
            prevImage();
          }
        }
      }, { passive: true });

      // Initialize first image
      showImage(0);
    }

    // Unified toggle function for carousel + content
    function toggleExpandedState() {
      isExpanded = !isExpanded;
      console.log('Toggling expanded state to:', isExpanded);

      if (isExpanded) {
        // Expand: show carousel controls, switch to contain, show content
        if (controls) {
          controls.style.display = 'flex';
        }

        // Get current image (it may have been replaced by carousel)
        const currentImg = imageContainer.querySelector('img');
        if (currentImg) {
          currentImg.classList.remove('object-cover');
          currentImg.classList.add('object-contain');
        }

        if (content) {
          content.style.maxHeight = content.scrollHeight + 'px';
          if (dividerContainer) {
            content.parentNode.insertBefore(dividerContainer, content.nextSibling);
          }
        }

        if (toggleBtn) {
          toggleBtn.textContent = 'Read Less';
        }
      } else {
        // Collapse: hide carousel controls, switch to cover, hide content
        if (controls) {
          controls.style.display = 'none';
        }

        // Get current image (it may have been replaced by carousel)
        const currentImg = imageContainer.querySelector('img');
        if (currentImg) {
          currentImg.classList.remove('object-contain');
          currentImg.classList.add('object-cover');
        }

        if (content) {
          content.style.maxHeight = '0';
          if (dividerContainer) {
            content.parentNode.insertBefore(dividerContainer, content);
          }
        }

        if (toggleBtn) {
          toggleBtn.textContent = 'Read More';
        }
      }
    }

    // Button click - toggle expanded state
    if (toggleBtn) {
      toggleBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        toggleExpandedState();
      });
    }

    // If no carousel, clicking image should still toggle content (mobile only)
    if (carouselImages.length <= 1) {
      imageContainer.addEventListener('click', function() {
        if (!isDesktop()) {
          toggleExpandedState();
        }
      });
    }

    // On desktop, ensure main image is always object-contain
    function handleResize() {
      const currentImg = imageContainer.querySelector('img');
      if (currentImg && isDesktop()) {
        currentImg.classList.remove('object-cover');
        currentImg.classList.add('object-contain');
      }
    }

    // Listen for resize events
    window.addEventListener('resize', handleResize);

    // Initial check
    handleResize();
  });
});
