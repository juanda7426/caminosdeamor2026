// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
	apiKey: "AIzaSyBl-uhPdW6WGCpEaen2G8_LXVNt2Fcd638",
	authDomain: "cda-jdv.firebaseapp.com",
	projectId: "cda-jdv",
	storageBucket: "cda-jdv.firebasestorage.app",
	messagingSenderId: "871813905686",
	appId: "1:871813905686:web:2b99860603ec961569e437",
	measurementId: "G-BL7Z239W5Z",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// const analytics = getAnalytics(app);
