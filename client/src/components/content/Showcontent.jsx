import React, { useState, useEffect } from "react";
import "./showcontent.css";
import axios from "axios";
import { Card } from "./Card";
import { Footer } from "../NavFooter/Footer";
import { useNavigate } from "react-router-dom";

export const Showcontent = () => {
  const [posts, setPosts] = useState([]); // Store all posts fetched from the backend
  const [searchResults, setSearchResults] = useState([]); // Store filtered posts
  const [searchQuery, setSearchQuery] = useState(""); // Store the search input
  const [atHome,setHome] = useState(true);
  const navigate = useNavigate(); // Hook for navigation

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get("https://studentvault-server.onrender.com/api/posts", {

          headers: {
            "x-client-id": import.meta.env.VITE_CLIENT_ID, // Must match the value on the server
            // "x-client-id": 'sid_j'
          },
          withCredentials: true,
        });
        const data = response.data;
        setPosts(data); // Store all fetched posts
        setSearchResults(data); // Initially, display all posts
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };
    fetchPosts();
  }, []);

  // Handle search functionality
  const handleSearch = (e) => {
    setSearchQuery(e.target.value.toLowerCase());
  }
  const handleresult=(e)=>{
    if (searchQuery.trim() === "") {
      // If the search query is empty, reset to show all posts
      setSearchResults(posts);
    } else {
      // Filter posts based on title, description, or owner.username
      const filtered = posts.filter(
        (post) =>
          post.title.toLowerCase().includes(searchQuery) ||
          post.description.toLowerCase().includes(searchQuery) ||
          post.owner?.username.toLowerCase().includes(searchQuery)
      );
      setSearchResults(filtered);
      setHome(false);
    }
  };

  const handleback = ()=>{
    setHome(true);
    setSearchResults(posts);
    navigate("/");
  }

  // Handle card click - Redirect to /show/:postId
  const handleCardClick = (post) => {
    const url = `/show/${post._id}`;
    window.open(url, "_blank");
  };

  return (
    <>
      <div className="container-md">
        <div className="inner_text mt-3" style={{ color: "black" }}>
          Search Your Study Material Now!
        </div>
        <div className="serachContainer col-10 offset-1">
          <div className="input-group my-4">
            <input
              type="text"
              className="form-control"
              placeholder="Search Study Material here"
              aria-label="Search"
              value={searchQuery} // Bind search query to input
              onChange={handleSearch} // Handle input change
            />
            <button className="btn btn-outline-secondary submitbtn" type="button" onClick={handleresult}>
              Search
            </button>
          </div>
          {!atHome?<span style={{color:'black'}} onClick={handleback}><i class="fa-solid fa-arrow-left-long"></i> Home</span>:null}
        </div>

        <div className="inner-container">
          <div className="cards my-4">
            {searchResults.length > 0 ? (
              searchResults.map((post) => (
                <Card
                  key={post._id}
                  title={post.title}
                  username={post.owner?.username} // Use the username of the owner
                  description={post.description}
                  onClick={() => handleCardClick(post)}
                />
              ))
            ) : (
              <div className="no-results">
                <p style={{color:'black', textAlign:'center'}}>No posts found for your search.</p>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};
