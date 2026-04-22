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
   ========================================================================== */
(() => {
    'use strict';
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
