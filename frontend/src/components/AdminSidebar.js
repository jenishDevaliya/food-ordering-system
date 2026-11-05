import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/admin.css';
import {FaThLarge,FaUsers,FaEdit,FaPlus,FaListAlt,FaHamburger,FaSearch,FaStar,FaChevronDown,FaChevronUp,FaList,FaFile,FaCommentAlt,} from 'react-icons/fa';

const AdminSidebar = () => {
  const [openMenus, setOpenMenus] = useState({
    category: false,
    food: false,
    orders: false,
  });

  const toggleMenu = (menu) => {
    setOpenMenus(prev => ({ ...prev, [menu]: !prev[menu] }));
  };

  return (
    <div className="bg-dark text-white sidebar vh-100" style={{ width: '250px' }}>
      <div className="text-center p-3 border-bottom">
        <img src="/images/admin.jpg" className="img-fluid rounded-circle mb-2" width="70" alt="Admin Img" />
        <h6 className="mb-0">Admin</h6>
      </div>

      <div className="list-group list-group-flush p-2">
        <Link to="/admin-dashboard" className="list-group-item list-group-item-action bg-dark text-white border-0">
          <FaThLarge className="me-2" /> Dashboard
        </Link>

        <div className="list-group list-group-flush">
        <Link to="/manage_user" className="list-group-item list-group-item-action bg-dark text-white border-0">
          <FaUsers className="me-2" /> Reg Users
        </Link>
        </div>

        <button
          onClick={() => toggleMenu('category')}
          className="list-group-item list-group-item-action bg-dark text-white d-flex justify-content-between align-items-center border-0"
        >
          <span><FaEdit className="me-2" /> Food Category</span>
          {openMenus.category ? <FaChevronUp /> : <FaChevronDown />}
        </button>
        {openMenus.category && (
          <div className="ps-4">
            <Link to="/add-category" className="list-group-item list-group-item-action bg-dark text-white border-0">
               Add Category
            </Link>

            <Link to="/manage-category" className="list-group-item list-group-item-action bg-dark text-white border-0">
               Manage Category
            </Link>
          </div>
        )}

        <button
          onClick={() => toggleMenu('orders')}
          className="list-group-item list-group-item-action bg-dark text-white d-flex justify-content-between align-items-center border-0"
        >
          <span><FaList className="me-2" /> Orders</span>
          {openMenus.orders ? <FaChevronUp /> : <FaChevronDown />}
        </button>
        {openMenus.orders && (
          <div className="ps-4">
            <Link to="/order-not-confirmed" className="list-group-item list-group-item-action bg-dark text-white border-0">
                Not Confirmed 
            </Link>

            <Link to="/order-confirmed" className="list-group-item list-group-item-action bg-dark text-white border-0">
               Confirmed
            </Link>

            <Link to="/food-being-prepared" className="list-group-item list-group-item-action bg-dark text-white border-0">
               Being Prepared
            </Link>

            <Link to="/food-pickup" className="list-group-item list-group-item-action bg-dark text-white border-0">
               Food Pickup
            </Link>

            <Link to="/food-delivered" className="list-group-item list-group-item-action bg-dark text-white border-0">
               Delivered
            </Link>

            <Link to="/order-cancelled" className="list-group-item list-group-item-action bg-dark text-white border-0">
               Cancelled
            </Link>

            <Link to="/all-orders" className="list-group-item list-group-item-action bg-dark text-white border-0">
               All Orders
            </Link>
          </div>
        )}

        <button
          onClick={() => toggleMenu('food')}
          className="list-group-item list-group-item-action bg-dark text-white d-flex justify-content-between align-items-center border-0"
        >
          <span><FaEdit className="me-2" /> Food Menu</span>
          {openMenus.food ? <FaChevronUp /> : <FaChevronDown />}
        </button>
        {openMenus.food && (
          <div className="ps-4">
            <Link to='/add-food' className="list-group-item list-group-item-action bg-dark text-white border-0">
             Add Food 
            </Link>

            <Link to="/manage-food" className="list-group-item list-group-item-action bg-dark text-white border-0">
               Manage Food 
            </Link>
          </div>
        )}

        <Link to="/order-report" className="list-group-item list-group-item-action bg-dark text-white border-0">
          <FaFile className="me-2" /> B/w Dates Report
        </Link>

        <Link to="/search-order" className="list-group-item list-group-item-action bg-dark text-white border-0">
          <FaSearch className="me-2" /> Search
        </Link>

        <Link to="/manage-reviews" className="list-group-item list-group-item-action bg-dark text-white border-0">
          <FaCommentAlt className="me-2" /> Manage Reviews
        </Link>
      </div>
    </div>
  );
};

export default AdminSidebar;
