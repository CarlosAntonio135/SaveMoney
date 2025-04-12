import { auth } from "./firebaseConfig.js";
import {
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

document.addEventListener("DOMContentLoaded", () => {

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

  const form = document.getElementById("loginForm");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const email = document.getElementById("email").value;
      const senha = document.getElementById("password").value;

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
          document.getElementById("errorMessage").textContent = "Erro: " + error.message;
        });
    });
  }


  const googleBtn = document.getElementById("googleLogin");
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
          document.getElementById("errorMessage").textContent = "Erro no login com Google: " + error.message;
        });
    });
  }

});
