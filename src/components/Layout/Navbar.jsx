import React from 'react';
import { useAuth } from '../../contexts/AuthContext';

const Navbar = () => {
  const { currentUser, userData, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  const getRoleDisplayName = (role) => {
    switch (role) {
      case 'client': return 'Client';
      case 'staff': return 'Staff';
      case 'admin': return 'Admin';
      default: return 'User';
    }
  };

  return (
    <nav className="navbar">
      <div className="container flex-between">
        <div className="navbar-brand">
          Smart Barber Booking & Payment Management System
        </div>
        
        {currentUser && userData && (
          <div className="flex">
            <span className="mr-3">
              {getRoleDisplayName(userData.role)} - {userData.name || currentUser.email}
            </span>
            <button
              onClick={handleLogout}
              className="btn btn-sm btn-outline"
              style={{ color: 'white', borderColor: 'white' }}
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;