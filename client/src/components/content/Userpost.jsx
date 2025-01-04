import React, {useEffect,useState} from 'react'
import {Card} from './Card';
import './showcontent.css';
import axios from 'axios';


export const Userpost = ({sessionDetail}) => {
  const [posts,setPosts] = useState([]);
  const [errmsg, setErrormsg] = useState('');
  const [searchResults, setSearchResults] = useState([]); // Store filtered posts
  const [searchQuery, setSearchQuery] = useState(""); // Store the search input
  const [atHome,setHome] = useState(true);

   // Handle card click - Redirect to /show/:postId
    useEffect(() => {
      const fetchPosts = async () => {
        try {
          const response = await axios.get('https://student-vault-server.vercel.app/api/userposts', {
            params: { username: sessionDetail.username }, // Pass username to API
            headers: {
              'x-client-id': import.meta.env.VITE_CLIENT_ID, // Add required headers
            },withCredentials: true
          });
    
          if (response.data && response.data.length > 0) {
            setPosts(response.data); // Set the posts to state
            setSearchResults(response.data); // Initialize search results with all posts
            setErrormsg(''); // Clear any previous error message
          } else {
            setErrormsg('No posts found!');
            setPosts([]); // Clear posts state if no data found
          }
        } catch (err) {
          console.log('Error fetching user posts details:', err.message);
          setErrormsg('No post Found. Kindly upload a Post ');
        }
      };
    
      fetchPosts();
    }, [sessionDetail.username]);
    
    const handleSearch=(e)=>{
      // console.log(e.target.value);      
      setSearchQuery(e.target.value.toLowerCase());
    }
  
    const handleResult=(e)=>{
      if (searchQuery.trim() === "") {
        // If the search query is empty, reset to show all posts
        console.log(searchQuery);        
        setSearchResults(posts);
      } else {
        // console.log(searchQuery); 
        const fpost = posts.filter(
          (post)=>{
            return (          
            post.title.toLowerCase().includes(searchQuery.trim()) ||
            post.description.toLowerCase().includes(searchQuery.trim()) ||
            post.owner?.username.toLowerCase().includes(searchQuery.trim())
            );
        });
        // console.log(fpost); 
        setHome(false)
        setSearchResults(fpost);
      }
    }

    const handleCardClick = (post) => {
      const url = `/show/${post._id}`;
      window.open(url, "_blank");
    };

  return (
    <>
    {errmsg!=="" && (
        <div className="alert alert-warning col-6 offset-3 mt-4" role="alert">
        {errmsg}
      </div>
  )}

    <div className="container-md">
            <div className="inner_text mt-3" style={{ color: "black" }}>
              My Posts
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
                <button className="btn btn-outline-secondary submitbtn" type="button" onClick={handleResult}>
                  Search
                </button>
              </div>
              {!atHome?<span style={{color:'black'}} onClick={()=>{setHome(true),setSearchResults(posts)}}><i class="fa-solid fa-arrow-left-long"></i> Home</span>:null}
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
          </>
  )
}
