import React, { useState } from 'react';
import PublicLayout from './PublicLayout';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    mobile: '',
    password: '',
    confirmPassword: ''
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { firstName, lastName, mobile, email, password, confirmPassword } = formData;

    if (password !== confirmPassword) {
      toast.error('Password and Confirm Password do not match');
      return;
    }

    try {
      const response = await fetch('http://127.0.0.1:8000/api/register/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstname: firstName, lastname: lastName, mobilenumber: mobile, email, password })
      });

      const result = await response.json();

      if (response.status === 201) {
        toast.success(result.message || 'You have successfully registered');
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          mobile: '',
          password: '',
          confirmPassword: ''
        });
        setTimeout(() => 
          navigate('/login'), 
        2000);
      } 
      else 
        {
        toast.error(result.message || 'Something went wrong');
      }
    }
     catch (error) {
      console.error(error);
      toast.error('Error connecting to server');
    }
  };

  return (
    <PublicLayout>
      <ToastContainer position="top-center" autoClose={2000} />
      <div className="container py-5">
        <div className="row shadow-lg rounded-4">
          <div className="col-md-6 p-4">
            <h3 className="text-center mb-4">
              <i className="fas fa-user-plus me-2"></i> User Registration
            </h3>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <input name="firstName" type="text" className="form-control" value={formData.firstName} onChange={handleChange} placeholder="First name" required/>
              </div>

              <div className="mb-3">
                <input name="lastName" type="text" className="form-control" value={formData.lastName} onChange={handleChange} placeholder="Last name" required/>
              </div>

              <div className="mb-3">
                <input name="email" type="email" className="form-control" value={formData.email} onChange={handleChange} placeholder="Email" required/>
              </div>

              <div className="mb-3">
                <input name="mobile" type="text" className="form-control" value={formData.mobile} onChange={handleChange} placeholder="Mobile number" required/>
              </div>

              <div className="mb-3">
                <input name="password" type="password" className="form-control" value={formData.password} onChange={handleChange} placeholder="Password" required/>
              </div>

              <div className="mb-3">
                <input name="confirmPassword" type="password" className="form-control"  value={formData.confirmPassword} onChange={handleChange} placeholder="Repeat Password" required/>
              </div>

              <button type="submit" className="btn btn-primary w-100">
                <i className="fas fa-user-check me-2"></i> Submit
              </button>
            </form>
          </div>

          <div className="col-md-6 d-flex align-items-center justify-content-center">
            <div className="p-4 text-center">
              <img src="/images/registration.png" className="img-fluid" style={{ maxHeight: '400px' }} alt="Registration"/>
              <h5 className="mt-3">Registration is fast, secure and free.</h5>
              <p className="text-muted small">
                Join our food family and enjoy delicious food delivered to your door!
              </p>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
};

export default Register;
