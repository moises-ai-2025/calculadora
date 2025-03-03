// Elementos DOM
const themeToggleBtn = document.getElementById('theme-toggle-btn');
const alturaInput = document.getElementById('altura');
const pesoInput = document.getElementById('peso');
const calcularBtn = document.getElementById('calcular-imc');
const resultadoDiv = document.getElementById('imc-result');

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
  // Carregar tema do localStorage
  loadTheme();
  
  // Adicionar event listeners
  setupEventListeners();
});

// Configurar event listeners
function setupEventListeners() {
  // Alternar tema
  themeToggleBtn.addEventListener('click', toggleTheme);
  
  // Calcular IMC
  calcularBtn.addEventListener('click', calcularIMC);
  
  // Permitir cálculo ao pressionar Enter
  alturaInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      pesoInput.focus();
    }
  });
  
  pesoInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      calcularIMC();
    }
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

// Calcular IMC
function calcularIMC() {
  // Obter valores dos inputs
  const altura = parseFloat(alturaInput.value);
  const peso = parseFloat(pesoInput.value);
  
  // Validar inputs
  if (isNaN(altura) || isNaN(peso) || altura <= 0 || peso <= 0) {
    mostrarErro('Por favor, insira valores válidos para altura e peso.');
    return;
  }
  
  // Converter altura de cm para m
  const alturaMetros = altura / 100;
  
  // Calcular IMC
  const imc = peso / (alturaMetros * alturaMetros);
  
  // Determinar categoria
  const categoria = getCategoriaIMC(imc);
  
  // Exibir resultado
  mostrarResultado(imc, categoria);
  
  // Salvar no histórico
  salvarHistorico(altura, peso, imc, categoria);
}

// Obter categoria do IMC
function getCategoriaIMC(imc) {
  if (imc < 18.5) {
    return {
      nome: 'Abaixo do peso',
      classe: 'category-underweight',
      descricao: 'Você está abaixo do peso ideal. Isso pode estar associado a alguns problemas de saúde.',
      recomendacoes: [
        'Consulte um nutricionista para um plano alimentar adequado',
        'Aumente a ingestão calórica com alimentos saudáveis',
        'Considere exercícios de fortalecimento muscular'
      ]
    };
  } else if (imc < 25) {
    return {
      nome: 'Peso normal',
      classe: 'category-normal',
      descricao: 'Parabéns! Você está com o peso ideal para sua altura.',
      recomendacoes: [
        'Mantenha uma alimentação balanceada',
        'Pratique atividades físicas regularmente',
        'Faça check-ups médicos periódicos'
      ]
    };
  } else if (imc < 30) {
    return {
      nome: 'Sobrepeso',
      classe: 'category-overweight',
      descricao: 'Você está com sobrepeso. Isso pode aumentar o risco de problemas de saúde.',
      recomendacoes: [
        'Adote uma dieta balanceada com redução calórica moderada',
        'Aumente a atividade física (pelo menos 150 min/semana)',
        'Consulte um profissional de saúde para orientações específicas'
      ]
    };
  } else if (imc < 35) {
    return {
      nome: 'Obesidade Grau I',
      classe: 'category-obese1',
      descricao: 'Você está com obesidade grau I. Isso aumenta significativamente o risco de problemas de saúde.',
      recomendacoes: [
        'Consulte um médico para avaliação completa',
        'Busque orientação nutricional profissional',
        'Inicie um programa de exercícios adequado à sua condição'
      ]
    };
  } else if (imc < 40) {
    return {
      nome: 'Obesidade Grau II',
      classe: 'category-obese2',
      descricao: 'Você está com obesidade grau II. O risco para sua saúde é alto.',
      recomendacoes: [
        'Procure acompanhamento médico regular',
        'Siga um plano alimentar supervisionado por profissional',
        'Considere atividades físicas sob orientação especializada'
      ]
    };
  } else {
    return {
      nome: 'Obesidade Grau III',
      classe: 'category-obese3',
      descricao: 'Você está com obesidade grau III. O risco para sua saúde é extremamente alto.',
      recomendacoes: [
        'Busque tratamento médico especializado com urgência',
        'Siga rigorosamente as orientações médicas e nutricionais',
        'Considere todas as opções de tratamento disponíveis'
      ]
    };
  }
}

// Mostrar resultado do IMC
function mostrarResultado(imc, categoria) {
  // Formatar o IMC para 1 casa decimal
  const imcFormatado = imc.toFixed(1);
  
  // Criar HTML do resultado
  const resultadoHTML = `
    <div class="imc-value">
      <h3>Seu IMC é</h3>
      <div class="imc-number ${categoria.classe}">${imcFormatado}</div>
      <div class="imc-category ${categoria.classe}">${categoria.nome}</div>
    </div>
    
    <div class="imc-details">
      <h4>O que isso significa?</h4>
      <p>${categoria.descricao}</p>
      
      <h4>Recomendações:</h4>
      <ul>
        ${categoria.recomendacoes.map(rec => `<li>${rec}</li>`).join('')}
      </ul>
    </div>
  `;
  
  // Atualizar o conteúdo da div de resultado
  resultadoDiv.innerHTML = resultadoHTML;
  
  // Adicionar animação
  resultadoDiv.style.opacity = '0';
  setTimeout(() => {
    resultadoDiv.style.opacity = '1';
  }, 100);
}

// Mostrar mensagem de erro
function mostrarErro(mensagem) {
  resultadoDiv.innerHTML = `
    <div class="result-placeholder" style="color: var(--danger-color)">
      <i class="fas fa-exclamation-circle"></i>
      <p>${mensagem}</p>
    </div>
  `;
}

// Salvar cálculo no histórico
function salvarHistorico(altura, peso, imc, categoria) {
  // Obter histórico existente ou criar novo
  let historico = JSON.parse(localStorage.getItem('imcHistorico')) || [];
  
  // Adicionar novo cálculo
  historico.unshift({
    data: new Date().toISOString(),
    altura: altura,
    peso: peso,
    imc: imc,
    categoria: categoria.nome
  });
  
  // Limitar a 10 entradas
  if (historico.length > 10) {
    historico = historico.slice(0, 10);
  }
  
  // Salvar no localStorage
  localStorage.setItem('imcHistorico', JSON.stringify(historico));
}
