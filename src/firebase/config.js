// Import the functions you need from the SDKs you need
// Khong dau
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
   apiKey: "AIzaSyDmogQeQLltOYrmAe5epPY1k9ZwsIusDKA",
  authDomain: "meowink-hehe.firebaseapp.com",
  projectId: "meowink-hehe",
  // storageBucket: "meowink-hehe.firebasestorage.app",
  storageBucket: "meowink-hehe.appspot.com",

  messagingSenderId: "716004955651",
  appId: "1:716004955651:web:3a36908b948e28088b2036",
  measurementId: "G-NXRVT32HPG"
};


const app = initializeApp(firebaseConfig);

// Auth
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();


// Firestore
export const db = getFirestore(app);

// Offline cache (optional)
// enableIndexedDbPersistence(db).catch(() => {
  // Co the bo qua neu khong ho tro
// });
