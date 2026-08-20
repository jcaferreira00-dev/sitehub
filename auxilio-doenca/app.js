
var SALARIO_MINIMO = 1621.00;
var TETO_INSS = 8475.55;

function formatBRL(v){
  return v.toLocaleString('pt-BR', {minimumFractionDigits:2, maximumFractionDigits:2});
}

function atualizarCampos(){
  var motivo = document.getElementById('motivo').value;
  var carenciaField = document.getElementById('carenciaField');
  carenciaField.style.display = (motivo === 'comum') ? 'block' : 'none';
  document.getElementById('resultado').classList.remove('show');
}

function calcular(){
  var motivo = document.getElementById('motivo').value;
  var media = parseFloat(document.getElementById('media').value) || 0;
  var carenciaField = document.getElementById('carenciaField');
  var carenciaOk = carenciaField.style.display === 'none' ? true : document.getElementById('carencia').checked;
  var box = document.getElementById('resultado');
  box.classList.add('show');

  if(media <= 0){
    box.className = 'result show status-warn';
    document.getElementById('r-label').textContent = 'Falta informação';
    document.getElementById('r-value').textContent = 'Informe a média dos salários de contribuição';
    document.getElementById('r-note').textContent = 'Preencha o campo acima pra calcular o valor estimado do benefício.';
    return;
  }

  if(!carenciaOk){
    box.className = 'result show status-warn';
    document.getElementById('r-label').textContent = 'Carência não confirmada';
    document.getElementById('r-value').textContent = 'É preciso comprovar 12 contribuições';
    document.getElementById('r-note').textContent = 'Para doença comum, o INSS exige 12 contribuições mensais antes do afastamento. Sem isso, o pedido tende a ser negado — exceto se a incapacidade for por acidente ou por uma das doenças graves listadas em lei, casos em que a carência é dispensada.';
    return;
  }

  var valorFinal = Math.min(Math.max(media * 0.91, SALARIO_MINIMO), TETO_INSS);
  var nota;
  if(media * 0.91 < SALARIO_MINIMO){
    nota = 'O cálculo (91% da média) ficou abaixo do salário mínimo — o benefício nunca pode ser pago abaixo do piso de R$ ' + formatBRL(SALARIO_MINIMO) + '.';
  } else if(media * 0.91 > TETO_INSS){
    nota = 'O cálculo passa do teto do INSS — o benefício fica limitado a R$ ' + formatBRL(TETO_INSS) + '.';
  } else {
    nota = 'Valor de 91% da média informada, dentro dos limites do INSS.';
  }

  var pagamento = 'Se você é empregado CLT, os primeiros 15 dias são pagos pela empresa e o INSS assume a partir do 16º dia. Nas demais categorias, o INSS paga desde o início do afastamento reconhecido pela perícia.';

  box.className = 'result show status-good';
  document.getElementById('r-label').textContent = 'Valor mensal estimado (91% da média)';
  document.getElementById('r-value').textContent = 'R$ ' + formatBRL(valorFinal);
  document.getElementById('r-note').textContent = nota + ' ' + pagamento;
}
