// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";  // Import Realtime Database functions
import { getAuth } from "firebase/auth";  // Add this import
// Import firebase Auth if you need authentication
// If you want analytics, keep this:
// import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCsTlPcKD0Nq8ZE3vIp5NdFHZA_Uv-FMmE",
  authDomain: "my-skyn.firebaseapp.com",
  databaseURL: "https://my-skyn-default-rtdb.firebaseio.com",
  projectId: "my-skyn",
  storageBucket: "my-skyn.firebasestorage.app",
  messagingSenderId: "644781679411",
  appId: "1:644781679411:web:bb6eed31139fef0b77d446",
  measurementId: "G-CV9J8QNHV5"
};

// Initialize services as needed
const app = initializeApp(firebaseConfig); //firebase
// Initialize Realtime Database and export it for use in the app
const database = getDatabase(app);
const auth = getAuth(app); // Initialise Firebase Auth

// If you want to keep Analytics enabled, uncomment the next line:
// const analytics = getAnalytics(app);

export { app, database, auth };
