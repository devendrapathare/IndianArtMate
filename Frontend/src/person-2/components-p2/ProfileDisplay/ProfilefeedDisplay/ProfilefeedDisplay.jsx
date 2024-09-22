import React, { useEffect, useState, useRef } from 'react';
import './ProfilefeedDisplay.css';
import ProfileFeed from '../../Profile/ProfileFeed/ProfileFeed';

const ProfilefeedDisplay = ({ isOwnProfile, current_id }) => {
    const [viewerPosts, setViewerPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const isMounted = useRef(true);

    useEffect(() => {
      const fetchUserPosts = async () => {
          setLoading(true);
          try {
              const response = await fetch(`http://localhost:5000/fetchPostsByUserId/${current_id}`);
              if (!response.ok) {
                  throw new Error('Network response was not ok');
              }
              const data = await response.json();
  
              if (data && Array.isArray(data.data)) {
                  setViewerPosts(data.data);
              } else {
                  console.warn("No posts found or data structure is incorrect", data);
                  setViewerPosts([]);
              }
          } catch (error) {
              console.error("Error fetching viewer posts:", error);
          } finally {
              setLoading(false);
          }
      };
  
      if (current_id) {
          fetchUserPosts();
          console.log("this is wjay i  got:",viewerPosts)
      }
  }, [current_id]);
  

    const containerClass = viewerPosts.length > 0 ? 'ProfilefeedDisplay-container' : 'EmptyProfilefeedDisplay-container';

    return (
        <div className={containerClass}>
            {loading ? (
                <h1>Loading...</h1>
            ) : (
                <div className="show">
                    {viewerPosts.length > 0 ? (
                        viewerPosts.map((item) => (
                            <ProfileFeed 
                                key={item._id} 
                                image={item.image} 
                                category={item.category} 
                                description={item.description} 
                                price={item.price} 
                                title={item.title} 
                            />
                        ))
                    ) : (
                        <h1>No posts for this viewer</h1>
                    )}
                </div>
            )}
        </div>
    );
};

export default ProfilefeedDisplay;
