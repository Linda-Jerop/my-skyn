// Import Firebase SDK functions needed for our app
import { initializeApp } from "firebase/app";
// Import Realtime Database to store and sync product data
import { getDatabase } from "firebase/database";
// Import Authentication for user login/signup functionality
import { getAuth } from "firebase/auth";

// Firebase project configuration object using environment variables
// This keeps sensitive information secure and out of version control
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase app with our configuration
const app = initializeApp(firebaseConfig);

// Initialize and get references to Firebase services
const database = getDatabase(app); // Realtime Database instance
const auth = getAuth(app); // Authentication instance

// Export instances so other files can use Firebase services
export { app, database, auth };
