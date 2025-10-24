import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Navbar() {
  const { currentUser, logout } = useAuth();

  return (
    <nav className="bg-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-xl font-bold">MYSKYN✌🏾</Link>
          <div className="flex space-x-4">
            <Link to="/products" className="hover:text-blue-600">Products</Link>
            {currentUser ? (
              <>
                <Link to="/profile" className="hover:text-blue-600">Profile</Link>
                <button 
                  onClick={logout}
                  className="hover:text-red-600"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link to="/login" className="hover:text-blue-600">Login</Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}