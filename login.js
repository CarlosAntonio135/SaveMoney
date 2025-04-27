import { auth } from "./firebaseConfig.js";
import {
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

document.addEventListener("DOMContentLoaded", () => {

  // Se já estiver logado, redireciona para o Dashboard
  onAuthStateChanged(auth, (user) => {
    if (user) {
      const usuario = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName
      };
      localStorage.setItem("usuarioLogado", JSON.stringify(usuario));
      window.location.href = "index.html";
    }
  });

  const form = document.getElementById("loginForm");
  const googleBtn = document.getElementById("googleLogin");
  const errorMessage = document.getElementById("errorMessage");

  // Login com email e senha
  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const email = document.getElementById("email").value.trim();
      const senha = document.getElementById("password").value.trim();
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, senha);
        const user = userCredential.user;
        localStorage.setItem("usuarioLogado", JSON.stringify({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName
        }));
        window.location.href = "index.html";
      } catch (error) {
        errorMessage.textContent = "Erro: " + error.message;
      }
    });
  }

  // Login com Google
  if (googleBtn) {
    googleBtn.addEventListener("click", async () => {
      const provider = new GoogleAuthProvider();
      try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;
        localStorage.setItem("usuarioLogado", JSON.stringify({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName
        }));
        window.location.href = "index.html";
      } catch (error) {
        errorMessage.textContent = "Erro no login com Google: " + error.message;
      }
    });
  }
});
