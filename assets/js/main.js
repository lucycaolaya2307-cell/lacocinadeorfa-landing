"use strict";
/* ==========================================================================
   La Cocina de Orfa — Main script (TypeScript source)
   --------------------------------------------------------------------------
   Este archivo se compila a assets/js/main.js mediante `npm run build`
   (tsc). El HTML carga la salida compilada con `defer`.

   Secciones:
     1. NAV SCROLL       Añade .scrolled al <nav> al bajar 40px
     2. MOBILE MENU      Abre/cierra el overlay móvil
     3. MENU FILTERING   Filtra .dish según la tab .menu__tab activa
     4. REVEAL ON SCROLL Añade .in a .reveal cuando entran en viewport
     5. YEAR             Inyecta el año actual en #year (footer)
     6. ANTI-PHISHING    Advertencia en consola contra self-XSS
   ========================================================================== */
(() => {
    'use strict';
    // ---------- 0. ANTI-PHISHING CONSOLE WARNING ----------
    // Muchos ataques de phishing piden a la víctima pegar código en la consola
    // del navegador ("self-XSS"). Este aviso — patrón usado por Facebook,
    // Google y otros — sirve de freno social ante ese vector.
    try {
        console.log('%c¡Alto!', 'color: #b03c1c; font-size: 48px; font-weight: 700; text-shadow: 2px 2px 0 #3b130e;');
        console.log('%cEsta es una función del navegador pensada para desarrolladores. Si alguien te pidió copiar y pegar algo aquí, es muy probable que sea una estafa para tomar control de tu cuenta o información.', 'color: #3b130e; font-size: 14px; line-height: 1.5;');
        console.log('%cSi no entiendes a fondo lo que haces aquí, cierra esta ventana.', 'color: #6b2410; font-size: 13px; font-style: italic;');
    }
    catch {
        // Algunos entornos embebidos no exponen console — ignorar silenciosamente.
    }
    // Helper tipado: falla ruidosamente si el nodo no existe.
    const byId = (id) => {
        const el = document.getElementById(id);
        if (!el)
            throw new Error(`[main] Elemento #${id} no encontrado en el DOM`);
        return el;
    };
    // ---------- 1. NAV SCROLL ----------
    const nav = byId('nav');
    const onScroll = () => {
        if (window.scrollY > 40)
            nav.classList.add('scrolled');
        else
            nav.classList.remove('scrolled');
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    // ---------- 2. MOBILE MENU ----------
    const burger = byId('burger');
    const mobileMenu = byId('mobileMenu');
    const closeMenu = byId('closeMenu');
    burger.addEventListener('click', () => mobileMenu.classList.add('open'));
    closeMenu.addEventListener('click', () => mobileMenu.classList.remove('open'));
    document.querySelectorAll('[data-close]').forEach(a => a.addEventListener('click', () => mobileMenu.classList.remove('open')));
    // ---------- 3. MENU FILTERING ----------
    const tabs = document.querySelectorAll('.menu__tab');
    const dishes = document.querySelectorAll('.dish');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const cat = tab.dataset.cat ?? 'todos';
            tabs.forEach(t => {
                t.classList.remove('active');
                t.setAttribute('aria-selected', 'false');
            });
            tab.classList.add('active');
            tab.setAttribute('aria-selected', 'true');
            dishes.forEach(d => {
                d.hidden = !(cat === 'todos' || d.dataset.cat === cat);
            });
        });
    });
    // ---------- 4. REVEAL ON SCROLL ----------
    if ('IntersectionObserver' in window) {
        const io = new IntersectionObserver((entries) => {
            entries.forEach(e => {
                if (e.isIntersecting) {
                    e.target.classList.add('in');
                    io.unobserve(e.target);
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
        document.querySelectorAll('.reveal').forEach(el => io.observe(el));
    }
    else {
        // Navegador sin IntersectionObserver: revelar todo de una.
        document.querySelectorAll('.reveal').forEach(el => el.classList.add('in'));
    }
    // ---------- 5. YEAR ----------
    byId('year').textContent = String(new Date().getFullYear());
})();
