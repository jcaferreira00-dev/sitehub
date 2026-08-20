
function formatBRL(v){
  return v.toLocaleString('pt-BR', {minimumFractionDigits:2, maximumFractionDigits:2});
}

function diasNoMes(ano, mes){
  return new Date(ano, mes + 1, 0).getDate();
}

/* Conta quantos meses, dentro do intervalo [inicio, fim], tiveram
   pelo menos 15 dias trabalhados (regra da fração de 13º/férias) */
function contarMesesProporcionais(inicio, fim){
  if(fim < inicio) return 0;
  var meses = 0;
  var cursor = new Date(inicio.getFullYear(), inicio.getMonth(), 1);
  while(cursor <= fim){
    var inicioMes = new Date(cursor.getFullYear(), cursor.getMonth(), 1);
    var fimMes = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 0);
    var inicioEfetivo = inicioMes < inicio ? inicio : inicioMes;
    var fimEfetivo = fimMes > fim ? fim : fimMes;
    var dias = Math.round((fimEfetivo - inicioEfetivo) / 86400000) + 1;
    if(dias >= 15) meses++;
    cursor = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1);
  }
  return Math.min(meses, 12);
}

function atualizarCampos(){
  var tipo = document.getElementById('tipo').value;
  var fgtsField = document.getElementById('fgtsField');
  fgtsField.style.display = (tipo === 'sem_justa_causa' || tipo === 'indireta' || tipo === 'acordo') ? 'block' : 'none';
  document.getElementById('resultado').classList.remove('show');
}

function calcular(){
  var salario = parseFloat(document.getElementById('salario').value) || 0;
  var admissaoStr = document.getElementById('admissao').value;
  var demissaoStr = document.getElementById('demissao').value;
  var tipo = document.getElementById('tipo').value;
  var feriasVencidas = parseInt(document.getElementById('feriasVencidas').value) || 0;
  var saldoFgts = parseFloat(document.getElementById('saldoFgts').value) || 0;

  var box = document.getElementById('resultado');
  box.classList.add('show');

  if(salario <= 0 || !admissaoStr || !demissaoStr){
    box.className = 'result show status-warn';
    document.getElementById('r-label').textContent = 'Falta informação';
    document.getElementById('r-value').textContent = 'Preencha salário, admissão e demissão';
    document.getElementById('r-note').textContent = 'Esses três campos são obrigatórios pra calcular as verbas rescisórias.';
    return;
  }

  var admissao = new Date(admissaoStr + 'T00:00:00');
  var demissao = new Date(demissaoStr + 'T00:00:00');

  if(demissao <= admissao){
    box.className = 'result show status-warn';
    document.getElementById('r-label').textContent = 'Datas inválidas';
    document.getElementById('r-value').textContent = 'A demissão deve ser depois da admissão';
    document.getElementById('r-note').textContent = 'Confira as datas informadas.';
    return;
  }

  var diffDias = Math.round((demissao - admissao) / 86400000);
  var anosCompletos = Math.floor(diffDias / 365);

  /* Saldo de salário: dias trabalhados no mês da demissão */
  var diaDemissao = demissao.getDate();
  var saldoSalario = (salario / 30) * diaDemissao;

  /* 13º proporcional: meses com 15+ dias no ano da demissão */
  var inicio13 = new Date(demissao.getFullYear(), 0, 1);
  if(admissao > inicio13) inicio13 = admissao;
  var meses13 = contarMesesProporcionais(inicio13, demissao);
  var decimoTerceiro = (salario / 12) * meses13;

  /* Férias proporcionais: desde o último aniversário de admissão */
  var aniversario = new Date(demissao.getFullYear(), admissao.getMonth(), admissao.getDate());
  if(aniversario > demissao){
    aniversario = new Date(demissao.getFullYear() - 1, admissao.getMonth(), admissao.getDate());
  }
  var mesesFerias = contarMesesProporcionais(aniversario, demissao);
  var feriasProporcionais = (salario / 12) * mesesFerias;
  var tercoFeriasProp = feriasProporcionais / 3;

  var valorFeriasVencidas = salario * feriasVencidas;
  var tercoFeriasVencidas = valorFeriasVencidas / 3;

  /* Aviso prévio */
  var diasAviso = Math.min(30 + 3 * anosCompletos, 90);
  var avisoPrevio = 0;
  if(tipo === 'sem_justa_causa' || tipo === 'indireta'){
    avisoPrevio = (salario / 30) * diasAviso;
  } else if(tipo === 'acordo'){
    avisoPrevio = (salario / 30) * diasAviso * 0.5;
  }

  /* Multa do FGTS */
  var multaFgts = 0;
  if(saldoFgts > 0){
    if(tipo === 'sem_justa_causa' || tipo === 'indireta'){
      multaFgts = saldoFgts * 0.40;
    } else if(tipo === 'acordo'){
      multaFgts = saldoFgts * 0.20;
    }
  }

  /* Em justa causa, perde 13º e férias proporcionais */
  if(tipo === 'justa_causa'){
    decimoTerceiro = 0;
    feriasProporcionais = 0;
    tercoFeriasProp = 0;
  }

  var total = saldoSalario + decimoTerceiro + feriasProporcionais + tercoFeriasProp +
              valorFeriasVencidas + tercoFeriasVencidas + avisoPrevio + multaFgts;

  var linhas = [];
  linhas.push('Saldo de salário: R$ ' + formatBRL(saldoSalario));
  if(decimoTerceiro > 0) linhas.push('13º proporcional (' + meses13 + '/12): R$ ' + formatBRL(decimoTerceiro));
  if(feriasProporcionais > 0) linhas.push('Férias proporcionais + 1/3 (' + mesesFerias + '/12): R$ ' + formatBRL(feriasProporcionais + tercoFeriasProp));
  if(feriasVencidas > 0) linhas.push('Férias vencidas + 1/3 (' + feriasVencidas + (feriasVencidas === 1 ? ' período' : ' períodos') + '): R$ ' + formatBRL(valorFeriasVencidas + tercoFeriasVencidas));
  if(avisoPrevio > 0) linhas.push('Aviso prévio indenizado (' + diasAviso + ' dias' + (tipo === 'acordo' ? ', 50% por ser acordo' : '') + '): R$ ' + formatBRL(avisoPrevio));
  if(multaFgts > 0) linhas.push('Multa do FGTS (' + (tipo === 'acordo' ? '20%' : '40%') + ' sobre R$ ' + formatBRL(saldoFgts) + '): R$ ' + formatBRL(multaFgts));
  if(tipo === 'justa_causa') linhas.push('Dispensa por justa causa: sem 13º e sem férias proporcionais, por lei.');

  box.className = 'result show status-good';
  document.getElementById('r-label').textContent = 'Total estimado das verbas rescisórias';
  document.getElementById('r-value').textContent = 'R$ ' + formatBRL(total);
  document.getElementById('r-note').textContent = linhas.join(' · ');
}
