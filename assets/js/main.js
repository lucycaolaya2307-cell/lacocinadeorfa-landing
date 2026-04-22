/* ==========================================================================
   La Cocina de Orfa — Main script
   --------------------------------------------------------------------------
   Secciones:
     1. NAV SCROLL       Añade .scrolled al <nav> al bajar 40px
     2. MOBILE MENU      Abre/cierra el overlay móvil (burger / close / links)
     3. MENU FILTERING   Filtra .dish según la tab .menu__tab activa
     4. REVEAL ON SCROLL Añade .in a .reveal cuando entran en viewport
                         (fallback: marca todo como visible sin IO)
     5. YEAR             Inyecta el año actual en #year (footer)

   Este archivo se carga con `defer`, así que se ejecuta después de que
   el HTML haya sido parseado; por eso no necesita DOMContentLoaded.
   ========================================================================== */

(() => {
  'use strict';

  // ---------- 1. NAV SCROLL ----------
  const nav = document.getElementById('nav');
  const onScroll = () => {
    if (window.scrollY > 40) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ---------- 2. MOBILE MENU ----------
  const burger = document.getElementById('burger');
  const mobileMenu = document.getElementById('mobileMenu');
  const closeMenu = document.getElementById('closeMenu');
  burger.addEventListener('click', () => mobileMenu.classList.add('open'));
  closeMenu.addEventListener('click', () => mobileMenu.classList.remove('open'));
  document.querySelectorAll('[data-close]').forEach(a =>
    a.addEventListener('click', () => mobileMenu.classList.remove('open'))
  );

  // ---------- 3. MENU FILTERING ----------
  const tabs = document.querySelectorAll('.menu__tab');
  const dishes = document.querySelectorAll('.dish');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const cat = tab.dataset.cat;
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
  } else {
    // Navegador sin IntersectionObserver: revelar todo de una.
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('in'));
  }

  // ---------- 5. YEAR ----------
  document.getElementById('year').textContent = new Date().getFullYear();
})();
