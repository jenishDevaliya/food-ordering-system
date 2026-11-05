import React, { useState, useEffect } from 'react';
import { FaPlusCircle } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AdminLayout from '../components/AdminLayout';

const AddFood = () => {
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [formData, setFormData] = useState({
    category: '',
    item_name: '',
    item_description: '',
    item_quantity: '',
    item_price: '',
    image: null,
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('http://127.0.0.1:8000/api/categories/'); // <-- correct API endpoint
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data = await res.json();
        console.log('Fetched categories:', data);
        setCategories(data);
      } catch (err) {
        console.error('Error fetching categories:', err);
        toast.error('Failed to load categories.');
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, image: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const sendData = new FormData();
    sendData.append('category', formData.category);
    sendData.append('item_name', formData.item_name);
    sendData.append('item_description', formData.item_description);
    sendData.append('item_quantity', formData.item_quantity);
    sendData.append('item_price', formData.item_price);
    sendData.append('image', formData.image);

    try {
      const res = await fetch('http://127.0.0.1:8000/api/add-food-item/', {
        method: 'POST',
        body: sendData,
      });

      const data = await res.json();
      console.log('Add food response:', data);

      if (res.status === 201 || res.status === 200) {
        toast.success(data.message || 'Food item added successfully!');
        setFormData({
          category: '',
          item_name: '',
          item_description: '',
          item_quantity: '',
          item_price: '',
          image: null,
        });
      } else {
        toast.error(data.message || 'Failed to add food item.');
      }
    } catch (error) {
      console.error('Error submitting food item:', error);
      toast.error('Error connecting to server.');
    }
  };

  return (
    <AdminLayout>
      <div className="row">
        <div className="col-md-8">
          <div className="p-4 shadow rounded bg-white">
            <h4 className="mb-4 d-flex align-items-center">
              <FaPlusCircle className="me-2 text-primary" />{' '}
              <span className="text-dark">Add Food Item</span>
            </h4>

            <form onSubmit={handleSubmit} encType="multipart/form-data">
              <div className="mb-3">
                <label className="form-label">Food Category</label>
                {loadingCategories ? (
                  <p>Loading categories...</p>
                ) : (
                  <select
                    name="category"
                    className="form-select"
                    value={formData.category}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.length > 0 ? (
                      categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.category_name || cat.name}
                        </option>
                      ))
                    ) : (
                      <option disabled>No categories found</option>
                    )}
                  </select>
                )}
              </div>

              <div className="mb-3">
                <label className="form-label">Food Item Name</label>
                <input
                  name="item_name"
                  className="form-control"
                  placeholder="Enter food item name"
                  value={formData.item_name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Description</label>
                <textarea
                  name="item_description"
                  className="form-control"
                  placeholder="Enter description"
                  value={formData.item_description}
                  onChange={handleChange}
                  required
                ></textarea>
              </div>

              <div className="mb-3">
                <label className="form-label">Quantity</label>
                <input
                  name="item_quantity"
                  type="text"
                  className="form-control"
                  placeholder="e.g. 2pcs / Large"
                  value={formData.item_quantity}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Price (₹)</label>
                <input
                  name="item_price"
                  type="number"
                  step="0.01"
                  className="form-control"
                  placeholder=""
                  value={formData.item_price}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Image</label>
                <input
                  name="image"
                  type="file"
                  accept="image/*"
                  className="form-control"
                  onChange={handleFileChange}
                  required
                />
              </div>

              <button type="submit" className="btn btn-primary mt-2">
                <i className="fas fa-plus me-2"></i> Add Food
              </button>
            </form>

            <ToastContainer />
          </div>
        </div>

        <div className="col-md-4 d-flex justify-content-center align-items-center">
          <i
            className="fas fa-pizza-slice"
            style={{ fontSize: '180px', color: '#e5e5e5' }}
          ></i>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AddFood;
