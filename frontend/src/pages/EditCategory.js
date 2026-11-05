import React, { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';
import { useParams, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EditCategory = () => {
  const [category_name, setCategoryName] = useState('');
  const { id } = useParams();
  const adminUser = localStorage.getItem('adminUser');
  const navigate = useNavigate();

  useEffect(() => {
    if (!adminUser) {
      navigate('/admin-login');
      return;
    }

    fetch(`http://127.0.0.1:8000/api/category/${id}/`)
      .then(res => res.json())
      .then(data => setCategoryName(data.category_name))
      .catch(err => console.error(err));

  }, [id]);

  const handleUpdate = (e) => {
    e.preventDefault();

    fetch(`http://127.0.0.1:8000/api/category/${id}/`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ category_name: category_name })
    })
      .then(res => res.json())
      .then(data => {
        toast.success(data.message);

        setTimeout(() => {
          navigate('/manage-category');
        }, 2000);
      })
      .catch(err => console.error(err));
  }

  return (
    <AdminLayout>
      <ToastContainer position="top-center" autoClose={2000} />
      <div className="row">
        <div className="col-md-8">
          <div className="p-4 shadow rounded bg-white">
            <h4 className="mb-4 d-flex align-items-center">
              <i className="fas fa-pen-square text-primary me-2"></i> Edit Food Category
            </h4>

            <form onSubmit={handleUpdate}>
              <div className="mb-3">
                <label className="form-label">Category Name</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter category name"
                  value={category_name}
                  onChange={(e) => setCategoryName(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="btn btn-primary mt-2">
                <i className="fas fa-save me-2"></i> Update Category
              </button>
            </form>
          </div>
        </div>

        <div className="col-md-4 d-flex justify-content-center align-items-center">
          <i
            className="fas fa-utensils"
            style={{ fontSize: '180px', color: '#e5e5e5' }}
          ></i>
        </div>
      </div>
    </AdminLayout>
  );
}

export default EditCategory;
