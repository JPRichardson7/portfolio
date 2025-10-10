// Portfolio Inline Carousel
document.addEventListener('DOMContentLoaded', function() {
  // Initialize portfolio pieces
  const portfolioPieces = document.querySelectorAll('.portfolio-piece');

  // Helper to check if we're on desktop (lg breakpoint = 1024px)
  function isDesktop() {
    return window.matchMedia('(min-width: 1024px)').matches;
  }

  // Create lightbox modal (shared for all portfolio pieces)
  const lightbox = document.createElement('div');
  lightbox.className = 'portfolio-lightbox';
  lightbox.innerHTML = `
    <div class="lightbox-backdrop"></div>
    <div class="lightbox-content">
      <button class="lightbox-close" aria-label="Close lightbox">&times;</button>
      <button class="lightbox-prev" aria-label="Previous image">&lsaquo;</button>
      <img class="lightbox-image" src="" alt="">
      <button class="lightbox-next" aria-label="Next image">&rsaquo;</button>
      <div class="lightbox-dots-container">
        <div class="carousel-dots"></div>
      </div>
    </div>
  `;
  document.body.appendChild(lightbox);

  const lightboxImg = lightbox.querySelector('.lightbox-image');
  const lightboxClose = lightbox.querySelector('.lightbox-close');
  const lightboxPrev = lightbox.querySelector('.lightbox-prev');
  const lightboxNext = lightbox.querySelector('.lightbox-next');
  const lightboxDotsContainer = lightbox.querySelector('.carousel-dots');
  let lightboxImages = [];
  let lightboxCurrentIndex = 0;
  let lightboxCallback = null;

  function openLightbox(images, startIndex, onIndexChange) {
    lightboxImages = images;
    lightboxCurrentIndex = startIndex;
    lightboxCallback = onIndexChange;

    // Clear and recreate dots
    lightboxDotsContainer.innerHTML = '';
    if (images.length > 1) {
      images.forEach((_, i) => {
        const dot = document.createElement('span');
        dot.className = 'carousel-dot';
        dot.addEventListener('click', (e) => {
          e.stopPropagation();
          showLightboxImage(i);
        });
        lightboxDotsContainer.appendChild(dot);
      });
    }

    showLightboxImage(startIndex);
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  function showLightboxImage(index) {
    if (index < 0 || index >= lightboxImages.length) return;
    lightboxCurrentIndex = index;
    const imgData = lightboxImages[index];
    lightboxImg.src = imgData.src;
    lightboxImg.alt = imgData.alt || '';

    // Update dots
    const dots = lightboxDotsContainer.querySelectorAll('.carousel-dot');
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === index);
    });

    // Update prev/next button visibility
    lightboxPrev.style.display = lightboxImages.length > 1 ? 'block' : 'none';
    lightboxNext.style.display = lightboxImages.length > 1 ? 'block' : 'none';

    // Notify parent to update filmstrip
    if (lightboxCallback) {
      lightboxCallback(index);
    }
  }

  function nextLightboxImage() {
    const newIndex = (lightboxCurrentIndex + 1) % lightboxImages.length;
    showLightboxImage(newIndex);
  }

  function prevLightboxImage() {
    const newIndex = (lightboxCurrentIndex - 1 + lightboxImages.length) % lightboxImages.length;
    showLightboxImage(newIndex);
  }

  // Lightbox event listeners
  lightboxClose.addEventListener('click', closeLightbox);
  lightbox.querySelector('.lightbox-backdrop').addEventListener('click', closeLightbox);

  // Click on content container (but not its children) also closes
  const lightboxContentContainer = lightbox.querySelector('.lightbox-content');
  lightboxContentContainer.addEventListener('click', (e) => {
    // Only close if clicking the container itself, not its children
    if (e.target === lightboxContentContainer) {
      closeLightbox();
    }
  });

  lightboxPrev.addEventListener('click', (e) => {
    e.stopPropagation();
    prevLightboxImage();
  });
  lightboxNext.addEventListener('click', (e) => {
    e.stopPropagation();
    nextLightboxImage();
  });

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;

    if (e.key === 'Escape') {
      closeLightbox();
    } else if (e.key === 'ArrowLeft') {
      prevLightboxImage();
    } else if (e.key === 'ArrowRight') {
      nextLightboxImage();
    }
  });

  portfolioPieces.forEach(piece => {
    const imageContainers = piece.querySelectorAll('.portfolio-image-container');
    const toggleBtn = piece.querySelector('.portfolio-toggle-btn');
    const content = piece.querySelector('.portfolio-piece-content');
    const dividerContainer = piece.querySelector('.portfolio-divider-container');
    const filmstrip = piece.querySelector('.portfolio-filmstrip');

    if (imageContainers.length === 0) return;

    // Helper to get the active image container based on viewport
    function getActiveImageContainer() {
      if (isDesktop()) {
        // On desktop, return the desktop container (skip first mobile one)
        return imageContainers[1] || imageContainers[0];
      } else {
        // On mobile, return the first (mobile) container
        return imageContainers[0];
      }
    }

    // Get carousel images from data attribute (check all containers)
    let carouselImages = [];
    for (let container of imageContainers) {
      if (container.dataset.carouselImages) {
        try {
          carouselImages = JSON.parse(container.dataset.carouselImages);
          console.log('Carousel images loaded:', carouselImages);
          break;
        } catch (e) {
          console.error('Failed to parse carousel images:', e);
        }
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
      // Append controls to all containers
      imageContainers.forEach(container => {
        const controlsClone = controls.cloneNode(true);
        container.appendChild(controlsClone);
      });
      console.log('Carousel controls created for', carouselImages.length, 'images');

      // Create dots in all controls
      imageContainers.forEach(container => {
        const containerControls = container.querySelector('.carousel-controls');
        if (containerControls) {
          const dotsContainer = containerControls.querySelector('.carousel-dots');
          carouselImages.forEach((_, i) => {
            const dot = document.createElement('span');
            dot.className = 'carousel-dot';
            dot.addEventListener('click', (e) => {
              e.stopPropagation();
              showImage(i);
            });
            dotsContainer.appendChild(dot);
          });
        }
      });

      function showImage(index) {
        if (index < 0 || index >= carouselImages.length) return;
        currentIndex = index;

        // Update image src
        const imgData = carouselImages[index];
        console.log('Showing image', index, ':', imgData);

        // Update image in ALL containers (both mobile and desktop)
        imageContainers.forEach(container => {
          // Find the current picture or img element
          const currentPictureOrImg = container.querySelector('picture') || container.querySelector('.portfolio-image');

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

            newImg.alt = imgData.alt || '';

            // Start invisible
            newImg.style.opacity = '0';

            // Insert new image before old one
            currentPictureOrImg.parentNode.insertBefore(newImg, currentPictureOrImg);

            // Set src after inserting to trigger load
            newImg.src = imgData.src;

            // When loaded, fade in new image and remove old one
            newImg.onload = function() {
              newImg.style.opacity = '1';
              // Give a tiny delay to ensure the new image is painted
              setTimeout(() => {
                currentPictureOrImg.remove();
              }, 50);
            };
          }

          // Update dots in this container
          const containerControls = container.querySelector('.carousel-controls');
          if (containerControls) {
            const dots = containerControls.querySelectorAll('.carousel-dot');
            dots.forEach((dot, i) => {
              dot.classList.toggle('active', i === currentIndex);
            });
          }
        });

        console.log('Image replaced with:', imgData.src, 'desktop:', isDesktop());

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

      // Click image handler
      imageContainers.forEach(container => {
        container.addEventListener('click', function(e) {
          // Don't trigger if clicking on carousel controls (dots)
          if (e.target.closest('.carousel-controls')) {
            return;
          }

          if (isDesktop()) {
            // Desktop: open lightbox
            openLightbox(carouselImages, currentIndex, (newIndex) => {
              // Update the main carousel when lightbox changes
              showImage(newIndex);
            });
          } else {
            // Mobile: toggle expanded state
            toggleExpandedState();
          }
        });
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
      imageContainers.forEach(container => {
        container.addEventListener('touchstart', function(e) {
          if (!isExpanded) return;
          touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        container.addEventListener('touchend', function(e) {
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
      });

      // Initialize first image
      showImage(0);
    }

    // Unified toggle function for carousel + content
    function toggleExpandedState() {
      isExpanded = !isExpanded;
      console.log('Toggling expanded state to:', isExpanded);

      if (isExpanded) {
        // Expand: show carousel controls, switch to contain, show content
        imageContainers.forEach(container => {
          const containerControls = container.querySelector('.carousel-controls');
          if (containerControls) {
            containerControls.style.display = 'flex';
          }

          // Get current image (it may have been replaced by carousel)
          const currentImg = container.querySelector('img');
          if (currentImg) {
            currentImg.classList.remove('object-cover');
            currentImg.classList.add('object-contain');
          }
        });

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
        imageContainers.forEach(container => {
          const containerControls = container.querySelector('.carousel-controls');
          if (containerControls) {
            containerControls.style.display = 'none';
          }

          // Get current image (it may have been replaced by carousel)
          const currentImg = container.querySelector('img');
          if (currentImg) {
            currentImg.classList.remove('object-contain');
            currentImg.classList.add('object-cover');
          }
        });

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

    // If no carousel, clicking image should still work
    if (carouselImages.length <= 1) {
      imageContainers.forEach(container => {
        container.addEventListener('click', function() {
          if (isDesktop()) {
            // Desktop: open lightbox with single image
            const img = container.querySelector('img');
            if (img) {
              const singleImage = [{ src: img.src, alt: img.alt }];
              openLightbox(singleImage, 0, null);
            }
          } else {
            // Mobile: toggle expanded state
            toggleExpandedState();
          }
        });
      });
    }

    // On desktop, ensure main image is always object-contain
    function handleResize() {
      imageContainers.forEach(container => {
        const currentImg = container.querySelector('img');
        if (currentImg && isDesktop()) {
          currentImg.classList.remove('object-cover');
          currentImg.classList.add('object-contain');
        }
      });
    }

    // Listen for resize events
    window.addEventListener('resize', handleResize);

    // Initial check
    handleResize();
  });
});
