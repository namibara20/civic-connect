// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCId1ERF-uL1lpxI7ZkQMsK_ARybfI0yRk",
  authDomain: "civicconnect-d9033.firebaseapp.com",
  projectId: "civicconnect-d9033",
  storageBucket: "civicconnect-d9033.firebasestorage.app",
  messagingSenderId: "679471545778",
  appId: "1:679471545778:web:68dc248985d8d6546d38ab"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;