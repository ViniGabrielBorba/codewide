// ============================
// MENU MOBILE
// ============================
(function() {
  const btn = document.getElementById('menuBtn');
  const nav = document.getElementById('navMobile');
  const overlay = document.getElementById('overlay');
  const closeBtn = document.getElementById('navClose');

  if (!btn || !nav || !overlay || !closeBtn) return;

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
    if (focusables.length > 0) {
      firstFocusable = focusables[0];
      lastFocusable = focusables[focusables.length - 1];
      requestAnimationFrame(() => firstFocusable.focus());
    }
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
})();

// ============================
// COOKIE CONSENT
// ============================
(function() {
  const consent = document.getElementById('cookieConsent');
  const btn = document.getElementById('acceptCookiesBtn');

  if (!consent || !btn) return;

  if (!localStorage.getItem('cookiesAccepted')) {
    setTimeout(() => {
      consent.style.bottom = '20px';
      consent.style.opacity = '1';
    }, 500);
  } else {
    consent.style.display = 'none';
  }

  btn.addEventListener('click', () => {
    consent.style.bottom = '-120px';
    consent.style.opacity = '0';
    localStorage.setItem('cookiesAccepted', 'true');
    setTimeout(() => {
      consent.style.display = 'none';
    }, 500);
  });
})();

// ============================
// VALIDAÇÃO DE FORMULÁRIO
// ============================
(function() {
  const form = document.getElementById('whatsappForm');
  if (!form) return;

  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  function showError(input, message) {
    input.style.borderColor = '#ff6b8a';
    input.style.background = 'rgba(255, 107, 138, 0.1)';
    
    let errorDiv = input.parentElement.querySelector('.error-message');
    if (!errorDiv) {
      errorDiv = document.createElement('div');
      errorDiv.className = 'error-message';
      errorDiv.style.color = '#ff6b8a';
      errorDiv.style.fontSize = '14px';
      errorDiv.style.marginTop = '4px';
      input.parentElement.appendChild(errorDiv);
    }
    errorDiv.textContent = message;
  }

  function clearError(input) {
    input.style.borderColor = '';
    input.style.background = '';
    const errorDiv = input.parentElement.querySelector('.error-message');
    if (errorDiv) {
      errorDiv.remove();
    }
  }

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const nome = form.nome.value.trim();
    const email = form.email.value.trim();
    const mensagem = form.mensagem.value.trim();

    let isValid = true;

    // Validação de nome
    if (nome.length < 2) {
      showError(form.nome, 'Nome deve ter pelo menos 2 caracteres');
      isValid = false;
    } else {
      clearError(form.nome);
    }

    // Validação de email
    if (!validateEmail(email)) {
      showError(form.email, 'Por favor, insira um email válido');
      isValid = false;
    } else {
      clearError(form.email);
    }

    // Validação de mensagem
    if (mensagem.length < 10) {
      showError(form.mensagem, 'Mensagem deve ter pelo menos 10 caracteres');
      isValid = false;
    } else {
      clearError(form.mensagem);
    }

    if (isValid) {
      const phone = "5581994201799";
      const text = `Olá, meu nome é ${nome}.\nEmail: ${email}\nMensagem: ${mensagem}`;
      const url = `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
      window.open(url, "_blank");
      form.reset();
      
      // Mostrar mensagem de sucesso
      const successMsg = document.createElement('div');
      successMsg.className = 'success-message';
      successMsg.style.cssText = 'color: #4ade80; padding: 12px; background: rgba(74, 222, 128, 0.1); border-radius: 8px; margin-top: 16px; text-align: center;';
      successMsg.textContent = '✓ Mensagem enviada com sucesso!';
      form.parentElement.appendChild(successMsg);
      
      setTimeout(() => {
        successMsg.remove();
      }, 5000);
    }
  });

  // Limpar erros ao digitar
  ['nome', 'email', 'mensagem'].forEach(field => {
    const input = form[field];
    if (input) {
      input.addEventListener('input', () => clearError(input));
    }
  });
})();

// ============================
// INDICADOR DE PÁGINA ATIVA
// ============================
(function() {
  // Pegar a página atual, decodificando caracteres especiais
  let currentPage = window.location.pathname.split('/').pop() || 'index.html';
  currentPage = decodeURIComponent(currentPage).toLowerCase();
  
  const navLinks = document.querySelectorAll('.nav-desktop a, .nav-mobile .nav-link');
  
  navLinks.forEach(link => {
    let linkPath = link.getAttribute('href');
    // Decodificar e normalizar o caminho do link
    linkPath = decodeURIComponent(linkPath).toLowerCase();
    
    // Comparar páginas (incluindo index.html como raiz)
    if (linkPath === currentPage || 
        (currentPage === '' && linkPath === 'index.html') ||
        (currentPage === 'index.html' && linkPath === 'index.html')) {
      link.classList.add('active');
    }
  });
})();
