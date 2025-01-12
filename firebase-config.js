// firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-analytics.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";

// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyAC2KlxaGE-lta2JAX0nRzFV61ls_mEcPw",
  authDomain: "bus-army-dude-s-user-accounts.firebaseapp.com",
  projectId: "bus-army-dude-s-user-accounts",
  storageBucket: "bus-army-dude-s-user-accounts.firebasestorage.app",
  messagingSenderId: "987403561299",
  appId: "1:987403561299:web:9e72317c2572293d1059a6",
  measurementId: "G-12JCZ52Y92"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firebase Auth and Firestore
const auth = getAuth(app);
const firestore = getFirestore(app);

// Export for use in app.js
export { auth, firestore, createUserWithEmailAndPassword, signInWithEmailAndPassword, addDoc, collection };
