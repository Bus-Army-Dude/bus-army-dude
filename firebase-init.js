// firebase-init.js (Corrected with v9+ Modular Syntax)

// Import the functions you need from the SDKs
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-app.js"; // Match version in admin.js
import { getAuth } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-firestore.js";
// import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-analytics.js"; // Uncomment if needed

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCIZ0fri5V1E2si1xXpBPQQJqj1F_KuuG0", // Use your actual API key
    authDomain: "busarmydudewebsite.firebaseapp.com",
    projectId: "busarmydudewebsite",
    storageBucket: "busarmydudewebsite.firebasestorage.app",
    messagingSenderId: "42980404680",
    appId: "1:42980404680:web:f4f1e54789902a4295e4fd",
    measurementId: "G-DQPH8YL789" // Optional
};

// Initialize Firebase and services
let app;
let auth;
let db;
// let analytics; // Uncomment if needed

try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    // analytics = getAnalytics(app); // Uncomment if needed
    console.log("Firebase initialized successfully by firebase-init.js (v9+).");
} catch (error) {
    console.error("CRITICAL FIREBASE INITIALIZATION ERROR in firebase-init.js:", error);
    alert('FATAL ERROR: Cannot initialize Firebase. Site may not work correctly. Check console.');
    // Optionally try to display error on page, though body might not exist yet
    // document.body.innerHTML = '<div style="color: red; padding: 20px;">FATAL ERROR: Cannot initialize Firebase. Check console.</div>';
    throw error; // Stop further script execution
}

// Export the initialized services for other modules to use
export { app, auth, db /*, analytics */ }; // Add analytics here if you uncomment it
