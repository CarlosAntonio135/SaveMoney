// dashboard.js

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "sua-chave",
  authDomain: "seu-app.firebaseapp.com",
  projectId: "seu-app",
  storageBucket: "seu-app.appspot.com",
  messagingSenderId: "123",
  appId: "123",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const userName = document.getElementById("userName");
const userEmail = document.getElementById("userEmail");
const perfilBtn = document.getElementById("perfilBtn");
const perfilModal = document.getElementById("perfilModal");
const fecharModal = document.getElementById("fecharModal");
const logoutBtn = document.getElementById("logoutBtn");

perfilBtn.onclick = () => perfilModal.style.display = "block";
fecharModal.onclick = () => perfilModal.style.display = "none";
window.onclick = e => { if (e.target === perfilModal) perfilModal.style.display = "none"; };
logoutBtn.onclick = () => signOut(auth).then(() => location.href = "login.html");

onAuthStateChanged(auth, user => {
  if (user) {
    userName.textContent = user.displayName || "Usuário";
    userEmail.textContent = user.email || "Email";
  } else {
    location.href = "login.html";
  }
});

const listaTransacoes = document.getElementById("listaTransacoes");
let transacoes = JSON.parse(localStorage.getItem("transacoes")) || [];

function salvarTransacoes() {
  localStorage.setItem("transacoes", JSON.stringify(transacoes));
}

function atualizarResumo() {
  let entradas = 0, saidas = 0;
  transacoes.forEach(t => {
    t.tipo === "entrada" ? entradas += t.valor : saidas += t.valor;
  });
  document.getElementById("totalEntradas").textContent = `R$ ${entradas.toFixed(2)}`;
  document.getElementById("totalSaidas").textContent = `R$ ${saidas.toFixed(2)}`;
  document.getElementById("saldoFinal").textContent = `R$ ${(entradas - saidas).toFixed(2)}`;
}

function renderizarTransacoes() {
  listaTransacoes.innerHTML = "";
  transacoes.forEach(t => {
    const div = document.createElement("div");
    div.textContent = `${t.data} - ${t.tipo} - ${t.descricao}: R$ ${t.valor.toFixed(2)}`;
    listaTransacoes.appendChild(div);
  });
  atualizarResumo();
  atualizarGrafico();
}

window.adicionarTransacao = () => {
  const descricao = document.getElementById("descricao").value;
  const valor = parseFloat(document.getElementById("valor").value);
  const tipo = document.getElementById("tipo").value;
  const data = document.getElementById("data").value;
  if (!descricao || isNaN(valor) || !data) return alert("Preencha todos os campos!");
  transacoes.push({ descricao, valor, tipo, data });
  salvarTransacoes();
  renderizarTransacoes();
  document.getElementById("descricao").value = "";
  document.getElementById("valor").value = "";
  document.getElementById("data").value = "";
};

window.exportarPDF = () => {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  doc.text("Relatório Financeiro", 10, 10);
  transacoes.forEach((t, i) => {
    doc.text(`${t.data} - ${t.tipo} - ${t.descricao}: R$ ${t.valor.toFixed(2)}`, 10, 20 + i * 10);
  });
  doc.save("relatorio.pdf");
};

window.exportarExcel = () => {
  const wb = XLSX.utils.book_new();
  const ws_data = [["Data", "Tipo", "Descrição", "Valor"]];
  transacoes.forEach(t => ws_data.push([t.data, t.tipo, t.descricao, t.valor]));
  const ws = XLSX.utils.aoa_to_sheet(ws_data);
  XLSX.utils.book_append_sheet(wb, ws, "Transações");
  XLSX.writeFile(wb, "relatorio.xlsx");
};

let grafico;
function atualizarGrafico() {
  const ctx = document.getElementById("grafico").getContext("2d");
  const entradas = transacoes.filter(t => t.tipo === "entrada").reduce((s, t) => s + t.valor, 0);
  const saidas = transacoes.filter(t => t.tipo === "saida").reduce((s, t) => s + t.valor, 0);
  if (grafico) grafico.destroy();
  grafico = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: ["Entradas", "Saídas"],
      datasets: [{ data: [entradas, saidas], backgroundColor: ["#4caf50", "#f44336"] }]
    },
    options: {
      plugins: { legend: { labels: { color: "#fff" } } }
    }
  });
}

window.limparHistorico = () => {
  if (confirm("Tem certeza que deseja apagar o histórico?")) {
    transacoes = [];
    salvarTransacoes();
    renderizarTransacoes();
  }
};

renderizarTransacoes();

// Navegação entre abas
const navLinks = document.querySelectorAll('.nav-links a');
navLinks.forEach(link => link.addEventListener('click', e => {
  e.preventDefault();
  const target = link.getAttribute('href').substring(1);
  document.querySelectorAll('main section').forEach(sec => {
    sec.style.display = sec.id === target ? 'block' : 'none';
  });
}));

// Metas
const formMeta = document.getElementById("formMeta");
const listaMetas = document.getElementById("listaMetas");
let metas = JSON.parse(localStorage.getItem("metas")) || [];
function renderizarMetas() {
  listaMetas.innerHTML = "";
  metas.forEach(meta => {
    const progresso = Math.min((meta.atual / meta.valor) * 100, 100);
    listaMetas.innerHTML += `<div class='meta-card'><strong>${meta.nome}</strong><br>R$ ${meta.atual.toFixed(2)} de R$ ${meta.valor.toFixed(2)}<div class='meta-progress'><div class='meta-progress-bar' style='width:${progresso}%;'></div></div><small>Data limite: ${meta.data}</small></div>`;
  });
}
formMeta?.addEventListener("submit", e => {
  e.preventDefault();
  const nome = document.getElementById("nomeMeta").value;
  const valor = parseFloat(document.getElementById("valorMeta").value);
  const data = document.getElementById("dataMeta").value;
  metas.push({ nome, valor, data, atual: 0 });
  localStorage.setItem("metas", JSON.stringify(metas));
  formMeta.reset();
  renderizarMetas();
});
renderizarMetas();
