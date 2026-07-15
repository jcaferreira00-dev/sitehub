(function () {
  "use strict";

  // ===== Dados oficiais do calendário PIS/Pasep 2026 (ano-base 2024) =====
  // Fonte: Codefat / Ministério do Trabalho e Emprego, conferido em jul/2026.
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

  var MESES_NOMES = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
  ];

  var hoje = new Date();

  function lotePorMesNascimento(mes) {
    for (var i = 0; i < LOTES.length; i++) {
      if (LOTES[i].months.indexOf(mes) !== -1) return LOTES[i];
    }
    return null;
  }

  function formatBRL(v) {
    return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  }

  // ===== Status dinâmico (hero) =====
  function renderStatus() {
    var statusLabel = document.getElementById("statusLabel");
    var statusValue = document.getElementById("statusValue");
    var statusSub = document.getElementById("statusSub");

    var dataFormatada = hoje.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric"
    });
    statusLabel.textContent = dataFormatada;

    if (hoje < new Date("2026-02-05")) {
      statusValue.textContent = "Consulta ainda não abriu";
      statusSub.textContent = "A consulta oficial abre em 5 de fevereiro de 2026.";
      return;
    }

    if (hoje > PRAZO_SAQUE) {
      statusValue.textContent = "Prazo de saque de 2026 encerrado";
      statusSub.textContent = "Quem não sacou ainda tem até 5 anos para resgatar o valor.";
      return;
    }

    var proximoLote = null;
    for (var i = 0; i < LOTES.length; i++) {
      var d = new Date(LOTES[i].date + "T00:00:00-03:00");
      if (d >= hoje) { proximoLote = LOTES[i]; break; }
    }

    if (proximoLote) {
      var diasRestantes = Math.ceil((new Date(proximoLote.date + "T00:00:00-03:00") - hoje) / 86400000);
      statusValue.textContent = "Próximo lote: nascidos em " + proximoLote.label.toLowerCase();
      statusSub.textContent = proximoLote.dateDisplay + (diasRestantes > 0 ? " · faltam " + diasRestantes + " dia" + (diasRestantes === 1 ? "" : "s") : " · é hoje!");
    } else {
      statusValue.textContent = "Todos os lotes de 2026 já foram pagos";
      statusSub.textContent = "Quem ainda não sacou tem até 30/12/2026.";
    }
  }

  // ===== Trilha (linha do tempo) =====
  function renderTrilha() {
    var track = document.getElementById("trilhaTrack");
    var line = document.createElement("div");
    line.className = "trilha-line";
    var fill = document.createElement("div");
    fill.className = "trilha-line-fill";
    line.appendChild(fill);
    track.appendChild(line);

    var doneCount = 0;
    var nowIndex = -1;

    LOTES.forEach(function (lote, i) {
      var d = new Date(lote.date + "T00:00:00-03:00");
      var stop = document.createElement("div");
      stop.className = "trilha-stop";
      if (d < hoje) { stop.classList.add("done"); doneCount++; }
      else if (nowIndex === -1) { stop.classList.add("now"); nowIndex = i; }

      var dot = document.createElement("div");
      dot.className = "trilha-dot";
      var month = document.createElement("div");
      month.className = "trilha-month";
      month.textContent = lote.label.split(" ")[0];
      var date = document.createElement("div");
      date.className = "trilha-date";
      date.textContent = lote.dateDisplay.slice(0, 5);

      stop.appendChild(dot);
      stop.appendChild(month);
      stop.appendChild(date);
      track.appendChild(stop);
    });

    var pct = (doneCount / LOTES.length) * 100;
    fill.style.width = pct + "%";
  }

  // ===== Tabela completa =====
  function renderTabela() {
    var tbody = document.querySelector("#pisTable tbody");
    LOTES.forEach(function (lote) {
      var d = new Date(lote.date + "T00:00:00-03:00");
      var tr = document.createElement("tr");
      var isPast = d < hoje;
      var isNext = false;

      var tdLabel = document.createElement("td");
      tdLabel.textContent = lote.label;
      var tdDate = document.createElement("td");
      tdDate.className = "date";
      tdDate.textContent = lote.dateDisplay;

      if (isPast) {
        tr.className = "past-row";
        var tag = document.createElement("span");
        tag.className = "tag paid";
        tag.textContent = "pago";
        tdDate.appendChild(tag);
      }

      tr.appendChild(tdLabel);
      tr.appendChild(tdDate);
      tbody.appendChild(tr);
    });

    // marca o próximo lote
    var rows = tbody.querySelectorAll("tr");
    for (var i = 0; i < LOTES.length; i++) {
      var d = new Date(LOTES[i].date + "T00:00:00-03:00");
      if (d >= hoje) {
        rows[i].classList.add("current-row");
        var tag = document.createElement("span");
        tag.className = "tag next";
        tag.textContent = "próximo";
        rows[i].querySelector("td.date").appendChild(tag);
        break;
      }
    }
  }

  // ===== Calculadora =====
  function initCalculadora() {
    var birthSelect = document.getElementById("birthMonth");
    MESES_NOMES.forEach(function (nome, idx) {
      var opt = document.createElement("option");
      opt.value = idx + 1;
      opt.textContent = nome;
      birthSelect.appendChild(opt);
    });
    birthSelect.value = hoje.getMonth() + 1;

    var monthsSlider = document.getElementById("monthsWorked");
    var monthsVal = document.getElementById("monthsWorkedVal");
    var calcValue = document.getElementById("calcValue");
    var calcDate = document.getElementById("calcDate");

    function update() {
      var meses = parseInt(monthsSlider.value, 10);
      monthsVal.textContent = meses;
      var valor = (SALARIO_MINIMO_2026 / 12) * meses;
      calcValue.textContent = formatBRL(valor);

      var mesNasc = parseInt(birthSelect.value, 10);
      var lote = lotePorMesNascimento(mesNasc);
      calcDate.textContent = lote ? lote.dateDisplay : "—";
    }

    monthsSlider.addEventListener("input", update);
    birthSelect.addEventListener("change", update);
    update();
  }

  // ===== Contagem regressiva do prazo =====
  function renderPrazo() {
    var el = document.getElementById("daysLeft");
    var diff = Math.ceil((PRAZO_SAQUE - hoje) / 86400000);
    if (diff > 0) {
      el.textContent = diff + " dias restantes";
    } else {
      el.textContent = "prazo encerrado";
    }
  }

  // ===== Tema =====
  function initTheme() {
    var btn = document.getElementById("themeToggle");
    var body = document.body;
    var saved = null;
    try { saved = localStorage.getItem("abono2026-theme"); } catch (e) {}
    if (saved) {
      body.setAttribute("data-theme", saved);
      btn.textContent = saved === "dark" ? "Claro" : "Escuro";
    }
    btn.addEventListener("click", function () {
      var current = body.getAttribute("data-theme");
      var next = current === "dark" ? "light" : "dark";
      body.setAttribute("data-theme", next);
      btn.textContent = next === "dark" ? "Claro" : "Escuro";
      try { localStorage.setItem("abono2026-theme", next); } catch (e) {}
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    renderStatus();
    renderTrilha();
    renderTabela();
    initCalculadora();
    renderPrazo();
    initTheme();
  });
})();
