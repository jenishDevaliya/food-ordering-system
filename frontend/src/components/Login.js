import React, { useState } from "react";
import PublicLayout from "./PublicLayout";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { FaSignInAlt, FaUserPlus } from "react-icons/fa";

const Login = () => {
  const [formData, setFormData] = useState({ emailcont: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://127.0.0.1:8000/api/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emailcont: formData.emailcont, password: formData.password }),
      });

      const result = await response.json();

      if (response.status === 200) {
        toast.success(result.message || "Login Successful");

    
        localStorage.setItem('userId', result.userId);   // ✅ CORRECT

        localStorage.setItem('userName', result.userName); // this is fine


        setFormData({ 
          emailcont: '', 
          password: '' 
        });
        setTimeout(() => 
          navigate('/'), 
        2000); 
      } 
      else {
        toast.error(result.message || "Invalid credentials");
      }
    } 
    catch (error) {
      console.error(error);
      toast.error("Error connecting to server");
    }

    
  };

  return (
    <PublicLayout>
       <ToastContainer position="top-center" autoClose={2000} />
      <div className="container py-5">
        <div className="row align-items-center">
          <div className="col-md-6 p-4">
            <h3 className="text-center mb-4">
              <FaSignInAlt className="me-2" /> User Login
            </h3>

            <form className="card p-4 shadow" onSubmit={handleSubmit}>
              <div className="mb-3">
                <input
                  name="emailcont"
                  type="email"
                  className="form-control"
                  value={formData.emailcont}
                  onChange={handleChange}
                  placeholder="Email"
                  required
                />
              </div>

              <div className="mb-3">
                <input
                  name="password"
                  type="password"
                  className="form-control"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Password"
                  required
                />
              </div>

              <div className="d-flex justify-content-between">
                <button type="submit" className="btn btn-primary">
                  <FaSignInAlt className="me-2" /> Login
                </button>

                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => navigate("/register")}
                >
                  <FaUserPlus className="me-2" /> Register
                </button>
              </div>
            </form>
          </div>

          <div className="col-md-6 d-flex align-items-center justify-content-center">
            <div className="text-center">
              <img src="/images/login.png" className="img-fluid rounded-3 w-75" />
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
};

export default Login;
