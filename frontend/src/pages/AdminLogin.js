import React, { useState } from 'react';
import { FaUser, FaLock, FaSignInAlt } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/admin.css';
import PublicLayout from '../components/PublicLayout';

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('http://127.0.0.1:8000/api/admin-login/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (res.status === 200) {
        toast.success(data.message || 'Login successful');
        localStorage.setItem('adminUser', username);
        setTimeout(() => {
          window.location.href = '/admin-dashboard';
        }, 2000);
      } else {
        toast.error(data.message || 'Invalid credentials');
      }
    } catch (error) {
      toast.error('Server error. Please try again.');
      console.error('Login error:', error);
    }
  };

  return (
    <PublicLayout>
      <div
        className="d-flex justify-content-center align-items-center vh-100"
        style={{
          backgroundImage: "url('/images/admin.png')",
          backgroundSize: 'cover',
        }}
      >
        <div className="card p-4 shadow-lg" style={{ maxWidth: '500px', width: '100%' }}>
          <h3 className="text-center mb-4">
            <FaUser className="me-2 icon-fix" /> Admin Login
          </h3>

          <form onSubmit={handleLogin}>
            <div className="mb-3">
              <label className="form-label">
                <FaUser className="me-1 icon-fix" /> Username
              </label>
              <input
                type="text"
                className="form-control form-control-lg"
                placeholder="Enter admin username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label fs-5 mb-2">
                <FaLock className="me-1 icon-fix" /> Password
              </label>
              <input
                type="password"
                className="form-control form-control-lg"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary w-100 mt-3">
              <FaSignInAlt className="me-1" /> Login
            </button>
          </form>
        </div>

        <ToastContainer position="top-right" autoClose={2000} />
      </div>
    </PublicLayout>
  );
};

export default AdminLogin;
