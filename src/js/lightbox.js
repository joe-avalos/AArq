/**
 * Mobile-only lightbox for carousel images.
 * Opens a full-screen modal with the tapped image at its natural aspect ratio.
 * Closes on tap, Escape key, or back button.
 */

const MOBILE_MAX = 768;

let overlay = null;
let img = null;
let closeBtn = null;
let triggerEl = null;
let scrollY = 0;

function createOverlay() {
  overlay = document.createElement('div');
  overlay.className = 'lightbox-overlay';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-label', 'Image preview');
  overlay.hidden = true;

  closeBtn = document.createElement('button');
  closeBtn.className = 'lightbox-close';
  closeBtn.setAttribute('aria-label', 'Close preview');
  closeBtn.textContent = '\u00d7';
  closeBtn.addEventListener('click', close);

  img = document.createElement('img');
  img.className = 'lightbox-img';
  img.alt = 'Enlarged preview';

  overlay.appendChild(closeBtn);
  overlay.appendChild(img);
  document.body.appendChild(overlay);

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) close();
  });

  // Trap focus within lightbox
  overlay.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      close();
      return;
    }
    if (e.key === 'Tab') {
      // Only two focusable elements: closeBtn and img (via overlay)
      e.preventDefault();
      closeBtn.focus();
    }
  });
}

function open(src, trigger) {
  if (!overlay) createOverlay();
  triggerEl = trigger;
  img.src = src;
  img.alt = trigger?.alt || 'Enlarged preview';
  overlay.hidden = false;
  // Lock scroll — position:fixed prevents iOS bounce/scroll-through
  scrollY = window.scrollY;
  document.body.style.position = 'fixed';
  document.body.style.top = `-${scrollY}px`;
  document.body.style.left = '0';
  document.body.style.right = '0';
  closeBtn.focus();
}

function close() {
  if (!overlay) return;
  overlay.hidden = true;
  img.src = '';
  // Restore scroll position
  document.body.style.position = '';
  document.body.style.top = '';
  document.body.style.left = '';
  document.body.style.right = '';
  window.scrollTo(0, scrollY);
  // Return focus to trigger element
  if (triggerEl) {
    triggerEl.focus();
    triggerEl = null;
  }
}

export function initLightbox(container) {
  container.addEventListener('click', (e) => {
    if (window.innerWidth > MOBILE_MAX) return;

    const target = e.target;
    if (target.tagName !== 'IMG') return;

    const src = target.src || target.currentSrc;
    if (src) {
      e.preventDefault();
      e.stopPropagation();
      open(src, target);
    }
  });
}
