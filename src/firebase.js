// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, signInAnonymously, onAuthStateChanged } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCzKYjxfghvva713q9W74yWqCm_rudYx6k",
  authDomain: "rft-todo-app-2025-68c0c.firebaseapp.com",
  projectId: "rft-todo-app-2025-68c0c",
  storageBucket: "rft-todo-app-2025-68c0c.firebasestorage.app",
  messagingSenderId: "465728607973",
  appId: "1:465728607973:web:fa382da903720962c0a60c",
  measurementId: "G-00MXGSG836"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Function to handle anonymous sign-in
export const signInAnon = async () => {
  try {
    await signInAnonymously(auth);
    console.log("Signed in anonymously");
  } catch (error) {
    console.error("Anonymous sign-in failed", error.message);
  }
};

// Listen for authentication state changes and call signInAnon if needed
onAuthStateChanged(auth, (user) => {
    if (!user) {
        signInAnon();
    }
});

const analytics = getAnalytics(app);