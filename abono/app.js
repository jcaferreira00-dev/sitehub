
var LOTES = [
  { label: "Janeiro", months: [1], date: "2026-02-15", dateDisplay: "15/02/2026" },
  { label: "Fevereiro", months: [2], date: "2026-03-15", dateDisplay: "15/03/2026" },
  { label: "Março e abril", months: [3, 4], date: "2026-04-15", dateDisplay: "15/04/2026" },
  { label: "Maio e junho", months: [5, 6], date: "2026-05-15", dateDisplay: "15/05/2026" },
  { label: "Julho e agosto", months: [7, 8], date: "2026-06-15", dateDisplay: "15/06/2026" },
  { label: "Setembro e outubro", months: [9, 10], date: "2026-07-15", dateDisplay: "15/07/2026" },
  { label: "Novembro e dezembro", months: [11, 12], date: "2026-08-15", dateDisplay: "15/08/2026" }
];

var SALARIO_MINIMO_2026 = 1621.00;
var PRAZO_SAQUE = new Date("2026-12-30T23:59:59-03:00");
var MESES_NOMES = ["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"];
var hoje = new Date();

function lotePorMesNascimento(mes){
  for (var i = 0; i < LOTES.length; i++) {
    if (LOTES[i].months.indexOf(mes) !== -1) return LOTES[i];
  }
  return null;
}

function formatBRL(v){
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function calcular(){
  var meses = parseInt(document.getElementById('monthsWorked').value, 10);
  var mesNasc = parseInt(document.getElementById('birthMonth').value, 10);
  var valor = (SALARIO_MINIMO_2026 / 12) * meses;
  var lote = lotePorMesNascimento(mesNasc);
  document.getElementById('calcValue').textContent = formatBRL(valor);
  document.getElementById('calcDate').textContent = lote ? lote.dateDisplay : '—';
}

function renderStatus(){
  var el = document.getElementById('statusEyebrow');
  if (hoje < new Date("2026-02-05")) {
    el.innerHTML = '<span class="dot-pulse"></span> Consulta abre em 5 de fevereiro de 2026';
    return;
  }
  if (hoje > PRAZO_SAQUE) {
    el.innerHTML = '<span class="dot-pulse"></span> Prazo de saque 2026 encerrado';
    return;
  }
  var proximoLote = null;
  for (var i = 0; i < LOTES.length; i++) {
    var d = new Date(LOTES[i].date + "T00:00:00-03:00");
    if (d >= hoje) { proximoLote = LOTES[i]; break; }
  }
  if (proximoLote) {
    el.innerHTML = '<span class="dot-pulse"></span> Próximo lote: nascidos em ' + proximoLote.label.toLowerCase() + ' · ' + proximoLote.dateDisplay;
  } else {
    el.innerHTML = '<span class="dot-pulse"></span> Todos os lotes de 2026 já foram pagos';
  }
}

function renderTabela(){
  var tbody = document.querySelector('#pisTable tbody');
  var proximoMarcado = false;
  LOTES.forEach(function(lote){
    var d = new Date(lote.date + "T00:00:00-03:00");
    var isPast = d < hoje;
    var tr = document.createElement('tr');
    if (isPast) tr.className = 'past-row';

    var tdLabel = document.createElement('td');
    tdLabel.textContent = lote.label;
    var tdDate = document.createElement('td');
    tdDate.textContent = lote.dateDisplay;

    if (isPast) {
      var tag = document.createElement('span');
      tag.className = 'tag paid';
      tag.textContent = 'pago';
      tdDate.appendChild(tag);
    } else if (!proximoMarcado) {
      var tagN = document.createElement('span');
      tagN.className = 'tag next';
      tagN.textContent = 'próximo';
      tdDate.appendChild(tagN);
      tr.className = 'current-row';
      proximoMarcado = true;
    }

    tr.appendChild(tdLabel);
    tr.appendChild(tdDate);
    tbody.appendChild(tr);
  });
}

function initBirthSelect(){
  var sel = document.getElementById('birthMonth');
  MESES_NOMES.forEach(function(nome, idx){
    var opt = document.createElement('option');
    opt.value = idx + 1;
    opt.textContent = nome;
    sel.appendChild(opt);
  });
  sel.value = hoje.getMonth() + 1;
}

document.addEventListener('DOMContentLoaded', function(){
  initBirthSelect();
  renderStatus();
  renderTabela();
  calcular();
});
