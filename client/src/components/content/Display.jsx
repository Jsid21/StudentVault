import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './display.css';

export const Display = ({ sessionDetail }) => {
  const { postId } = useParams(); // Get postId from URL
  const [post, setPost] = useState(null);
  const [user, setUser] = useState(''); // Store the logged-in user
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPostDetails = async () => {
      try {
        // Fetch the post details
        const response = await axios.get(`https://student-vault-server.vercel.app/api/posts/${postId}`, {
          headers: {
            "x-client-id": import.meta.env.VITE_CLIENT_ID, // Must match the value on the server
          },
          withCredentials: true,
        });
        if(response.status === 200){
          const data = response.data;
          setPost(data);
          setUser(sessionDetail.username); // Assume the API returns user object
        }else if (response.status === 404) {
          setErrorMessage(response.data.message); // Set the error message
        }
      } catch (error) {
        console.log("Error fetching post details:", error.message);
        setErrorMessage("Error fetching post details.");
        // navigate("/");
      }
    };

    fetchPostDetails();
  }, [postId]);

  const handleDelete = async () => {
    try {
      alert("Are you sure to delete?");
      await axios.delete(`https://student-vault-server.vercel.app/api/posts/${postId}`, {
        headers: {
          "x-client-id": import.meta.env.VITE_CLIENT_ID,
        },
        withCredentials: true,
      });
      navigate('/'); // Redirect to homepage or any desired page
    } catch (error) {
      console.error("Error deleting post:", error);
      alert("Failed to delete the post.");
    }
  };

  const handleEdit = () => {
    // Navigate to the Update page and pass post data as state
    navigate(`/update/${postId}`, { state: { post } });
  };

  if(errorMessage){
    return(<div className="alert alert-warning col-6 offset-3 mt-4" role="alert">{errorMessage}</div>);
  }

  if (!post) {
    // Display a loader or empty screen while session check is in progress
    return (
      <div>
        <div
          className="spinner-grow text-info position-absolute top-50 start-50 translate-middle"
          role="status"
        >
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container-md cont_main" style={{ backgroundColor: 'white' }}>
      <h2 className="card_title1 mx-3">{post.title}</h2>
      <h6 className="card_subtitle1">{post.owner.username}</h6>
      <p className="innerText">{post.description}</p>

      {/* File preview section */}
      {post.file && post.file.url && (
        <div className="file-preview my-3">
          <h5>File Preview:</h5>
          <a
            href={post.file.url}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-info"
          >
            View File
          </a>
        </div>
      )}

      {/* Show delete button only if the logged-in user is the owner */}
      {user === post.owner.username ? (
        <>
          <hr></hr>
          <button
            type="submit"
            className="btn btn-danger mx-2 my-2"
            onClick={handleDelete}
          >
            Delete <i className="fa-solid fa-trash" style={{ fontSize: '1rem' }}></i>
          </button>
          <button
            type="submit"
            className="btn btn-warning mx-2 my-2"
            onClick={handleEdit}
          >
            Edit <i className="fa-solid fa-pen-to-square" style={{ fontSize: '1rem' }}></i>
          </button>
        </>
      ) : null}
    </div>
  );
};
