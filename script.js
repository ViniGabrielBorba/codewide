const btn = document.getElementById('menuBtn');
const nav = document.getElementById('navMobile');
const overlay = document.getElementById('overlay');
const closeBtn = document.getElementById('navClose');
const navLinks = nav.querySelectorAll('.nav-link');

let firstFocusable, lastFocusable;

function openMenu() {
  nav.classList.add('active');
  overlay.classList.add('active');
  nav.setAttribute('aria-hidden', 'false');
  overlay.setAttribute('aria-hidden', 'false');
  btn.setAttribute('aria-expanded', 'true');
  document.body.style.overflow = 'hidden';

  // Focus trap
  const focusables = nav.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
  firstFocusable = focusables[0];
  lastFocusable = focusables[focusables.length - 1];
  
  requestAnimationFrame(() => firstFocusable.focus());
}

function closeMenu() {
  nav.classList.remove('active');
  overlay.classList.remove('active');
  nav.setAttribute('aria-hidden', 'true');
  overlay.setAttribute('aria-hidden', 'true');
  btn.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
  btn.focus();
}

// Event listeners
btn.addEventListener('click', () => nav.classList.contains('active') ? closeMenu() : openMenu());
closeBtn.addEventListener('click', closeMenu);
overlay.addEventListener('click', closeMenu);
navLinks.forEach(link => link.addEventListener('click', () => setTimeout(closeMenu, 50)));

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && nav.classList.contains('active')) closeMenu();

  // Focus trap
  if (e.key === 'Tab' && nav.classList.contains('active')) {
    if (e.shiftKey && document.activeElement === firstFocusable) {
      e.preventDefault();
      lastFocusable.focus();
    } else if (!e.shiftKey && document.activeElement === lastFocusable) {
      e.preventDefault();
      firstFocusable.focus();
    }
  }
});
