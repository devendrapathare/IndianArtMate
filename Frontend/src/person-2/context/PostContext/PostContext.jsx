import { createContext, useContext, useEffect, useState } from "react";
import axios from 'axios';
import { useAuthContext } from "../AuthContext/AuthContext";

export const PostContext = createContext();

const PostContextProvider = ({ children }) => {
    const [posts, setPosts] = useState([]);
    const [loggedInUserPosts, setLoggedInUserPosts] = useState([]);
    const { authUser } = useAuthContext();
    const [singleUserData, setsingleUserData] = useState([])
    const url = 'http://localhost:5000';
    
    
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
            const response = await axios.get(`${url}/api/post/listlogedInUserPost/${authUser._id}`);
            const sortedPosts = response.data.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            setLoggedInUserPosts(sortedPosts);
            // console.log("Fetched logged-in user posts:", sortedPosts); 
        } catch (error) {
            console.error("Error fetching logged-in user posts:", error);
        }
    };

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
    
    
    useEffect(() => {
        console.log("Single user data updated:", singleUserData);
    }, [singleUserData]);
    
    
    useEffect(() => {
        fetchPostList();  
        fetchLoggedInUserPostList();
        fetchSingleUserDetailById;
    }, [authUser]);

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
