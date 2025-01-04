import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom'; // Import Navigate
import { Login } from './components/loginSignup/Login';
import { Navbar } from './components/NavFooter/Navbar';
import { Footer } from './components/NavFooter/Footer';
import { Home } from './Home';
import { Signup } from './components/loginSignup/Signup';
import axios from 'axios';
import { Upload } from './components/uploads/Upload';
import { Display } from './components/content/Display';
import { Update } from './components/uploads/Update';
import { Profile } from './components/content/Profile';
import {Userpost} from './components/content/Userpost';
import { Notfound } from './components/content/Notfound';

function App() {
  const [session, setSession] = useState({ isLoggedIn: false, username: '' });
  const [isLoading, setIsLoading] = useState(true); // Add loading state


  const checkSession = async () => {
    try {
      const response = await axios.get('https://studentvault-server.onrender.com/api/checkSession', {
        withCredentials: true,
      });
      console.log('Session response:', response.data); // Debugging
      setSession({
        isLoggedIn: response.data.isLoggedIn,
        username: response.data.isLoggedIn ? response.data.username : '',
      });
    } catch (error) {
      console.error('Error checking session:', error);
      setSession({ isLoggedIn: false, username: '' });
    } finally {
      setIsLoading(false);
    }
  };
  

  useEffect(() => {
    checkSession(); // Check session status on initial load
  }, []);

  if (isLoading) {
    // Display a loader or empty screen while session check is in progress
    return <div>
      <div className="spinner-grow text-info position-absolute top-50 start-50 translate-middle" role="status">
      <span className="sr-only">Loading...</span>
      </div>
      </div>
  }

  return (
    <>
      {/* Pass session details to Navbar */}
      <Navbar session={session} onLogout={checkSession} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/show/:postId" element={<Display sessionDetail={session} />} /> {/* New route */}

        {/* If the user is not logged in, they can access /login and /signup */}
        {!session.isLoggedIn ? (
          <>
            <Route path="/login" element={<Login onLogin={checkSession} />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/upload" element={<Navigate to="/login" />} />
            <Route path="/profile" element={<Navigate to="/login" />} />
            <Route path="/myposts" element={<Navigate to="/login" />} />
            <Route path="/update/:postId" element={<Navigate to="/login" />} />
          </>
        ) : (
          // If the user is logged in and tries to go to /login or /signup, redirect to home
          <>
            <Route path="/login" element={<Navigate to="/" />} />
            <Route path="/signup" element={<Navigate to="/" />} />
            <Route path="/upload" element={<Upload />} />
            <Route path="/profile" element={<Profile sessionDetail={session} />} />
            <Route path="/myposts" element={<Userpost sessionDetail={session} />} />
            <Route path="/update/:postId" element={<Update sessionDetail={session} />} />
          </>
        )}

        {/* Catch-all route for undefined paths */}
        {/* <Route path="*" element={<Navigate to="/" />} /> */}
        <Route path="*" element={<Notfound />} />
      </Routes>
      {/* <Footer /> */}
    </>
  );
}

export default App;
