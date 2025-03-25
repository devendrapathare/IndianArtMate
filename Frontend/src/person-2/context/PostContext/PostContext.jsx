import { createContext, useContext, useEffect, useState, useCallback } from "react";
import axios from 'axios';
import { useAuthContext } from "../AuthContext/AuthContext";
import toast from "react-hot-toast";

export const PostContext = createContext();

const PostContextProvider = ({ children }) => {
    const [posts, setPosts] = useState([]);
    const [Allposts, setAllPosts] = useState([]);
    const [loggedInUserPosts, setLoggedInUserPosts] = useState([]);
    const { authUser } = useAuthContext();
    const [singleUserData, setsingleUserData] = useState([]);
    const [TotalLikeDislikeRankAndRatio, setTotalLikeDislikeRankAndRatio] = useState()
    const url = 'http://localhost:5000';

    // Memoize fetchPostList to prevent unnecessary re-renders
    const fetchPostList = useCallback(async (userId) => {
        try {
            const response = await axios.get(`${url}/api/post/listPost`, {
                params: { userId } // Pass the userId as a query parameter
            });
            const sortedPosts = response.data.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            setPosts(sortedPosts);
            // console.log('Fetched posts:', sortedPosts);
        } catch (error) {
            console.error("Error fetching posts:", error);
        }
    }, [url]);

    // Memoize fetchLoggedInUserPostList
    const fetchLoggedInUserPostList = useCallback(async () => {
        if (!authUser?._id) return; // Early return if authUser is not set
        try {
            const response = await axios.get(`${url}/api/post/listlogedInUserPost/${authUser._id}`);
            const sortedPosts = response.data.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            setLoggedInUserPosts(sortedPosts);
            // console.log("Fetched logged-in user posts:", sortedPosts); 
        } catch (error) {
            console.error("Error fetching logged-in user posts:", error);
        }
    }, [authUser, url]);

    // Memoize fetchSingleUserDetailById
    const fetchSingleUserDetailById = useCallback(async (artistId) => {
        if (!artistId) return;
        // console.log("Fetching single user detail by ID:", artistId);
        try {
            const response = await axios.get(`${url}/users/${artistId}`);
            setsingleUserData(response.data);
            // console.log("Fetched single user data:", response.data); 
        } catch (error) {
            console.error("Error fetching single user by ID:", error);
        }
    }, [url]);

    useEffect(() => {
        if (authUser && authUser._id) {
            fetchLoggedInUserPostList();
            // Optionally, fetch posts for the logged-in user or other initial data
        }
    }, [authUser, fetchLoggedInUserPostList]);

    const fetchPostsByName = useCallback(async (postName) => {
        console.log("Fetching posts by name using POST method...");
        try {
            const path = `${url}/api/post/listPostByName`;
            console.log("Request URL:", path);
            const response = await axios.post(path, { postName });
            return { success: true, data: response.data.data };
        } catch (error) {
            console.error("Error fetching posts by name:", error);
            return { success: false, error: "Could not fetch the data" };
        }
    }, [url]);


    const deletePostById = async (id) => {
        try {
            const response = await axios.post(
                `${url}/api/post/deletePostById/${id}`,
                {}, // Empty body
                {
                    withCredentials: true,  // Cookies ko request mein include karne ke liye
                }
            );

            if (response.status === 200) {
                setLoggedInUserPosts((prevPosts) => prevPosts.filter(post => post._id !== id));
                toast.success('Post deleted successfully');
            } else {
                console.error("Failed to delete post");
                toast.error('Failed to delete Post');
            }
        } catch (error) {
            console.error("Error deleting post:", error);
            toast.error('Failed to delete Post');
        }
    };

    const fetchPostLikesDislikesByPostId = async (postId) => {
        try {
            const response = await axios.get(`${url}/posts/getLikesDislikes`, {
                params: { postId }
            });
            setTotalLikeDislikeRankAndRatio(response.data);
        } catch (error) {
            console.error("Error fetching likes and dislikes:", error);
            return { error: "Could not fetch the data" };
        }
    }

    // console.log("TotalLikeDislikeRankAndRatio:", TotalLikeDislikeRankAndRatio);
    

    const contextValue = {
        posts,
        Allposts,
        fetchPostList,
        fetchLoggedInUserPostList,
        loggedInUserPosts,
        url,
        fetchSingleUserDetailById,
        singleUserData,
        fetchPostsByName,
        deletePostById,
        fetchPostLikesDislikesByPostId,
        TotalLikeDislikeRankAndRatio,
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
