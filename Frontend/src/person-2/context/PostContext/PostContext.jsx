import { createContext, useContext, useEffect, useState } from "react";
import axios from 'axios';
import { AuthContext, useAuthContext } from "../AuthContext/AuthContext";

export const PostContext = createContext();

const PostContextProvider = (props) => {
    const url = "http://localhost:5000";
    const [posts, setPosts] = useState([]);
    const [logedInUserPosts, setlogedInUserPosts] = useState([])
    const {authUser} = useAuthContext()

    

    const fetchPostList = async () => {
        try {
            const response = await axios.get(`/api/post/listPost`);
            const sortedPosts = response.data.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            setPosts(sortedPosts);
            // console.log("Fetched posts:", sortedPosts);  
        } catch (error) {
            console.error("Error fetching posts:", error);
        }
    };

    const fetchLogedInUserPostList = async (params) => {
        try {
            const response = await axios.get('/api/post/listlogedIUserPost',{
                params: {userId: authUser._id}
            });
            const sortedPosts = response.data.data.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));
            setlogedInUserPosts(sortedPosts);
            // console.log("Fetched logedIn user Posts posts:", sortedPosts); 
        } catch (error) {
            console.error("Error fetching posts:", error);
        }
    }
    

    useEffect(() => {
        fetchPostList();
        if (authUser && authUser._id) {
            fetchLogedInUserPostList();
        }
    }, [authUser]);

    const contextValue = {
        posts,
        url,
        fetchPostList,
        fetchLogedInUserPostList,
        logedInUserPosts,
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
