import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './upload.css';

export const Update = ({ sessionDetail }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { post } = location.state || {}; // Handle null `location.state`
  const clientId = import.meta.env.VITE_CLIENT_ID;

  const [formData, setFormData] = useState({
    title: post?.title || '',
    description: post?.description || '',
    file: null,
  });

  const [error, setError] = useState(!post ? 'No post data provided. Please navigate through the appropriate link.' : '');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, file: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!post) {
      setError('Cannot update without a valid post.');
      return;
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      if (formData.file) {
        formDataToSend.append('file', formData.file);
      }

      await axios.put(`http://localhost:3000/api/posts/${post._id}`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'x-client-id': clientId,
        },
        withCredentials: true,
      });

      alert('Post updated successfully!');
      navigate(`/show/${post._id}`);
    } catch (error) {
      console.error('Error updating post:', error);
      setError('Failed to update the post. Please try again.');
    }
  };

  return (
    <>
    {/* <div style={{color:'red'}}>{clientId}</div> */}
    <div className="container-md" style={{ color: 'black' }}>
      {error && <div className="alert alert-danger my-4 col-10 offset-1">{error}</div>}
      {!error && (
        <>
          <div className="header">
            <div className="text">Update Post</div>
            <div className="underline"></div>
          </div>
          <form className="needs-validation my-4 mx-2" onSubmit={handleSubmit}>
            <label htmlFor="title" className="form-label">
              Title
            </label>
            <input
              name="title"
              id="title"
              className="form-control"
              type="text"
              placeholder="Enter title"
              value={formData.title}
              onChange={handleInputChange}
              required
            />
            <br />
            <div className="mb-3">
              <label htmlFor="description" className="form-label">
                Description
              </label>
              <textarea
                name="description"
                className="form-control"
                id="description"
                rows="3"
                placeholder="Enter Description"
                value={formData.description}
                onChange={handleInputChange}
                required
              ></textarea>
            </div>
            <br />
            <label htmlFor="file" className="form-label">
              Upload File (Image/PDF) (Optional)
            </label>
            <input
              name="file"
              className="form-control"
              type="file"
              onChange={handleFileChange}
            />
            <br />
            <button type="submit" className="btn btn-primary submit_btn_1">
              Update
            </button>
          </form>
        </>
      )}
    </div>
    </>
  );
};
