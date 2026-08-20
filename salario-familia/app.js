
var LIMITE_RENDA = 1980.38;
var COTA = 67.54;

function formatBRL(v){
  return v.toLocaleString('pt-BR', {minimumFractionDigits:2, maximumFractionDigits:2});
}

function calcular(){
  var categoria = document.getElementById('categoria').value;
  var remuneracao = parseFloat(document.getElementById('remuneracao').value) || 0;
  var filhos = parseInt(document.getElementById('filhos').value) || 0;
  var box = document.getElementById('resultado');
  box.classList.add('show');

  if(categoria === 'outro'){
    box.className = 'result show status-warn';
    document.getElementById('r-label').textContent = 'Fora do público do benefício';
    document.getElementById('r-value').textContent = 'Salário-família é só pra empregado, doméstico ou avulso';
    document.getElementById('r-note').textContent = 'Contribuintes individuais, facultativos e MEI não têm direito ao salário-família — só empregados com carteira assinada, empregados domésticos e trabalhadores avulsos.';
    return;
  }

  if(remuneracao <= 0 || filhos <= 0){
    box.className = 'result show status-warn';
    document.getElementById('r-label').textContent = 'Falta informação';
    document.getElementById('r-value').textContent = 'Informe a remuneração e o nº de filhos';
    document.getElementById('r-note').textContent = 'Preencha os dois campos pra calcular o valor do benefício.';
    return;
  }

  if(remuneracao > LIMITE_RENDA){
    box.className = 'result show status-warn';
    document.getElementById('r-label').textContent = 'Fora do limite de renda';
    document.getElementById('r-value').textContent = 'Sem direito neste mês';
    document.getElementById('r-note').textContent = 'O limite em 2026 é de R$ ' + formatBRL(LIMITE_RENDA) + ' de remuneração mensal. Se sua remuneração variar mês a mês (com horas extras, por exemplo), você pode ter direito só nos meses em que ficar dentro do limite.';
    return;
  }

  var valorFinal = COTA * filhos;
  box.className = 'result show status-good';
  document.getElementById('r-label').textContent = 'Valor mensal estimado';
  document.getElementById('r-value').textContent = 'R$ ' + formatBRL(valorFinal);
  document.getElementById('r-note').textContent = 'Cota de R$ ' + formatBRL(COTA) + ' por filho, para ' + filhos + (filhos === 1 ? ' filho' : ' filhos') + ' de até 14 anos (ou inválido de qualquer idade). Pago junto com o salário, mês a mês, enquanto durarem as condições.';
}
