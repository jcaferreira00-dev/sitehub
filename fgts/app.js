
var MESES = ['janeiro','fevereiro','março','abril','maio','junho','julho','agosto','setembro','outubro','novembro','dezembro'];

function calcular(){
  var saldo = parseFloat(document.getElementById('saldo').value) || 0;
  var mes = document.getElementById('mes').value;
  var box = document.getElementById('resultado');
  box.classList.add('show');

  if(saldo <= 0){
    box.className = 'result show status-warn';
    document.getElementById('r-label').textContent = 'Falta informação';
    document.getElementById('r-value').textContent = 'Informe seu saldo';
    document.getElementById('r-note').textContent = 'Preencha o saldo total do FGTS pra calcular o valor sacável.';
    return;
  }

  var aliquota, adicional;
  if(saldo <= 500){ aliquota = 0.50; adicional = 0; }
  else if(saldo <= 1000){ aliquota = 0.40; adicional = 50; }
  else if(saldo <= 5000){ aliquota = 0.30; adicional = 150; }
  else if(saldo <= 10000){ aliquota = 0.20; adicional = 650; }
  else if(saldo <= 15000){ aliquota = 0.15; adicional = 1150; }
  else if(saldo <= 20000){ aliquota = 0.10; adicional = 1900; }
  else { aliquota = 0.05; adicional = 2900; }

  var valor = (saldo * aliquota) + adicional;

  box.className = 'result show status-good';
  document.getElementById('r-label').textContent = 'Valor estimado do saque';
  document.getElementById('r-value').textContent = 'R$ ' + valor.toFixed(2).replace('.', ',');

  var nota = 'Faixa: ' + (aliquota*100).toFixed(0) + '% do saldo + R$ ' + adicional.toFixed(2).replace('.', ',') + ' de parcela adicional.';
  if(mes !== ''){
    var abre = parseInt(mes);
    var fecha = (abre + 2) % 12;
    nota += ' Sua janela de saque em 2026: de ' + MESES[abre] + ' até o fim de ' + MESES[fecha] + '.';
  }
  document.getElementById('r-note').textContent = nota;
}
