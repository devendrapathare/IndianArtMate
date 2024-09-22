import { createContext, useContext, useEffect, useState } from "react";
import axios from 'axios';
import { useAuthContext } from "../AuthContext/AuthContext";

export const PostContext = createContext();

const PostContextProvider = ({ children }) => {
    const [posts, setPosts] = useState([]);
    const [loggedInUserPosts, setLoggedInUserPosts] = useState([]);
    const { authUser } = useAuthContext();
    
    const fetchPostList = async (userId) => {
        try {
            const response = await axios.get('/api/post/listPost', {
                params: { userId } // Pass the userId as a query parameter
            });
            const sortedPosts = response.data.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            setPosts(sortedPosts);
        } catch (error) {
            console.error("Error fetching posts:", error);
        }
    };

    const fetchLoggedInUserPostList = async () => {
        if (!authUser?._id) return; // Early return if authUser is not set
        try {
            const response = await axios.get('/api/post/listlogedInUserPost', {
                params: { userId: authUser._id }
            });
            const sortedPosts = response.data.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            setLoggedInUserPosts(sortedPosts);
            console.log("Fetched logged-in user posts:", sortedPosts); 
        } catch (error) {
            console.error("Error fetching logged-in user posts:", error);
        }
    };
    
    useEffect(() => {
        fetchPostList(); // Fetch all posts on initial load
        fetchLoggedInUserPostList(); // Fetch posts for the logged-in user
    }, [authUser]);

    const contextValue = {
        posts,
        fetchPostList,
        fetchLoggedInUserPostList,
        loggedInUserPosts,
    };

    return (
        <PostContext.Provider value={contextValue}>
            {children}
        </PostContext.Provider>
    );
};

// Custom hook to use the PostContext
export const usePostContext = () => {
    return useContext(PostContext);
};

export default PostContextProvider;
