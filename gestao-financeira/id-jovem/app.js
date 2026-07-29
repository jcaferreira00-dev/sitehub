
function calcular(){
  var idade = parseInt(document.getElementById('idade').value) || 0;
  var renda = parseFloat(document.getElementById('renda').value) || 0;
  var cadunico = document.getElementById('cadunico').checked;
  var box = document.getElementById('resultado');
  box.classList.add('show');

  if(idade <= 0 || renda <= 0){
    box.className = 'result show status-warn';
    document.getElementById('r-label').textContent = 'Falta informação';
    document.getElementById('r-value').textContent = 'Preencha idade e renda';
    document.getElementById('r-note').textContent = 'Informe sua idade e a renda familiar pra calcular.';
    return;
  }

  if(idade < 15 || idade > 29){
    box.className = 'result show status-warn';
    document.getElementById('r-label').textContent = 'Fora da faixa etária';
    document.getElementById('r-value').textContent = 'É preciso ter entre 15 e 29 anos';
    document.getElementById('r-note').textContent = 'O ID Jovem é exclusivo pra essa faixa de idade.';
    return;
  }

  var salarioMinimo = 1621.00;
  if(renda <= salarioMinimo * 2){
    box.className = 'result show status-good';
    document.getElementById('r-label').textContent = 'Provavelmente elegível';
    document.getElementById('r-value').textContent = 'Passagem grátis + meia-entrada';
    var nota = 'Sua idade e renda familiar se encaixam no programa.';
    if(!cadunico) nota += ' Mas antes de emitir, atualize (ou faça) seu cadastro no CadÚnico — é pré-requisito.';
    document.getElementById('r-note').textContent = nota;
  } else {
    box.className = 'result show status-warn';
    document.getElementById('r-label').textContent = 'Renda acima do limite';
    document.getElementById('r-value').textContent = 'Limite: 2 salários mínimos (R$ 3.242)';
    document.getElementById('r-note').textContent = 'Com a renda familiar informada, o ID Jovem não se aplica hoje.';
  }
}
