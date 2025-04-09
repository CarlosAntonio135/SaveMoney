// dashboard.js
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

async function carregarTransacoes() {
  if (!currentUser) return;

  const q = query(
    collection(db, "transacoes"),
    where("uid", "==", currentUser.uid)
  );

  const querySnapshot = await getDocs(q);
  transacoes = [];
  querySnapshot.forEach((doc) => {
    transacoes.push(doc.data());
  });
  atualizarInterface();
}

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

function atualizarInterface() {
  const lista = document.getElementById("listaTransacoes");
  lista.innerHTML = "";

  let totalEntradas = 0;
  let totalSaidas = 0;

  transacoes.forEach((t) => {
    const item = document.createElement("div");
    item.classList.add("transacao-item");
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
          labels: { color: '#fff' }
        }
      }
    }
  });
}

document.getElementById("logoutBtn").addEventListener("click", async () => {
  await signOut(auth);
  window.location.href = "login.html";
});

document.getElementById("perfilBtn").addEventListener("click", () => {
  const modal = document.getElementById("perfilModal");
  modal.style.display = "block";
});

document.getElementById("fecharModal").addEventListener("click", () => {
  document.getElementById("perfilModal").style.display = "none";
});

document.addEventListener("click", function (event) {
  const modal = document.getElementById("perfilModal");
  const perfilBtn = document.getElementById("perfilBtn");
  if (!perfilBtn.contains(event.target) && !modal.contains(event.target)) {
    modal.style.display = "none";
  }
});
