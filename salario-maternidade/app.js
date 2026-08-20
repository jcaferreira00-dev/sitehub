
var SALARIO_MINIMO = 1621.00;
var TETO_INSS = 8475.55;

function formatBRL(v){
  return v.toLocaleString('pt-BR', {minimumFractionDigits:2, maximumFractionDigits:2});
}

function atualizarCampos(){
  var categoria = document.getElementById('categoria').value;
  var salarioField = document.getElementById('salarioField');
  var carenciaField = document.getElementById('carenciaField');
  var salarioLabel = document.getElementById('salarioLabel');
  var salarioHint = document.getElementById('salarioHint');

  if(categoria === 'rural'){
    salarioField.style.display = 'none';
  } else {
    salarioField.style.display = 'block';
  }

  if(categoria === 'clt' || categoria === 'domestica'){
    carenciaField.style.display = 'none';
  } else {
    carenciaField.style.display = 'block';
  }

  if(categoria === 'clt'){
    salarioLabel.textContent = 'Seu salário mensal (R$)';
    salarioHint.textContent = 'Valor pago pelo empregador, sem limite do teto do INSS.';
  } else if(categoria === 'domestica'){
    salarioLabel.textContent = 'Seu salário mensal (R$)';
    salarioHint.textContent = 'Pago diretamente pelo INSS, respeitando o teto de R$ ' + formatBRL(TETO_INSS) + '.';
  } else if(categoria === 'individual'){
    salarioLabel.textContent = 'Média das suas últimas 12 contribuições (R$)';
    salarioHint.textContent = 'Some os salários de contribuição dos últimos 12 meses e divida por 12.';
  } else if(categoria === 'desempregada'){
    salarioLabel.textContent = 'Média salarial dos últimos meses trabalhados (R$)';
    salarioHint.textContent = 'Considerando os últimos vínculos ou contribuições antes da demissão.';
  }

  document.getElementById('resultado').classList.remove('show');
}

function calcular(){
  var categoria = document.getElementById('categoria').value;
  var salario = parseFloat(document.getElementById('salario').value) || 0;
  var carenciaField = document.getElementById('carenciaField');
  var carenciaOk = carenciaField.style.display === 'none' ? true : document.getElementById('carencia').checked;
  var box = document.getElementById('resultado');
  box.classList.add('show');

  if(categoria !== 'rural' && salario <= 0){
    box.className = 'result show status-warn';
    document.getElementById('r-label').textContent = 'Falta informação';
    document.getElementById('r-value').textContent = 'Informe o valor do salário ou média';
    document.getElementById('r-note').textContent = 'Preencha o campo acima pra calcular o valor estimado do benefício.';
    return;
  }

  if(!carenciaOk){
    box.className = 'result show status-warn';
    document.getElementById('r-label').textContent = 'Carência não confirmada';
    document.getElementById('r-value').textContent = 'É preciso comprovar 10 contribuições';
    document.getElementById('r-note').textContent = 'Nessa categoria, o INSS exige pelo menos 10 contribuições mensais antes do parto (prazo reduzido proporcionalmente em caso de parto antecipado). Sem isso, o pedido tende a ser negado — regularize as contribuições antes de solicitar.';
    return;
  }

  var valorFinal, duracaoTexto, notaExtra;

  if(categoria === 'rural'){
    valorFinal = SALARIO_MINIMO;
    duracaoTexto = '120 dias corridos';
    notaExtra = 'Segurada especial (trabalhadora rural em regime de economia familiar) recebe sempre 1 salário mínimo, independente de valores de produção.';
  } else if(categoria === 'clt'){
    valorFinal = salario;
    duracaoTexto = '120 dias corridos (180 dias se a empresa participa do Empresa Cidadã)';
    notaExtra = 'Pago integralmente pelo empregador na folha, sem aplicar o teto do INSS — só em salários muito altos entra o limite do subsídio de Ministro do STF.';
  } else {
    valorFinal = Math.min(Math.max(salario, SALARIO_MINIMO), TETO_INSS);
    duracaoTexto = '120 dias corridos';
    if(salario < SALARIO_MINIMO){
      notaExtra = 'O valor informado é menor que o salário mínimo — o benefício nunca pode ser pago abaixo do piso de R$ ' + formatBRL(SALARIO_MINIMO) + '.';
    } else if(salario > TETO_INSS){
      notaExtra = 'O valor informado passa do teto do INSS — o benefício fica limitado a R$ ' + formatBRL(TETO_INSS) + '.';
    } else {
      notaExtra = 'Calculado com base na média informada, dentro dos limites do INSS (piso R$ ' + formatBRL(SALARIO_MINIMO) + ' e teto R$ ' + formatBRL(TETO_INSS) + ').';
    }
  }

  box.className = 'result show status-good';
  document.getElementById('r-label').textContent = 'Valor mensal estimado';
  document.getElementById('r-value').textContent = 'R$ ' + formatBRL(valorFinal);
  document.getElementById('r-note').textContent = 'Duração: ' + duracaoTexto + '. ' + notaExtra;
}
