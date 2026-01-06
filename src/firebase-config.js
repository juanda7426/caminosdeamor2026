// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
	apiKey: "AIzaSyDmC9Gm3nYH0iwwJlGR79kGIQmNuNXl2eE",
	authDomain: "camor26-f1225.firebaseapp.com",
	projectId: "camor26-f1225",
	storageBucket: "camor26-f1225.firebasestorage.app",
	messagingSenderId: "550311088260",
	appId: "1:550311088260:web:899e6d098bdea149b772d1",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// const analytics = getAnalytics(app);
