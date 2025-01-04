import React, { useState, useEffect } from 'react';
import './profile.css';
import profile from '../assets/profile.png';
import axios from 'axios';

export const Profile = ({ sessionDetail }) => {
  const [userDetails, setUserDetails] = useState({
    username: '',
    email: '',
    password: ''
  });

  const [newPassword, setnewPass] = useState({
    oldpass : '',
    newpass : ''
  });

  const [errormsg, setErr] = useState("");

  const handleOldPass = (e)=>{
    const {name, value} = e.target;
    setnewPass({...newPassword, [name] : value});
  }

  const handleNewPass = (e)=>{
    const {name, value} = e.target;
    setnewPass({...newPassword, [name] : value});
  }


  useEffect(() => {
    // Fetch user details when component mounts
    const fetchUserDetails = async () => {
      try {
        // if(userDetails.password !== newPassword.newpass ){
        const response = await axios.get('https://studentvault-server.onrender.com/profile', {
          params: { username: sessionDetail.username },
          headers: {        
            "x-client-id": import.meta.env.VITE_CLIENT_ID, // Must match the value on the server
          }
        });
        setUserDetails(response.data);
        // }else{
        //     setErr("Current password and New password is same, Try another one")
        // }
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };

    fetchUserDetails();
  }, [sessionDetail.username]);

  const handleDelete = ()=>{

  }

  return (
    <>
    {errormsg!=="" && (
        <div className="alert alert-warning col-6 offset-3 mt-4" role="alert">
        {errormsg}
      </div>
  )}
    <div className="container-xxl container2" style={{ color: 'black' }}>
      <div className="titlediv">
        <img src={profile} className="pic" alt="Profile" />
        <div className="usernameDiv">{userDetails.username}</div>
      </div>
      <div className="details">
        <div className="mail" style={{ margin: '15px 0' }}>
          <div style={{ fontWeight: '700' }}>Email :</div>
          <div>{userDetails.email}</div>
        </div>
        <hr />
        <div className="submissionButton">
        {/* <button type="submit" className="btn btn-danger submit_btn_3" >
          Delete Account
        </button>           */}
        </div>
      </div>
    </div>
    </>
  );
};
