import React from 'react';
import logo from '../assets/logo.png';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

export const Navbar = ({ session, onLogout }) => {
  const { isLoggedIn, username } = session; // Destructure session details
  const navigate = useNavigate();
  // console.log('Navbar received session:', session); // Debugging
  const handleLogout = async () => {
    try {
      // Logout endpoint (assumes /logout exists on your backend)
      await axios.post(
        'https://student-vault-server.vercel.app/logout',
        {},
        {
          headers: {
            "x-client-id": import.meta.env.VITE_CLIENT_ID, // Must match the value on the server
          },
          withCredentials: true,
        }
      );
      onLogout(); // Trigger session re-check
      navigate('/'); // Redirect to the homepage after logout
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <div>
      <nav className="navbar navbar-expand-lg border-bottom sticky-top" style={{ backgroundColor: 'white' }}>
        <div className="container-fluid">
          <Link className="navbar-brand ms-3" to="/">
            <img src={logo} alt="Bootstrap" style={{ width: '150px' }} />
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNavAltMarkup"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
            <div className="navbar-nav ms-auto d-flex align-items-start">
              <Link className="nav-link" to="/">
                <i className="fa-solid fa-house"></i> Home
              </Link>
              <Link className="nav-link" to="/upload">
                <i className="fa-solid fa-plus"></i> Upload
              </Link>
              {isLoggedIn ? (
                <>
                  {/* Dropdown */}
                  <div className="nav-item dropdown">
                    <button
                      className="btn btn-link nav-link dropdown-toggle"
                      id="navbarDropdown"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                      style={{ textDecoration: 'none' }}
                    >
                      Welcome, {username}
                    </button>
                    <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
                      <li>
                        <Link className="dropdown-item" to="/profile">
                          Profile
                        </Link>
                      </li>
                      <li>
                        <Link className="dropdown-item" to="/myposts">
                          My Posts
                        </Link>
                      </li>
                    </ul>
                  </div>
                  <Link className="nav-link btn btn-link me-2" onClick={handleLogout}>
                    Logout
                  </Link>
                </>
              ) : (
                <>
                  <Link className="nav-link" to="/signup">
                    Sign up
                  </Link>
                  <Link className="nav-link" to="/login">
                    Log in
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};
