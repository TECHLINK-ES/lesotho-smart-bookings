import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { appointmentService, transactionService } from '../../services/firebaseService';

const StaffDashboard = () => {
  const { userData } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    todayAppointments: 0,
    todayEarnings: 0,
    weeklyEarnings: 0,
    monthlyEarnings: 0,
    completionRate: 0
  });

  // Mock data for demonstration
  const mockAppointments = [
    {
      id: '1',
      clientName: 'John Smith',
      serviceName: 'Haircut & Beard',
      date: new Date().toISOString().split('T')[0],
      time: '09:00',
      amount: 80,
      status: 'confirmed'
    },
    {
      id: '2',
      clientName: 'Mike Johnson',
      serviceName: 'Hair Wash',
      date: new Date().toISOString().split('T')[0],
      time: '10:30',
      amount: 30,
      status: 'completed'
    },
    {
      id: '3',
      clientName: 'David Wilson',
      serviceName: 'Full Service',
      date: new Date().toISOString().split('T')[0],
      time: '14:00',
      amount: 120,
      status: 'pending'
    }
  ];

  useEffect(() => {
    // For demo, use mock data. In production, fetch from Firebase
    setAppointments(mockAppointments);
    
    // Calculate stats
    const todayAppointments = mockAppointments.length;
    const todayEarnings = mockAppointments.reduce((sum, apt) => sum + apt.amount, 0);
    const completedToday = mockAppointments.filter(apt => apt.status === 'completed').length;
    const completionRate = todayAppointments > 0 ? (completedToday / todayAppointments) * 100 : 0;
    
    setStats({
      todayAppointments,
      todayEarnings,
      weeklyEarnings: todayEarnings * 6, // Mock weekly
      monthlyEarnings: todayEarnings * 25, // Mock monthly
      completionRate
    });
    
    setLoading(false);
  }, [userData]);

  const handleStatusUpdate = async (appointmentId, newStatus) => {
    try {
      // Update appointment status
      await appointmentService.updateAppointment(appointmentId, { status: newStatus });
      
      // Update local state
      setAppointments(appointments.map(apt => 
        apt.id === appointmentId ? { ...apt, status: newStatus } : apt
      ));
      
      alert(`Appointment ${newStatus} successfully!`);
    } catch (error) {
      console.error('Error updating appointment:', error);
      alert('Failed to update appointment status');
    }
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      'confirmed': 'badge-primary',
      'pending': 'badge-warning',
      'completed': 'badge-success',
      'cancelled': 'badge-error'
    };
    return `badge ${statusClasses[status] || 'badge-primary'}`;
  };

  if (loading) {
    return (
      <div className="container mt-4">
        <div className="spinner"></div>
        <p className="text-center">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h1>Staff Dashboard</h1>
      <p className="text-muted mb-4">Welcome back, {userData?.name || 'Staff Member'}!</p>
      
      {/* Today's Stats */}
      <div className="grid grid-4 mb-5">
        <div className="card bg-primary" style={{ color: 'white' }}>
          <div className="flex">
            <div style={{ fontSize: '2rem', marginRight: '1rem' }}>📅</div>
            <div>
              <h2>{stats.todayAppointments}</h2>
              <p>Today's Appointments</p>
            </div>
          </div>
        </div>
        
        <div className="card bg-success" style={{ color: 'white' }}>
          <div className="flex">
            <div style={{ fontSize: '2rem', marginRight: '1rem' }}>💰</div>
            <div>
              <h2>M{stats.todayEarnings}</h2>
              <p>Today's Earnings</p>
            </div>
          </div>
        </div>
        
        <div className="card bg-warning" style={{ color: 'white' }}>
          <div className="flex">
            <div style={{ fontSize: '2rem', marginRight: '1rem' }}>📈</div>
            <div>
              <h2>M{stats.weeklyEarnings}</h2>
              <p>Weekly Earnings</p>
            </div>
          </div>
        </div>
        
        <div className="card bg-error" style={{ color: 'white' }}>
          <div className="flex">
            <div style={{ fontSize: '2rem', marginRight: '1rem' }}>⭐</div>
            <div>
              <h2>{stats.completionRate.toFixed(0)}%</h2>
              <p>Completion Rate</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-3">
        {/* Today's Appointments */}
        <div className="card" style={{ gridColumn: 'span 2' }}>
          <div className="card-header">
            <h2 className="card-title">Today's Appointments</h2>
          </div>
          
          {appointments.length > 0 ? (
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Time</th>
                    <th>Client</th>
                    <th>Service</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map((appointment) => (
                    <tr key={appointment.id}>
                      <td>{appointment.time}</td>
                      <td>{appointment.clientName}</td>
                      <td>{appointment.serviceName}</td>
                      <td>M{appointment.amount}</td>
                      <td>
                        <span className={getStatusBadge(appointment.status)}>
                          {appointment.status}
                        </span>
                      </td>
                      <td>
                        {appointment.status === 'confirmed' && (
                          <button
                            className="btn btn-success btn-sm mr-2"
                            onClick={() => handleStatusUpdate(appointment.id, 'completed')}
                          >
                            Complete
                          </button>
                        )}
                        {appointment.status === 'pending' && (
                          <>
                            <button
                              className="btn btn-primary btn-sm mr-2"
                              onClick={() => handleStatusUpdate(appointment.id, 'confirmed')}
                            >
                              Confirm
                            </button>
                            <button
                              className="btn btn-error btn-sm"
                              onClick={() => handleStatusUpdate(appointment.id, 'cancelled')}
                            >
                              Cancel
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center p-4">
              <p className="text-muted">No appointments scheduled for today</p>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Quick Actions</h3>
          </div>
          
          <div className="flex-column" style={{ gap: '1rem' }}>
            <button className="btn btn-primary btn-block">
              📅 View All Bookings
            </button>
            <button className="btn btn-success btn-block">
              💰 Track Income/Expenses
            </button>
            <button className="btn btn-warning btn-block">
              ✂️ Manage Services
            </button>
            <button className="btn btn-error btn-block">
              📊 View Reports
            </button>
          </div>
          
          <div className="mt-4 p-3 bg-light rounded">
            <h4>This Week Summary</h4>
            <p><strong>Total Income:</strong> M{stats.weeklyEarnings}</p>
            <p><strong>Commission Paid:</strong> M{Math.floor(stats.weeklyEarnings * 0.1)}</p>
            <p><strong>Net Earnings:</strong> M{stats.weeklyEarnings - Math.floor(stats.weeklyEarnings * 0.1)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffDashboard;