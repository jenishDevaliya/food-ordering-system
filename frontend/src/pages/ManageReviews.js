import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../components/AdminLayout';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CSVLink } from "react-csv";

const ManageReviews = () => {

  const [reviews, setReviews] = useState([]);
  const [search, setSearch] = useState("");

  const adminUser = localStorage.getItem("adminUser");
  const navigate = useNavigate();

  useEffect(() => {
    if (!adminUser) {
      navigate("/admin-login");
      return;
    }

    fetch("http://127.0.0.1:8000/api/all-reviews/")
      .then((res) => res.json())
      .then((data) => {
        setReviews(data);
      })
      .catch((err) => console.error(err));

  }, [adminUser, navigate]);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this review?")) {
    fetch(`http://127.0.0.1:8000/api/delete_review/${id}/`, {

        method: "DELETE",
      })
        .then((res) => res.json())
        .then((data) => {
          toast.success(data.message || "Review deleted successfully");
          setReviews(reviews.filter(r => r.id !== id));
        })
        .catch((err) => console.error(err));
    }
  };

  // FILTER REVIEWS (Correct)
  const filteredReviews = reviews.filter((rev) =>
    rev.user_name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout>
      <ToastContainer position="top-center" autoClose={2000} />

      <div>
        <h3 className="text-center text-primary mb-4">
          <i className="fas fa-star me-2"></i>Manage Reviews
        </h3>

        <h5 className="text-end text-muted">
          <i className="fas fa-database me-2"></i>Total Reviews
          <span className="ms-2 badge bg-success">{reviews.length}</span>
        </h5>

        <div className="mb-3 d-flex justify-content-between">
          <input
            type="text"
            placeholder="Search by reviewer name..."
            className="form-control w-50"
            onChange={(e) => setSearch(e.target.value)}
          />

          <CSVLink
            data={reviews}
            filename="reviews_list.csv"
            className="btn btn-success"
          >
            <i className="fas fa-file-csv me-2"></i>Export to CSV
          </CSVLink>
        </div>

        <table className="table table-bordered table-hover table-striped">
          <thead className="table-dark">
            <tr>
              <th>S.No</th>
              <th>Food Item</th>
              <th>User</th>
              <th>Rating</th>
              <th>Comment</th>
              <th>Date</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredReviews.length > 0 ? (
              filteredReviews.map((r, index) => (
                <tr key={r.id}>
                  <td>{index + 1}</td>
                  <td>{r.food_name}</td>
                  <td>{r.user_name}</td>
                  <td>{[...Array(5)].map((_, i) => (
                    <i key={i} className={`text-warning fa-star ${i<r.rating ? 'fas' : 'far'} `}></i>
                  ))}{r.rating}</td>
                  <td>{r.comment}</td>
                  <td>{new Date(r.created_at).toLocaleDateString()}</td>

                  <td>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDelete(r.id)}
                    >
                      <i className="fas fa-trash me-1"></i>Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center text-muted">
                  No reviews found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
};

export default ManageReviews;
