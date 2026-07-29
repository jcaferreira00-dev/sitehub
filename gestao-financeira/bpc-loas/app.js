
function calcular(){
  var idoso = document.getElementById('idoso').checked;
  var pcd = document.getElementById('pcd').checked;
  var renda = parseFloat(document.getElementById('renda').value) || 0;
  var pessoas = parseInt(document.getElementById('pessoas').value) || 0;
  var box = document.getElementById('resultado');
  box.classList.add('show');

  if(!idoso && !pcd){
    box.className = 'result show status-warn';
    document.getElementById('r-label').textContent = 'Fora do público do benefício';
    document.getElementById('r-value').textContent = 'BPC é só pra idoso 65+ ou PCD';
    document.getElementById('r-note').textContent = 'Se esse não é o seu caso, esse benefício não se aplica — mas pode ser que sim pra outro familiar.';
    return;
  }
  if(pessoas <= 0){
    box.className = 'result show status-warn';
    document.getElementById('r-label').textContent = 'Falta informação';
    document.getElementById('r-value').textContent = 'Informe a renda e o nº de pessoas';
    document.getElementById('r-note').textContent = 'Preencha os campos pra calcular a renda por pessoa da família.';
    return;
  }

  var perCapita = renda / pessoas;
  if(perCapita <= 405.25){
    box.className = 'result show status-good';
    document.getElementById('r-label').textContent = 'Provavelmente elegível';
    document.getElementById('r-value').textContent = 'R$ 1.621,00/mês';
    document.getElementById('r-note').textContent = 'Renda por pessoa: R$ ' + perCapita.toFixed(2).replace('.', ',') + ', dentro do limite de R$ 405,25. Confirme pelo Meu INSS.';
  } else if(perCapita <= 810.50){
    box.className = 'result show status-good';
    document.getElementById('r-label').textContent = 'Pode ter direito pela flexibilização';
    document.getElementById('r-value').textContent = 'R$ 1.621,00/mês';
    document.getElementById('r-note').textContent = 'Renda por pessoa: R$ ' + perCapita.toFixed(2).replace('.', ',') + '. Acima de R$ 405,25, mas dentro de R$ 810,50 — precisa comprovar vulnerabilidade adicional (gastos com saúde, remédios etc) na hora do pedido.';
  } else {
    box.className = 'result show status-warn';
    document.getElementById('r-label').textContent = 'Fora da linha de elegibilidade';
    document.getElementById('r-value').textContent = 'R$ ' + perCapita.toFixed(2).replace('.', ',') + ' por pessoa';
    document.getElementById('r-note').textContent = 'O limite é de R$ 810,50 por pessoa mesmo com flexibilização. Com esses números, não se enquadra hoje.';
  }
}
