import { auth, db } from "./firebaseConfig.js";
import {
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

let transacoes = [];
let currentUser = null;

// Autenticação do usuário
onAuthStateChanged(auth, async (user) => {
  if (user) {
    currentUser = user;
    document.getElementById("userName").innerText = user.displayName || user.email;
    document.getElementById("userEmail").innerText = user.email;
    carregarTransacoes();
  } else {
    window.location.href = "login.html";
  }
});

// Carregar transações do Firestore
async function carregarTransacoes() {
  if (!currentUser) return;

  const q = query(collection(db, "transacoes"), where("uid", "==", currentUser.uid));
  const querySnapshot = await getDocs(q);

  transacoes = [];
  querySnapshot.forEach((doc) => {
    transacoes.push(doc.data());
  });

  atualizarInterface();
}

// Adicionar nova transação
document.getElementById("adicionarBtn").addEventListener("click", adicionarTransacao);

async function adicionarTransacao() {
  const descricao = document.getElementById("descricao").value;
  const valor = parseFloat(document.getElementById("valor").value);
  const tipo = document.getElementById("tipo").value;
  const data = document.getElementById("data").value;

  if (!descricao || isNaN(valor) || !data || !currentUser) return;

  const novaTransacao = {
    descricao,
    valor,
    tipo,
    data,
    uid: currentUser.uid,
  };

  await addDoc(collection(db, "transacoes"), novaTransacao);
  transacoes.push(novaTransacao);
  atualizarInterface();
  limparCampos();
}

// Atualizar a interface com as transações
function atualizarInterface() {
  const lista = document.getElementById("listaTransacoes");
  lista.innerHTML = "";

  let totalEntradas = 0;
  let totalSaidas = 0;

  transacoes.forEach((t) => {
    const item = document.createElement("div");
    item.className = "transacao-item";
    item.innerText = `${t.descricao} - R$ ${t.valor.toFixed(2)} - ${t.tipo} - ${t.data}`;
    lista.appendChild(item);

    if (t.tipo === "entrada") totalEntradas += t.valor;
    else totalSaidas += t.valor;
  });

  document.getElementById("totalEntradas").innerText = `R$ ${totalEntradas.toFixed(2)}`;
  document.getElementById("totalSaidas").innerText = `R$ ${totalSaidas.toFixed(2)}`;
  document.getElementById("saldoFinal").innerText = `R$ ${(totalEntradas - totalSaidas).toFixed(2)}`;
  atualizarGrafico(totalEntradas, totalSaidas);
}

// Limpar campos do formulário
function limparCampos() {
  document.getElementById("descricao").value = "";
  document.getElementById("valor").value = "";
  document.getElementById("data").value = "";
}

// Atualizar gráfico com Chart.js
let grafico;
function atualizarGrafico(entrada, saida) {
  const ctx = document.getElementById("grafico").getContext("2d");
  if (grafico) grafico.destroy();

  grafico = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: ["Entradas", "Saídas"],
      datasets: [{
        data: [entrada, saida],
        backgroundColor: ["#00ff88", "#ff4b4b"],
        borderWidth: 1,
      }],
    },
    options: {
      plugins: {
        legend: {
          labels: { color: "#fff" },
        },
      },
    },
  });
}

// Logout
document.getElementById("logoutBtn").addEventListener("click", async () => {
  await signOut(auth);
  window.location.href = "login.html";
});

// Abrir e fechar o modal de perfil
window.addEventListener("DOMContentLoaded", () => {
  document.getElementById("perfilBtn").addEventListener("click", () => {
    document.getElementById("perfilModal").style.display = "block
