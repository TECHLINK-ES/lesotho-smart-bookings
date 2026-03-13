import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

const LoginForm = ({ onToggleMode }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const demoAccounts = [
    { email: 'client@demo.com', password: 'demo123', role: 'Client' },
    { email: 'staff@demo.com', password: 'demo123', role: 'Staff/Barber' },
    { email: 'admin@demo.com', password: 'demo123', role: 'Platform Admin' }
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      setError('');
      setLoading(true);
      await login(formData.email, formData.password);
    } catch (error) {
      setError('Failed to log in: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = (demoEmail, demoPassword) => {
    setFormData({
      email: demoEmail,
      password: demoPassword
    });
  };

  return (
    <div className="container-sm mt-5">
      <div className="card">
        <div className="card-header text-center">
          <h1 className="card-title">SBBPMS Login</h1>
          <p className="card-subtitle">Smart Barber Booking & Payment Management System</p>
        </div>
        
        {error && (
          <div className="alert alert-error">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>
          
          <button
            type="submit"
            className="btn btn-primary btn-block"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="mt-4">
          <h3>Demo Accounts:</h3>
          <div className="grid grid-3 mt-3">
            {demoAccounts.map((account, index) => (
              <div key={index} className="card">
                <button
                  className="btn btn-outline btn-sm"
                  onClick={() => handleDemoLogin(account.email, account.password)}
                >
                  {account.role}
                </button>
                <p className="text-sm text-muted mt-2">
                  {account.email}<br />
                  {account.password}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center mt-4">
          <button
            className="btn btn-outline"
            onClick={onToggleMode}
          >
            Don't have an account? Register
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;