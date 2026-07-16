
function verificar(){
  var q1 = document.getElementById('q1').checked;
  var q2 = document.getElementById('q2').checked;
  var q3 = document.getElementById('q3').checked;
  var q4 = document.getElementById('q4').checked;
  var box = document.getElementById('resultado');
  box.classList.add('show');

  if(!q1){
    box.className = 'result show status-warn';
    document.getElementById('r-label').textContent = 'Provavelmente não';
    document.getElementById('r-value').textContent = 'Benefício exclusivo do serviço público';
    document.getElementById('r-note').textContent = 'O Abono de Permanência só existe pra servidores públicos efetivos. Quem é CLT (regime geral/INSS) não tem esse direito.';
    return;
  }
  if(!q2){
    box.className = 'result show status-warn';
    document.getElementById('r-label').textContent = 'Precisa confirmar seu regime';
    document.getElementById('r-value').textContent = 'Verifique se você é RPPS';
    document.getElementById('r-note').textContent = 'O benefício vale pra quem contribui por um Regime Próprio de Previdência Social (RPPS). Alguns municípios não têm RPPS e usam o INSS — nesse caso, a regra não se aplica.';
    return;
  }
  if(!q3){
    box.className = 'result show status-warn';
    document.getElementById('r-label').textContent = 'Ainda não';
    document.getElementById('r-value').textContent = 'Requisitos da aposentadoria não cumpridos';
    document.getElementById('r-note').textContent = 'O abono só é devido a partir do momento em que você cumpre integralmente os requisitos pra se aposentar. Peça ao seu RH uma contagem do seu tempo de contribuição pra confirmar quando isso acontece.';
    return;
  }
  if(!q4){
    box.className = 'result show status-good';
    document.getElementById('r-label').textContent = 'Você já pode se aposentar';
    document.getElementById('r-value').textContent = 'O abono é pra quem continua trabalhando';
    document.getElementById('r-note').textContent = 'Como você já cumpre os requisitos mas não quer continuar na ativa, o caminho natural é solicitar a aposentadoria em vez do abono.';
    return;
  }

  box.className = 'result show status-good';
  document.getElementById('r-label').textContent = 'Você provavelmente tem direito';
  document.getElementById('r-value').textContent = 'Abono de Permanência';
  document.getElementById('r-note').textContent = 'Com base no que você marcou, seu perfil se encaixa. Procure o RH ou o RPPS do seu órgão pra formalizar o pedido — o valor equivale à sua alíquota de contribuição (geralmente 11% a 14% do salário).';
}
