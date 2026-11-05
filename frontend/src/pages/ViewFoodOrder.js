import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AdminLayout from '../components/AdminLayout';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ViewFoodOrder = () => {
    const { orderNumber } = useParams();
    const adminUser = localStorage.getItem('adminUser');
    const navigate = useNavigate();
    const [data, setData] = useState(null);

    useEffect(() => {
        if (!adminUser) {
            navigate('/admin-login');
            return;
        }

        fetch(`http://127.0.0.1:8000/api/view-order-detail/${orderNumber}/`)
            .then(res => res.json())
            .then(data => setData(data))
            .catch(err => console.error(err));
    }, [orderNumber, adminUser, navigate]);

    
    if (!data) {
        return <AdminLayout><p className="text-center mt-5">Loading...</p></AdminLayout>;
    }


    const orderObj = data.order || {};
    const foodsArr = data.foods || [];
    const trackingArr = data.tracking || [];

    const statusOptions = [
        "Order Confirmed",
        "Food being Prepared",
        "Food Pickup",
        "Food Delivered",
        "Order Cancelled"
        
    ];

    const currentStatus = orderObj.order_final_status || "";
    const visibleStatusOptions = statusOptions.slice(statusOptions.indexOf(currentStatus) + 1);

    const handleUpdateStatus = async (e) => {
        e.preventDefault();
        const status = e.target.status.value;
        const remark = e.target.remark.value;

        try {
            const res = await fetch('http://127.0.0.1:8000/api/update-order-status/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ order_number: orderNumber, status, remark })
            });

            const result = await res.json();

            if (result.message) {
                toast.success(result.message);
                setTimeout(() => window.location.reload(), 1000);
            } else {
                toast.error(result.error || 'Failed to update status');
            }
        } catch (err) {
            toast.error("Server error");
            console.error(err);
        }
    };

    return (
        <AdminLayout>
            <ToastContainer position="top-right" autoClose={2000} />

            <div className="container mt-4">
                <h3 className="text-center text-primary mb-4">Order Details #{orderNumber}</h3>

                {/* User Info */}
                <div className="row">
                    <div className="col-md-6">
                        <h5>User Info</h5>
                        <table className="table table-bordered">
                            <tbody>
                                <tr><th>First Name</th><td>{orderObj.user_first_name || "-"}</td></tr>
                                <tr><th>Last Name</th><td>{orderObj.user_last_name || "-"}</td></tr>
                                <tr><th>Email</th><td>{orderObj.user_email || "-"}</td></tr>
                                <tr><th>Mobile</th><td>{orderObj.user_mobile || "-"}</td></tr>
                                <tr><th>Address</th><td>{orderObj.address || "-"}</td></tr>
                                <tr><th>Order Time</th>
                                    <td>{orderObj.order_time ? new Date(orderObj.order_time).toLocaleString() : "-"}</td>
                                </tr>
                                <tr><th>Final Status</th><td>{orderObj.order_final_status || "Pending"}</td></tr>
                            </tbody>
                        </table>
                    </div>

                    {/* Ordered Foods */}
                    <div className="col-md-6">
                        <h5>Ordered Foods</h5>
                        <table className="table table-bordered">
                            <thead>
                                <tr><th>Image</th><th>Name</th><th>Price</th></tr>
                            </thead>
                            <tbody>
                                {foodsArr.length > 0 ? foodsArr.map((food, index) => (
                                    <tr key={index}>
                                        <td>
                                            <img
                                                src={`http://127.0.0.1:8000${food.image || ''}`}
                                                width="60"
                                                alt={food.item_name || 'Food'}
                                            />
                                        </td>
                                        <td>{food.item_name || '-'}</td>
                                        <td>{food.item_price || '-'}</td>
                                    </tr>
                                )) : (
                                    <tr><td colSpan="3" className="text-center">No foods ordered</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Tracking History */}
                <h5 className="mt-4">Tracking History</h5>
                <table className="table table-bordered">
                    <thead>
                        <tr><th>#</th><th>Status</th><th>Remark</th><th>Date</th></tr>
                    </thead>
                    <tbody>
                        {trackingArr.length > 0 ? trackingArr.map((track, index) => (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{track.status || '-'}</td>
                                <td>{track.remark || '-'}</td>
                                <td>{track.status_date ? new Date(track.status_date).toLocaleString() : '-'}</td>
                            </tr>
                        )) : (
                            <tr><td colSpan="4" className="text-center">No tracking history yet</td></tr>
                        )}
                    </tbody>
                </table>

                {/* Update Order Status */}
                {orderObj.order_final_status !== "Food Delivered" && (
                    <div className='my-4'>
                        <h5>Update Order Status</h5>
                        <form onSubmit={handleUpdateStatus}>
                            <div className="mb-3">
                                <label>Status</label>
                                <select name="status" className="form-control" required>
                                    {visibleStatusOptions.length > 0 ? visibleStatusOptions.map((status, index) => (
                                        <option key={index} value={status}>{status}</option>
                                    )) : <option disabled>No further status</option>}
                                </select>
                            </div>

                            <div className="mb-3">
                                <label>Remark</label>
                                <textarea name="remark" className="form-control" rows="3" required></textarea>
                            </div>

                            <div className="text-center">
                                <button type="submit" className="btn btn-success">Update Status</button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
};

export default ViewFoodOrder;
