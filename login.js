import { auth } from "./firebaseConfig.js";
import {
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

// Verifica se já está logado e redireciona
onAuthStateChanged(auth, (user) => {
  if (user) {
    // Salva dados no localStorage
    localStorage.setItem("usuarioLogado", JSON.stringify({
      uid: user.uid,
      email: user.email,
      displayName: user.displayName
    }));
    window.location.href = "index.html";
  }
});

// Login com email e senha
document.getElementById("loginForm").addEventListener("submit", (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const senha = document.getElementById("senha").value;

  signInWithEmailAndPassword(auth, email, senha)
    .then((userCredential) => {
      const user = userCredential.user;
      localStorage.setItem("usuarioLogado", JSON.stringify({
        uid: user.uid,
        email: user.email,
        displayName: user.displayName
      }));
      window.location.href = "index.html";
    })
    .catch((error) => {
      alert("Erro ao fazer login: " + error.message);
    });
});

// Login com Google
document.getElementById("loginGoogle").addEventListener("click", () => {
  const provider = new GoogleAuthProvider();

  signInWithPopup(auth, provider)
    .then((result) => {
      const user = result.user;
      localStorage.setItem("usuarioLogado", JSON.stringify({
        uid: user.uid,
        email: user.email,
        displayName: user.displayName
      }));
      window.location.href = "index.html";
    })
    .catch((error) => {
      alert("Erro no login com Google: " + error.message);
    });
});

