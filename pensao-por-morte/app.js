
var SALARIO_MINIMO = 1621.00;

function formatBRL(v){
  return v.toLocaleString('pt-BR', {minimumFractionDigits:2, maximumFractionDigits:2});
}

function atualizarCampos(){
  var tipo = document.getElementById('tipo').value;
  var conjugeFields = document.getElementById('conjugeFields');
  conjugeFields.style.display = (tipo === 'conjuge') ? 'block' : 'none';
  document.getElementById('resultado').classList.remove('show');
}

function duracaoPorIdade(idade){
  if(idade < 21) return '3 anos';
  if(idade <= 26) return '6 anos';
  if(idade <= 29) return '10 anos';
  if(idade <= 40) return '15 anos';
  if(idade <= 43) return '20 anos';
  return 'vitalícia';
}

function calcular(){
  var tipo = document.getElementById('tipo').value;
  var base = parseFloat(document.getElementById('base').value) || 0;
  var deps = parseInt(document.getElementById('deps').value) || 0;
  var box = document.getElementById('resultado');
  box.classList.add('show');

  if(base <= 0){
    box.className = 'result show status-warn';
    document.getElementById('r-label').textContent = 'Falta informação';
    document.getElementById('r-value').textContent = 'Informe o valor base do benefício';
    document.getElementById('r-note').textContent = 'Preencha o valor da aposentadoria que o(a) falecido(a) recebia (ou teria direito).';
    return;
  }
  if(deps <= 0){
    box.className = 'result show status-warn';
    document.getElementById('r-label').textContent = 'Falta informação';
    document.getElementById('r-value').textContent = 'Informe o nº de dependentes habilitados';
    document.getElementById('r-note').textContent = 'Conte todos os dependentes com direito reconhecido pelo INSS (cônjuge/companheiro, filhos etc), não só você.';
    return;
  }

  var percentual = Math.min(0.5 + 0.1 * deps, 1.0);
  var valorFinal = Math.max(base * percentual, SALARIO_MINIMO);

  var duracaoTexto = '';
  var alerta = '';

  if(tipo === 'filho'){
    duracaoTexto = 'até 21 anos de idade (vitalícia se houver invalidez ou deficiência grave, intelectual ou mental)';
  } else if(tipo === 'conjuge'){
    var idade = parseInt(document.getElementById('idadeConjuge').value) || 0;
    var uniao2anos = document.getElementById('uniao2anos').checked;
    var contrib18 = document.getElementById('contrib18').checked;

    if(!uniao2anos || !contrib18){
      duracaoTexto = 'limitada a 4 meses';
      alerta = ' Atenção: como a união tinha menos de 2 anos e/ou o(a) falecido(a) tinha menos de 18 contribuições, a regra padrão limita a pensão do cônjuge/companheiro(a) a 4 meses — SALVO se o óbito decorreu de acidente ou de doença posterior ao casamento/união, casos em que essa limitação não se aplica. Vale muito a pena confirmar isso com um advogado.';
    } else if(idade > 0){
      duracaoTexto = duracaoPorIdade(idade);
    } else {
      duracaoTexto = 'depende da idade do cônjuge/companheiro(a) na data do óbito — informe a idade pra ver o prazo exato';
    }
  } else {
    duracaoTexto = 'varia conforme o tipo de dependente — consulte o Meu INSS ou um advogado pra confirmar o prazo';
  }

  box.className = 'result show status-good';
  document.getElementById('r-label').textContent = 'Valor mensal estimado (rateado entre os dependentes)';
  document.getElementById('r-value').textContent = 'R$ ' + formatBRL(valorFinal);
  document.getElementById('r-note').textContent = 'Cálculo: 50% do valor base + 10% por dependente (' + deps + (deps === 1 ? ' dependente' : ' dependentes') + '), com mínimo de 1 salário mínimo. Duração estimada: ' + duracaoTexto + '.' + alerta;
}
