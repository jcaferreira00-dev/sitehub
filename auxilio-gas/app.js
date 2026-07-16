
function calcular(){
  var cadunico = document.getElementById('cadunico').checked;
  var bolsafamilia = document.getElementById('bolsafamilia').checked;
  var bpc = document.getElementById('bpc').checked;
  var violencia = document.getElementById('violencia').checked;
  var renda = parseFloat(document.getElementById('renda').value) || 0;
  var pessoas = parseInt(document.getElementById('pessoas').value) || 0;
  var box = document.getElementById('resultado');
  box.classList.add('show');

  var perCapita = pessoas > 0 ? renda / pessoas : null;
  var rendaOk = perCapita !== null && perCapita <= 810.50;

  if(!cadunico){
    box.className = 'result show status-warn';
    document.getElementById('r-label').textContent = 'Passo necessário';
    document.getElementById('r-value').textContent = 'Atualize o CadÚnico primeiro';
    document.getElementById('r-note').textContent = 'O Auxílio-Gás depende do Cadastro Único atualizado. Sem isso, nenhuma das outras condições conta.';
    return;
  }

  if(bolsafamilia || bpc || violencia || rendaOk){
    box.className = 'result show status-good';
    document.getElementById('r-label').textContent = 'Provavelmente elegível';
    document.getElementById('r-value').textContent = '~R$ 100 a R$ 130 a cada 2 meses';
    var motivo = bolsafamilia ? 'já recebe o Bolsa Família' : (bpc ? 'tem BPC na família' : (violencia ? 'está em medida protetiva' : 'tem renda per capita dentro do limite'));
    document.getElementById('r-note').textContent = 'Como sua família ' + motivo + ', você entra no grupo prioritário. A seleção final ainda depende do orçamento de cada bimestre.';
    return;
  }

  box.className = 'result show status-warn';
  document.getElementById('r-label').textContent = 'Fora das prioridades atuais';
  document.getElementById('r-value').textContent = 'Renda acima do limite ou sem prioridade';
  document.getElementById('r-note').textContent = 'Com base no que você marcou, sua família não está entre as prioridades de seleção hoje. Vale manter o CadÚnico atualizado — os critérios podem mudar a cada bimestre.';
}
