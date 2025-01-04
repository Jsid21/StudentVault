import React from 'react';
import profile from '../assets/profile.png';
import './card.css';

export const Card = ({ title, username, description, onClick }) => {
  return (
    <div className="card mx-2 my-2" onClick={onClick} style={{ cursor: 'pointer' }}>
      <div className="card_body">
        <img src={profile} alt="Profile" />
        <div className="card_container">
          <h6 className="card_subtitle mb-2 mx-1 text-body-secondary">{username}</h6>
          <h5 className="card_title">{title}</h5>
          <div className="card_text">
            {/* <p>{description.length > 100 ? `${description.substring(0, 100)}...` : description}</p> */}
            {description}
          </div>
        </div>
      </div>
    </div>
  );
};
