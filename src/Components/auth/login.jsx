import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export function Login() {
  // State for controlled form inputs
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); // Store error messages
  
  // Get authentication functions from context
  const { login, googleSignIn } = useAuth();
  // Get navigate function for programmatic navigation
  const navigate = useNavigate();

  // Handle email/password login form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent page reload on form submit
    setError('');       // Clear any previous errors
    try {
      await login(email, password); // Call Firebase login function
      navigate('/'); // Redirect to home page after successful login
    } catch (error) {
      // Display error message if login fails
      setError('Failed to login. Please check your credentials.');
    }
  };

  // Handle Google OAuth sign-in
  const handleGoogleSignIn = async () => {
    setError(''); // Clear any previous errors
    try {
      await googleSignIn(); // Open Google sign-in popup
      navigate('/'); // Redirect to home after successful Google login
    } catch (error) {
      setError('Failed to sign in with Google.');
    }
  };

  // JSX - Login form UI
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 px-4 py-8">
      {/* Login form - handleSubmit runs when form is submitted */}
      <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 md:p-10 rounded-2xl shadow-xl w-full max-w-md">
        {/* Header section */}
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Welcome Back</h2>
          <p className="text-gray-600 text-sm sm:text-base">Sign in to continue to MYSKYN</p>
        </div>
        
        {/* Error message - only displayed if error state has a value */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-3 mb-4 rounded">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}
        
        {/* Form inputs section */}
        <div className="space-y-4">
          {/* Email input - controlled component bound to email state */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input 
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)} // Update state on input change
              placeholder="you@example.com"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
          
          {/* Password input - controlled component bound to password state */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input 
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)} // Update state on input change
              placeholder="••••••••"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
        </div>
        
        {/* Submit button - triggers handleSubmit when clicked */}
        <button 
          type="submit" 
          className="w-full mt-6 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors font-medium"
        >
          Sign In
        </button>
        
        {/* Divider with "Or continue with" text */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Or continue with</span>
          </div>
        </div>
        
        {/* Google sign-in button - type="button" prevents form submission */}
        <button 
          type="button" 
          onClick={handleGoogleSignIn}
          className="w-full bg-white border-2 border-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all flex items-center justify-center gap-3 font-medium"
        >
          {/* Google logo from official Firebase CDN */}
          <img 
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" 
            alt="Google logo" 
            className="w-5 h-5"
          />
          <span className="hidden sm:inline">Sign in with Google</span>
          <span className="sm:hidden">Google</span>
        </button>
      </form>
    </div>
  );
}

export default Login;