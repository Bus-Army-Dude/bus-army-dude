// firebase-init.js

// !!! IMPORTANT: PASTE YOUR COPIED FIREBASE CONFIGURATION HERE !!!
const firebaseConfig = {
  apiKey: "AIzaSyCrQNseQTsWjQhsQBGm8nk9Y_mysuaTsrc", // Use your actual key
  authDomain: "bus-army-dude-website.firebaseapp.com",
  projectId: "bus-army-dude-website",
  storageBucket: "bus-army-dude-website.appspot.com",
  messagingSenderId: "464457126263",
  appId: "1:464457126263:web:7e8d63b9bb59a360b39172"
};

// Initialize Firebase ONLY if it hasn't been initialized yet
let db, auth; // Make db and auth globally accessible if needed by other scripts
try {
  if (typeof firebase !== 'undefined' && !firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
      console.log("Firebase initialized successfully by firebase-init.js.");

      // Get Firestore instance - needed by public scripts
      if (typeof firebase.firestore === 'function') {
         db = firebase.firestore();
         console.log("Firestore instance created.");
      } else {
          console.warn("Firestore SDK not loaded before firebase-init.js");
      }
      // Get Auth instance - might be needed by settings.js? If not, can remove.
      if (typeof firebase.auth === 'function') {
          auth = firebase.auth();
          console.log("Auth instance created.");
      } else {
           console.warn("Auth SDK not loaded before firebase-init.js");
      }

  } else if (typeof firebase !== 'undefined' && firebase.apps.length > 0) {
      console.log("Firebase already initialized.");
      // Get instances if already initialized
       if (typeof firebase.firestore === 'function') db = firebase.firestore();
       if (typeof firebase.auth === 'function') auth = firebase.auth();
  } else {
      throw new Error("Firebase SDK not loaded before firebase-init.js");
  }
} catch (error) {
     console.error("Error initializing Firebase:", error);
     // Maybe display a less intrusive error on the public page
     // document.body.innerHTML = '<div>Error loading site configuration. Please try again later.</div>';
}
