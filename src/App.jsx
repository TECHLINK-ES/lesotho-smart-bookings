import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Navbar from './components/Layout/Navbar';
import Sidebar from './components/Layout/Sidebar';
import LoginForm from './components/Auth/LoginForm';
import RegisterForm from './components/Auth/RegisterForm';

// Client Pages
import ClientDashboard from './pages/Client/ClientDashboard';
import BookAppointment from './pages/Client/BookAppointment';

// Staff Pages
import StaffDashboard from './pages/Staff/StaffDashboard';

// Admin Pages
import AdminDashboard from './pages/Admin/AdminDashboard';

// Main App Content Component
const AppContent = () => {
  const { currentUser, userData, loading } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState('dashboard');

  if (loading) {
    return (
      <div className="flex-center" style={{ height: '100vh' }}>
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  if (!currentUser || !userData) {
    return (
      <div>
        <Navbar />
        {isLogin ? (
          <LoginForm onToggleMode={() => setIsLogin(false)} />
        ) : (
          <RegisterForm onToggleMode={() => setIsLogin(true)} />
        )}
      </div>
    );
  }

  const renderCurrentPage = () => {
    switch (userData.role) {
      case 'client':
        switch (currentPage) {
          case 'book': 
            return <BookAppointment />;
          case 'history': 
            return (
              <div className="container mt-4">
                <h1>Booking History</h1>
                <p>This page will show all your past and upcoming appointments.</p>
                <div className="card">
                  <p>Feature coming soon! You'll be able to view, reschedule, and cancel your appointments here.</p>
                </div>
              </div>
            );
          case 'payments': 
            return (
              <div className="container mt-4">
                <h1>Payment History</h1>
                <p>Track all your payments and transactions.</p>
                <div className="card">
                  <p>Feature coming soon! You'll see detailed payment history and receipts here.</p>
                </div>
              </div>
            );
          default: 
            return <ClientDashboard onNavigate={setCurrentPage} />;
        }
      
      case 'staff':
        switch (currentPage) {
          case 'bookings': 
            return (
              <div className="container mt-4">
                <h1>Manage Bookings</h1>
                <p>View and manage all your appointments.</p>
                <div className="card">
                  <p>Feature coming soon! You'll be able to view, confirm, and manage all bookings here.</p>
                </div>
              </div>
            );
          case 'income': 
            return (
              <div className="container mt-4">
                <h1>Income & Expenses</h1>
                <p>Track your earnings and business expenses.</p>
                <div className="card">
                  <p>Feature coming soon! You'll see detailed financial tracking with charts and reports here.</p>
                </div>
              </div>
            );
          case 'services': 
            return (
              <div className="container mt-4">
                <h1>Manage Services</h1>
                <p>Add, edit, and manage your services and pricing.</p>
                <div className="card">
                  <p>Feature coming soon! You'll be able to manage your service offerings here.</p>
                </div>
              </div>
            );
          case 'reports': 
            return (
              <div className="container mt-4">
                <h1>Reports</h1>
                <p>View detailed business analytics and reports.</p>
                <div className="card">
                  <p>Feature coming soon! You'll see comprehensive business reports and analytics here.</p>
                </div>
              </div>
            );
          default: 
            return <StaffDashboard />;
        }
      
      case 'admin':
        switch (currentPage) {
          case 'shops': 
            return (
              <div className="container mt-4">
                <h1>Manage Shops</h1>
                <p>Manage all registered barber shops on the platform.</p>
                <div className="card">
                  <p>Feature coming soon! You'll be able to add, edit, and manage all shops here.</p>
                </div>
              </div>
            );
          case 'users': 
            return (
              <div className="container mt-4">
                <h1>Manage Users</h1>
                <p>Manage all platform users and their permissions.</p>
                <div className="card">
                  <p>Feature coming soon! You'll see user management tools here.</p>
                </div>
              </div>
            );
          case 'commissions': 
            return (
              <div className="container mt-4">
                <h1>Commission Reports</h1>
                <p>Track platform commissions and revenue.</p>
                <div className="card">
                  <p>Feature coming soon! You'll see detailed commission tracking and reports here.</p>
                </div>
              </div>
            );
          case 'settings': 
            return (
              <div className="container mt-4">
                <h1>System Settings</h1>
                <p>Configure platform settings and preferences.</p>
                <div className="card">
                  <p>Feature coming soon! You'll be able to configure system settings here.</p>
                </div>
              </div>
            );
          default: 
            return <AdminDashboard />;
        }
      
      default:
        return (
          <div className="container mt-4">
            <h1>Access Denied</h1>
            <p>You don't have permission to access this area.</p>
          </div>
        );
    }
  };

  return (
    <div>
      <Navbar />
      
      {/* Menu Button */}
      <button
        className="btn btn-primary"
        onClick={() => setSidebarOpen(true)}
        style={{
          position: 'fixed',
          top: '80px',
          left: '20px',
          zIndex: 1000,
          borderRadius: '50%',
          width: '50px',
          height: '50px',
          fontSize: '1.2rem'
        }}
      >
        ☰
      </button>
      
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />
      
      <main style={{ paddingTop: '20px' }}>
        {renderCurrentPage()}
      </main>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;