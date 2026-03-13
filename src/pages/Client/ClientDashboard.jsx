import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { appointmentService } from '../../services/firebaseService';

const ClientDashboard = ({ onNavigate }) => {
  const { userData, currentUser } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    upcoming: 0,
    completed: 0,
    cancelled: 0,
    totalSpent: 0
  });

  // Updated useEffect to depend on both userData and currentUser
  useEffect(() => {
    if (userData && currentUser) {
      fetchAppointments();
    }
  }, [userData, currentUser]);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Ensure we have a valid user ID
      if (!currentUser?.uid) {
        throw new Error('User ID is not available');
      }
      
      const userAppointments = await appointmentService.getAppointmentsByClient(currentUser.uid);
      
      // Ensure we have an array before filtering
      const appointmentsData = Array.isArray(userAppointments) ? userAppointments : [];
      setAppointments(appointmentsData);
      
      // Calculate stats
      const upcoming = appointmentsData.filter(apt => 
        apt.status === 'confirmed' || apt.status === 'pending'
      ).length;
      const completed = appointmentsData.filter(apt => apt.status === 'completed').length;
      const cancelled = appointmentsData.filter(apt => apt.status === 'cancelled').length;
      const totalSpent = appointmentsData
        .filter(apt => apt.status === 'completed')
        .reduce((sum, apt) => sum + (apt.amount || 0), 0);
      
      setStats({ upcoming, completed, cancelled, totalSpent });
    } catch (error) {
      console.error('Error fetching appointments:', error);
      setError('Failed to load appointments. Please try again later.');
      setAppointments([]); // Clear appointments on error
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      'confirmed': 'badge-success',
      'pending': 'badge-warning',
      'completed': 'badge-primary',
      'cancelled': 'badge-error'
    };
    return `badge ${statusClasses[status] || 'badge-primary'}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="container mt-4">
        <div className="d-flex justify-content-center">
          <div className="spinner-border" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
        <p className="text-center mt-3">Loading dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Welcome, {userData?.name || 'Client'}!</h1>
        <button 
          className="btn btn-primary"
          onClick={() => onNavigate('book')}
        >
          📅 Book New Appointment
        </button>
      </div>
      
      {/* Quick Stats */}
      <div className="row mb-5">
        <div className="col-md-3 mb-3">
          <div className="card bg-primary text-white">
            <div className="card-body">
              <h3 className="card-title">{stats.upcoming}</h3>
              <p className="card-text">Upcoming Appointments</p>
            </div>
          </div>
        </div>
        
        <div className="col-md-3 mb-3">
          <div className="card bg-success text-white">
            <div className="card-body">
              <h3 className="card-title">{stats.completed}</h3>
              <p className="card-text">Completed Services</p>
            </div>
          </div>
        </div>
        
        <div className="col-md-3 mb-3">
          <div className="card bg-warning text-white">
            <div className="card-body">
              <h3 className="card-title">${stats.totalSpent.toFixed(2)}</h3>
              <p className="card-text">Total Spent</p>
            </div>
          </div>
        </div>
        
        <div className="col-md-3 mb-3">
          <div className="card bg-danger text-white">
            <div className="card-body">
              <h3 className="card-title">{stats.cancelled}</h3>
              <p className="card-text">Cancelled Bookings</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="row mb-5">
        <div className="col-md-3 mb-3">
          <div className="card text-center h-100">
            <div className="card-body">
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📅</div>
              <h3 className="card-title">Book Appointment</h3>
              <p className="card-text text-muted">Schedule your next visit</p>
              <button 
                className="btn btn-primary"
                onClick={() => onNavigate('book')}
              >
                Book Now
              </button>
            </div>
          </div>
        </div>
        
        <div className="col-md-3 mb-3">
          <div className="card text-center h-100">
            <div className="card-body">
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📋</div>
              <h3 className="card-title">View History</h3>
              <p className="card-text text-muted">Check past appointments</p>
              <button 
                className="btn btn-outline-primary"
                onClick={() => onNavigate('history')}
              >
                View History
              </button>
            </div>
          </div>
        </div>
        
        <div className="col-md-3 mb-3">
          <div className="card text-center h-100">
            <div className="card-body">
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>💳</div>
              <h3 className="card-title">Payments</h3>
              <p className="card-text text-muted">Track your payments</p>
              <button 
                className="btn btn-outline-primary"
                onClick={() => onNavigate('payments')}
              >
                View Payments
              </button>
            </div>
          </div>
        </div>
        
        <div className="col-md-3 mb-3">
          <div className="card text-center h-100">
            <div className="card-body">
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⭐</div>
              <h3 className="card-title">Reviews</h3>
              <p className="card-text text-muted">Rate your experience</p>
              <button className="btn btn-outline-primary">
                Leave Review
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Appointments */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Recent Appointments</h2>
        </div>
        
        {appointments.length > 0 ? (
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Service</th>
                  <th>Barber</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {appointments.slice(0, 5).map((appointment) => (
                  <tr key={appointment.id}>
                    <td>{formatDate(appointment.date)}</td>
                    <td>{appointment.serviceName || 'N/A'}</td>
                    <td>{appointment.barberName || 'N/A'}</td>
                    <td>${appointment.amount ? appointment.amount.toFixed(2) : '0.00'}</td>
                    <td>
                      <span className={`badge ${getStatusBadge(appointment.status)}`}>
                        {appointment.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="card-body text-center">
            <p className="text-muted">No appointments yet. Book your first appointment!</p>
            <button 
              className="btn btn-primary mt-3"
              onClick={() => onNavigate('book')}
            >
              Book Your First Appointment
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientDashboard;