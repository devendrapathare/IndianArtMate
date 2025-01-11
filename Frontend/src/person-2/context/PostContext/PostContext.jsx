// import { createContext, useContext, useEffect, useState } from "react";
// import axios from 'axios';
// import { useAuthContext } from "../AuthContext/AuthContext";

// export const PostContext = createContext();

// const PostContextProvider = ({ children }) => {
//     const [posts, setPosts] = useState([]);
//     const [loggedInUserPosts, setLoggedInUserPosts] = useState([]);
//     const { authUser } = useAuthContext();
//     const [singleUserData, setsingleUserData] = useState([])
//     const url = 'http://localhost:5000';
    
    
//     const fetchPostList = async (userId) => {
//         // if(authUser){

//             try {
//                 const response = await axios.get('/api/post/listPost', {
//                     params: { userId } // Pass the userId as a query parameter
//                 });
//                 const sortedPosts = response.data.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
//                 setPosts(sortedPosts);
//                 // console.log('fetchpostlist',sortedPosts);
//             } catch (error) {
//                 console.error("Error fetching posts:", error);
//             }
//         // };
//         }

//     const fetchLoggedInUserPostList = async () => {
//         if (!authUser?._id) return; // Early return if authUser is not set
//         try {
//             const response = await axios.get(`${url}/api/post/listlogedInUserPost/${authUser._id}`);
//             const sortedPosts = response.data.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
//             setLoggedInUserPosts(sortedPosts);
//             // console.log("Fetched logged-in user posts:", sortedPosts); 
//         } catch (error) {
//             console.error("Error fetching logged-in user posts:", error);
//         }
//     };

//     const fetchSingleUserDetailById = async (artistId) => {
//         console.log("fetchSingleUserDetailById:", artistId);
//         try {
//             const response = await axios.get(`${url}/users/${artistId}`);
//             // console.log("Full response:", response.data);
//             setsingleUserData(response.data); 
    
//             // console.log("Fetched single user data:", response.data); 
//         } catch (error) {
//             console.error("Error Fetching Single user by Id:", error);
//         }
//     };
    

    
//     useEffect(() => {
//         fetchPostList();  
//         fetchLoggedInUserPostList();
//         fetchSingleUserDetailById;
//     }, [authUser]);

//     const contextValue = {
//         posts,
//         fetchPostList,
//         fetchLoggedInUserPostList,
//         loggedInUserPosts,
//         url,
//         fetchSingleUserDetailById,
//         singleUserData,
//     };

//     return (
//         <PostContext.Provider value={contextValue}>
//             {children}
//         </PostContext.Provider>
//     );
// };

// // Custom hook to use the PostContext
// export const usePostContext = () => {
//     return useContext(PostContext);
// };

// export default PostContextProvider;



import { createContext, useContext, useEffect, useState, useCallback } from "react";
import axios from 'axios';
import { useAuthContext } from "../AuthContext/AuthContext";

export const PostContext = createContext();

const PostContextProvider = ({ children }) => {
    const [posts, setPosts] = useState([]);
    const [Allposts, setAllPosts] = useState([]);
    const [loggedInUserPosts, setLoggedInUserPosts] = useState([]);
    const { authUser } = useAuthContext();
    const [singleUserData, setsingleUserData] = useState([]);
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
        console.log("Fetching single user detail by ID:", artistId);
        try {
            const response = await axios.get(`${url}/users/${artistId}`);
            setsingleUserData(response.data); 
            console.log("Fetched single user data:", response.data); 
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
            const sortedPosts = response.data.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            console.log("Fetched posts by name:", sortedPosts);
            return { success: true, data: sortedPosts };
        } catch (error) {
            console.error("Error fetching posts by name:", error);
            return { success: false, error:"Could not fetch the data" };
        }
    }, [url]);
    


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
