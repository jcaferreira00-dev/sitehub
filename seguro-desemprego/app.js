
function calcular(){
  var media = parseFloat(document.getElementById('media').value) || 0;
  var meses = parseInt(document.getElementById('meses').value) || 0;
  var vezes = document.getElementById('vezes').value;
  var box = document.getElementById('resultado');
  box.classList.add('show');

  if(media <= 0 || meses <= 0){
    box.className = 'result show status-warn';
    document.getElementById('r-label').textContent = 'Falta informação';
    document.getElementById('r-value').textContent = 'Preencha os campos acima';
    document.getElementById('r-note').textContent = 'Informe a média salarial e os meses trabalhados pra calcular.';
    return;
  }

  var parcela;
  if(media <= 2222.17){ parcela = media * 0.8; }
  else if(media <= 3703.99){ parcela = 1777.74 + (media - 2222.17) * 0.5; }
  else { parcela = 2518.65; }
  if(parcela < 1621.00) parcela = 1621.00;
  if(parcela > 2518.65) parcela = 2518.65;

  var minimo = {'1': 12, '2': 9, '3': 6}[vezes];
  var numParcelas = 0;
  if(meses >= 24) numParcelas = 5;
  else if(meses >= 12) numParcelas = 4;
  else if(vezes === '2' && meses >= 9) numParcelas = 3;
  else if(vezes === '3' && meses >= 6) numParcelas = 3;

  if(numParcelas === 0){
    box.className = 'result show status-warn';
    document.getElementById('r-label').textContent = 'Ainda não dá pra confirmar';
    document.getElementById('r-value').textContent = 'Tempo mínimo não atingido';
    document.getElementById('r-note').textContent = 'Pra essa solicitação, o mínimo exigido é de ' + minimo + ' meses trabalhados. Com ' + meses + ' meses, ainda não fecha o requisito — mas vale confirmar seu caso no app Carteira de Trabalho Digital.';
    return;
  }

  var total = parcela * numParcelas;
  box.className = 'result show status-good';
  document.getElementById('r-label').textContent = 'Parcela estimada';
  document.getElementById('r-value').textContent = 'R$ ' + parcela.toFixed(2).replace('.', ',');
  document.getElementById('r-note').textContent = 'Você tem direito a ' + numParcelas + ' parcelas, totalizando cerca de R$ ' + total.toFixed(2).replace('.', ',') + '. Peça entre o 7º e o 120º dia após a demissão.';
}
