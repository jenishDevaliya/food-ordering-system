import React from 'react';
import {FaBars,FaBell,FaChevronLeft,FaChevronRight,FaSignOutAlt,}
from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const AdminHeader = ({ toggleSidebar, sidebarOpen , newOrders }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('adminUser');
    navigate('/admin-login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom px-3 shadow">
      <button className="btn btn-outline-dark" onClick={toggleSidebar}>
        {sidebarOpen ? <FaChevronLeft /> : <FaChevronRight />}
      </button>

      <span className="navbar-brand fw-semibold ms-3">
        <i className="fas fa-utensils me-2"></i> Food Ordering System
      </span>

      <button className="navbar-toggler border-0 ms-auto">
        <FaBars />
      </button>

      <div className="collapse navbar-collapse">
        <ul className="navbar-nav ms-auto align-items-center gap-3">
          <li className="nav-item position-relative">
            <button className="btn btn-outline-secondary position-relative" 
            onClick={() => {
              if (newOrders > 0) {
                navigate('/order-not-confirmed');
              }
            }}
            title={newOrders > 0 ? "View New Orders" : "Now new Order"}
            >

              <FaBell />
              <span className="badge bg-danger position-absolute top-0 start-100 translate-middle">
                {newOrders}</span>
            </button>

          </li>
          <li className="nav-item">
            <button className="btn btn-outline-danger" onClick={handleLogout}>
              <FaSignOutAlt className="me-1" /> Logout
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default AdminHeader;
