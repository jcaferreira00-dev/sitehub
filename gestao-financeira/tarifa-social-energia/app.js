
function calcular(){
  var renda = parseFloat(document.getElementById('renda').value) || 0;
  var pessoas = parseInt(document.getElementById('pessoas').value) || 0;
  var bpc = document.getElementById('bpc').checked;
  var doente = document.getElementById('doente').checked;
  var box = document.getElementById('resultado');
  box.classList.add('show');

  if(pessoas <= 0 && !bpc){
    box.className = 'result show status-warn';
    document.getElementById('r-label').textContent = 'Falta informação';
    document.getElementById('r-value').textContent = 'Preencha os campos acima';
    document.getElementById('r-note').textContent = 'Informe a renda e o nº de pessoas, ou marque se recebe BPC.';
    return;
  }

  var perCapita = pessoas > 0 ? renda / pessoas : 0;

  if(bpc){
    box.className = 'result show status-good';
    document.getElementById('r-label').textContent = 'Isenção total provável';
    document.getElementById('r-value').textContent = '100% até 80 kWh/mês';
    document.getElementById('r-note').textContent = 'Quem recebe BPC/LOAS tem direito automático à isenção total até 80 kWh de consumo. Confira se já está aplicado na sua fatura.';
    return;
  }

  if(doente && perCapita <= 4863){
    box.className = 'result show status-good';
    document.getElementById('r-label').textContent = 'Isenção total provável';
    document.getElementById('r-value').textContent = '100% até 80 kWh/mês';
    document.getElementById('r-note').textContent = 'Famílias com renda per capita até 3 salários mínimos e morador dependente de aparelho elétrico têm direito à isenção. Vale confirmar com a distribuidora.';
    return;
  }

  if(perCapita > 0 && perCapita <= 810.50){
    box.className = 'result show status-good';
    document.getElementById('r-label').textContent = 'Isenção total provável';
    document.getElementById('r-value').textContent = '100% até 80 kWh/mês';
    document.getElementById('r-note').textContent = 'Renda por pessoa: R$ ' + perCapita.toFixed(2).replace('.', ',') + ', dentro do limite de meio salário mínimo (R$ 810,50).';
    return;
  }

  if(perCapita > 810.50 && perCapita <= 1621){
    box.className = 'result show status-good';
    document.getElementById('r-label').textContent = 'Pode ter direito ao Desconto Social';
    document.getElementById('r-value').textContent = 'Tarifa reduzida até 120 kWh/mês';
    document.getElementById('r-note').textContent = 'Renda por pessoa: R$ ' + perCapita.toFixed(2).replace('.', ',') + '. Nessa faixa (entre meio e um salário mínimo per capita), você pode ter direito ao novo Desconto Social, vigente desde janeiro de 2026.';
    return;
  }

  box.className = 'result show status-warn';
  document.getElementById('r-label').textContent = 'Fora das faixas atuais';
  document.getElementById('r-value').textContent = perCapita > 0 ? ('R$ ' + perCapita.toFixed(2).replace('.', ',') + ' por pessoa') : '—';
  document.getElementById('r-note').textContent = 'Com esses números, sua família não se encaixa nas faixas de desconto hoje. Vale reconferir se algum dado mudou, como composição familiar ou renda.';
}
