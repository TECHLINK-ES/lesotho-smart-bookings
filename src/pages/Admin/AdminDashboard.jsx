import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';

const AdminDashboard = () => {
  const { userData } = useAuth();
  const [loading, setLoading] = useState(true);
  const [platformStats, setPlatformStats] = useState({
    totalShops: 25,
    activeShops: 22,
    totalUsers: 1250,
    monthlyRevenue: 15750,
    totalCommissions: 8450,
    activeSubscriptions: 22
  });

  const [topShops] = useState([
    {
      id: 1,
      name: 'Elite Barber Shop',
      location: 'Maseru',
      monthlyBookings: 145,
      revenue: 2340,
      commission: 1450,
      status: 'active'
    },
    {
      id: 2,
      name: 'Modern Cuts',
      location: 'Teyateyaneng',
      monthlyBookings: 98,
      revenue: 1680,
      commission: 980,
      status: 'active'
    },
    {
      id: 3,
      name: 'Classic Style',
      location: 'Mafeteng',
      monthlyBookings: 76,
      revenue: 1290,
      commission: 760,
      status: 'active'
    },
    {
      id: 4,
      name: 'Urban Barbers',
      location: 'Leribe',
      monthlyBookings: 54,
      revenue: 890,
      commission: 540,
      status: 'pending'
    }
  ]);

  const [recentTransactions] = useState([
    {
      id: 1,
      type: 'Commission',
      shop: 'Elite Barber Shop',
      amount: 10,
      date: new Date().toISOString()
    },
    {
      id: 2,
      type: 'Subscription',
      shop: 'Modern Cuts',
      amount: 300,
      date: new Date().toISOString()
    },
    {
      id: 3,
      type: 'Commission',
      shop: 'Classic Style',
      amount: 10,
      date: new Date().toISOString()
    }
  ]);

  useEffect(() => {
    // Mock data loading
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  const getStatusBadge = (status) => {
    const statusClasses = {
      'active': 'badge-success',
      'pending': 'badge-warning',
      'inactive': 'badge-error'
    };
    return `badge ${statusClasses[status] || 'badge-primary'}`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="container mt-4">
        <div className="spinner"></div>
        <p className="text-center">Loading admin dashboard...</p>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h1>Platform Admin Dashboard</h1>
      <p className="text-muted mb-4">Welcome back, {userData?.name || 'Admin'}!</p>
      
      {/* Platform Overview */}
      <div className="grid grid-3 mb-5">
        <div className="card bg-primary" style={{ color: 'white' }}>
          <div className="flex">
            <div style={{ fontSize: '2rem', marginRight: '1rem' }}>🏪</div>
            <div>
              <h2>{platformStats.totalShops}</h2>
              <p>Total Shops</p>
              <small>{platformStats.activeShops} active</small>
            </div>
          </div>
        </div>
        
        <div className="card bg-success" style={{ color: 'white' }}>
          <div className="flex">
            <div style={{ fontSize: '2rem', marginRight: '1rem' }}>👥</div>
            <div>
              <h2>{platformStats.totalUsers}</h2>
              <p>Total Users</p>
            </div>
          </div>
        </div>
        
        <div className="card bg-warning" style={{ color: 'white' }}>
          <div className="flex">
            <div style={{ fontSize: '2rem', marginRight: '1rem' }}>💰</div>
            <div>
              <h2>M{platformStats.monthlyRevenue}</h2>
              <p>Monthly Revenue</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-3">
        {/* Top Performing Shops */}
        <div className="card" style={{ gridColumn: 'span 2' }}>
          <div className="card-header">
            <h2 className="card-title">Top Performing Shops</h2>
          </div>
          
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Shop Name</th>
                  <th>Location</th>
                  <th>Bookings</th>
                  <th>Revenue</th>
                  <th>Commission</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {topShops.map((shop) => (
                  <tr key={shop.id}>
                    <td>{shop.name}</td>
                    <td>{shop.location}</td>
                    <td>{shop.monthlyBookings}</td>
                    <td>M{shop.revenue}</td>
                    <td>M{shop.commission}</td>
                    <td>
                      <span className={getStatusBadge(shop.status)}>
                        {shop.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Transactions & Quick Actions */}
        <div>
          <div className="card mb-4">
            <div className="card-header">
              <h3 className="card-title">Recent Transactions</h3>
            </div>
            
            {recentTransactions.map((transaction) => (
              <div key={transaction.id} className="p-3" style={{ borderBottom: '1px solid #eee' }}>
                <div className="flex-between">
                  <div>
                    <p className="font-bold">{transaction.type}</p>
                    <p className="text-sm text-muted">{transaction.shop}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-success">M{transaction.amount}</p>
                    <p className="text-sm text-muted">{formatDate(transaction.date)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Quick Actions</h3>
            </div>
            
            <div className="flex-column" style={{ gap: '1rem' }}>
              <button className="btn btn-primary btn-block">
                🏪 Manage Shops
              </button>
              <button className="btn btn-success btn-block">
                👥 Manage Users
              </button>
              <button className="btn btn-warning btn-block">
                💳 Commission Reports
              </button>
              <button className="btn btn-error btn-block">
                ⚙️ System Settings
              </button>
            </div>
            
            <div className="mt-4 p-3 bg-light rounded">
              <h4>Platform Summary</h4>
              <p><strong>Total Commission:</strong> M{platformStats.totalCommissions}</p>
              <p><strong>Active Subscriptions:</strong> {platformStats.activeSubscriptions}</p>
              <p><strong>Growth Rate:</strong> +12.5%</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;