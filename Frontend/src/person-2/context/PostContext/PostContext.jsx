import { createContext, useContext, useEffect, useState } from "react";
import axios from 'axios';

export const PostContext = createContext();

const PostContextProvider = (props) => {
    const url = "http://localhost:5000";
    const [posts, setPosts] = useState([]);

    const fetchPostList = async () => {
        try {
            const response = await axios.get(`/api/post/listPost`);
            const sortedPosts = response.data.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            setPosts(sortedPosts);
            console.log("Fetched posts:", sortedPosts); // Log the fetched data
        } catch (error) {
            console.error("Error fetching posts:", error);
        }
    };
    

    useEffect(() => {
        fetchPostList(); // Fetch posts when the component mounts
    }, []);

    const contextValue = {
        posts,
        url,
        fetchPostList, // Add this to the context so it can be used in other components
    };

    return (
        <PostContext.Provider value={contextValue}>
            {props.children}
        </PostContext.Provider>
    );
};

export default PostContextProvider;

// Custom hook to use the PostContext
export const usePostContext = () => {
    return useContext(PostContext);
};
