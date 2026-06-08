import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBZpoMZPkS2_ZCzKgKE079yIK4C1X1HAfY",
  authDomain: "finance-tracker-c20c5.firebaseapp.com",
  projectId: "finance-tracker-c20c5",
  storageBucket: "finance-tracker-c20c5.firebasestorage.app",
  messagingSenderId: "1009842347807",
  appId: "1:1009842347807:web:db7017520c0cac0dc79a2a"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);