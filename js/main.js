// Elementos DOM
const themeToggleBtn = document.getElementById('theme-toggle-btn');
const miniExpression = document.getElementById('mini-expression');
const miniResult = document.getElementById('mini-result');

// Variáveis para a mini calculadora
let currentExpression = '';
let lastResult = null;
let isNewCalculation = true;

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
  // Carregar tema do localStorage
  loadTheme();
  
  // Adicionar event listeners
  setupEventListeners();
  
  // Animação de scroll suave para links internos
  setupSmoothScroll();
  
  // Animação para cards de calculadoras
  setupCardAnimations();
});

// Configurar event listeners
function setupEventListeners() {
  // Alternar tema
  themeToggleBtn.addEventListener('click', toggleTheme);
  
  // Adicionar event listener para links de navegação
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      
      if (targetElement) {
        const headerHeight = document.querySelector('header').offsetHeight;
        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

// Alternar tema (claro/escuro)
function toggleTheme() {
  const body = document.body;
  const icon = themeToggleBtn.querySelector('i');
  
  if (body.classList.contains('dark-theme')) {
    body.classList.remove('dark-theme');
    icon.className = 'fas fa-moon';
    localStorage.setItem('theme', 'light');
  } else {
    body.classList.add('dark-theme');
    icon.className = 'fas fa-sun';
    localStorage.setItem('theme', 'dark');
  }
}

// Carregar tema do localStorage
function loadTheme() {
  const savedTheme = localStorage.getItem('theme');
  const icon = themeToggleBtn.querySelector('i');
  
  if (savedTheme === 'dark') {
    document.body.classList.add('dark-theme');
    icon.className = 'fas fa-sun';
  }
}

// Configurar scroll suave
function setupSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      
      if (targetElement) {
        const headerHeight = document.querySelector('header').offsetHeight;
        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

// Configurar animações para cards
function setupCardAnimations() {
  const calcCards = document.querySelectorAll('.calc-card');
  
  calcCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.style.transform = 'translateY(-10px)';
      card.style.boxShadow = '0 15px 30px var(--shadow-color)';
    });
    
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'translateY(0)';
      card.style.boxShadow = '0 5px 15px var(--shadow-color)';
    });
  });
}

// Mini Calculadora
function miniCalc(value) {
  // Se for um novo cálculo após um resultado
  if (isNewCalculation && !isNaN(parseInt(value)) && miniExpression.textContent.includes('=')) {
    miniExpression.textContent = '';
    miniResult.textContent = '';
    currentExpression = '';
  }
  
  isNewCalculation = false;
  
  switch (value) {
    case 'clear':
      miniExpression.textContent = '';
      miniResult.textContent = '0';
      currentExpression = '';
      break;
      
    case 'backspace':
      if (currentExpression.length > 0) {
        currentExpression = currentExpression.slice(0, -1);
        miniResult.textContent = currentExpression || '0';
      }
      break;
      
    case 'sign':
      if (currentExpression.startsWith('-')) {
        currentExpression = currentExpression.substring(1);
      } else if (currentExpression !== '') {
        currentExpression = '-' + currentExpression;
      }
      miniResult.textContent = currentExpression || '0';
      break;
      
    case '=':
      try {
        // Guardar a expressão original para exibição
        const originalExpression = currentExpression;
        
        // Avaliar a expressão
        const result = eval(currentExpression);
        
        // Formatar o resultado
        const formattedResult = typeof result === 'number' ? 
          (Number.isInteger(result) ? result.toString() : parseFloat(result.toFixed(8)).toString()) : 
          result.toString();
        
        // Atualizar a expressão e o resultado
        miniExpression.textContent = originalExpression + ' =';
        miniResult.textContent = formattedResult;
        
        // Preparar para o próximo cálculo
        currentExpression = formattedResult;
        isNewCalculation = true;
      } catch (error) {
        miniResult.textContent = 'Erro';
        setTimeout(() => {
          miniResult.textContent = currentExpression || '0';
        }, 1000);
      }
      break;
      
    default:
      // Adicionar o valor à expressão
      currentExpression += value;
      miniResult.textContent = currentExpression;
  }
}

// Detectar scroll para efeitos na navegação
window.addEventListener('scroll', () => {
  const header = document.querySelector('header');
  
  if (window.scrollY > 50) {
    header.style.boxShadow = '0 5px 15px var(--shadow-color)';
  } else {
    header.style.boxShadow = '0 2px 10px var(--shadow-color)';
  }
});
