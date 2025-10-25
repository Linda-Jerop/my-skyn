import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Navbar() {
  const { currentUser, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const NavLink = ({ to, label, onClick }) => (
    <Link
      to={to}
      onClick={() => {
        if (onClick) onClick();
        setMobileMenuOpen(false);
      }}
      className={`block w-full md:w-auto text-left md:text-center px-4 py-2 md:px-3 md:py-1 rounded-md transition-colors ${
        isActive(to)
          ? 'bg-blue-600 text-white md:bg-transparent md:text-blue-600 font-semibold'
          : 'text-gray-700 hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-600'
      }`}
    >
      {label}
    </Link>
  );

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="text-xl md:text-2xl font-bold text-gray-800 hover:text-blue-600 transition-colors"
          >
            MYSKYN✌🏾
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-2">
            <NavLink to="/" label="Home" />
            <NavLink to="/pairing" label="Pairing Tool" />
            <NavLink to="/products" label="Products" />
            
            {currentUser ? (
              <>
                <NavLink to="/profile" label="Profile" />
                <NavLink to="/admin" label="Admin" />
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="px-4 py-2 text-white bg-red-500 hover:bg-red-600 rounded-md transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <NavLink to="/login" label="Login" />
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {mobileMenuOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 space-y-2 border-t border-gray-200">
            <NavLink to="/" label="Home" />
            <NavLink to="/pairing" label="Pairing Tool" />
            <NavLink to="/products" label="Products" />
            
            {currentUser ? (
              <>
                <NavLink to="/profile" label="Profile" />
                <NavLink to="/admin" label="Admin" />
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 text-white bg-red-500 hover:bg-red-600 rounded-md transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <NavLink to="/login" label="Login" />
            )}
          </div>
        )}
      </div>
    </nav>
  );
}