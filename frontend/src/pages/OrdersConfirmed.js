import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AdminLayout from '../components/AdminLayout';

const OrdersConfirmed = () => {
  const [orders, setOrders] = useState([]);
  const adminUser = localStorage.getItem('adminUser');
  const navigate = useNavigate();

  useEffect(() => {
    if (!adminUser) {
      navigate('/admin-login');
      return;
    }

    fetch('http://127.0.0.1:8000/api/orders-confirmed/')
      .then(res => res.json())
      .then(data => setOrders(data))
      .catch(err => console.error(err));
  }, []);

  return (
    <AdminLayout>
      <div>
        <h3 className="text-center text-primary mb-4">
          Confirmed Orders
        </h3>

        <h5 className="text-end text-muted">
          Total Confirmed Orders: <span className="badge bg-success">{orders.length}</span>
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
                      className="btn btn-sm btn-info"
                    >
                      View Details
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center text-muted">
                  No confirmed orders found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
};

export default OrdersConfirmed;
