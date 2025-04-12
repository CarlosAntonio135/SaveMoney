import { auth } from "./firebaseConfig.js";
import {
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

window.addEventListener("DOMContentLoaded", () => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      localStorage.setItem("usuarioLogado", JSON.stringify({
        uid: user.uid,
        email: user.email,
        displayName: user.displayName
      }));
      window.location.href = "index.html";
    }
  });

  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
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
  }

  const googleBtn = document.getElementById("loginGoogle");
  if (googleBtn) {
    googleBtn.addEventListener("click", () => {
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
  }
});
