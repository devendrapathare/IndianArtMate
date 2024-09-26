import { createContext, useContext, useEffect, useState, useCallback } from "react";
import axios from 'axios';
import { useAuthContext } from "../AuthContext/AuthContext";

export const PostContext = createContext();

const PostContextProvider = ({ children }) => {
    const [posts, setPosts] = useState([]);
    const [loggedInUserPosts, setLoggedInUserPosts] = useState([]);
    const { authUser } = useAuthContext();

    // Base URL for the backend
    const url = 'http://localhost:5000'; // Adjust this URL as per your backend

    // Memoize fetchPostList to avoid unnecessary re-creations
    const fetchPostList = useCallback(async (userId) => {
        try {
            const response = await axios.get(`${url}/api/post/listPost`, {
                params: { userId } // Pass the userId as a query parameter
            });
            const sortedPosts = response.data.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            setPosts(sortedPosts);
            console.log("Fetched posts for user:", userId);
        } catch (error) {
            console.error("Error fetching posts:", error);
        }
    }, [url]); // Only change if URL changes

    // Memoize fetchLoggedInUserPostList to avoid unnecessary re-creations
    const fetchLoggedInUserPostList = useCallback(async () => {
        if (!authUser?._id) return; // Early return if authUser is not set
        try {
            const response = await axios.get(`${url}/api/post/listlogedInUserPost`, {
                params: { userId: authUser._id }
            });
            const sortedPosts = response.data.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            setLoggedInUserPosts(sortedPosts);
            console.log("Fetched logged-in user posts:", sortedPosts);
        } catch (error) {
            console.error("Error fetching logged-in user posts:", error);
        }
    }, [authUser, url]); // Re-run if authUser or url changes

    // Use effect to fetch posts for the logged-in user whenever authUser changes
    useEffect(() => {
        if (authUser) {
            fetchLoggedInUserPostList(); // Fetch posts for the logged-in user
        }
    }, [authUser, fetchLoggedInUserPostList]);

    const contextValue = {
        posts,
        fetchPostList,
        fetchLoggedInUserPostList,
        loggedInUserPosts,
        url, // Add the base URL to context so it can be used in components like ProfileFeed
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
