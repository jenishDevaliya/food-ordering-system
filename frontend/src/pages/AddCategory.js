import React, { useState } from 'react';
import { FaUser, FaPlusCircle } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AdminLayout from '../components/AdminLayout';

const AddCategory = () => {
  const [categoryName, setCategoryName] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await 
      fetch('http://127.0.0.1:8000/api/categories/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: categoryName }),
      });

      const data = await res.json();

      if (res.status === 201 || res.status === 200) {
        toast.success(data.message || 'Category added successfully');
        setCategoryName('');
      } 
      else {
        toast.error(data.message || 'Failed to add category');
      }
    } 
    catch (error) {
      console.error(error);
      toast.error('Error connecting to server.');
    }
  };

  return (
    <AdminLayout>
      <div className="row">
        <div className="col-md-8">
          <div className="p-4 shadow rounded bg-white">
            <h4 className="mb-4 d-flex align-items-center">
              <FaPlusCircle className="me-2 text-primary" /> Add Category
            </h4>

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">
                   Category Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter category name"
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="btn btn-primary mt-2">
                <i className="fas fa-plus me-2"></i> Add Category
              </button>
            </form>

            <ToastContainer />
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
};

export default AddCategory;
