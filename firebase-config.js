import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";

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

const loginForm = document.getElementById("loginForm");
const errorMessage = document.getElementById("errorMessage");

if (loginForm) {
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = loginForm["email"].value;
    const password = loginForm["password"].value;

    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        
        window.location.href = "painel.html";
      })
      .catch((error) => {
        errorMessage.textContent = "Erro ao entrar: " + error.message;
      });
  });
}

const googleLogin = document.getElementById("googleLogin");

if (googleLogin) {
  googleLogin.addEventListener("click", () => {
    signInWithPopup(auth, provider)
      .then(() => {
       
        window.location.href = "painel.html";
      })
      .catch((error) => {
        errorMessage.textContent = "Erro no login com Google: " + error.message;
      });
  });
}

onAuthStateChanged(auth, (user) => {
  if (user && window.location.pathname.includes("login.html")) {
    window.location.href = "painel.html";
  }
});
