// Variáveis globais
let expressionHistory = [];
let currentTheme = 'light';

// Elementos DOM
const resultadoElement = document.getElementById('resultado');
const expressionElement = document.getElementById('expression');
const historyListElement = document.getElementById('history-list');
const themeToggleButton = document.getElementById('theme-toggle-btn');
const calcThemeToggleButton = document.getElementById('calc-theme-toggle');
const basicTab = document.getElementById('basic-tab');
const scientificTab = document.getElementById('scientific-tab');
const historyTab = document.getElementById('history-tab');
const basicCalculator = document.getElementById('basic-calculator');
const scientificCalculator = document.getElementById('scientific-calculator');
const historyPanel = document.getElementById('history-panel');
const clearHistoryButton = document.getElementById('clear-history');

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
  // Carregar histórico do localStorage
  loadHistory();
  
  // Carregar tema do localStorage
  loadTheme();
  
  // Adicionar event listeners
  setupEventListeners();
  
  // Adicionar suporte para teclado
  setupKeyboardSupport();
});

// Configurar event listeners
function setupEventListeners() {
  // Alternar entre abas
  basicTab.addEventListener('click', () => switchTab('basic'));
  scientificTab.addEventListener('click', () => switchTab('scientific'));
  historyTab.addEventListener('click', () => switchTab('history'));
  
  // Alternar tema
  themeToggleButton.addEventListener('click', toggleTheme);
  calcThemeToggleButton.addEventListener('click', toggleTheme);
  
  // Limpar histórico
  clearHistoryButton.addEventListener('click', clearHistory);
}

// Função para inserir números e operadores na calculadora
function insert(value) {
  const currentValue = resultadoElement.innerHTML;
  
  // Verificar se o valor atual é um resultado de cálculo
  if (expressionElement.innerHTML.includes('=')) {
    if (['+', '-', '*', '/'].includes(value)) {
      // Se for um operador, continue a partir do resultado
      expressionElement.innerHTML = '';
    } else {
      // Se for um número ou outro caractere, comece um novo cálculo
      expressionElement.innerHTML = '';
      resultadoElement.innerHTML = '';
    }
  }
  
  resultadoElement.innerHTML = currentValue + value;
}

// Função para inserir funções matemáticas
function insertFunction(func, power = null) {
  const currentValue = resultadoElement.innerHTML;
  
  if (power) {
    // Para potências (x², x³, etc.)
    resultadoElement.innerHTML = `${func}${currentValue}, ${power})`;
  } else {
    // Para outras funções (sin, cos, etc.)
    resultadoElement.innerHTML = `${func}${currentValue})`;
  }
}

// Função para limpar a tela da calculadora
function clean() {
  resultadoElement.innerHTML = '';
  expressionElement.innerHTML = '';
}

// Função para remover o último caractere da tela da calculadora
function back() {
  const currentValue = resultadoElement.innerHTML;
  resultadoElement.innerHTML = currentValue.substring(0, currentValue.length - 1);
}

// Função para alternar o sinal do número (positivo/negativo)
function toggleSign() {
  const currentValue = resultadoElement.innerHTML;
  
  if (currentValue.startsWith('-')) {
    resultadoElement.innerHTML = currentValue.substring(1);
  } else if (currentValue !== '') {
    resultadoElement.innerHTML = '-' + currentValue;
  }
}

// Função para calcular o resultado da expressão
function calcular() {
  const expression = resultadoElement.innerHTML;
  
  if (expression) {
    try {
      // Substituir × por * e ÷ por / para avaliação
      const sanitizedExpression = expression
        .replace(/×/g, '*')
        .replace(/÷/g, '/')
        .replace(/−/g, '-');
      
      // Avaliar a expressão
      const result = eval(sanitizedExpression);
      
      // Formatar o resultado
      const formattedResult = formatResult(result);
      
      // Atualizar a expressão e o resultado
      expressionElement.innerHTML = expression + ' =';
      resultadoElement.innerHTML = formattedResult;
      
      // Adicionar ao histórico
      addToHistory(expression, formattedResult);
    } catch (error) {
      resultadoElement.innerHTML = 'Erro';
      setTimeout(() => {
        resultadoElement.innerHTML = expression;
      }, 1000);
    }
  }
}

// Formatar o resultado para exibição
function formatResult(result) {
  // Se for um número, limitar a 8 casas decimais
  if (typeof result === 'number') {
    if (Number.isInteger(result)) {
      return result.toString();
    } else {
      return parseFloat(result.toFixed(8)).toString();
    }
  }
  return result.toString();
}

// Adicionar cálculo ao histórico
function addToHistory(expression, result) {
  // Adicionar ao array de histórico
  expressionHistory.unshift({ expression, result });
  
  // Limitar o histórico a 10 itens
  if (expressionHistory.length > 10) {
    expressionHistory.pop();
  }
  
  // Atualizar o histórico na interface
  updateHistoryDisplay();
  
  // Salvar no localStorage
  saveHistory();
}

// Atualizar a exibição do histórico
function updateHistoryDisplay() {
  // Limpar o histórico atual
  historyListElement.innerHTML = '';
  
  // Se não houver histórico, mostrar mensagem
  if (expressionHistory.length === 0) {
    historyListElement.innerHTML = '<p class="history-empty">Nenhum cálculo realizado ainda.</p>';
    return;
  }
  
  // Adicionar cada item do histórico
  expressionHistory.forEach((item, index) => {
    const historyItem = document.createElement('div');
    historyItem.className = 'history-item';
    historyItem.innerHTML = `
      <div class="history-expression">${item.expression}</div>
      <div class="history-result">${item.result}</div>
    `;
    
    // Adicionar evento de clique para reutilizar o cálculo
    historyItem.addEventListener('click', () => {
      resultadoElement.innerHTML = item.result;
      expressionElement.innerHTML = item.expression + ' =';
      switchTab('basic');
    });
    
    historyListElement.appendChild(historyItem);
  });
}

// Salvar histórico no localStorage
function saveHistory() {
  localStorage.setItem('calculatorHistory', JSON.stringify(expressionHistory));
}

// Carregar histórico do localStorage
function loadHistory() {
  const savedHistory = localStorage.getItem('calculatorHistory');
  if (savedHistory) {
    expressionHistory = JSON.parse(savedHistory);
    updateHistoryDisplay();
  }
}

// Limpar histórico
function clearHistory() {
  expressionHistory = [];
  updateHistoryDisplay();
  localStorage.removeItem('calculatorHistory');
}

// Alternar entre abas
function switchTab(tab) {
  // Remover classe active de todas as abas
  basicTab.classList.remove('active');
  scientificTab.classList.remove('active');
  historyTab.classList.remove('active');
  basicCalculator.classList.remove('active');
  scientificCalculator.classList.remove('active');
  historyPanel.classList.remove('active');
  
  // Adicionar classe active à aba selecionada
  if (tab === 'basic') {
    basicTab.classList.add('active');
    basicCalculator.classList.add('active');
  } else if (tab === 'scientific') {
    scientificTab.classList.add('active');
    scientificCalculator.classList.add('active');
  } else if (tab === 'history') {
    historyTab.classList.add('active');
    historyPanel.classList.add('active');
  }
}

// Alternar tema (claro/escuro)
function toggleTheme() {
  const body = document.body;
  const themeIcon = themeToggleButton.querySelector('i');
  
  if (body.classList.contains('dark-theme')) {
    body.classList.remove('dark-theme');
    themeIcon.className = 'fas fa-moon';
    calcThemeToggleButton.textContent = '🌙';
    currentTheme = 'light';
  } else {
    body.classList.add('dark-theme');
    themeIcon.className = 'fas fa-sun';
    calcThemeToggleButton.textContent = '☀️';
    currentTheme = 'dark';
  }
  
  // Salvar tema no localStorage
  localStorage.setItem('calculatorTheme', currentTheme);
}

// Carregar tema do localStorage
function loadTheme() {
  const savedTheme = localStorage.getItem('calculatorTheme');
  const themeIcon = themeToggleButton.querySelector('i');
  
  if (savedTheme === 'dark') {
    document.body.classList.add('dark-theme');
    themeIcon.className = 'fas fa-sun';
    calcThemeToggleButton.textContent = '☀️';
    currentTheme = 'dark';
  }
}

// Configurar suporte para teclado
function setupKeyboardSupport() {
  document.addEventListener('keydown', (event) => {
    const key = event.key;
    
    // Números e operadores
    if (/[0-9]/.test(key)) {
      insert(key);
    } else if (['+', '-', '*', '/', '.', '(', ')'].includes(key)) {
      insert(key);
    } else if (key === 'Enter') {
      calcular();
    } else if (key === 'Escape') {
      clean();
    } else if (key === 'Backspace') {
      back();
    }
  });
}
