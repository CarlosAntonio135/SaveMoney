import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import {
  getAuth,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";

// Firebase Config
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
const auth = getAuth(app);

// Verifica se o usuário está autenticado
onAuthStateChanged(auth, (user) => {
  if (!user) {
    window.location.href = "login.html";
  }
});

// Botão de Perfil
document.getElementById("btnPerfil").addEventListener("click", () => {
  const user = auth.currentUser;
  if (user) {
    document.getElementById("perfilNome").innerText = user.displayName || "Não informado";
    document.getElementById("perfilEmail").innerText = user.email || "Não informado";
    document.getElementById("perfilProvedor").innerText =
      user.providerData[0].providerId === "password" ? "Email/Senha" : "Google";
    document.getElementById("perfilModal").style.display = "flex";
  }
});

// Logout
document.getElementById("logout").addEventListener("click", () => {
  signOut(auth)
    .then(() => {
      window.location.href = "login.html";
    })
    .catch((error) => {
      alert("Erro ao sair: " + error.message);
    });
});

// Transações
let transacoes = [];

function adicionarTransacao() {
  const descricao = document.getElementById("descricao").value;
  const valor = parseFloat(document.getElementById("valor").value);
  const tipo = document.getElementById("tipo").value;
  const data = document.getElementById("data").value;

  if (!descricao || isNaN(valor) || !data) return;

  transacoes.push({ descricao, valor, tipo, data });
  atualizarInterface();
  limparCampos();
}

function atualizarInterface() {
  const lista = document.getElementById("listaTransacoes");
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
  document.getElementById("descricao").value = "";
  document.getElementById("valor").value = "";
  document.getElementById("data").value = "";
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
        backgroundColor: ['#00ff88', '#ff4b4b'],
        borderWidth: 1
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

function exportarExcel() {
  const worksheet = XLSX.utils.json_to_sheet(transacoes);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Transações");
  XLSX.writeFile(workbook, "relatorio-financeiro.xlsx");
}
