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
    input.classList.add('error');
    input.classList.remove('valid');
    
    let errorDiv = input.parentElement.querySelector('.error-message');
    if (!errorDiv) {
      errorDiv = document.createElement('div');
      errorDiv.className = 'error-message';
      input.parentElement.appendChild(errorDiv);
    }
    errorDiv.textContent = message;
    errorDiv.style.opacity = '0';
    requestAnimationFrame(() => {
      errorDiv.style.transition = 'opacity 0.3s ease';
      errorDiv.style.opacity = '1';
    });
  }

  function showValid(input) {
    input.classList.remove('error');
    input.classList.add('valid');
    const errorDiv = input.parentElement.querySelector('.error-message');
    if (errorDiv) {
      errorDiv.style.transition = 'opacity 0.3s ease';
      errorDiv.style.opacity = '0';
      setTimeout(() => errorDiv.remove(), 300);
    }
  }

  function clearError(input) {
    input.classList.remove('error', 'valid');
    const errorDiv = input.parentElement.querySelector('.error-message');
    if (errorDiv) {
      errorDiv.style.transition = 'opacity 0.3s ease';
      errorDiv.style.opacity = '0';
      setTimeout(() => errorDiv.remove(), 300);
    }
  }

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const nome = form.nome.value.trim();
    const email = form.email.value.trim();
    const servico = form.servico.value;
    const mensagem = form.mensagem.value.trim();

    let isValid = true;

    // Validação de nome
    if (nome.length < 2) {
      showError(form.nome, 'Nome deve ter pelo menos 2 caracteres');
      isValid = false;
    } else if (nome.length >= 2) {
      showValid(form.nome);
    }

    // Validação de email
    if (!validateEmail(email)) {
      showError(form.email, 'Por favor, insira um email válido');
      isValid = false;
    } else if (validateEmail(email)) {
      showValid(form.email);
    }

    // Validação de serviço
    if (!servico) {
      showError(form.servico, 'Por favor, selecione um serviço');
      isValid = false;
    } else if (servico) {
      showValid(form.servico);
    }

    // Validação de mensagem
    if (mensagem.length < 10) {
      showError(form.mensagem, 'Mensagem deve ter pelo menos 10 caracteres');
      isValid = false;
    } else if (mensagem.length >= 10) {
      showValid(form.mensagem);
    }

    if (isValid) {
      const phone = "5581994201799";
      const text = `Olá, meu nome é ${nome}.\nEmail: ${email}\nServiço escolhido: ${servico}\nMensagem: ${mensagem}`;
      const url = `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
      window.open(url, "_blank");
      form.reset();
      
      // Limpar estados de validação
      form.querySelectorAll('.error, .valid').forEach(el => {
        el.classList.remove('error', 'valid');
      });

      // Mostrar mensagem de sucesso com animação
      const existingMsg = form.parentElement.querySelector('.success-message');
      if (existingMsg) existingMsg.remove();
      
      const successMsg = document.createElement('div');
      successMsg.className = 'success-message';
      successMsg.textContent = '✓ Mensagem enviada com sucesso!';
      successMsg.style.opacity = '0';
      successMsg.style.transform = 'translateY(-10px)';
      form.parentElement.appendChild(successMsg);
      
      requestAnimationFrame(() => {
        successMsg.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
        successMsg.style.opacity = '1';
        successMsg.style.transform = 'translateY(0)';
      });
      
      setTimeout(() => {
        successMsg.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
        successMsg.style.opacity = '0';
        successMsg.style.transform = 'translateY(-10px)';
        setTimeout(() => successMsg.remove(), 400);
      }, 4000);
    }
  });

  // Validação em tempo real
  ['nome', 'email', 'servico', 'mensagem'].forEach(field => {
    const input = form[field];
    if (!input) return;

    input.addEventListener('blur', function() {
      const value = field === 'servico' ? this.value : this.value.trim();
      
      if (field === 'nome') {
        if (value.length < 2) {
          showError(this, 'Nome deve ter pelo menos 2 caracteres');
        } else if (value.length >= 2) {
          showValid(this);
        }
      } else if (field === 'email') {
        if (value && !validateEmail(value)) {
          showError(this, 'Por favor, insira um email válido');
        } else if (value && validateEmail(value)) {
          showValid(this);
        } else {
          clearError(this);
        }
      } else if (field === 'servico') {
        if (!value) {
          showError(this, 'Por favor, selecione um serviço');
        } else if (value) {
          showValid(this);
        }
      } else if (field === 'mensagem') {
        if (value.length < 10) {
          showError(this, 'Mensagem deve ter pelo menos 10 caracteres');
        } else if (value.length >= 10) {
          showValid(this);
        }
      }
    });

    input.addEventListener('input', function() {
      if (this.classList.contains('error')) {
        const value = field === 'servico' ? this.value : this.value.trim();
        if (field === 'nome' && value.length >= 2) {
          showValid(this);
        } else if (field === 'email' && value && validateEmail(value)) {
          showValid(this);
        } else if (field === 'servico' && value) {
          showValid(this);
        } else if (field === 'mensagem' && value.length >= 10) {
          showValid(this);
        }
      }
    });

    // Para select, usar evento 'change' também
    if (field === 'servico' && input.tagName === 'SELECT') {
      input.addEventListener('change', function() {
        const value = this.value;
        if (value) {
          showValid(this);
        } else {
          showError(this, 'Por favor, selecione um serviço');
        }
      });
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

// ============================
// TOGGLE DE TEMA (MODO ESCURO/CLARO)
// ============================
(function() {
  const themeToggle = document.getElementById('themeToggle');
  const html = document.documentElement;
  
  // Função para obter tema salvo ou preferência do sistema
  function getInitialTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      return savedTheme;
    }
    // Verificar preferência do sistema
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
      return 'light';
    }
    return 'dark'; // Padrão: escuro
  }
  
  // Aplicar tema inicial
  function applyTheme(theme) {
    html.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    
    // Atualizar meta theme-color para mobile
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', theme === 'light' ? '#FFFFFF' : '#000000');
    }
  }
  
  // Alternar tema
  function toggleTheme() {
    const currentTheme = html.getAttribute('data-theme') || 'dark';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    applyTheme(newTheme);
    
    // Animação suave no botão
    if (themeToggle) {
      themeToggle.style.transform = 'scale(0.9)';
      setTimeout(() => {
        themeToggle.style.transform = 'scale(1)';
      }, 150);
    }
  }
  
  // Inicializar tema
  const initialTheme = getInitialTheme();
  applyTheme(initialTheme);
  
  // Event listener no botão
  if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
    themeToggle.setAttribute('aria-label', initialTheme === 'dark' ? 'Ativar modo claro' : 'Ativar modo escuro');
  }
  
  // Atualizar aria-label quando o tema muda
  const observer = new MutationObserver(() => {
    if (themeToggle) {
      const currentTheme = html.getAttribute('data-theme') || 'dark';
      themeToggle.setAttribute('aria-label', currentTheme === 'dark' ? 'Ativar modo claro' : 'Ativar modo escuro');
    }
  });
  
  observer.observe(html, {
    attributes: true,
    attributeFilter: ['data-theme']
  });
  
  // Escutar mudanças na preferência do sistema (opcional)
  if (window.matchMedia) {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: light)');
    mediaQuery.addEventListener('change', (e) => {
      // Só aplicar se o usuário não tiver escolhido um tema manualmente
      if (!localStorage.getItem('theme')) {
        applyTheme(e.matches ? 'light' : 'dark');
      }
    });
  }
})();
