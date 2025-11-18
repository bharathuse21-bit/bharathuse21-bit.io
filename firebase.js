import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAivdKu90qWik88ykWxgvs4ZR2DTBRFykA",
  authDomain: "medstudyeasy-f1e25.firebaseapp.com",
  projectId: "medstudyeasy-f1e25",
  storageBucket: "medstudyeasy-f1e25.appspot.com", // <-- fixed here
  messagingSenderId: "479468659075",
  appId: "1:479468659075:web:ac7949ee17a6832a2c56b6",
  measurementId: "G-N96DW95QRK"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
