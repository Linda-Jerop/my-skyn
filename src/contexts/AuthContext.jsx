// Import React hooks for creating context and managing state
import { createContext, useContext, useState, useEffect } from 'react';
// Import Firebase auth instance from our config
import { auth } from '../firebaseConfig';
// Import Firebase authentication functions
import { 
  createUserWithEmailAndPassword, // For email/password signup
  signInWithEmailAndPassword,     // For email/password login
  signOut,                         // For logging out
  onAuthStateChanged,              // Listens for auth state changes
  GoogleAuthProvider,              // For Google sign-in
  signInWithPopup                  // Opens popup for OAuth providers
} from 'firebase/auth';

const AuthContext = createContext(); // Creating context to share authentication state across components

export const useAuth = () => useContext(AuthContext); // Custom hook to easily access auth context in any component

export function AuthProvider({ children }) { //AuthProvider component wraps app and provides auth functionality
  const [currentUser, setCurrentUser] = useState(null); // State to store currently logged-in user (null if not logged in)
  const [loading, setLoading] = useState(true); // State to track if we're still checking authentication status

  // useEffect runs once on mount to set up auth state listener
  useEffect(() => {
    
    // Listen for changes in authentication state (login/logout)
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user); // Update user state when auth state changes
      setLoading(false); // Done checking auth status
    });
    return unsubscribe; // Cleanup: unsubscribe from listener when component unmounts
  }, []);

  // Object containing all auth functions available to child components
  const value = {
    currentUser, // Currently logged-in user object
    signup: (email, password) => createUserWithEmailAndPassword(auth, email, password),
    login: (email, password) => signInWithEmailAndPassword(auth, email, password),
    logout: () => signOut(auth),
    googleSignIn: () => {
      const provider = new GoogleAuthProvider(); // Create Google auth provider
      return signInWithPopup(auth, provider);    // Open Google sign-in popup
    }
  };

  // Provide auth context to all child components
  // Only render children after we've checked initial auth state
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
