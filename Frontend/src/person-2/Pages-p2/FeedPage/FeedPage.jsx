import React, { useState, useEffect, useRef } from 'react'
import './FeedPage.css'
import ProfileInfo from '../../components-p2/Profile/ProfileInfo/ProfileInfo'
import { useAuthContext } from '../../context/AuthContext/AuthContext'
import Feeds from '../../components-p2/Feeds/Feeds'
import Feed from '../../components-p2/Feeds/Feed/Feed'
import { usePostContext } from '../../context/PostContext/PostContext'

const FeedPage = () => {
    const { authUser } = useAuthContext()
    const { posts } = usePostContext()
    const [categories, setCategories] = useState([])
    const scrollContainerRefs = useRef({})

    // Extract unique categories from posts
    useEffect(() => {
        if (posts && posts.length > 0) {
            const uniqueCategories = [...new Set(posts.map(post => post.category))]
            setCategories(uniqueCategories.filter(category => category)) // Filter out undefined/empty categories
        }
    }, [posts])

    // Add smooth scroll behavior for touch devices
    useEffect(() => {
        const handleTouchScroll = () => {
            // Apply the refs to all scroll containers once categories are loaded
            Object.keys(scrollContainerRefs.current).forEach(category => {
                const container = scrollContainerRefs.current[category];
                if (container) {
                    let isDown = false;
                    let startX;
                    let scrollLeft;
                    
                    const onMouseDown = (e) => {
                        // Don't trigger drag behavior on like/dislike buttons or their containers
                        if (
                            e.target.closest('.feed-like-dislike-div') || 
                            e.target.classList.contains('respons')
                        ) {
                            return;
                        }
                        isDown = true;
                        container.classList.add('active-scroll');
                        startX = e.pageX - container.offsetLeft;
                        scrollLeft = container.scrollLeft;
                    };
                    
                    const onMouseLeave = () => {
                        isDown = false;
                        container.classList.remove('active-scroll');
                    };
                    
                    const onMouseUp = () => {
                        isDown = false;
                        container.classList.remove('active-scroll');
                    };
                    
                    const onMouseMove = (e) => {
                        if (!isDown) return;
                        e.preventDefault();
                        const x = e.pageX - container.offsetLeft;
                        const walk = (x - startX) * 2; // Scroll speed
                        container.scrollLeft = scrollLeft - walk;
                    };
                    
                    // Add event listeners
                    container.addEventListener('mousedown', onMouseDown);
                    container.addEventListener('mouseleave', onMouseLeave);
                    container.addEventListener('mouseup', onMouseUp);
                    container.addEventListener('mousemove', onMouseMove);
                    
                    // Return cleanup function
                    return () => {
                        container.removeEventListener('mousedown', onMouseDown);
                        container.removeEventListener('mouseleave', onMouseLeave);
                        container.removeEventListener('mouseup', onMouseUp);
                        container.removeEventListener('mousemove', onMouseMove);
                    };
                }
            });
        };
        
        if (Object.keys(scrollContainerRefs.current).length > 0) {
            handleTouchScroll();
        }
    }, [categories]);

    return (
        <div className='FeedPage-main'>
            {/* Top section with profile and more artists */}
            <div className='FeedPage-top-section'>
                <div className='FeedPage-profile-section'>
                    <ProfileInfo isOwnProfile={true} userId={authUser._id} />
                </div>
            </div>

            {/* Horizontal post sections by category */}
            <div className='FeedPage-posts-sections'>
                {categories.length > 0 ? (
                    categories.map(category => (
                        <div key={category} className='FeedPage-category-section'>
                            <h3 className='FeedPage-category-title'>{category}</h3>
                            
                            <div 
                                className='FeedPage-horizontal-posts'
                                ref={el => scrollContainerRefs.current[category] = el}
                                data-category={category}
                            >
                                {posts
                                    .filter(post => post.category === category)
                                    .slice(0, 5) // Limit to 5 posts per row
                                    .map(post => (
                                        <div key={post._id} className='FeedPage-post-card'>
                                            <Feed post={post} />
                                        </div>
                                    ))
                                }
                                {posts.filter(post => post.category === category).length > 5 && (
                                    <div className='FeedPage-see-more'>
                                        <button>See More</button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className='FeedPage-all-posts'>
                        <h3 className='FeedPage-category-title'>All Posts</h3>
                        <Feeds />
                    </div>
                )}
            </div>
        </div>
    )
}

export default FeedPage