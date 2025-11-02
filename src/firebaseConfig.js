// Import Firebase SDK functions needed for our app
import { initializeApp } from "firebase/app";
// Import Realtime Database to store and sync product data
import { getDatabase } from "firebase/database";
// Import Authentication for user login/signup functionality
import { getAuth } from "firebase/auth";

// Firebase project configuration object
// Contains unique identifiers for connecting to our Firebase project
const firebaseConfig = {
  apiKey: "AIzaSyCsTlPcKD0Nq8ZE3vIp5NdFHZA_Uv-FMmE", // API key for Firebase services
  authDomain: "my-skyn.firebaseapp.com", // Domain for Firebase Authentication
  databaseURL: "https://my-skyn-default-rtdb.firebaseio.com", // URL for Realtime Database
  projectId: "my-skyn", // Unique project identifier
  storageBucket: "my-skyn.firebasestorage.app", // Cloud Storage bucket
  messagingSenderId: "644781679411", // For Firebase Cloud Messaging
  appId: "1:644781679411:web:bb6eed31139fef0b77d446", // Unique app identifier
  measurementId: "G-CV9J8QNHV5" // For Google Analytics (optional)
};

// Initialize Firebase app with our configuration
const app = initializeApp(firebaseConfig);

// Initialize and get references to Firebase services
const database = getDatabase(app); // Realtime Database instance
const auth = getAuth(app); // Authentication instance

// Export instances so other files can use Firebase services
export { app, database, auth };
