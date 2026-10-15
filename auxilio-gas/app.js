
var SALARIO_MINIMO = 1621.00;

function calcular(){
  var cadunico = document.getElementById('cadunico').checked;
  var bolsafamilia = document.getElementById('bolsafamilia').checked;
  var cpf = document.getElementById('cpf').checked;
  var renda = parseFloat(document.getElementById('renda').value) || 0;
  var pessoas = parseInt(document.getElementById('pessoas').value) || 0;
  var box = document.getElementById('resultado');
  var set = function(cls, label, value, note){
    box.className = 'result show ' + cls;
    document.getElementById('r-label').textContent = label;
    document.getElementById('r-value').textContent = value;
    document.getElementById('r-note').textContent = note;
  };

  if(!cadunico){
    set('status-warn', 'Passo necessário', 'Atualize o CadÚnico primeiro', 'O Gás do Povo usa o Cadastro Único atualizado nos últimos 24 meses. Procure o CRAS do seu município.');
    return;
  }
  if(pessoas < 1){
    set('status-warn', 'Falta informação', 'Informe o nº de pessoas', 'Preencha a renda e o número de pessoas da família.');
    return;
  }
  var perCapita = renda / pessoas;
  var vales = pessoas >= 4 ? 6 : 4;
  var freq = pessoas >= 4 ? 'um a cada 2 meses' : 'um a cada 3 meses';

  if(perCapita > SALARIO_MINIMO / 2){
    set('status-warn', 'Fora do perfil', 'Renda acima de meio salário mínimo por pessoa', 'Sua renda por pessoa ficou em R$ ' + perCapita.toFixed(2).replace('.', ',') + '. O limite é R$ 810,50 (meio salário mínimo de 2026).');
    return;
  }
  if(pessoas < 2){
    set('status-warn', 'Fora do perfil atual', 'Famílias de 1 pessoa ainda não entram', 'Hoje o programa atende famílias com 2 ou mais pessoas no mesmo cadastro.');
    return;
  }
  if(!bolsafamilia){
    set('status-warn', 'Fora do perfil atual', 'Hoje o programa atende famílias do Bolsa Família', 'Sua renda está dentro do limite, mas no momento o Gás do Povo está sendo liberado para famílias do Bolsa Família. Mantenha o CadÚnico atualizado — o público pode ser ampliado.');
    return;
  }
  set('status-good', 'Provavelmente no perfil', vales + ' vales por ano (' + freq + ')',
    'Cada vale dá direito a uma recarga grátis do botijão de 13 kg numa revenda credenciada.' + (cpf ? '' : ' Atenção: o CPF do responsável familiar precisa estar regular na Receita Federal.') + ' A entrada depende do orçamento do programa — consulte no app Meu Social.');
}
