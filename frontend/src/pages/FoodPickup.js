import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';  // ✅ Added Link import
import AdminLayout from '../components/AdminLayout';

const FoodPickup = () => {
  const [orders, setOrders] = useState([]);
  const adminUser = localStorage.getItem('adminUser');
  const navigate = useNavigate();

  useEffect(() => {
    if (!adminUser) {
      navigate('/admin-login');
      return;
    }

    // ✅ Fixed API URL
    fetch('http://127.0.0.1:8000/api/foodpickup/')
      .then((res) => res.json())
      .then((data) => {
        setOrders(data);
      })
      .catch((err) => console.error('Error fetching food pickup orders:', err));
  }, []);

  return (
    <AdminLayout>
      <div>
        <h3 className="text-center text-primary mb-4">
          <i className="fas fa-list-alt me-1"></i>
          Detail of Food Pickup Orders
        </h3>

        <h5 className="text-end text-muted">
          <i className="fas fa-database me-1"></i>
          Total Pickup Orders
          <span className="ms-2 badge bg-success">{orders.length}</span>
        </h5>

        <table className="table table-bordered table-hover table-striped">
          <thead className="table-dark">
            <tr>
              <th>S.No</th>
              <th>Order Number</th>
              <th>Order Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.length > 0 ? (
              orders.map((order, index) => (
                <tr key={order.id}>
                  <td>{index + 1}</td>
                  <td>{order.order_number}</td>
                  <td>{new Date(order.order_time).toLocaleString()}</td>
                  <td>
                    <Link
                      to={`/admin-view-order-detail/${order.order_number}`}
                      className="btn btn-sm btn-info me-2"
                    >
                      <i className="fas fa-eye me-1"></i> View Details
                    </Link>
                    <button className="btn btn-sm btn-danger">
                      <i className="fas fa-trash-alt me-1"></i> Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center text-muted">
                  No pickup orders found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
};

export default FoodPickup;
