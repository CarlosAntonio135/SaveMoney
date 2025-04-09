// Firebase e funcionalidades
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";
import {
  getAuth,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";

// Config Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCmw9A3WvecBRr19MhIX5-wKLf66r-voig",
  authDomain: "savemoney-7b401.firebaseapp.com",
  projectId: "savemoney-7b401",
  storageBucket: "savemoney-7b401.appspot.com",
  messagingSenderId: "1036605042056",
  appId: "1:1036605042056:web:1d5ee679915dba328c5e3d",
  measurementId: "G-LX8LY8FF6M"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

let userId = null;
let transacoes = [];

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "login.html";
  } else {
    userId = user.uid;
    await carregarTransacoes();
    atualizarInterface();
  }
});

// Logout
const logoutBtn = document.getElementById("logout");
if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    signOut(auth).then(() => window.location.href = "login.html");
  });
}

// DOM Elements
const descricaoInput = document.getElementById("descricao");
const valorInput = document.getElementById("valor");
const tipoInput = document.getElementById("tipo");
const dataInput = document.getElementById("data");
const lista = document.getElementById("listaTransacoes");

// Botão adicionar
const botaoAdicionar = document.querySelector("button[onclick='adicionarTransacao()']");
if (botaoAdicionar) botaoAdicionar.addEventListener("click", adicionarTransacao);

async function adicionarTransacao() {
  const descricao = descricaoInput.value;
  const valor = parseFloat(valorInput.value);
  const tipo = tipoInput.value;
  const data = dataInput.value;

  if (!descricao || isNaN(valor) || !data) return;

  transacoes.push({ descricao, valor, tipo, data });
  await salvarTransacoes();
  atualizarInterface();
  limparCampos();
}

function atualizarInterface() {
  lista.innerHTML = "";

  let totalEntradas = 0;
  let totalSaidas = 0;

  transacoes.forEach((t) => {
    const item = document.createElement("div");
    item.innerHTML = `${t.descricao} - R$ ${t.valor.toFixed(2)} - ${t.tipo} - ${t.data}`;
    lista.appendChild(item);

    if (t.tipo === "entrada") totalEntradas += t.valor;
    else totalSaidas += t.valor;
  });

  document.getElementById("totalEntradas").innerText = `R$ ${totalEntradas.toFixed(2)}`;
  document.getElementById("totalSaidas").innerText = `R$ ${totalSaidas.toFixed(2)}`;
  document.getElementById("saldoFinal").innerText = `R$ ${(totalEntradas - totalSaidas).toFixed(2)}`;

  atualizarGrafico(totalEntradas, totalSaidas);
}

function limparCampos() {
  descricaoInput.value = "";
  valorInput.value = "";
  dataInput.value = "";
}

let grafico;
function atualizarGrafico(entrada, saida) {
  const ctx = document.getElementById('grafico').getContext('2d');
  if (grafico) grafico.destroy();
  grafico = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Entradas', 'Saídas'],
      datasets: [{
        data: [entrada, saida],
        backgroundColor: ['#00ff88', '#ff4b4b']
      }]
    },
    options: {
      plugins: {
        legend: {
          labels: {
            color: '#fff'
          }
        }
      }
    }
  });
}

async function salvarTransacoes() {
  if (!userId) return;
  const ref = doc(db, "transacoes", userId);
  await setDoc(ref, { transacoes });
}

async function carregarTransacoes() {
  if (!userId) return;
  const ref = doc(db, "transacoes", userId);
  const snap = await getDoc(ref);
  if (snap.exists()) {
    transacoes = snap.data().transacoes || [];
  }
}

// Exporta PDF
function exportarPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  doc.text("Relatório Financeiro - SaveMoney", 20, 20);
  transacoes.forEach((t, i) => {
    const y = 30 + i * 10;
    doc.text(`${t.descricao} | ${t.tipo} | R$ ${t.valor} | ${t.data}`, 20, y);
  });
  doc.save("relatorio-financeiro.pdf");
}

// Exporta Excel
function exportarExcel() {
  const worksheet = XLSX.utils.json_to_sheet(transacoes);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Transações");
  XLSX.writeFile(workbook, "relatorio-financeiro.xlsx");
}
import { getAuth, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";

// Mostra o perfil
document.getElementById("btnPerfil").addEventListener("click", () => {
  const auth = getAuth();
  const user = auth.currentUser;

  if (user) {
    document.getElementById("perfilNome").innerText = user.displayName || "Não informado";
    document.getElementById("perfilEmail").innerText = user.email || "Não informado";
    document.getElementById("perfilProvedor").innerText = user.providerData[0].providerId === "password" ? "Email/Senha" : "Google";
    document.getElementById("perfilModal").style.display = "flex";
  }
});

// Logout (já deve existir, mas pode garantir que está aqui)
document.getElementById("logout").addEventListener("click", () => {
  const auth = getAuth();
  signOut(auth).then(() => {
    window.location.href = "login.html";
  }).catch((error) => {
    alert("Erro ao sair: " + error.message);
  });
});
