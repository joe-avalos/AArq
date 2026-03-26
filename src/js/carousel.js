export class Carousel {
  constructor(element, options = {}) {
    this.el = element;
    this.opts = {
      autoplay: false,
      interval: 5000,
      loop: true,
      ...options,
    };

    this.track = element.querySelector('.carousel-track');
    this.prevBtn = element.querySelector('.carousel-prev');
    this.nextBtn = element.querySelector('.carousel-next');
    this.dotsContainer = element.querySelector('.carousel-dots');

    this._timer = null;
    this._observer = null;
    this._dots = [];
    this._currentIndex = 0;
    this._reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    this._init();
  }

  _slides() {
    return Array.from(this.track.children);
  }

  _slideWidth() {
    const slides = this._slides();
    return slides.length > 0 ? slides[0].getBoundingClientRect().width : 0;
  }

  _init() {
    const slides = this._slides();
    if (slides.length === 0) return;

    // Set ARIA on slides
    slides.forEach((slide, i) => {
      slide.setAttribute('role', 'group');
      slide.setAttribute('aria-roledescription', 'slide');
      if (!slide.hasAttribute('aria-label')) {
        slide.setAttribute('aria-label', `${i + 1} of ${slides.length}`);
      }
    });

    // Build dots
    this._buildDots(slides.length);

    // Wire buttons
    if (this.prevBtn) {
      this.prevBtn.addEventListener('click', () => this._prev());
    }
    if (this.nextBtn) {
      this.nextBtn.addEventListener('click', () => this._next());
    }

    // IntersectionObserver for dot sync
    this._observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = this._slides().indexOf(entry.target);
            if (idx !== -1) {
              this._currentIndex = idx;
              this._syncDots(idx);
            }
          }
        });
      },
      { root: this.track, threshold: 0.5 }
    );

    this._slides().forEach((slide) => this._observer.observe(slide));

    // Pause on hover / focus
    this.el.addEventListener('mouseenter', () => this._pause());
    this.el.addEventListener('mouseleave', () => this._resume());
    this.el.addEventListener('focusin', () => this._pause());
    this.el.addEventListener('focusout', () => {
      if (!this.el.contains(document.activeElement)) {
        this._resume();
      }
    });

    // Start autoplay
    if (this.opts.autoplay && !this._reducedMotion) {
      this._startAutoplay();
    }
  }

  _buildDots(count) {
    if (!this.dotsContainer) return;
    this.dotsContainer.innerHTML = '';
    this._dots = [];

    for (let i = 0; i < count; i++) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.setAttribute('role', 'tab');
      btn.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
      btn.setAttribute('aria-label', `Slide ${i + 1}`);
      btn.dataset.index = String(i);
      btn.addEventListener('click', () => this._goTo(i));
      this.dotsContainer.appendChild(btn);
      this._dots.push(btn);
    }
  }

  _syncDots(activeIndex) {
    this._dots.forEach((dot, i) => {
      dot.setAttribute('aria-selected', i === activeIndex ? 'true' : 'false');
    });
  }

  _goTo(index) {
    const slides = this._slides();
    if (index < 0 || index >= slides.length) return;
    const width = this._slideWidth();
    this.track.scrollTo({
      left: width * index,
      behavior: this._reducedMotion ? 'auto' : 'smooth',
    });
    this._currentIndex = index;
  }

  _prev() {
    const slides = this._slides();
    let next = this._currentIndex - 1;
    if (next < 0) {
      next = this.opts.loop ? slides.length - 1 : 0;
    }
    this._goTo(next);
  }

  _next() {
    const slides = this._slides();
    let next = this._currentIndex + 1;
    if (next >= slides.length) {
      next = this.opts.loop ? 0 : slides.length - 1;
    }
    this._goTo(next);
  }

  _startAutoplay() {
    this._clearAutoplay();
    this._timer = setInterval(() => this._next(), this.opts.interval);
  }

  _clearAutoplay() {
    if (this._timer !== null) {
      clearInterval(this._timer);
      this._timer = null;
    }
  }

  _pause() {
    this._clearAutoplay();
  }

  _resume() {
    if (this.opts.autoplay && !this._reducedMotion) {
      this._startAutoplay();
    }
  }

  destroy() {
    this._clearAutoplay();
    if (this._observer) {
      this._observer.disconnect();
      this._observer = null;
    }
  }
}
