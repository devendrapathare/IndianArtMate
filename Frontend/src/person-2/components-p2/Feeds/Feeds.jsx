import React, { useContext } from 'react'
import './Feeds.css'
import Feed from './Feed/Feed'
import { PostContext } from '../../context/PostContext/PostContext';
import { useAuthContext } from '../../context/AuthContext/AuthContext';

const Feeds = () => {

    const { posts } = useContext(PostContext);

    const { authUser } = useAuthContext()

    return (
        <div className='feeds-container'>
            {posts
            .filter(post => post.userId !== authUser._id)
            .map((post) =>(
                <Feed key={post._id} post={post}/>
            ))
            }
        </div>
    )
}

export default Feeds