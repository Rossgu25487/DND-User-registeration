// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  projectId: "dnd-vault-7l1x5",
  appId: "1:202792475635:web:0a7c0946d30f2e55c85086",
  storageBucket: "dnd-vault-7l1x5.firebasestorage.app",
  apiKey: "AIzaSyDlCk4GVId4MRUMjcyxFJTW2lH68Fp-GCU",
  authDomain: "dnd-vault-7l1x5.firebaseapp.com",
  measurementId: "",
  messagingSenderId: "202792475635"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
