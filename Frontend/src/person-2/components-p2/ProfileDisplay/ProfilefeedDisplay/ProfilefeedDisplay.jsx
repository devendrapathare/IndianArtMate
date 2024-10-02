import React, { useEffect, useState, useRef } from 'react';
import './ProfilefeedDisplay.css';
import ProfileFeed from '../../Profile/ProfileFeed/ProfileFeed';
import { usePostContext } from '../../../context/PostContext/PostContext';
import { assets } from '../../../../assets/assets';

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
                    console.log("No posts found or data structure is incorrect", data);
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
            
        }
    }, [current_id]);

    const containerClass = viewerPosts.length > 0 ? 'ProfilefeedDisplay-container' : 'EmptyProfilefeedDisplay-container';
    return (
        <div>
            {loading ? (
                <h1>Loading...</h1>
            ) : (
                <div className={containerClass}>
                    {viewerPosts.length > 0 ? (
                        viewerPosts.map((item) => (
                            <ProfileFeed
                                key={item._id}
                                id={item._id}
                                image={item.image}
                                category={item.category}
                                description={item.description}
                                price={item.price}
                                title={item.title}
                                userId={item.userId}
                            />
                        ))
                    ) : (
                        <div className="ProfilefeedDisplay-empty">
                            <img src={assets.empty_box} alt="No posts" />
                            <h1>No posts available</h1>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
    

export default ProfilefeedDisplay;