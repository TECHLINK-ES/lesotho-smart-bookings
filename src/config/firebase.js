// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAMcHsPPPayV7cmIa5VRlHxPVEPzAdrrcU",
  authDomain: "smart-barber-booking.firebaseapp.com",
  projectId: "smart-barber-booking",
  storageBucket: "smart-barber-booking.firebasestorage.app",
  messagingSenderId: "1219607744",
  appId: "1:1219607744:web:4699cf765620aa76038125",
  measurementId: "G-NVEXJX9TX1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const analytics = getAnalytics(app);

export default app;