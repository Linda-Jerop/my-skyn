// Import useState for managing mobile menu toggle state
import { useState } from 'react';
// Import Link for navigation and useLocation to track current route
import { Link, useLocation } from 'react-router-dom';
// Import auth functions to check login status and logout
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';

export default function Navbar() {
  // Get current user and logout function from auth context
  const { currentUser, logout } = useAuth();
  const { getTotalItems, setIsCartOpen } = useCart();
  // State to control mobile menu open/closed
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  // Get current location to highlight active nav link
  const location = useLocation();

  // Helper function to check if a path matches current location
  const isActive = (path) => location.pathname === path;

  // Reusable NavLink component for consistent styling
  const NavLink = ({ to, label, onClick }) => (
    <Link
      to={to}
      onClick={() => {
        if (onClick) onClick(); // Execute additional onClick if provided
        setMobileMenuOpen(false); // Close mobile menu when link is clicked
      }}
      // Conditional classes: different styles for active vs inactive links
      className={`block w-full md:w-auto text-left md:text-center px-4 py-2 md:px-3 md:py-1 rounded-md transition-colors ${
        isActive(to)
          ? 'bg-pink-600 text-white md:bg-transparent md:text-pink-600 font-semibold'
          : 'text-gray-700 hover:bg-gray-100 md:hover:bg-transparent md:hover:text-pink-600'
      }`}
    >
      {label}
    </Link>
  );

  return (
    // Sticky navbar that stays at top while scrolling
    <nav className="bg-gradient-to-r from-white via-pink-50 to-gray-50 shadow-lg sticky top-0 z-50 backdrop-blur-sm bg-opacity-80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand - clickable link to home */}
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="text-xl md:text-2xl font-bold bg-gradient-to-r from-gray-600 to-pink-600 bg-clip-text text-transparent hover:from-pink-600 hover:to-gray-600 transition-all duration-300"
          >
            MYSKYN✌🏾
          </Link>

          {/* Desktop Navigation - hidden on mobile (md:flex shows on medium screens+) */}
          <div className="hidden md:flex md:items-center md:space-x-2">
            <NavLink to="/" label="Home" />
            <NavLink to="/pairing" label="Pairing Tool" />
            <NavLink to="/products" label="Products" />
            <NavLink to="/routine" label="Routines" />
            <NavLink to="/feedback" label="Feedback" />
            
            {/* Cart Icon */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 text-gray-700 hover:text-pink-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {getTotalItems() > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {getTotalItems()}
                </span>
              )}
            </button>
            
            {/* Conditional rendering: show different links based on login status */}
            {currentUser ? (
              <>
                <NavLink to="/profile" label="Profile" />
                <NavLink to="/admin" label="Admin" />
                {/* Logout button - calls Firebase logout and closes menu */}
                <button
                  onClick={() => {
                    logout(); // Sign user out of Firebase
                    setMobileMenuOpen(false);
                  }}
                  className="px-4 py-2 text-white bg-red-500 hover:bg-red-600 rounded-md transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              // If not logged in, show login link
              <NavLink to="/login" label="Login" />
            )}
          </div>

          {/* Mobile menu button - only visible on small screens */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)} // Toggle menu open/closed
            className="md:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            {/* Hamburger/X icon - changes based on menu state */}
            <svg
              className="h-6 w-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {/* Conditional rendering: X when open, hamburger when closed */}
              {mobileMenuOpen ? (
                <path d="M6 18L18 6M6 6l12 12" /> // X icon
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" /> // Hamburger icon (3 lines)
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation Menu - only shown when mobileMenuOpen is true */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 space-y-2 border-t border-gray-200">
            <NavLink to="/" label="Home" />
            <NavLink to="/pairing" label="Pairing Tool" />
            <NavLink to="/products" label="Products" />
            <NavLink to="/routine" label="Routines" />
            <NavLink to="/feedback" label="Feedback" />
            
            {/* Mobile Cart Button */}
            <button
              onClick={() => {
                setIsCartOpen(true);
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors flex items-center justify-between"
            >
              <span>Cart</span>
              {getTotalItems() > 0 && (
                <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {getTotalItems()}
                </span>
              )}
            </button>
            
            {/* Same conditional logic as desktop menu */}
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