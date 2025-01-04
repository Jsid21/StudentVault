import React, { useState } from 'react';
import axios from 'axios';
import './loginsignup.css';
import { useNavigate } from 'react-router-dom';  // Import useNavigate
// The useNavigate hook from react-router-dom is used to programmatically navigate to different routes.

export const Signup = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });

  const navigate = useNavigate();
  const [error, setError] = useState("");  // Initialize navigate

  // Handle input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("https://studentvault-server.onrender.com/signup", formData,{ 
        headers: {        
          "x-client-id": import.meta.env.VITE_CLIENT_ID, // Must match the value on the server
        }});
      if (response.status === 201) {
        setFormData({ username: "", email: "", password: "" });
        alert("User Registered");
        navigate("/login");
        
      }
    } catch (error) {
      setError(error.response?.data?.error || "An unexpected error occurred");
    }
  };
  

  return (
    <>
      {error && (
        <div className="alert alert-warning col-6 offset-3 mt-4" role="alert">
        {error}
      </div>
      )}
      <div className="container-xxl container1">
        <div className="header">
          <div className="text">Signup</div>
          <div className="underline"></div>
        </div>
        <div className="row mt-3">
          <div className="col-12">
            <form onSubmit={handleSubmit} className="needs-validation" novalidate>
              <div className="mb-3">
                <label htmlFor="exampleInputUsername" className="form-label">
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  className="form-control"
                  id="exampleInputUsername"
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
                <div className="valid-feedback">Looks good!</div>
              </div>
              <div className="mb-3">
                <label htmlFor="exampleInputEmail1" className="form-label">
                  Email address
                </label>
                <input
                  type="email"
                  name="email"
                  className="form-control"
                  id="exampleInputEmail1"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
                <div className="valid-feedback">Looks good!</div>
              </div>
              <div className="mb-3">
                <label htmlFor="exampleInputPassword1" className="form-label">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  className="form-control"
                  id="exampleInputPassword1"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <div className="valid-feedback">Looks good!</div>
              </div>
              <button type="submit" className="btn btn-primary submit mx-auto">
                SignUp
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};
