import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBKIyw-lBzogsx6FROobMRx4FJCsumWzIA",
  authDomain: "signsight-73d8d.firebaseapp.com",
  projectId: "signsight-73d8d",
  storageBucket: "signsight-73d8d.firebasestorage.app",
  messagingSenderId: "893708684625",
  appId: "1:893708684625:web:0e91e5f7407d0a00475770",
  measurementId: "G-H5VQSVNKNN",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);