// Global JavaScript
document.addEventListener('DOMContentLoaded', function() {
  // Cart Modal Toggle
  const cartModal = document.querySelector('.cart-modal');
  const cartOverlay = document.querySelector('.cart-modal__overlay');
  const cartToggleButtons = document.querySelectorAll('[data-cart-toggle]');
  const cartCloseButtons = document.querySelectorAll('[data-cart-close]');

  function openCart() {
    if (cartModal) cartModal.classList.add('is-open');
    if (cartOverlay) cartOverlay.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }

  function closeCart() {
    if (cartModal) cartModal.classList.remove('is-open');
    if (cartOverlay) cartOverlay.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  cartToggleButtons.forEach(button => {
    button.addEventListener('click', openCart);
  });

  cartCloseButtons.forEach(button => {
    button.addEventListener('click', closeCart);
  });

  if (cartOverlay) {
    cartOverlay.addEventListener('click', closeCart);
  }

  // Close cart on Escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && cartModal && cartModal.classList.contains('is-open')) {
      closeCart();
    }
  });

  // Mobile Menu Toggle
  const mobileMenuToggle = document.querySelector('[data-mobile-menu-toggle]');
  const mobileMenu = document.querySelector('[data-mobile-menu]');

  if (mobileMenuToggle && mobileMenu) {
    mobileMenuToggle.addEventListener('click', function() {
      mobileMenu.classList.toggle('is-open');
      this.setAttribute('aria-expanded', 
        this.getAttribute('aria-expanded') === 'false' ? 'true' : 'false'
      );
    });
  }

  console.log('Shopify Theme initialized');
});
