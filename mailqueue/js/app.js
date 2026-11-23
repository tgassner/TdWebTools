"use strict";

const REFRESH_SECONDS = 30;
const API_URL = "api.php";

// Spezialisierte Spalten aus dbo.GroupwareTransfer
const ERROR_COL   = "ErrorMsg";      // rot markiert, wenn nicht leer
const HIDDEN_COL  = "ContentJson";

// Welche State-Werte gelten als "Fehler"? (anpassen in EINER Zeile)
// Gueltige Werte sind smallint-Nummern; leere Menge = nur ErrorMsg wird geprueft.
const ERROR_STATES = new Set([3, 4, 5]);

// Freundliche Spalten-Namen (optional, wird nur im Kopf verwendet)
const LABELS = {
  ID: "ID", ObjectId: "Objekt-ID", State: "Status",
  Timestamp: "Timestamp", Priority: "Priorität", ErrorMsg: "Fehler",
  ObjectType: "Objekt-Typ", ItemArt: "Art", ItemID: "Item-ID",
  DokumentNr: "Dokumentnr.", Filename: "Datei",
};
const badge       = document.getElementById("badge");
const refreshBtn  = document.getElementById("refreshBtn");
const statusEl    = document.getElementById("status");
const lastUpdated = document.getElementById("lastUpdated");
const errorBox    = document.getElementById("errorBox");
const emptyBox    = document.getElementById("emptyBox");
const tableWrap   = document.getElementById("tableWrap");
const thead       = document.querySelector("#queueTable thead");
const tbody       = document.querySelector("#queueTable tbody");

let pending = false;
let stateSaving = false;
const DEFAULT_BTN_LABEL = "Aktualisieren";

refreshBtn.addEventListener("click", refresh);

function setPhase(phase) {
  statusEl.classList.remove("ok", "err");
  if (phase === "loading") {
    statusEl.textContent = "Lade …";
  } else if (phase === "ok") {
    statusEl.classList.add("ok");
    statusEl.textContent = "Verbindung OK";
  } else {
    statusEl.classList.add("err");
    statusEl.textContent = "Verbindungsfehler";
  }
}

function showError(message) {
  errorBox.textContent = "Fehler: " + message;
  errorBox.classList.remove("hidden");
}

function clearError() {
  errorBox.classList.add("hidden");
}

function collectKeys(rows) {
  const keys = [];
  const seen = new Set();
  for (const row of rows) {
    for (const k of Object.keys(row)) {
      if (!seen.has(k)) {
        seen.add(k);
        keys.push(k);
      }
    }
  }
  return keys;
}

function errorInfo(row) {
  const errMsg = row[ERROR_COL];
  const hasErrText = errMsg !== null && errMsg !== undefined && String(errMsg).trim().length > 0;
  const stateNum = Number(row.State);
  const isErrState = Number.isFinite(stateNum) && ERROR_STATES.has(stateNum);
  const isWarning = !hasErrText && Number.isFinite(stateNum) && stateNum !== 0;
  return { hasErrText, stateNum, isErrState, isError: hasErrText || isErrState, isWarning };
}

function applyRowState(tr, row) {
  const info = errorInfo(row);
  tr.classList.toggle("row-error", info.hasErrText);
  tr.classList.toggle("row-warning", info.isWarning);
  tr.title = info.hasErrText
    ? "Fehlermeldung gesetzt"
    : (info.isWarning ? "State=" + info.stateNum : "");
}

function buildStateCell(td, row, tr) {
  const stateNum = Number(row.State);
  if (row.State === undefined || row.State === null || !Number.isFinite(stateNum) || stateNum <= 0) {
    td.textContent = row.State === null ? "–" : (row.State === undefined ? "" : String(row.State));
    return;
  }

  td.classList.add("state-cell");

  const wrap = document.createElement("div");
  wrap.className = "state-wrap";

  const value = document.createElement("span");
  value.className = "state-value";
  value.textContent = String(row.State);

  const button = document.createElement("button");
  button.type = "button";
  button.className = "state-reset";
  button.textContent = "Reset auf 0";
  button.title = "Aktueller State: " + row.State;
  button.setAttribute("aria-label", "State von ID " + row.ID + " von " + row.State + " auf 0 setzen");

  button.addEventListener("click", async () => {
    clearError();
    stateSaving = true;
    button.disabled = true;
    button.textContent = "…";

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: row.ID, state: 0 }),
      });
      const data = await res.json();
      if (!data.ok) {
        throw new Error(data.error || "HTTP " + res.status);
      }

      row.State = 0;
      if (td.isConnected) {
        td.classList.remove("state-cell");
        td.textContent = "0";
      }
      applyRowState(tr, row);
    } catch (err) {
      showError(err.message);
      button.textContent = "Reset auf 0";
    } finally {
      stateSaving = false;
      button.disabled = false;
    }
  });

  wrap.appendChild(value);
  wrap.appendChild(button);
  td.appendChild(wrap);
}

function buildTimestampCell(td, value) {
  if (value === null || value === undefined || value === "") {
    td.textContent = "";
    return;
  }

  const raw = String(value);
  const m = raw.match(/^(\d{4})-(\d{2})-(\d{2})[T ](\d{2}):(\d{2}):(\d{2})/);
  if (!m) {
    td.textContent = raw;
    return;
  }

  td.classList.add("timestamp-cell");

  const date = document.createElement("span");
  date.className = "timestamp-date";
  date.textContent = m[3] + "." + m[2] + "." + m[1];

  const time = document.createElement("span");
  time.className = "timestamp-time";
  time.textContent = m[4] + ":" + m[5] + ":" + m[6];

  td.appendChild(date);
  td.appendChild(document.createElement("br"));
  td.appendChild(time);
}

function renderRows(rows) {
  const keys = collectKeys(rows).filter(k => k !== HIDDEN_COL);

  const headRow = document.createElement("tr");
  for (const k of keys) {
    const th = document.createElement("th");
    th.textContent = LABELS[k] || k;
    th.dataset.col = k;
    headRow.appendChild(th);
  }
  thead.innerHTML = "";
  thead.appendChild(headRow);

  const frag = document.createDocumentFragment();
  for (const row of rows) {
    const tr = document.createElement("tr");
    applyRowState(tr, row);

    for (const k of keys) {
      const td = document.createElement("td");
      td.dataset.col = k;
      if (k === "State") {
        buildStateCell(td, row, tr);
      } else if (k === "Timestamp") {
        buildTimestampCell(td, row[k]);
      } else if (k === "Filename" && row.ID !== undefined && row.ID !== null && row[k]) {
        const text = String(row[k]);
        const link = document.createElement("a");
        link.className = "file-download";
        link.href = API_URL + "?download=" + encodeURIComponent(String(row.ID));
        link.textContent = text;
        link.title = text;
        link.download = text;
        td.appendChild(link);
      } else {
        const v = row[k];
        const text = (v === null || v === undefined) ? "" : String(v);
        td.textContent = text;
        if (text) td.title = text;
      }
      tr.appendChild(td);
    }
    frag.appendChild(tr);
  }
  tbody.innerHTML = "";
  tbody.appendChild(frag);
}

async function refresh() {
  if (pending) return;
  pending = true;
  refreshBtn.disabled = true;
  refreshBtn.textContent = "Aktualisiere …";
  clearError();
  setPhase("loading");

  try {
    const res = await fetch(API_URL, { cache: "no-store" });
    const data = await res.json();
    if (!data.ok) {
      throw new Error(data.error || "HTTP " + res.status);
    }
    renderRows(data.rows);
    const n = data.rows.length;
    badge.textContent = n + (n === 1 ? " Mail" : " Mails");
    emptyBox.classList.toggle("hidden", n > 0);
    tableWrap.classList.toggle("hidden", n === 0);
    setPhase("ok");
  } catch (err) {
    showError(err.message);
    setPhase("error");
  } finally {
    pending = false;
    refreshBtn.disabled = false;
    refreshBtn.textContent = DEFAULT_BTN_LABEL;
    lastUpdated.textContent = "Stand: " + new Date().toLocaleTimeString("de-DE");
  }
}

function stateEditActive() {
  if (stateSaving) return true;
  const active = document.activeElement;
  return !!(active && active.matches && active.matches(".state-reset"));
}

refresh();
setInterval(() => {
  if (stateEditActive()) return;
  refresh();
}, REFRESH_SECONDS * 1000);
