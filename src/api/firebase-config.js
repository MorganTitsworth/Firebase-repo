// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCtD0wdzEnNQRfct6l6_Gbt66RPP3_ahwQ",
  authDomain: "journa-820d2.firebaseapp.com",
  projectId: "journa-820d2",
  storageBucket: "journa-820d2.appspot.com",
  messagingSenderId: "433552517915",
  appId: "1:433552517915:web:cdfa08f495100d4ecb41be",
  measurementId: "G-R9RWNNYWB9",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
export default db;
