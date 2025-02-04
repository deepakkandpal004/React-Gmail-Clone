// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCOguBpe0Ehr1dcjc1ohVm3IEFtc8Xiook",
  authDomain: "clone-cd7e6.firebaseapp.com",
  projectId: "clone-cd7e6",
  storageBucket: "clone-cd7e6.firebasestorage.app",
  messagingSenderId: "1069409732189",
  appId: "1:1069409732189:web:5a398fd72e011710772fb4",
  measurementId: "G-FK9XELBLEV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth();
export const db = getFirestore(app);
export const provider = new GoogleAuthProvider();
