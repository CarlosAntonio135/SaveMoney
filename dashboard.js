// Importa Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import {
  getAuth,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";

// Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCmw9A3WvecBRr19MhIX5-wKLf66r-voig",
  authDomain: "savemoney-7b401.firebaseapp.com",
  projectId: "savemoney-7b401",
  storageBucket: "savemoney-7b401.appspot.com",
  messagingSenderId: "1036605042056",
  appId: "1:1036605042056:web:1d5ee679915dba328c5e3d",
  measurementId: "G-LX8LY8FF6M"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Verifica se o usuário está autenticado
onAuthStateChanged(auth, (user) => {
  if (!user) {
    window.location.href = "login.html"; // redireciona se não estiver logado
  }
});

// Logout
const logoutBtn = document.getElementById("logout");
if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    signOut(auth)
      .then(() => {
        window.location.href = "login.html";
      })
      .catch((error) => {
        alert("Erro ao sair: " + error.message);
      });
  });
}

// Transações em memória
let transactions = [];

// Elementos
const descriptionInput = document.getElementById("description");
const amountInput = document.getElementById("amount");
const typeSelect = document.getElementById("type");
const transactionList = document.getElementById("transaction-list");
const balanceDisplay = document.getElementById("balance");
const addTransactionBtn = document.getElementById("add-transaction");

if (addTransactionBtn) {
  addTransactionBtn.addEventListener("click", () => {
    const description = descriptionInput.value.trim();
    const amount = parseFloat(amountInput.value);
    const type = typeSelect.value;

    if (description === "" || isNaN(amount)) {
      alert("Preencha todos os campos corretamente.");
      return;
    }

    const transaction = {
      description,
      amount: type === "expense" ? -amount : amount,
      type,
    };

    transactions.push(transaction);
    renderTransactions();
    updateBalance();

    // Limpa os campos
    descriptionInput.value = "";
    amountInput.value = "";
  });
}

function renderTransactions() {
  transactionList.innerHTML = "";

  transactions.forEach((t, index) => {
    const li = document.createElement("li");
    li.textContent = `${t.description} - R$ ${t.amount.toFixed(2)}`;
    li.className = t.amount < 0 ? "expense" : "income";

    const removeBtn = document.createElement("button");
    removeBtn.textContent = "Remover";
    removeBtn.onclick = () => {
      transactions.splice(index, 1);
      renderTransactions();
      updateBalance();
    };

    li.appendChild(removeBtn);
    transactionList.appendChild(li);
  });
}

function updateBalance() {
  const total = transactions.reduce((acc, t) => acc + t.amount, 0);
  balanceDisplay.textContent = `Saldo: R$ ${total.toFixed(2)}`;
}
