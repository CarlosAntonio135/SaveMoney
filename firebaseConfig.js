import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyCmw9A3WvecBRr19MhIX5-wKLf66r-voig",
  authDomain: "savemoney-7b401.firebaseapp.com",
  projectId: "savemoney-7b401",
  storageBucket: "savemoney-7b401.firebasestorage.app",
  messagingSenderId: "1036605042056",
  appId: "1:1036605042056:web:1d5ee679915dba328c5e3d",
  measurementId: "G-LX8LY8FF6M"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
