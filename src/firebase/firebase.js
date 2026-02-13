// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBLltAp87QQg1clh6fcIxpeUrJwbeLFS-Y",
  authDomain: "reanime-414db.firebaseapp.com",
  projectId: "reanime-414db",
  storageBucket: "reanime-414db.firebasestorage.app",
  messagingSenderId: "329298417339",
  appId: "1:329298417339:web:24d77e2178525c6a7abb9e",
  measurementId: "G-J7HFBE3KEJ",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth();
export const db = getFirestore(app);
export default app;
