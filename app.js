// app.js
import { auth, firestore, createUserWithEmailAndPassword, signInWithEmailAndPassword, addDoc, collection } from './firebase-config.js';

document.getElementById("sign-up-form").addEventListener("submit", async (event) => {
  event.preventDefault();

  const email = document.getElementById("sign-up-email").value;
  const password = document.getElementById("sign-up-password").value;

  try {
    // Sign up the user
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Add user to Firestore
    await addDoc(collection(firestore, "users"), {
      uid: user.uid,
      email: user.email
    });

    alert("User signed up and added to Firestore!");
  } catch (error) {
    alert("Error signing up: " + error.message);
  }
});

document.getElementById("sign-in-form").addEventListener("submit", async (event) => {
  event.preventDefault();

  const email = document.getElementById("sign-in-email").value;
  const password = document.getElementById("sign-in-password").value;

  try {
    // Sign in the user
    await signInWithEmailAndPassword(auth, email, password);

    alert("User signed in successfully!");
  } catch (error) {
    alert("Error signing in: " + error.message);
  }
});
