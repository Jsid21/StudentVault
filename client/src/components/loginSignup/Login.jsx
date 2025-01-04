import React, { useState } from "react";
import axios from "axios"; 
import { useNavigate } from "react-router-dom"; 
import "./loginsignup.css";

export const Login = ({ onLogin}) => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const navigate = useNavigate();
  const [error, setError] = useState(""); // Error state
  

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("https://student-vault-server.vercel.app/login", formData, { 
      headers: {        
        "x-client-id": import.meta.env.VITE_CLIENT_ID, // Must match the value on the server
      }, withCredentials: true });

      if (response.status === 200) {
        setFormData({ username: "", password: "" });
        onLogin();
        // alert(`${response.data.message}`);
        setTimeout(() => navigate("/"), 2000);
      }
    } catch (error) {
      // console.log(error);      
      setError("Invalid login credentials ... Try again");
    }
  };
  return (
    <>
      {/* <Flash type={flash.type} message={flash.message} /> Render Flash */}
      {error && (
        <div className="alert alert-warning col-6 offset-3 mt-4" role="alert">
        {error}
      </div>
      )}
      <div className="container-xxl container1">
        <div className="header">
          <div className="text">Login</div>
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
                  onChange={handleInputChange}
                  required
                />
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
                  onChange={handleInputChange}
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary submit mx-auto">
                Login
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};
