/**
 * Theme JavaScript - Essence 4.2
 */

document.addEventListener('DOMContentLoaded', function() {
  
  // ===== Mobile Navigation Drawer =====
  const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
  const mobileDrawer = document.querySelector('.mobile-nav-drawer');
  const mobileOverlay = document.querySelector('.mobile-nav-overlay');
  const navClose = document.getElementById('nav-close');
  const navBack = document.getElementById('nav-back');

  function openNav() {
    if (mobileDrawer && mobileOverlay) {
      mobileDrawer.classList.add('open');
      mobileOverlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeNav() {
    if (mobileDrawer && mobileOverlay) {
      mobileDrawer.classList.remove('open');
      mobileOverlay.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  mobileNavToggle?.addEventListener('click', openNav);
  navClose?.addEventListener('click', closeNav);
  mobileOverlay?.addEventListener('click', closeNav);
  navBack?.addEventListener('click', closeNav);

  // ===== Mobile Submenu Accordion =====
  document.querySelectorAll('.mobile-submenu-toggle').forEach(btn => {
    btn.addEventListener('click', function() {
      const panel = this.closest('li').querySelector('.mobile-submenu');
      const isOpen = panel.classList.contains('open');
      
      // Close all other panels
      document.querySelectorAll('.mobile-submenu').forEach(p => {
        p.classList.remove('open');
        p.style.maxHeight = null;
      });
      
      if (!isOpen) {
        panel.classList.add('open');
        panel.style.maxHeight = panel.scrollHeight + 'px';
      }
    });
  });

  // ===== Search Overlay =====
  const searchOpenBtns = document.querySelectorAll('.search-open-btn, .search-open');
  const searchOverlay = document.querySelector('.search-overlay, .header-search');
  const searchCloseBtn = document.querySelector('.search-close');
  const searchInput = document.querySelector('.search-input');

  searchOpenBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      if (searchOverlay) {
        searchOverlay.classList.add('active');
        setTimeout(() => searchInput?.focus(), 100);
      }
    });
  });

  searchCloseBtn?.addEventListener('click', function() {
    searchOverlay?.classList.remove('active');
  });

  // Close on escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      searchOverlay?.classList.remove('active');
      closeNav();
      document.querySelector('.cart-drawer')?.classList.remove('open');
      document.querySelector('.cart-overlay')?.classList.remove('active');
    }
  });

  // ===== Add to Cart Buttons =====
  document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
    btn.addEventListener('click', async function(e) {
      e.preventDefault();
      
      const productId = this.dataset.productId;
      const variantId = this.dataset.variantId || productId;
      const quantity = 1;
      
      if (!productId) return;
      
      // Show loading state
      this.classList.add('loading');
      
      try {
        const response = await fetch('/cart/add.js', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ items: [{ id: variantId, quantity }] })
        });
        
        if (response.ok) {
          updateCartCount();
          // Open cart drawer
          const cartDrawer = document.querySelector('.cart-drawer');
          const overlay = document.querySelector('.cart-overlay');
          cartDrawer?.classList.add('open');
          overlay?.classList.add('active');
          document.body.style.overflow = 'hidden';
        }
      } catch (error) {
        console.error('Error adding to cart:', error);
      } finally {
        this.classList.remove('loading');
      }
    });
  });

  // ===== Wishlist Buttons =====
  document.querySelectorAll('.wishlist-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      this.classList.toggle('active');
      
      const removeBtn = this.parentElement?.querySelector('.wishlist-btn--active');
      const addBtn = this.parentElement?.querySelector('.wishlist-btn:not(.wishlist-btn--active)');
      
      if (this.classList.contains('active')) {
        removeBtn?.style.setProperty('display', 'flex');
        addBtn?.style.setProperty('display', 'none');
      } else {
        removeBtn?.style.setProperty('display', 'none');
        addBtn?.style.setProperty('display', 'flex');
      }
      
      updateWishlistCount();
    });
  });

  // ===== Help Button =====
  const helpButton = document.querySelector('.help-button');
  const helpCustomer = document.querySelector('.help-customer');
  
  helpButton?.addEventListener('click', function() {
    helpCustomer?.classList.toggle('showlist');
  });

  // ===== Newsletter Popup =====
  setTimeout(function() {
    const popup = document.querySelector('.newsletter-popup');
    const hasShown = localStorage.getItem('newsletter_shown');
    
    if (popup && !hasShown) {
      popup.classList.add('active');
      localStorage.setItem('newsletter_shown', '1');
    }
  }, 8000);

  document.querySelector('.popup-close')?.addEventListener('click', function() {
    document.querySelector('.newsletter-popup')?.classList.remove('active');
  });

  // Close popup on overlay click
  document.querySelector('.newsletter-popup')?.addEventListener('click', function(e) {
    if (e.target === this) {
      this.classList.remove('active');
    }
  });

  // ===== Cart Drawer =====
  const cartDrawerToggle = document.getElementById('cart-drawer-toggle');
  const cartDrawer = document.querySelector('.cart-drawer');
  const cartOverlay = document.querySelector('.cart-overlay');
  const cartDrawerClose = document.querySelector('.cart-drawer-close');

  cartDrawerToggle?.addEventListener('click', function() {
    cartDrawer?.classList.add('open');
    cartOverlay?.classList.add('active');
    document.body.style.overflow = 'hidden';
  });

  cartDrawerClose?.addEventListener('click', function() {
    cartDrawer?.classList.remove('open');
    cartOverlay?.classList.remove('active');
    document.body.style.overflow = '';
  });

  cartOverlay?.addEventListener('click', function() {
    cartDrawer?.classList.remove('open');
    this.classList.remove('active');
    document.body.style.overflow = '';
  });

  // ===== Intersection Observer for Animations =====
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const animationObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animated');
        animationObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.slideUp, .fadeIn').forEach(el => {
    animationObserver.observe(el);
  });

  // ===== Update Cart Count Function =====
  window.updateCartCount = function() {
    fetch('/cart.js')
      .then(response => response.json())
      .then(cart => {
        const count = cart.item_count;
        document.querySelectorAll('.cart-count-badge').forEach(element => {
          if (count > 0) {
            element.textContent = count;
            element.classList.remove('d-none');
          } else {
            element.classList.add('d-none');
          }
        });
      })
      .catch(error => console.error('Error fetching cart:', error));
  };

  // ===== Update Wishlist Count Function =====
  window.updateWishlistCount = function() {
    // Implement wishlist count logic here
    // This would typically use localStorage or a backend API
  };

  // Initialize cart count on page load
  window.updateCartCount();

  // ===== Quick View Modal =====
  document.querySelectorAll('.product-qv-btn').forEach(btn => {
    btn.addEventListener('click', async function(e) {
      e.preventDefault();
      
      const quickViewUrl = this.dataset.quickviewUrl;
      if (!quickViewUrl) return;
      
      try {
        const response = await fetch(quickViewUrl);
        const html = await response.text();
        
        // Create and show modal
        const modal = document.createElement('div');
        modal.className = 'quick-view-modal active';
        modal.innerHTML = html;
        document.body.appendChild(modal);
        document.body.style.overflow = 'hidden';
        
        // Close on overlay click
        modal.addEventListener('click', function(e) {
          if (e.target === this) {
            modal.remove();
            document.body.style.overflow = '';
          }
        });
        
        // Close button
        modal.querySelector('.quick-view-close')?.addEventListener('click', function() {
          modal.remove();
          document.body.style.overflow = '';
        });
      } catch (error) {
        console.error('Error loading quick view:', error);
      }
    });
  });

});

// ===== Swiper Initializations =====
function initializeSwipers() {
  // Hero Slideshow
  if (document.querySelector('.hero-swiper')) {
    new Swiper('.hero-swiper', {
      loop: true,
      autoplay: {
        delay: 6000,
        disableOnInteraction: false
      },
      effect: 'slide',
      navigation: {
        nextEl: '.hero-next',
        prevEl: '.hero-prev'
      },
      pagination: {
        el: '.hero-pagination',
        clickable: true
      }
    });
  }

  // Collections Carousel
  if (document.querySelector('.collections-swiper')) {
    new Swiper('.collections-swiper', {
      slidesPerView: 3,
      spaceBetween: 12,
      scrollbar: {
        el: '.swiper-scrollbar',
        draggable: true
      },
      breakpoints: {
        768: {
          slidesPerView: 6,
          spaceBetween: 16
        }
      }
    });
  }

  // Products Swiper (reusable for multiple sections)
  document.querySelectorAll('.products-swiper').forEach((swiperEl, index) => {
    const sectionId = swiperEl.closest('[id]')?.id || `products-section-${index}`;
    
    new Swiper(swiperEl, {
      slidesPerView: 2,
      spaceBetween: 12,
      navigation: {
        nextEl: `#${sectionId} .prod-next`,
        prevEl: `#${sectionId} .prod-prev`
      },
      breakpoints: {
        768: {
          slidesPerView: 3,
          spaceBetween: 16
        },
        992: {
          slidesPerView: 6,
          spaceBetween: 20
        }
      }
    });
  });

  // Secondary Banner
  if (document.querySelector('.secondary-banner-swiper')) {
    new Swiper('.secondary-banner-swiper', {
      loop: true,
      autoplay: {
        delay: 8000,
        disableOnInteraction: false
      },
      navigation: {
        nextEl: '.banner-next',
        prevEl: '.banner-prev'
      },
      pagination: {
        el: '.banner-pagination',
        clickable: true
      }
    });
  }
}

// Initialize Swipers after DOM is ready
document.addEventListener('DOMContentLoaded', initializeSwipers);

// Re-initialize on theme editor refresh
if (window.Shopify && window.Shopify.themeEditor) {
  window.Shopify.themeEditor.on('section:load', initializeSwipers);
  window.Shopify.themeEditor.on('section:unload', () => {
    // Destroy swipers if needed
  });
}
