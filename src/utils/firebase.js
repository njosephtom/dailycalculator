import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBY5UFE3wf-SBp7kK7xPdPa2s6ULgG41ak",
  authDomain: "resumebuddy-3d3ae.firebaseapp.com",
  projectId: "resumebuddy-3d3ae",
  storageBucket: "resumebuddy-3d3ae.firebasestorage.app",
  messagingSenderId: "396903959586",
  appId: "1:396903959586:web:d53ada6516712feea60e7b",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
export default app;
