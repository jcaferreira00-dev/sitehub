
function calcular(){
  var renda = parseFloat(document.getElementById('renda').value) || 0;
  var pessoas = parseInt(document.getElementById('pessoas').value) || 0;
  var criancas06 = parseInt(document.getElementById('criancas06').value) || 0;
  var outros = parseInt(document.getElementById('outros').value) || 0;

  var box = document.getElementById('resultado');
  box.classList.add('show');

  if(pessoas <= 0){
    box.className = 'result show status-warn';
    document.getElementById('r-label').textContent = 'Falta informação';
    document.getElementById('r-value').textContent = 'Informe o nº de pessoas';
    document.getElementById('r-note').textContent = 'Preencha quantas pessoas moram na casa pra calcular a renda por pessoa.';
    return;
  }

  var rendaPerCapita = renda / pessoas;
  var valorBase = 600 + (criancas06 * 150) + (outros * 50);

  if(rendaPerCapita <= 218){
    box.className = 'result show status-good';
    document.getElementById('r-label').textContent = 'Provavelmente elegível';
    document.getElementById('r-value').textContent = 'R$ ' + valorBase.toFixed(2).replace('.', ',');
    document.getElementById('r-note').textContent = 'Renda por pessoa: R$ ' + rendaPerCapita.toFixed(2).replace('.', ',') + '. Valor estimado por mês, sujeito à confirmação no CadÚnico.';
  } else if(rendaPerCapita <= 706){
    var valorProtecao = valorBase * 0.5;
    box.className = 'result show status-good';
    document.getElementById('r-label').textContent = 'Pode ter direito à Regra de Proteção';
    document.getElementById('r-value').textContent = 'R$ ' + valorProtecao.toFixed(2).replace('.', ',');
    document.getElementById('r-note').textContent = 'Renda por pessoa: R$ ' + rendaPerCapita.toFixed(2).replace('.', ',') + '. Nessa faixa, famílias que já recebiam o benefício podem manter 50% do valor por um período — não vale para novas inscrições.';
  } else {
    box.className = 'result show status-warn';
    document.getElementById('r-label').textContent = 'Fora da linha de elegibilidade';
    document.getElementById('r-value').textContent = 'R$ ' + rendaPerCapita.toFixed(2).replace('.', ',') + ' por pessoa';
    document.getElementById('r-note').textContent = 'O limite geral é de R$ 218 por pessoa (ou R$ 706 pra quem já recebe, pela Regra de Proteção). Com esses números, a família não se encaixa hoje.';
  }
}
