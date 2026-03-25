/* ==========================================================================
   COMPONENTS.JS — Shared Web Components (<site-header>, <site-footer>)
   Edit this file to change header/footer/nav across ALL pages.
   ========================================================================== */

/* ==========================================================================
   <site-header>

   Usage:
     <site-header active="projects" variant="page"></site-header>

   Attributes:
     active  — which nav link gets .active class (projects|services|about|contact)
               omit for homepage (no active link)
     variant — "home" for transparent homepage header, "page" for all others
   ========================================================================== */

class SiteHeader extends HTMLElement {
    connectedCallback() {
        var active = this.getAttribute('active') || '';
        var variant = this.getAttribute('variant') || 'page';
        var navClass = active || variant;

        this.outerHTML = ''
            + '<a href="#main-content" class="skip-nav"><span lang="en">Skip to main content</span><span lang="es">Saltar al contenido principal</span></a>'
            + '<!-------Header------->'
            + '<header class="header-container ' + variant + '">'
            + '    <div class="header-inner max-width maintb">'
            + '        <div class="logo"><a href="/" title="Avalos Arquitectos"><img src="/public/images/logo.jpeg"'
            + '                              alt="Avalos Arquitectos" width="225" height="225"'
            + '                              class="main-logo"/></a></div>'
            + '        <div class="nav-container">'
            + '            <div class="languages">'
            + '                <div class="links" role="toolbar" aria-label="Site preferences">'
            + '                    <button class="lang-toggle" aria-label="Cambiar a español">'
            + '                        <span lang="en">ES</span><span lang="es">EN</span>'
            + '                    </button>'
            + '                    <span class="toolbar-separator" aria-hidden="true"></span>'
            + '                    <button class="theme-toggle" aria-label="Switch to dark theme">'
            + '                        <svg class="icon-sun" aria-hidden="true" viewBox="0 0 24 24"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>'
            + '                        <svg class="icon-moon" aria-hidden="true" viewBox="0 0 24 24"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>'
            + '                    </button>'
            + '                </div>'
            + '            </div>'
            + '            <nav aria-label="Main navigation">'
            + '            <div class="navigation ' + navClass + '">'
            + '                <ul class="list">'
            + '                    <li><a href="/projects"' + (active === 'projects' ? ' class="active"' : '') + '><span lang="en">Projects</span><span lang="es">Proyectos</span></a></li>'
            + '                    <li>'
            + '                        <a href="/services"' + (active === 'services' ? ' class="active"' : '') + '><span lang="en">Services</span><span lang="es">Servicios</span></a>'
            + '                        <ul class="hide">'
            + '                            <li class="nav-link-item"><a class="nav-links" href="/services#design"><span lang="en">Design</span><span lang="es">Diseño</span></a></li>'
            + '                            <li class="nav-link-item"><a class="nav-links" href="/services#construction"><span lang="en">Construction</span><span lang="es">Construcción</span></a></li>'
            + '                            <li class="nav-link-item"><a class="nav-links" href="/services#property-management"><span lang="en">Property Management</span><span lang="es">Administración de Propiedades</span></a></li>'
            + '                        </ul>'
            + '                    </li>'
            + '                    <li><a href="/about"' + (active === 'about' ? ' class="active"' : '') + '><span lang="en">About</span><span lang="es">Nosotros</span></a></li>'
            + '                    <li><a href="/contact"' + (active === 'contact' ? ' class="active"' : '') + '><span lang="en">Contact</span><span lang="es">Contacto</span></a></li>'
            + '                </ul>'
            + '                <div class="mobile-nav"><button class="open-mobile-menu" aria-expanded="false" aria-label="Close menu"><img src="/public/images/close.svg"'
            + '                                                                     alt="" width="18"'
            + '                                                                     height="18"/></button></div>'
            + '            </div>'
            + '            </nav>'
            + '        </div>'
            + '        <div class="mobile-nav"><button class="open-mobile-menu" aria-expanded="false" aria-label="Open menu"><span class="element"><img'
            + '                src="/public/images/hamburger.svg" alt="" width="24" height="24"/></span></button></div>'
            + '        <div class="clear"></div>'
            + '    </div>'
            + '</header>'
            + '<!-------End Header------->';
    }
}

customElements.define('site-header', SiteHeader);

/* ==========================================================================
   <site-footer>

   Usage:
     <site-footer></site-footer>

   No attributes needed — footer is identical on all pages.
   ========================================================================== */

class SiteFooter extends HTMLElement {
    connectedCallback() {
        this.outerHTML = ''
            + '<footer class="footer-container">'
            + '    <div class="footer-inner max-width">'
            + '        <div class="footer-flex-container mobile-wrap">'
            + '            <div class="footer-flex-container logo-container">'
            + '                <div class="footer-item margin-fix">'
            + '                    <div class="logo"><a href="/" title="Avalos Arquitectos"><img src="/public/images/logo.svg"'
            + '                                                                                  alt="Avalos Arquitectos" width="100"'
            + '                                                                                  height="100" class="main-logo"/></a>'
            + '                    </div>'
            + '                    <div class="motto"><span lang="en">&ldquo;We do not design spaces.<br/>We create lifestyles.&rdquo;</span><span lang="es">&ldquo;No diseñamos espacios.<br/>Creamos estilos de vida.&rdquo;</span></div>'
            + '                </div>'
            + '            </div>'
            + '            <div class="footer-flex-container middle-container">'
            + '                <div class="footer-item">'
            + '                    <div class="footer-item-title"><span lang="en">Sitemap</span><span lang="es">Mapa del sitio</span></div>'
            + '                    <div class="footer-item-links">'
            + '                        <nav aria-label="Footer navigation">'
            + '                        <ul class="link-list">'
            + '                            <li><a href="/projects"><span lang="en">Projects</span><span lang="es">Proyectos</span></a></li>'
            + '                            <li><a href="/services"><span lang="en">Services</span><span lang="es">Servicios</span></a></li>'
            + '                            <li><a href="/about"><span lang="en">About</span><span lang="es">Nosotros</span></a></li>'
            + '                            <li><a href="/contact"><span lang="en">Contact</span><span lang="es">Contacto</span></a></li>'
            + '                        </ul>'
            + '                        </nav>'
            + '                    </div>'
            + '                </div>'
            + '                <div class="footer-item">'
            + '                    <div class="footer-item-title"><span lang="en">Find us</span><span lang="es">Encuéntranos</span></div>'
            + '                    <div class="link">'
            + '                        <a href="https://maps.app.goo.gl/d9BxKSN5XKhLBRo56" target="_blank" rel="nofollow">'
            + '                            Camino del Pedernal 160<br/>Pedregal<br/>Cabo San Lucas<br/>Baja California Sur<br/>CP 23453<br/>Mexico'
            + '                        </a>'
            + '                    </div>'
            + '                </div>'
            + '            </div>'
            + '            <div class="footer-flex-container">'
            + '                <div class="footer-item">'
            + '                    <div class="footer-item-title"><span lang="en">Phone</span><span lang="es">Teléfono</span></div>'
            + '                    <div class="footer-item-links">'
            + '                        <ul class="link-list">'
            + '                            <li><a href="tel:+526241431440">+52 (624) 143.1440</a></li>'
            + '                        </ul>'
            + '                    </div>'
            + '                    <div class="footer-item-title"><span lang="en">Jacinto Avalos and potential projects:</span><span lang="es">Jacinto Avalos y nuevos proyectos:</span></div>'
            + '                    <div class="footer-item-links">'
            + '                        <ul class="link-list">'
            + '                            <li><a href="mailto:jacinto@avalosarquitectos.com" aria-label="Email address">jacinto@avalosarquitectos.com</a></li>'
            + '                        </ul>'
            + '                    </div>'
            + '                    <div class="footer-item-title"><span lang="en">General, press, and employment inquiries:</span><span lang="es">Consultas generales, prensa, y empleo:</span></div>'
            + '                    <div class="link">'
            + '                        <a href="mailto:info@avalosarquitectos.com" aria-label="Email address">info@avalosarquitectos.com</a>'
            + '                    </div>'
            + '                </div>'
            + '            </div>'
            + '        </div>'
            + '        <div class="footer-copyright">&copy; 2026 Avalos Arquitectos y Asociados, S.C.</div>'
            + '    </div>'
            + '</footer>';
    }
}

customElements.define('site-footer', SiteFooter);
