// Import Navigate component for redirecting users
import { Navigate } from 'react-router-dom';
// Import useAuth hook to check if user is logged in
import { useAuth } from '../../contexts/AuthContext';

// ProtectedRoute wrapper component - protects routes from unauthorized access
// Wraps around any page/component that requires authentication
export default function ProtectedRoute({ children }) {
  // Get current user from authentication context
  const { currentUser } = useAuth();
  
  // If no user is logged in, redirect to login page
  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  // If user is authenticated, render the protected content
  return children;
}