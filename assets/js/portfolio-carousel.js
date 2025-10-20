// Portfolio Inline Carousel
document.addEventListener('DOMContentLoaded', function() {
  // Debug: Track scroll events
  let lastScrollY = window.scrollY;
  window.addEventListener('scroll', function() {
    if (window.scrollY !== lastScrollY) {
      console.log('SCROLL EVENT! Old:', lastScrollY, 'New:', window.scrollY, 'Delta:', window.scrollY - lastScrollY);
      console.trace('Scroll triggered from:');
      lastScrollY = window.scrollY;
    }
  });

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

    // Get carousel images from pre-generated picture tags
    let carouselImages = [];
    const carouselGenerator = piece.querySelector('.carousel-image-generator');
    if (carouselGenerator) {
      const generatedImages = carouselGenerator.querySelectorAll('.carousel-gen-img');
      generatedImages.forEach(genImg => {
        const img = genImg.querySelector('img');
        if (img) {
          carouselImages.push({
            src: img.src,
            srcset: img.srcset || '',
            alt: genImg.dataset.alt || img.alt || '',
            picture: genImg.querySelector('picture') ? genImg.querySelector('picture').outerHTML : null
          });
        }
      });
      console.log('Carousel images loaded from generated sources:', carouselImages);
    }

    // Track expanded state for content (mobile only)
    let isExpanded = false;
    let controls = null;
    let currentIndex = 0;

    // Store original cropped images for each container to restore on collapse
    const originalImages = new Map();
    imageContainers.forEach(container => {
      const originalPicture = container.querySelector('picture');
      if (originalPicture) {
        originalImages.set(container, originalPicture.outerHTML);
      }
    });

    // Define showImage function for all pieces (single or multi-image)
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
            // If we have a full picture element from Jekyll Picture Tag, use it
            if (imgData.picture) {
              const tempDiv = document.createElement('div');
              tempDiv.innerHTML = imgData.picture;
              const newPicture = tempDiv.querySelector('picture');
              const newImg = newPicture.querySelector('img');

              // Apply correct classes based on device type and expanded state
              if (isDesktop()) {
                newImg.classList.add('portfolio-image', 'h-full', 'w-auto', 'object-contain', 'transition-all', 'duration-300');
              } else {
                newImg.classList.add('portfolio-image', 'w-full', 'h-full', 'transition-all', 'duration-300');
                if (isExpanded) {
                  newImg.classList.add('object-contain');
                } else {
                  newImg.classList.add('object-contain');  // Changed from object-cover to match Jekyll Picture Tag
                }
              }

              // Start invisible
              newImg.style.opacity = '0';

              // Insert new picture before old one
              currentPictureOrImg.parentNode.insertBefore(newPicture, currentPictureOrImg);

              // When loaded, fade in and remove old
              newImg.onload = function() {
                newImg.style.opacity = '1';
                setTimeout(() => {
                  currentPictureOrImg.remove();
                }, 50);
              };
            } else {
              // Fallback to simple img if no picture element available
              const newImg = document.createElement('img');
              newImg.className = 'portfolio-image w-full h-full object-contain transition-all duration-300';
              newImg.alt = imgData.alt || '';
              newImg.src = imgData.src;
              if (imgData.srcset) {
                newImg.srcset = imgData.srcset;
              }

              newImg.style.opacity = '0';
              currentPictureOrImg.parentNode.insertBefore(newImg, currentPictureOrImg);

              newImg.onload = function() {
                newImg.style.opacity = '1';
                setTimeout(() => {
                  currentPictureOrImg.remove();
                }, 50);
              };
            }
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

    // Setup carousel-specific features for multi-image pieces
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
              e.preventDefault();
              e.stopPropagation();
              showImage(i);
            });
            dotsContainer.appendChild(dot);
          });
        }
      });

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
          console.log('Image container clicked!');
          console.log('Event target:', e.target);
          console.log('Closest carousel controls:', e.target.closest('.carousel-controls'));

          // Don't trigger if clicking on carousel controls (dots)
          if (e.target.closest('.carousel-controls')) {
            console.log('Clicked on controls, ignoring...');
            return;
          }

          e.preventDefault();
          console.log('After preventDefault on image click');

          if (isDesktop()) {
            console.log('Desktop - opening lightbox');
            // Desktop: open lightbox
            openLightbox(carouselImages, currentIndex, (newIndex) => {
              // Update the main carousel when lightbox changes
              showImage(newIndex);
            });
          } else {
            console.log('Mobile - toggling expanded state');
            // Mobile: toggle expanded state
            toggleExpandedState();
          }
        });
      });

      // Filmstrip click handlers (desktop only)
      if (filmstrip) {
        const filmstripThumbs = filmstrip.querySelectorAll('.filmstrip-thumb');
        filmstripThumbs.forEach((thumb, index) => {
          thumb.addEventListener('click', function(e) {
            e.preventDefault();
            if (isDesktop()) {
              showImage(index);
            }
          });
        });

        // Filmstrip navigation buttons
        const filmstripWrapper = filmstrip.closest('.filmstrip-wrapper');
        if (filmstripWrapper) {
          const prevBtn = filmstripWrapper.querySelector('.filmstrip-nav-btn.prev');
          const nextBtn = filmstripWrapper.querySelector('.filmstrip-nav-btn.next');

          if (prevBtn && nextBtn) {
            // Scroll filmstrip by one thumbnail width when clicking arrows
            prevBtn.addEventListener('click', function(e) {
              e.preventDefault();
              e.stopPropagation();
              const scrollAmount = filmstrip.querySelector('.filmstrip-thumb')?.offsetWidth || 100;
              filmstrip.scrollBy({ left: -scrollAmount - 8, behavior: 'smooth' }); // -8 for gap
            });

            nextBtn.addEventListener('click', function(e) {
              e.preventDefault();
              e.stopPropagation();
              const scrollAmount = filmstrip.querySelector('.filmstrip-thumb')?.offsetWidth || 100;
              filmstrip.scrollBy({ left: scrollAmount + 8, behavior: 'smooth' }); // +8 for gap
            });

            // Show/hide navigation buttons based on scroll position
            function updateNavButtons() {
              const isAtStart = filmstrip.scrollLeft <= 0;
              const isAtEnd = filmstrip.scrollLeft + filmstrip.clientWidth >= filmstrip.scrollWidth - 1;

              prevBtn.style.opacity = isAtStart ? '0.3' : '0.8';
              prevBtn.style.pointerEvents = isAtStart ? 'none' : 'auto';
              nextBtn.style.opacity = isAtEnd ? '0.3' : '0.8';
              nextBtn.style.pointerEvents = isAtEnd ? 'none' : 'auto';
            }

            // Initial check
            updateNavButtons();

            // Update on scroll
            filmstrip.addEventListener('scroll', updateNavButtons);

            // Update on resize
            window.addEventListener('resize', updateNavButtons);
          }
        }
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

      // Initialize first image - DISABLED to preserve Jekyll Picture Tag's cropped/optimized image
      // Only runs when user interacts (swipe, click dots, expand)
      // showImage(0);
    }

    // Unified toggle function for carousel + content
    function toggleExpandedState() {
      // Debug: Log scroll position before toggle
      console.log('=== TOGGLE START ===');
      console.log('Scroll position before:', window.scrollY);
      console.log('Document height before:', document.documentElement.scrollHeight);

      // Save scroll position to prevent auto-scrolling
      const savedScrollY = window.scrollY;

      isExpanded = !isExpanded;
      console.log('Toggling expanded state to:', isExpanded);

      if (isExpanded) {
        // Expand: Replace cropped 5:4 image with uncropped version from carousel
        if (carouselImages.length > 0 && typeof showImage === 'function') {
          showImage(currentIndex);
        }

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

        // Restore scroll position after DOM changes
        window.scrollTo(0, savedScrollY);

        // Debug: Log scroll position after expand
        console.log('Scroll position after expand:', window.scrollY);
        console.log('Document height after expand:', document.documentElement.scrollHeight);
        console.log('=== TOGGLE END (EXPANDED) ===');
      } else {
        // Collapse: restore original cropped 5:4 image, hide carousel controls, hide content
        imageContainers.forEach(container => {
          // Restore original cropped image if we have it stored
          const originalHTML = originalImages.get(container);
          if (originalHTML) {
            const currentPictureOrImg = container.querySelector('picture') || container.querySelector('.portfolio-image');
            if (currentPictureOrImg) {
              const tempDiv = document.createElement('div');
              tempDiv.innerHTML = originalHTML;
              const originalPicture = tempDiv.querySelector('picture');

              // Insert original before current
              currentPictureOrImg.parentNode.insertBefore(originalPicture, currentPictureOrImg);
              // Remove the uncropped version
              currentPictureOrImg.remove();
            }
          }

          const containerControls = container.querySelector('.carousel-controls');
          if (containerControls) {
            containerControls.style.display = 'none';
          }
        });

        // Reset current index to 0 for next expansion
        currentIndex = 0;

        if (content) {
          content.style.maxHeight = '0';
          if (dividerContainer) {
            content.parentNode.insertBefore(dividerContainer, content);
          }
        }

        if (toggleBtn) {
          toggleBtn.textContent = 'Read More';
        }

        // Restore scroll position after DOM changes
        window.scrollTo(0, savedScrollY);

        // Debug: Log scroll position after collapse
        console.log('Scroll position after collapse:', window.scrollY);
        console.log('Document height after collapse:', document.documentElement.scrollHeight);
        console.log('=== TOGGLE END (COLLAPSED) ===');
      }
    }

    // Button click - toggle expanded state
    if (toggleBtn) {
      toggleBtn.addEventListener('click', function(e) {
        console.log('Button clicked!');
        console.log('Event target:', e.target);
        console.log('Event type:', e.type);
        console.log('Default prevented:', e.defaultPrevented);

        e.preventDefault();
        e.stopPropagation();

        console.log('After preventDefault - default prevented:', e.defaultPrevented);
        toggleExpandedState();
      });
    }

    // If no carousel, clicking image should still work
    if (carouselImages.length <= 1) {
      imageContainers.forEach(container => {
        container.addEventListener('click', function(e) {
          e.preventDefault();
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
