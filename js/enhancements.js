/* ==========================================================================
   ENHANCEMENTS.JS — Theme Toggle, Language Toggle, Accessibility
   No dependencies — vanilla JS. Loaded before </body>.
   ========================================================================== */

(function () {
    'use strict';

    /* ======================================================================
       1. THEME TOGGLE
       ====================================================================== */

    function getPreferredTheme() {
        var stored = localStorage.getItem('theme');
        if (stored === 'dark' || stored === 'light') return stored;
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    function applyTheme(theme) {
        document.documentElement.dataset.theme = theme === 'dark' ? 'dark' : '';
        var meta = document.querySelector('meta[name="theme-color"]');
        if (meta) {
            meta.setAttribute('content', theme === 'dark' ? '#121212' : '#ffffff');
        }
    }

    function updateThemeToggle(btn, theme) {
        if (!btn) return;
        var isDark = theme === 'dark';
        var lang = document.documentElement.lang || 'en';
        if (lang === 'es') {
            btn.setAttribute('aria-label', isDark ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro');
        } else {
            btn.setAttribute('aria-label', isDark ? 'Switch to light theme' : 'Switch to dark theme');
        }
    }

    function initThemeToggle() {
        var btns = document.querySelectorAll('.theme-toggle');
        var currentTheme = getPreferredTheme();

        applyTheme(currentTheme);

        btns.forEach(function (btn) {
            updateThemeToggle(btn, currentTheme);
            btn.addEventListener('click', function () {
                var next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
                localStorage.setItem('theme', next);
                applyTheme(next);
                btns.forEach(function (b) { updateThemeToggle(b, next); });
            });
        });

        // Listen for OS theme changes
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function (e) {
            if (!localStorage.getItem('theme')) {
                var next = e.matches ? 'dark' : 'light';
                applyTheme(next);
                btns.forEach(function (b) { updateThemeToggle(b, next); });
            }
        });
    }

    /* ======================================================================
       2. LANGUAGE TOGGLE
       ====================================================================== */

    function updateLangToggle(btn, lang) {
        if (!btn) return;
        if (lang === 'es') {
            btn.setAttribute('aria-label', 'Switch to English');
        } else {
            btn.setAttribute('aria-label', 'Cambiar a español');
        }
    }

    function initLangToggle() {
        var btns = document.querySelectorAll('.lang-toggle');
        var currentLang = document.documentElement.lang || 'en';

        btns.forEach(function (btn) {
            updateLangToggle(btn, currentLang);
            btn.addEventListener('click', function () {
                var next = document.documentElement.lang === 'es' ? 'en' : 'es';
                document.documentElement.lang = next;
                localStorage.setItem('lang', next);
                btns.forEach(function (b) { updateLangToggle(b, next); });
                // Update theme toggle labels to match new language
                var themeBtns = document.querySelectorAll('.theme-toggle');
                var currentTheme = document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light';
                themeBtns.forEach(function (b) { updateThemeToggle(b, currentTheme); });
            });
        });
    }

    /* ======================================================================
       3. ACCESSIBILITY — Mobile Menu ARIA
       ====================================================================== */

    function initMobileMenuA11y() {
        var openBtns = document.querySelectorAll('.open-mobile-menu');
        var headerInner = document.querySelector('.header-inner');

        if (!headerInner || !openBtns.length) return;

        // Observe class changes on header-inner for navigation-active
        var observer = new MutationObserver(function (mutations) {
            mutations.forEach(function (m) {
                if (m.attributeName === 'class') {
                    var isActive = headerInner.classList.contains('navigation-active');
                    openBtns.forEach(function (btn) {
                        btn.setAttribute('aria-expanded', isActive ? 'true' : 'false');
                    });
                }
            });
        });

        observer.observe(headerInner, { attributes: true });
    }

    /* ======================================================================
       4. ACCESSIBILITY — Owl Carousel ARIA
       ====================================================================== */

    function initCarouselA11y() {
        // Wait for jQuery and Owl to be ready
        if (typeof jQuery === 'undefined') return;

        jQuery(document).ready(function ($) {
            // Wait a tick for Owl to initialize
            setTimeout(function () {
                $('.owl-carousel').each(function () {
                    var $carousel = $(this);
                    var label = 'Image carousel';

                    if ($carousel.hasClass('owl-testimonial-slider')) {
                        label = 'Testimonials';
                    } else if ($carousel.hasClass('owl-overflow-slider')) {
                        label = 'Project images';
                    } else if ($carousel.closest('.fullscreen-slider').length) {
                        label = 'Featured projects';
                    }

                    $carousel.attr({
                        'aria-roledescription': 'carousel',
                        'aria-label': label
                    });

                    // Mark non-visible slides
                    function updateSlideVisibility() {
                        $carousel.find('.owl-item').each(function () {
                            var $item = $(this);
                            $item.attr('aria-hidden', $item.hasClass('active') ? 'false' : 'true');
                        });
                    }

                    updateSlideVisibility();
                    $carousel.on('changed.owl.carousel translated.owl.carousel', updateSlideVisibility);

                    // Label nav buttons
                    $carousel.find('.owl-prev').attr('aria-label', 'Previous slide');
                    $carousel.find('.owl-next').attr('aria-label', 'Next slide');

                    // Label dots
                    $carousel.find('.owl-dot').each(function (i) {
                        $(this).attr('aria-label', 'Go to slide ' + (i + 1));
                    });
                });
            }, 500);
        });
    }

    /* ======================================================================
       5. ACCESSIBILITY — Service Tabs ARIA
       ====================================================================== */

    function initServiceTabsA11y() {
        var tabContainer = document.querySelector('.page-services .tab-container .tabs');
        if (!tabContainer) return;

        tabContainer.setAttribute('role', 'tablist');

        var tabs = tabContainer.querySelectorAll('.tab-link');
        var tabContents = document.querySelectorAll('.page-services .tab-content');

        tabs.forEach(function (tab, i) {
            var tabId = tab.id || 'service-tab-' + i;
            var panelId = tabContents[i] ? tabContents[i].id : null;

            tab.setAttribute('role', 'tab');
            if (!tab.id) tab.setAttribute('id', tabId);
            tab.setAttribute('aria-selected', tab.classList.contains('active') ? 'true' : 'false');
            if (panelId) {
                tab.setAttribute('aria-controls', panelId);
            }
            tab.setAttribute('tabindex', tab.classList.contains('active') ? '0' : '-1');

            if (tabContents[i]) {
                tabContents[i].setAttribute('role', 'tabpanel');
                tabContents[i].setAttribute('aria-labelledby', tabId);
            }
        });

        // Arrow key navigation
        tabContainer.addEventListener('keydown', function (e) {
            if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;

            var currentIndex = Array.from(tabs).findIndex(function (t) {
                return t.getAttribute('aria-selected') === 'true';
            });

            var nextIndex;
            if (e.key === 'ArrowRight') {
                nextIndex = (currentIndex + 1) % tabs.length;
            } else {
                nextIndex = (currentIndex - 1 + tabs.length) % tabs.length;
            }

            tabs[nextIndex].click();
            tabs[nextIndex].focus();
            e.preventDefault();
        });

        // Observe tab changes
        var observer = new MutationObserver(function () {
            tabs.forEach(function (tab) {
                var isActive = tab.classList.contains('active');
                tab.setAttribute('aria-selected', isActive ? 'true' : 'false');
                tab.setAttribute('tabindex', isActive ? '0' : '-1');
            });
        });

        tabs.forEach(function (tab) {
            observer.observe(tab, { attributes: true, attributeFilter: ['class'] });
        });
    }

    /* ======================================================================
       6. ACCESSIBILITY — Project Filter ARIA
       ====================================================================== */

    function initProjectFilterA11y() {
        var filterContainer = document.querySelector('.page-projects .tab-container .tabs');
        if (!filterContainer) return;

        filterContainer.setAttribute('role', 'tablist');

        var filters = filterContainer.querySelectorAll('.tab-link');
        filters.forEach(function (filter) {
            filter.setAttribute('role', 'tab');
            filter.setAttribute('aria-selected', filter.classList.contains('active') ? 'true' : 'false');
        });

        // Observe filter changes via MixItUp
        var observer = new MutationObserver(function () {
            filters.forEach(function (filter) {
                filter.setAttribute('aria-selected', filter.classList.contains('active') ? 'true' : 'false');
            });
        });

        filters.forEach(function (filter) {
            observer.observe(filter, { attributes: true, attributeFilter: ['class'] });
        });
    }

    /* ======================================================================
       INIT
       ====================================================================== */

    // Run after DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    function init() {
        initThemeToggle();
        initLangToggle();
        initMobileMenuA11y();
        initCarouselA11y();
        initServiceTabsA11y();
        initProjectFilterA11y();
    }

})();
