/**
 * Mobile-only lightbox for carousel images.
 * Opens a full-screen modal with the tapped image at its natural aspect ratio.
 * Closes on tap, Escape key, or back button.
 */

const MOBILE_MAX = 768;

let overlay = null;
let img = null;

function createOverlay() {
  overlay = document.createElement('div');
  overlay.className = 'lightbox-overlay';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-label', 'Image preview');
  overlay.hidden = true;

  img = document.createElement('img');
  img.className = 'lightbox-img';
  img.alt = '';

  overlay.appendChild(img);
  document.body.appendChild(overlay);

  overlay.addEventListener('click', close);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') close();
  });
}

function open(src) {
  if (!overlay) createOverlay();
  img.src = src;
  overlay.hidden = false;
  document.body.style.overflow = 'hidden';
}

function close() {
  if (!overlay) return;
  overlay.hidden = true;
  img.src = '';
  document.body.style.overflow = '';
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
      open(src);
    }
  });
}
