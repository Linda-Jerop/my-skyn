// Import React library
import React from 'react';
// Import useAuth hook to access currently logged-in user information
import { useAuth } from '../contexts/AuthContext';

// Profile component - displays user account information
export default function Profile() {
  // Get the currently logged-in user from AuthContext
  const { currentUser } = useAuth();

  return (
    // Full screen container with centered content
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-8">
      <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">My Profile</h2>
        
        {/* Profile card with rounded corners and shadow */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Decorative gradient header banner */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-32 sm:h-40"></div>
          
          {/* Profile content section */}
          <div className="px-6 py-8 sm:px-8">
            {/* Profile avatar - overlaps the banner using negative margin */}
            <div className="-mt-20 sm:-mt-24 mb-6 flex justify-center">
              <div className="w-24 h-24 sm:w-32 sm:h-32 bg-white rounded-full border-4 border-white shadow-lg flex items-center justify-center text-4xl sm:text-5xl">
                👤
              </div>
            </div>
            
            {/* User information display - vertically spaced */}
            <div className="space-y-4 max-w-md mx-auto">
              {/* Email display */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <p className="text-lg text-gray-900 bg-gray-50 px-4 py-2 rounded-md">
                  {/* Optional chaining (?.) prevents errors if currentUser is null */}
                  {currentUser?.email}
                </p>
              </div>
              
              {/* User ID display - using monospace font for technical data */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">User ID</label>
                <p className="text-sm text-gray-600 bg-gray-50 px-4 py-2 rounded-md font-mono break-all">
                  {currentUser?.uid}
                </p>
              </div>
              
              {/* Account status badge */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Account Status</label>
                <div className="flex justify-center">
                  {/* Green badge showing active status */}
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    ✓ Active
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
