(function () {
  "use strict";

  // ===================== Constantes =====================
  const ICONS = [
    { key: "shopping_cart", label: "Mercado" },
    { key: "directions_car", label: "Transporte" },
    { key: "home", label: "Casa" },
    { key: "restaurant", label: "Alimentação" },
    { key: "celebration", label: "Lazer" },
    { key: "favorite", label: "Saúde" },
    { key: "school", label: "Educação" },
    { key: "pets", label: "Pets" },
    { key: "checkroom", label: "Roupas" },
    { key: "receipt_long", label: "Contas" },
    { key: "flight", label: "Viagem" },
    { key: "category", label: "Outros" },
  ];

  const PAPERS = [
    { key: "kraft", bg: "#EFE6D3", dark: "#D6CAB0" },
    { key: "manila", bg: "#E4DCC3", dark: "#CBC1A3" },
    { key: "sand", bg: "#D9CFB8", dark: "#BFB294" },
    { key: "slate", bg: "#CCD6D3", dark: "#AAB8B3" },
    { key: "caramel", bg: "#DCB88F", dark: "#C29A6C" },
    { key: "rose", bg: "#DEC7C3", dark: "#C4A6A1" },
    { key: "sage", bg: "#C9D3C2", dark: "#AEBAA5" },
    { key: "powder", bg: "#C7D3DE", dark: "#A9BAC9" },
  ];

  const LS_ENVELOPES = "bolsos_envelopes";
  const LS_TRANSACOES = "bolsos_transacoes";
  const LS_CONFIG = "bolsos_config";
  const VALOR_MAXIMO = 9999999.99;

  // ===================== Estado =====================
  let envelopes = loadJSON(LS_ENVELOPES, []);
  let transacoes = loadJSON(LS_TRANSACOES, []);
  let config = loadJSON(LS_CONFIG, { diaFechamento: 1 });



  let monthOffset = 0;
  let envelopeSelecionadoLancamento = null;
  let envelopeEmEdicaoId = null;
  let iconSelecionado = ICONS[0].key;
  let paperSelecionado = PAPERS[0].key;
  let filtroExtratoEnvelope = "todos";

  // ===================== Utils =====================
  function loadJSON(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (e) {
      return fallback;
    }
  }

  function saveAll() {
    localStorage.setItem(LS_ENVELOPES, JSON.stringify(envelopes));
    localStorage.setItem(LS_TRANSACOES, JSON.stringify(transacoes));
    localStorage.setItem(LS_CONFIG, JSON.stringify(config));
  }

  function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
  }

  function pad(n) { return String(n).padStart(2, "0"); }

  function toISODate(date) {
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
  }

  function parseISODate(str) {
    const [y, m, d] = str.split("-").map(Number);
    return new Date(y, m - 1, d);
  }

  function daysInMonth(y, m) {
    return new Date(y, m + 1, 0).getDate();
  }

  function formatMoeda(v) {
    return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  }

  function formatMoedaCompacta(v) {
    if (Math.abs(v) >= 100000) {
      return v.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
        notation: "compact",
        maximumFractionDigits: 1,
      });
    }
    return formatMoeda(v);
  }

  function parseValorInput(str) {
    if (!str) return 0;
    const clean = str.replace(/[^\d,.-]/g, "").replace(/\.(?=\d{3})/g, "").replace(",", ".");
    const n = parseFloat(clean);
    return isNaN(n) ? 0 : n;
  }

  function paperOf(key) {
    return PAPERS.find((p) => p.key === key) || PAPERS[0];
  }

  // ===================== Período (mês de competência) =====================
  function periodStartContaining(date, dia) {
    const y = date.getFullYear(), m = date.getMonth();
    const dThis = Math.min(dia, daysInMonth(y, m));
    if (date.getDate() >= dThis) {
      return new Date(y, m, dThis);
    }
    const pm = m - 1;
    const py = pm < 0 ? y - 1 : y;
    const pmNorm = ((pm % 12) + 12) % 12;
    const dPrev = Math.min(dia, daysInMonth(py, pmNorm));
    return new Date(py, pmNorm, dPrev);
  }

  function periodForOffset(offset) {
    const dia = config.diaFechamento || 1;
    const today = new Date();
    let start = periodStartContaining(today, dia);
    start = new Date(start.getFullYear(), start.getMonth() + offset, 1);
    const clampedDay = Math.min(dia, daysInMonth(start.getFullYear(), start.getMonth()));
    start = new Date(start.getFullYear(), start.getMonth(), clampedDay);
    const end = new Date(start.getFullYear(), start.getMonth() + 1, start.getDate());
    end.setDate(end.getDate() - 1);
    return { start, end };
  }

  function periodLabel(period) {
    const txt = period.start.toLocaleDateString("pt-BR", { month: "long", year: "numeric" });
    return txt.charAt(0).toUpperCase() + txt.slice(1);
  }

  function transacoesNoPeriodo(period, envelopeId) {
    return transacoes.filter((t) => {
      if (envelopeId && t.envelopeId !== envelopeId) return false;
      const d = parseISODate(t.data);
      return d >= period.start && d <= period.end;
    });
  }

  function gastoEnvelope(envelopeId, period) {
    return transacoesNoPeriodo(period, envelopeId).reduce((s, t) => s + t.valor, 0);
  }

  // ===================== Render: Ledger bar =====================
  function renderLedger() {
    const period = periodForOffset(monthOffset);
    document.getElementById("ledger-mes").textContent = periodLabel(period);

    const orcado = envelopes.reduce((s, e) => s + (e.limite || 0), 0);
    const gasto = envelopes.reduce((s, e) => s + gastoEnvelope(e.id, period), 0);
    const livre = orcado - gasto;

    document.getElementById("stat-orcado").textContent = formatMoedaCompacta(orcado);
    document.getElementById("stat-gasto").textContent = formatMoedaCompacta(gasto);
    const elLivre = document.getElementById("stat-livre");
    elLivre.textContent = formatMoedaCompacta(livre);
    elLivre.parentElement.classList.toggle("negativo", livre < 0);

    const pct = orcado > 0 ? Math.min(100, (gasto / orcado) * 100) : 0;
    const fill = document.getElementById("ledger-bar-fill");
    fill.style.width = pct + "%";
    fill.style.background = gasto > orcado ? "var(--brick)" : pct >= 80 ? "var(--gold)" : "var(--teal)";
  }

  // ===================== Render: Início =====================
  function statusDoEnvelope(spent, limite) {
    if (limite <= 0) return { key: "ok", label: "sem limite", color: "var(--teal)" };
    const pct = (spent / limite) * 100;
    if (pct > 100) return { key: "estourado", label: "estourou", color: "var(--brick)", pct };
    if (pct >= 80) return { key: "atencao", label: Math.round(pct) + "%", color: "var(--gold)", pct };
    return { key: "ok", label: Math.round(pct) + "%", color: "var(--teal)", pct };
  }

  function badgeIcon(env, status) {
    if (env.limite <= 0) return "all_inclusive";
    if (status.key === "estourado") return "warning";
    return null;
  }

  function renderInicio() {
    const period = periodForOffset(monthOffset);
    const grid = document.getElementById("envelopes-grid");
    const empty = document.getElementById("empty-inicio");
    grid.innerHTML = "";

    if (envelopes.length === 0) {
      empty.hidden = false;
      grid.hidden = true;
      return;
    }
    empty.hidden = true;
    grid.hidden = false;

    envelopes.forEach((env) => {
      const spent = gastoEnvelope(env.id, period);
      const status = statusDoEnvelope(spent, env.limite);
      const paper = paperOf(env.paper);
      const pctClamped = Math.min(100, status.pct || 0);
      const restante = env.limite - spent;
      const icon = badgeIcon(env, status);

      let rodapeTexto;
      if (env.limite <= 0) {
        rodapeTexto = "Sem limite definido para este envelope";
      } else if (restante >= 0) {
        rodapeTexto = `Restam ${formatMoedaCompacta(restante)} disponíveis`;
      } else {
        rodapeTexto = `Estourou em ${formatMoedaCompacta(Math.abs(restante))}`;
      }

      const progressoHtml = env.limite > 0 ? `
          <div class="envelope-progress-row">
            <div class="envelope-progress-track">
              <div class="envelope-progress-fill tag-fill-${status.key}" style="width:${pctClamped}%"></div>
              <div class="envelope-progress-thumb" style="left:${pctClamped}%;border-color:${status.color}"></div>
            </div>
            <span class="envelope-progress-pct">${Math.round(pctClamped)}%</span>
          </div>` : "";

      const card = document.createElement("div");
      card.className = "envelope-card";
      card.style.background = `linear-gradient(135deg, rgba(255,255,255,0.30), rgba(255,255,255,0) 45%), ${paper.bg}`;
      card.innerHTML = `
        <div class="envelope-flap" style="background:linear-gradient(180deg, rgba(255,255,255,0.20), rgba(0,0,0,0.10)), ${paper.dark}"></div>
        <div class="envelope-seal" style="--pct:${pctClamped};--seal-color:${status.color}">
          <span class="material-symbols-outlined">${env.icon}</span>
        </div>
        <div class="envelope-body">
          <div class="envelope-top-row">
            <div class="envelope-nome">${escapeHtml(env.nome)}</div>
            <span class="envelope-badge tag-${status.key}">${icon ? `<span class="material-symbols-outlined">${icon}</span>` : ""}${status.label}</span>
          </div>
          <span class="envelope-gasto">${formatMoedaCompacta(spent)}</span>
          <div class="envelope-de">de ${formatMoedaCompacta(env.limite)}</div>
          ${progressoHtml}
          <div class="envelope-footer">
            <span class="envelope-footer-icon"><span class="material-symbols-outlined">${env.icon}</span></span>
            <span class="envelope-footer-text">${rodapeTexto}</span>
          </div>
        </div>
      `;
      card.addEventListener("click", () => {
        filtroExtratoEnvelope = env.id;
        goToView("extrato");
        document.getElementById("filtro-envelope").value = env.id;
        renderExtrato();
      });
      grid.appendChild(card);
    });
  }

  function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  // ===================== Render: Envelopes (gerenciar) =====================
  function renderEnvelopeList() {
    const list = document.getElementById("envelope-list");
    list.innerHTML = "";
    if (envelopes.length === 0) {
      list.innerHTML = `<div class="empty-state"><span class="material-symbols-outlined empty-icon">mail</span><p>Nenhum envelope criado ainda.</p></div>`;
      return;
    }
    envelopes.forEach((env) => {
      const paper = paperOf(env.paper);
      const item = document.createElement("div");
      item.className = "envelope-list-item";
      item.innerHTML = `
        <div class="envelope-list-icon" style="background:${paper.bg}">
          <span class="material-symbols-outlined">${env.icon}</span>
        </div>
        <div class="envelope-list-info">
          <strong>${escapeHtml(env.nome)}</strong>
          <span>limite ${formatMoeda(env.limite)}/mês</span>
        </div>
        <span class="material-symbols-outlined" style="color:var(--muted)">chevron_right</span>
      `;
      item.addEventListener("click", () => abrirSheetEnvelope(env.id));
      list.appendChild(item);
    });
  }

  // ===================== Render: Extrato =====================
  function renderExtratoFiltro() {
    const sel = document.getElementById("filtro-envelope");
    const current = sel.value || "todos";
    sel.innerHTML = `<option value="todos">Todos os envelopes</option>` +
      envelopes.map((e) => `<option value="${e.id}">${escapeHtml(e.nome)}</option>`).join("");
    sel.value = envelopes.some((e) => e.id === current) ? current : "todos";
  }

  function renderExtrato() {
    const period = periodForOffset(monthOffset);
    const filtro = document.getElementById("filtro-envelope").value;
    const lista = document.getElementById("extrato-lista");
    const empty = document.getElementById("empty-extrato");

    const envId = filtro === "todos" ? null : filtro;
    const itens = transacoesNoPeriodo(period, envId).slice().sort((a, b) => (a.data < b.data ? 1 : -1));

    lista.innerHTML = "";
    if (itens.length === 0) {
      empty.hidden = false;
      return;
    }
    empty.hidden = true;

    itens.forEach((t) => {
      const env = envelopes.find((e) => e.id === t.envelopeId);
      const paper = env ? paperOf(env.paper) : paperOf("kraft");
      const d = parseISODate(t.data);
      const dataFmt = d.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });

      const item = document.createElement("div");
      item.className = "extrato-item";
      item.innerHTML = `
        <div class="extrato-icon" style="background:${paper.bg}">
          <span class="material-symbols-outlined">${env ? env.icon : "help"}</span>
        </div>
        <div class="extrato-info">
          <strong>${env ? escapeHtml(env.nome) : "Envelope excluído"}${t.nota ? " · " + escapeHtml(t.nota) : ""}</strong>
          <span>${dataFmt}</span>
        </div>
        <div class="extrato-valor">-${formatMoeda(t.valor)}</div>
        <button class="extrato-delete" aria-label="Excluir lançamento">
          <span class="material-symbols-outlined">delete</span>
        </button>
      `;
      item.querySelector(".extrato-delete").addEventListener("click", (ev) => {
        ev.stopPropagation();
        if (confirm("Excluir este lançamento?")) {
          transacoes = transacoes.filter((x) => x.id !== t.id);
          saveAll();
          renderTudo();
          showToast("Lançamento excluído");
        }
      });
      lista.appendChild(item);
    });
  }

  // ===================== Render geral =====================
  function renderTudo() {
    renderLedger();
    renderInicio();
    renderEnvelopeList();
    renderExtratoFiltro();
    renderExtrato();
  }

  // ===================== Navegação de views =====================
  const VIEWS_COM_FAB = ["inicio", "extrato"];

  function goToView(view) {
    document.querySelectorAll(".view").forEach((v) => v.classList.remove("active"));
    document.getElementById("view-" + view).classList.add("active");
    document.querySelectorAll(".nav-btn").forEach((b) => b.classList.toggle("active", b.dataset.view === view));
    document.getElementById("fab-wrap").hidden = !VIEWS_COM_FAB.includes(view);
  }

  document.querySelectorAll(".nav-btn").forEach((btn) => {
    btn.addEventListener("click", () => goToView(btn.dataset.view));
  });

  document.getElementById("btn-mes-anterior").addEventListener("click", () => {
    monthOffset -= 1;
    renderTudo();
  });
  document.getElementById("btn-mes-proximo").addEventListener("click", () => {
    monthOffset += 1;
    renderTudo();
  });

  // ===================== Sheets =====================
  const overlay = document.getElementById("overlay");

  function openSheet(id) {
    document.getElementById(id).classList.add("visible");
    overlay.classList.add("visible");
  }

  function closeSheets() {
    document.querySelectorAll(".sheet").forEach((s) => s.classList.remove("visible"));
    overlay.classList.remove("visible");
  }

  overlay.addEventListener("click", closeSheets);

  // ---- Sheet: novo lançamento ----
  function renderChipsEnvelope() {
    const wrap = document.getElementById("chips-envelope");
    wrap.innerHTML = "";
    envelopes.forEach((env) => {
      const chip = document.createElement("button");
      chip.type = "button";
      chip.className = "chip" + (envelopeSelecionadoLancamento === env.id ? " selected" : "");
      chip.innerHTML = `<span class="material-symbols-outlined">${env.icon}</span>${escapeHtml(env.nome)}`;
      chip.addEventListener("click", () => {
        envelopeSelecionadoLancamento = env.id;
        renderChipsEnvelope();
      });
      wrap.appendChild(chip);
    });
  }

  document.getElementById("fab-add").addEventListener("click", () => {
    if (envelopes.length === 0) {
      showToast("Crie um envelope primeiro");
      goToView("envelopes");
      return;
    }
    envelopeSelecionadoLancamento = filtroExtratoEnvelope !== "todos" ? filtroExtratoEnvelope : envelopes[0].id;
    document.getElementById("input-valor").value = "";
    document.getElementById("input-nota").value = "";
    document.getElementById("input-data").value = toISODate(new Date());
    renderChipsEnvelope();
    openSheet("sheet-lancamento");
  });

  document.getElementById("btn-salvar-lancamento").addEventListener("click", () => {
    const valor = parseValorInput(document.getElementById("input-valor").value);
    const data = document.getElementById("input-data").value || toISODate(new Date());
    const nota = document.getElementById("input-nota").value.trim();

    if (!envelopeSelecionadoLancamento) {
      showToast("Escolha um envelope");
      return;
    }
    if (valor <= 0) {
      showToast("Informe um valor válido");
      return;
    }
    if (valor > VALOR_MAXIMO) {
      showToast("Valor muito alto — confira se não digitou um zero a mais");
      return;
    }

    transacoes.push({ id: generateId(), envelopeId: envelopeSelecionadoLancamento, valor, nota, data });
    saveAll();
    closeSheets();
    renderTudo();
    showToast("Lançamento salvo");
  });

  // ---- Sheet: novo/editar envelope ----
  function renderIconGrid() {
    const grid = document.getElementById("icon-grid");
    grid.innerHTML = "";
    ICONS.forEach((ic) => {
      const opt = document.createElement("button");
      opt.type = "button";
      opt.className = "icon-opt" + (iconSelecionado === ic.key ? " selected" : "");
      opt.setAttribute("aria-label", ic.label);
      opt.innerHTML = `<span class="material-symbols-outlined">${ic.key}</span>`;
      opt.addEventListener("click", () => {
        iconSelecionado = ic.key;
        renderIconGrid();
      });
      grid.appendChild(opt);
    });
  }

  function renderPaperGrid() {
    const grid = document.getElementById("paper-grid");
    grid.innerHTML = "";
    PAPERS.forEach((p) => {
      const opt = document.createElement("button");
      opt.type = "button";
      opt.className = "paper-opt" + (paperSelecionado === p.key ? " selected" : "");
      opt.style.background = p.bg;
      opt.setAttribute("aria-label", p.key);
      opt.addEventListener("click", () => {
        paperSelecionado = p.key;
        renderPaperGrid();
      });
      grid.appendChild(opt);
    });
  }

  function abrirSheetEnvelope(id) {
    envelopeEmEdicaoId = id || null;
    const excluirBtn = document.getElementById("btn-excluir-envelope");
    const titulo = document.getElementById("titulo-sheet-envelope");

    if (id) {
      const env = envelopes.find((e) => e.id === id);
      document.getElementById("input-nome-envelope").value = env.nome;
      document.getElementById("input-limite-envelope").value = String(env.limite).replace(".", ",");
      iconSelecionado = env.icon;
      paperSelecionado = env.paper;
      titulo.textContent = "Editar envelope";
      excluirBtn.hidden = false;
    } else {
      document.getElementById("input-nome-envelope").value = "";
      document.getElementById("input-limite-envelope").value = "";
      iconSelecionado = ICONS[0].key;
      paperSelecionado = PAPERS[envelopes.length % PAPERS.length].key;
      titulo.textContent = "Novo envelope";
      excluirBtn.hidden = true;
    }
    renderIconGrid();
    renderPaperGrid();
    openSheet("sheet-envelope");
  }

  document.getElementById("btn-novo-envelope").addEventListener("click", () => abrirSheetEnvelope(null));
  document.getElementById("btn-criar-primeiro").addEventListener("click", () => {
    goToView("envelopes");
    abrirSheetEnvelope(null);
  });

  document.getElementById("btn-salvar-envelope").addEventListener("click", () => {
    const nome = document.getElementById("input-nome-envelope").value.trim();
    const limite = parseValorInput(document.getElementById("input-limite-envelope").value);

    if (!nome) {
      showToast("Dê um nome ao envelope");
      return;
    }
    if (limite > VALOR_MAXIMO) {
      showToast("Limite muito alto — confira se não digitou um zero a mais");
      return;
    }

    if (envelopeEmEdicaoId) {
      const env = envelopes.find((e) => e.id === envelopeEmEdicaoId);
      env.nome = nome;
      env.limite = limite;
      env.icon = iconSelecionado;
      env.paper = paperSelecionado;
    } else {
      envelopes.push({ id: generateId(), nome, limite, icon: iconSelecionado, paper: paperSelecionado });
    }
    saveAll();
    closeSheets();
    renderTudo();
    showToast("Envelope salvo");
  });

  document.getElementById("btn-excluir-envelope").addEventListener("click", () => {
    if (!envelopeEmEdicaoId) return;
    if (!confirm("Excluir este envelope e todos os lançamentos dele?")) return;
    transacoes = transacoes.filter((t) => t.envelopeId !== envelopeEmEdicaoId);
    envelopes = envelopes.filter((e) => e.id !== envelopeEmEdicaoId);
    saveAll();
    closeSheets();
    renderTudo();
    showToast("Envelope excluído");
  });

  document.getElementById("filtro-envelope").addEventListener("change", renderExtrato);

  // ===================== Ajustes =====================
  function popularConfigDiaFechamento() {
    const sel = document.getElementById("config-dia-fechamento");
    sel.innerHTML = "";
    for (let d = 1; d <= 28; d++) {
      const opt = document.createElement("option");
      opt.value = d;
      opt.textContent = "Dia " + d;
      sel.appendChild(opt);
    }
    sel.value = config.diaFechamento || 1;
  }

  document.getElementById("config-dia-fechamento").addEventListener("change", (ev) => {
    config.diaFechamento = Number(ev.target.value);
    saveAll();
    renderTudo();
    showToast("Fechamento atualizado");
  });

  document.getElementById("btn-exportar").addEventListener("click", () => {
    const backup = { envelopes, transacoes, config, exportadoEm: new Date().toISOString() };
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `bolsos-backup-${toISODate(new Date())}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    showToast("Backup exportado");
  });

  document.getElementById("btn-importar").addEventListener("click", () => {
    document.getElementById("input-importar").click();
  });

  document.getElementById("input-importar").addEventListener("change", (ev) => {
    const file = ev.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result);
        if (!Array.isArray(data.envelopes) || !Array.isArray(data.transacoes)) {
          throw new Error("formato inválido");
        }
        envelopes = data.envelopes;
        transacoes = data.transacoes;
        config = data.config || config;
        saveAll();
        renderTudo();
        popularConfigDiaFechamento();
        showToast("Backup importado");
      } catch (e) {
        showToast("Arquivo de backup inválido");
      }
      ev.target.value = "";
    };
    reader.readAsText(file);
  });

  document.getElementById("btn-apagar-tudo").addEventListener("click", () => {
    if (!confirm("Apagar todos os envelopes e lançamentos deste aparelho? Essa ação não pode ser desfeita.")) return;
    envelopes = [];
    transacoes = [];
    config = { diaFechamento: 1 };
    saveAll();
    renderTudo();
    popularConfigDiaFechamento();
    showToast("Dados apagados");
  });

  // ===================== Toast =====================
  let toastTimer = null;
  function showToast(msg) {
    const el = document.getElementById("toast");
    el.textContent = msg;
    el.classList.add("visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove("visible"), 2200);
  }

  // ===================== Init =====================
  function init() {
    popularConfigDiaFechamento();
    renderTudo();

    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("sw.js").catch(() => {});
    }
  }

  init();
})();
