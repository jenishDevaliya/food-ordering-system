import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AdminLayout from '../components/AdminLayout';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const OrderReport = () => {
  const [formData, setFormData] = useState({
    from_date: '',
    to_date: '',
    status: 'all',
  });
  const [orders, setOrders] = useState([]);
  const adminUser = localStorage.getItem('adminUser');
  const navigate = useNavigate();

  useEffect(() => {
    if (!adminUser) {
      navigate('/admin-login');
      return;
    }
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('http://127.0.0.1:8000/api/order-between-dates/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        setOrders(data);
      } 
      else {
        toast.error(data.message || 'Failed to fetch order report');
      }
    } 
    catch (error) {
      console.error(error);
      toast.error('Error connecting to server.');
    }
  };

  return (
    <AdminLayout>
      <ToastContainer position="top-center" autoClose={2000} />
      <div>
        <h3 className="text-center text-primary mb-4">
          <i className="fas fa-list-alt me-1"></i>
          Between Dates Report
        </h3>

        <form onSubmit={handleSubmit} className="mb-4">
          <div className="row mb-3">
            <div className="col-md-4">
              <label>From Date</label>
              <input type="date" name="from_date" onChange={handleChange} className="form-control" required />
            </div>

            <div className="col-md-4">
              <label>To Date</label>
              <input
                type="date"
                name="to_date"
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>

            <div className="col-md-4">
              <label>Status</label>
              <select
                name="status"
                onChange={handleChange}
                className="form-control"
              >
                <option value="all">All</option>
                <option value="not_confirmed">Not Confirmed</option>
                <option value="Order Confirmed">Order Confirmed</option>
                <option value="Food being Prepared">Food being Prepared</option>
                <option value="Food Pickup">Food Pickup</option>
                <option value="Food Delivered">Food Delivered</option>
                <option value="Order Cancelled">Order Cancelled</option>
              </select>
            </div>
          </div>

          <div className="text-center">
            <button className="btn btn-primary" type="submit">Submit</button>
          </div>

          
        </form>

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
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
};

export default OrderReport;
