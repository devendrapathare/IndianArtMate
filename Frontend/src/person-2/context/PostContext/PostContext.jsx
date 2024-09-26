<<<<<<< HEAD
import { createContext, useContext, useEffect, useState, useCallback } from "react";
=======
import { createContext, useContext, useEffect, useState } from "react";
>>>>>>> 38a3753250e608921a441f6155e69ae2749c1803
import axios from 'axios';
import { useAuthContext } from "../AuthContext/AuthContext";

export const PostContext = createContext();

const PostContextProvider = ({ children }) => {
    const [posts, setPosts] = useState([]);
    const [loggedInUserPosts, setLoggedInUserPosts] = useState([]);
    const { authUser } = useAuthContext();
<<<<<<< HEAD

    // Base URL for the backend
    const url = 'http://localhost:5000'; // Adjust this URL as per your backend

    // Memoize fetchPostList to avoid unnecessary re-creations
    const fetchPostList = useCallback(async (userId) => {
=======
    const [singleUserData, setsingleUserData] = useState([])
    const url = 'http://localhost:5000';
    
    
    const fetchPostList = async (userId) => {
>>>>>>> 38a3753250e608921a441f6155e69ae2749c1803
        try {
            const response = await axios.get('/api/post/listPost', {
                params: { userId } // Pass the userId as a query parameter
            });
            const sortedPosts = response.data.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            setPosts(sortedPosts);
<<<<<<< HEAD
            console.log("Fetched posts for user:", userId);
=======
            // console.log('fetchpostlist',sortedPosts);
>>>>>>> 38a3753250e608921a441f6155e69ae2749c1803
        } catch (error) {
            console.error("Error fetching posts:", error);
        }
    }, [url]); // Only change if URL changes

    // Memoize fetchLoggedInUserPostList to avoid unnecessary re-creations
    const fetchLoggedInUserPostList = useCallback(async () => {
        if (!authUser?._id) return; // Early return if authUser is not set
        try {
            const response = await axios.get(`${url}/api/post/listlogedInUserPost/${authUser._id}`);
            const sortedPosts = response.data.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            setLoggedInUserPosts(sortedPosts);
<<<<<<< HEAD
            console.log("Fetched logged-in user posts:", sortedPosts);
=======
            // console.log("Fetched logged-in user posts:", sortedPosts); 
>>>>>>> 38a3753250e608921a441f6155e69ae2749c1803
        } catch (error) {
            console.error("Error fetching logged-in user posts:", error);
        }
    }, [authUser, url]); // Re-run if authUser or url changes

<<<<<<< HEAD
    // Use effect to fetch posts for the logged-in user whenever authUser changes
    useEffect(() => {
        if (authUser) {
            fetchLoggedInUserPostList(); // Fetch posts for the logged-in user
        }
    }, [authUser, fetchLoggedInUserPostList]);
=======
    const fetchSingleUserDetailById = async (artistId) => {
        console.log("fetchSingleUserDetailById:", artistId);
        try {
            const response = await axios.get(`${url}/users/${artistId}`);
            // console.log("Full response:", response.data);
            setsingleUserData(response.data); 
    
            // console.log("Fetched single user data:", response.data); 
        } catch (error) {
            console.error("Error Fetching Single user by Id:", error);
        }
    };
    
    
    // useEffect(() => {
    //     console.log("Single user data updated:", singleUserData);
    // }, [singleUserData]);
    
    
    useEffect(() => {
        fetchPostList();  
        fetchLoggedInUserPostList();
        fetchSingleUserDetailById;
    }, [authUser]);
>>>>>>> 38a3753250e608921a441f6155e69ae2749c1803

    const contextValue = {
        posts,
        fetchPostList,
        fetchLoggedInUserPostList,
        loggedInUserPosts,
        url,
        fetchSingleUserDetailById,
        singleUserData,
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
