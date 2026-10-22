import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"; // 👈 Add this line

const firebaseConfig = {
  apiKey: "AIzaSyBTSYJrnU_4Y0DXxLVZzCJfV8gs_sHW120",
  authDomain: "my-login-page-f74be.firebaseapp.com",
  projectId: "my-login-page-f74be",
  storageBucket: "my-login-page-f74be.appspot.com", // ✅ Correct bucket URL
  messagingSenderId: "364520471039",
  appId: "1:364520471039:web:d9f9dff2d40fc3916b0fca",
  measurementId: "G-EK932ZVMFV",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app); // 👈 Initialize storage
export default app;
