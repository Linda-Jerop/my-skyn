import React from 'react';
import { useAuth } from '../contexts/AuthContext';

export default function Profile() {
  const { currentUser } = useAuth();

  return (
    <div className="container mx-auto px-4">
      <h2 className="text-2xl font-bold mb-4">My Profile</h2>
      <p>Email: {currentUser?.email}</p>
    </div>
  );
}