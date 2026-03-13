import React from 'react';
import { useAuth } from '../../contexts/AuthContext';

const Sidebar = ({ isOpen, onClose, currentPage, onPageChange }) => {
  const { userData } = useAuth();

  const getMenuItems = () => {
    switch (userData?.role) {
      case 'client':
        return [
          { id: 'dashboard', label: 'Dashboard', icon: '📊' },
          { id: 'book', label: 'Book Appointment', icon: '📅' },
          { id: 'history', label: 'Booking History', icon: '📋' },
          { id: 'payments', label: 'Payment History', icon: '💳' },
        ];
      case 'staff':
        return [
          { id: 'dashboard', label: 'Dashboard', icon: '📊' },
          { id: 'bookings', label: 'Manage Bookings', icon: '📅' },
          { id: 'income', label: 'Income & Expenses', icon: '💰' },
          { id: 'services', label: 'Manage Services', icon: '✂️' },
          { id: 'reports', label: 'Reports', icon: '📈' },
        ];
      case 'admin':
        return [
          { id: 'dashboard', label: 'Dashboard', icon: '📊' },
          { id: 'shops', label: 'Manage Shops', icon: '🏪' },
          { id: 'users', label: 'Manage Users', icon: '👥' },
          { id: 'commissions', label: 'Commission Reports', icon: '💳' },
          { id: 'settings', label: 'Settings', icon: '⚙️' },
        ];
      default:
        return [];
    }
  };

  const menuItems = getMenuItems();

  const handleItemClick = (itemId) => {
    onPageChange(itemId);
    onClose();
  };

  return (
    <>
      {isOpen && <div className="overlay show" onClick={onClose}></div>}
      <div className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h2>SBBPMS</h2>
          <p className="text-sm">
            {userData?.role?.charAt(0).toUpperCase() + userData?.role?.slice(1)} Portal
          </p>
        </div>
        
        <ul className="sidebar-nav">
          {menuItems.map((item) => (
            <li key={item.id}>
              <a
                href="#"
                className={currentPage === item.id ? 'active' : ''}
                onClick={(e) => {
                  e.preventDefault();
                  handleItemClick(item.id);
                }}
              >
                <span className="icon">{item.icon}</span>
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default Sidebar;