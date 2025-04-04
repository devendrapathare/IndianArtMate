import React, { useState, useEffect } from "react";
import "./Search.css";
import { usePostContext } from "../../../person-2/context/PostContext/PostContext";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../../../person-2/context/AuthContext/AuthContext";
import axios from "axios";

const Search = () => {
    const [searchType, setSearchType] = useState("post");
    const [searchTerm, setSearchTerm] = useState("");
    const [results, setResults] = useState([]);
    const [resultsArt, setResultsArt] = useState([]);
    const [error, setError] = useState("");
    const [allPosts, setAllPosts] = useState([]);
    const [allUsers, setAllUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [searchPerformed, setSearchPerformed] = useState(false);
    const [animateResults, setAnimateResults] = useState(false);
    const { fetchPostsByName, url } = usePostContext();
    const navigate = useNavigate();
    const { authUser, fetchUserByName } = useAuthContext();

    // Load all posts and users on component mount for faster searching
    useEffect(() => {
        const fetchAllData = async () => {
            try {
                // Fetch all posts
                const postsResponse = await axios.get(`${url}/api/post/all`);
                if (postsResponse.data.success) {
                    setAllPosts(postsResponse.data.data || []);
                }
                
                // Fetch all users
                const usersResponse = await axios.get(`${url}/users/all`);
                if (usersResponse.data.success) {
                    setAllUsers(usersResponse.data.users || []);
                }
            } catch (error) {
                console.error("Error fetching initial data:", error);
            }
        };
        
        fetchAllData();
    }, [url]);

    // Handle Enter key press in the search input
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    const handleSearch = async () => {
        if (!searchTerm) {
            setError("Please enter a search term");
            return;
        }

        setError("");
        setIsLoading(true);
        setSearchPerformed(true);
        setResults([]);
        setResultsArt([]);
        setAnimateResults(false);

        try {
            if (searchType === "post") {
                // First try the regular API search
                const response = await fetchPostsByName(searchTerm);
                
                if (response?.success && response.data?.length > 0) {
                    setResults(response.data);
                } else {
                    // If API search returns no results, do local fuzzy search
                    const relatedPosts = allPosts.filter(post => 
                        post.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        post.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        post.description?.toLowerCase().includes(searchTerm.toLowerCase())
                    );
                    
                    if (relatedPosts.length > 0) {
                        setResults(relatedPosts);
                    } else {
                        setError("No posts found. Try a different search term.");
                    }
                }
            } else {
                // Artist search 
                const response = await fetchUserByName(searchTerm);
                if (response && response.length > 0) {
                    setResultsArt(response);
                } else {
                    // If API search returns no results, do local fuzzy search
                    const relatedArtists = allUsers.filter(user => 
                        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        user.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        user.address?.toLowerCase().includes(searchTerm.toLowerCase())
                    );
                    
                    if (relatedArtists.length > 0) {
                        setResultsArt(relatedArtists);
                    } else {
                        setError("No artists found matching your search criteria");
                    }
                }
            }
        } catch (error) {
            console.error("Search error:", error);
            setError("An error occurred while searching");
        } finally {
            setIsLoading(false);
            // Trigger animation after search completes
            setTimeout(() => {
                setAnimateResults(true);
            }, 100);
        }
    };

    const GotoPost = (image, category, description, price, title, userId, id) => {
        if (authUser) {
            navigate("/productDes", {
                state: {
                    image: `${url}/images/${image}`,
                    category,
                    description,
                    price,
                    title,
                    userId,
                    id,
                },
            });
        } else {
            alert("Please log in to view post details.");
        }
    };

    const GotoArtistProfile = (artistId) => {
        navigate(`/temp/${artistId}`);
    }

    // Helper function to determine where the search term matched
    const findMatchType = (post, searchTerm) => {
        const searchTermLower = searchTerm.toLowerCase();
        
        if (post.title?.toLowerCase().includes(searchTermLower)) {
            return "Title Match";
        } else if (post.category?.toLowerCase().includes(searchTermLower)) {
            return "Category Match";
        } else if (post.description?.toLowerCase().includes(searchTermLower)) {
            return "Description Match";
        }
        return "Related";
    };

    // Add helper function for artist match determination
    const findArtistMatchType = (artist, searchTerm) => {
        const searchTermLower = searchTerm.toLowerCase();
        
        if (artist.name?.toLowerCase().includes(searchTermLower)) {
            return "Name Match";
        } else if (artist.description?.toLowerCase().includes(searchTermLower)) {
            return "Bio Match";
        } else if (artist.address?.toLowerCase().includes(searchTermLower)) {
            return "Location Match";
        }
        return "Related";
    };

    return (
        <div className="page-container">
            <div className={`search-parent-div ${animateResults ? 'animate-results' : ''}`}>
                <h1 className="search-title">Search</h1>
                
                <div className="search-guide">
                    <div className="search-guide-content">
                        <div className="search-guide-icon">
                            <svg viewBox="0 0 24 24" width="24" height="24">
                                <path fill="#4169e1" d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4M11,16.5L6.5,12L7.91,10.59L11,13.67L16.59,8.09L18,9.5L11,16.5Z" />
                            </svg>
                        </div>
                        <div>
                            <h3>Search Tips</h3>
                            <p>Find artwork and artists on Indian ArtMate. You can search by:</p>
                            <ul className="search-tips-list">
                                <li>Art title or category</li>
                                <li>Artist name or location</li>
                                <li>Description keywords</li>
                            </ul>
                        </div>
                    </div>
                </div>
                
                <div className="search-top">
                    <div className="input-part">
                        <input
                            type="text"
                            placeholder={`Enter ${searchType === "post" ? "artwork" : "artist"} keywords...`}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyPress={handleKeyPress}
                        />
                        <select
                            value={searchType}
                            onChange={(e) => setSearchType(e.target.value)}
                        >
                            <option value="post">Artwork</option>
                            <option value="artist">Artist</option>
                        </select>
                    </div>
                    <button onClick={handleSearch} disabled={isLoading}>
                        {isLoading ? (
                            <span className="loading-spinner"></span>
                        ) : (
                            "Search"
                        )}
                    </button>
                </div>

                {error && <p className="error-message">{error}</p>}

                {isLoading && (
                    <div className="loading-container">
                        <div className="loading-spinner large"></div>
                        <p>Searching for results...</p>
                    </div>
                )}

                {!isLoading && searchPerformed && !error && results.length === 0 && resultsArt.length === 0 && (
                    <div className="no-results">
                        <div className="no-results-icon">
                            <svg viewBox="0 0 24 24" width="48" height="48">
                                <path fill="#dfe6ff" d="M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z" />
                            </svg>
                        </div>
                        <h3>No results found</h3>
                        <p>Try different keywords or change your search type</p>
                    </div>
                )}

                <div className="results-section">
                    {searchType === "post" && results.length > 0 && (
                        <>
                            <div className="results-header">
                                <h2>Search Results</h2>
                                <span className="results-count">{results.length} found</span>
                            </div>
                            <div className="search-result-container-post">
                                {results.map((post) => (
                                    <div key={post._id} className="search-result-post">
                                        {searchTerm && (
                                            <div className="match-indicator">
                                                {findMatchType(post, searchTerm)}
                                            </div>
                                        )}
                                        <img
                                            src={`${url}/images/${post.image}`}
                                            alt={post.title}
                                            onClick={() =>
                                                GotoPost(
                                                    post.image,
                                                    post.category,
                                                    post.description,
                                                    post.price,
                                                    post.title,
                                                    post.userId,
                                                    post._id
                                                )
                                            }
                                        />

                                        <div className="text-bot">
                                            <p className="sam p1">Title: {post.title}</p>
                                            <p className="sam p2">Price: ₹{post.price}</p>
                                            {post.category && (
                                                <div className="category-tag">{post.category}</div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}

                    {searchType === "artist" && resultsArt.length > 0 && (
                        <>
                            <div className="results-header">
                                <h2>Artist Results</h2>
                                <span className="results-count">{resultsArt.length} found</span>
                            </div>
                            <div className="search-result-container-artist">
                                {resultsArt.map((artist) => {
                                    // Determine the correct image path based on the actual data structure
                                    const imagePath = artist.profilePic 
                                        ? artist.profilePic.startsWith("https://") 
                                            ? artist.profilePic 
                                            : `${url}/profilePics${artist.profilePic.split("/profilePic")[1]}`
                                        : artist.image
                                            ? `${url}/images/${artist.image}`
                                            : "https://avatar.iran.liara.run/public/boy?username=Ash";
                                    
                                    return (
                                        <div key={artist._id || artist.id} className="search-result-artist">
                                            {searchTerm && (
                                                <div className="match-indicator">
                                                    {findArtistMatchType(artist, searchTerm)}
                                                </div>
                                            )}
                                            <img
                                                src={imagePath}
                                                alt={artist.name || artist.userName}
                                                onClick={() => GotoArtistProfile(artist._id)}
                                            />
                                            <div className="text-bot">
                                                <p className="sam p1">Name: {artist.name || artist.userName}</p>
                                                {(artist.address || artist.location) && (
                                                    <div className="category-tag">{artist.address || artist.location}</div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Search;
