import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider
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
const provider = new GoogleAuthProvider();

// Login com email e senha
const loginForm = document.getElementById("loginForm");
const errorMessage = document.getElementById("errorMessage");

loginForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const senha = document.getElementById("password").value;

  signInWithEmailAndPassword(auth, email, senha)
    .then(() => {
      window.location.href = "painel.html";
    })
    .catch((error) => {
      errorMessage.textContent = "Erro: " + error.message;
      errorMessage.style.color = "red";
    });
});

// Login com Google
const googleBtn = document.getElementById("googleLogin");
if (googleBtn) {
  googleBtn.addEventListener("click", () => {
    signInWithPopup(auth, provider)
      .then(() => {
        window.location.href = "painel.html";
      })
      .catch((error) => {
        errorMessage.textContent = "Erro: " + error.message;
        errorMessage.style.color = "red";
      });
  });
}
function loginUsuario(email, senha) {
  // Supondo que você valide o login aqui
  if (email === "teste@email.com" && senha === "123456") {
    // Redireciona para a página principal
    window.location.href = "index.html";
  } else {
    alert("Email ou senha incorretos!");
  }
}
