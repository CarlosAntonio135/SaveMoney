import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword
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

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const registerForm = document.getElementById("registerForm");
const errorMessage = document.getElementById("errorMessage");

registerForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const senha = document.getElementById("password").value;

  createUserWithEmailAndPassword(auth, email, senha)
    .then(() => {
      // Após o registro, redireciona para o painel
      window.location.href = "login.html";
    })
    .catch((error) => {
      errorMessage.textContent = "Erro: " + error.message;
      errorMessage.style.color = "red";
    });
});
