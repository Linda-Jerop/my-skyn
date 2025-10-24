import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, googleSignIn } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      // Add navigation logic here
    } catch (error) {
      setError('Failed to login');
    }
  };

  return (
    // <div className="login-container">
    //   <form onSubmit={handleSubmit}>
    //     {error && <div className="error">{error}</div>}
    //     <input 
    //       type="email" 
    //       value={email} 
    //       onChange={(e) => setEmail(e.target.value)} 
    //       placeholder="Email" 
    //       required 
    //     />
    //     <input 
    //       type="password" 
    //       value={password} 
    //       onChange={(e) => setPassword(e.target.value)} 
    //       placeholder="Password" 
    //       required 
    //     />
    //     <button type="submit">Login</button>
    //     <button type="button" onClick={googleSignIn}>
    //       Sign in with Google
    //     </button>
    //   </form>
    // </div>
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
  <form className="bg-white p-8 rounded-2xl shadow-md w-full max-w-sm">
    <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
    <input className="w-full p-2 mb-3 border rounded-md" />
    <input className="w-full p-2 mb-4 border rounded-md" />
    <p className="text-red-500 text-sm mb-3">{error}</p>
    <button className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700">
      Login
    </button>
  </form>
</div>
  );
}

export default Login;