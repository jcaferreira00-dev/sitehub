
function calcular(){
  var ano = document.getElementById('ano').value;
  var frequencia = document.getElementById('frequencia').checked;
  var aprovado = document.getElementById('aprovado').checked;
  var enem = document.getElementById('enem').checked;

  var total = 200; // matrícula
  if(frequencia) total += 1800;
  if(aprovado) total += 1000;
  if(ano === '3' && enem) total += 200;

  var box = document.getElementById('resultado');
  box.classList.add('show', 'status-good');
  document.getElementById('r-value').textContent = 'R$ ' + total.toFixed(2).replace('.', ',');

  var faltando = [];
  if(!frequencia) faltando.push('a frequência mínima de 80%');
  if(!aprovado) faltando.push('a aprovação no ano');
  if(ano === '3' && !enem) faltando.push('a participação no Enem (R$ 200 extra)');

  var nota = 'Valor estimado pra este ano letivo.';
  if(faltando.length > 0){
    nota += ' Sem contar ' + faltando.join(' e ') + ', que ainda pode(m) entrar se cumprido(s).';
  }
  document.getElementById('r-note').textContent = nota;
}
