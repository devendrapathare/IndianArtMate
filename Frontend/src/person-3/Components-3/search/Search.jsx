import React, { useState } from "react";
import "./Search.css";
import { usePostContext } from "../../../person-2/context/PostContext/PostContext";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../../../person-2/context/AuthContext/AuthContext";

const Search = () => {
    const [searchType, setSearchType] = useState("post"); // State for search type
    const [searchTerm, setSearchTerm] = useState("");
    const [results, setResults] = useState([]); // Initialize as an empty array
    const [resultsArt, setResultsArt] = useState([]); // Initialize as an empty array
    const [error, setError] = useState("");
    const { fetchPostsByName, url } = usePostContext();
    const navigate = useNavigate();
    const { authUser, fetchUserByName } = useAuthContext();

    const handleSearch = async () => {
        setError("");
        setResults([]);
        setResultsArt([]);
        if (!searchTerm.trim()) {
            setError("Please enter a name to search.");
            return;
        }

        try {
            if (searchType === "post") {
                const response = await fetchPostsByName(searchTerm);
                console.log("Post Search Response:", response);
                if (response?.success) {
                    setResults(response.data || []);
                    if (response.data?.length === 0) setError("No posts found.");
                } else {
                    setError("No posts found.");
                }
            } else if (searchType === "artist") {
                const response = await fetchUserByName(searchTerm);
                console.log("Artist Search Response:", response);
                if (response?.length) {
                    setResultsArt(response);
                } else {
                    setError("No artists found.");
                }
            }
        } catch (err) {
            console.error("Error during search:", err);
            setError("An error occurred while performing the search.");
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

    return (
        <div className="page-container">
            <div className="search-parent-div">
                <h1 className="search-title">Search</h1>
                
                <div className="search-guide">
                    <p>Find artwork and artists on Indian ArtMate. Select your search type and enter keywords to discover traditional art and talented artists.</p>
                </div>
                
                <div className="search-top">
                    <div className="input-part">
                        <input
                            type="text"
                            placeholder={`Enter ${searchType === "post" ? "post" : "artist"} name`}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <select
                            value={searchType}
                            onChange={(e) => setSearchType(e.target.value)}
                        >
                            <option value="post">Search by Post</option>
                            <option value="artist">Search by Artist</option>
                        </select>
                    </div>
                    <button onClick={handleSearch}>Search</button>
                </div>

                {error && <p className="error-message">{error}</p>}

                {!error && !results.length && !resultsArt.length && searchTerm && (
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
                        <div className="search-result-container-post">
                            {results.map((post) => (
                                <div key={post._id} className="search-result-post">
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
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {searchType === "artist" && resultsArt.length > 0 && (
                        <div className="search-result-container-artist">
                            {resultsArt.map((artist) => {
                                const path = artist.profilePic.startsWith("https://avatar.iran.liara.run/public/")
                                    ? artist.profilePic
                                    : `${url}/profilePics${artist.profilePic.split("/profilePic")[1]}`;
                                return (
                                    <div
                                        className="search-result-artist"
                                        key={artist.id}
                                        onClick={() => GotoArtistProfile(artist._id)}
                                    >
                                        <div>
                                            <img src={path} alt={artist.userName} />
                                        </div>
                                        <div>
                                            <p>{artist.userName}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            <footer className="site-footer">
                <div className="footer-container">
                    <div className="footer-section">
                        <h3>IndianArtMate</h3>
                        <p>Connecting Indian artists with art lovers worldwide.</p>
                    </div>
                    
                    <div className="footer-section">
                        <h3>Quick Links</h3>
                        <ul>
                            <li><a href="#">About Us</a></li>
                            <li><a href="#">Artists</a></li>
                            <li><a href="#">Auctions</a></li>
                            <li><a href="#">Blog</a></li>
                        </ul>
                    </div>
                    
                    <div className="footer-section">
                        <h3>Support</h3>
                        <ul>
                            <li><a href="#">Help Center</a></li>
                            <li><a href="#">Terms of Service</a></li>
                            <li><a href="#">Privacy Policy</a></li>
                            <li><a href="#">Contact Us</a></li>
                        </ul>
                    </div>
                    
                    <div className="footer-section">
                        <h3>Connect With Us</h3>
                        <div className="social-icons">
                            <a href="#" className="social-icon">
                                <svg viewBox="0 0 24 24" width="24" height="24">
                                    <path fill="#dfe6ff" d="M12 2.04C6.5 2.04 2 6.53 2 12.06C2 17.06 5.66 21.21 10.44 21.96V14.96H7.9V12.06H10.44V9.85C10.44 7.34 11.93 5.96 14.22 5.96C15.31 5.96 16.45 6.15 16.45 6.15V8.62H15.19C13.95 8.62 13.56 9.39 13.56 10.18V12.06H16.34L15.89 14.96H13.56V21.96A10 10 0 0 0 22 12.06C22 6.53 17.5 2.04 12 2.04Z" />
                                </svg>
                            </a>
                            <a href="#" className="social-icon">
                                <svg viewBox="0 0 24 24" width="24" height="24">
                                    <path fill="#dfe6ff" d="M22.46,6C21.69,6.35 20.86,6.58 20,6.69C20.88,6.16 21.56,5.32 21.88,4.31C21.05,4.81 20.13,5.16 19.16,5.36C18.37,4.5 17.26,4 16,4C13.65,4 11.73,5.92 11.73,8.29C11.73,8.63 11.77,8.96 11.84,9.27C8.28,9.09 5.11,7.38 3,4.79C2.63,5.42 2.42,6.16 2.42,6.94C2.42,8.43 3.17,9.75 4.33,10.5C3.62,10.5 2.96,10.3 2.38,10C2.38,10 2.38,10 2.38,10.03C2.38,12.11 3.86,13.85 5.82,14.24C5.46,14.34 5.08,14.39 4.69,14.39C4.42,14.39 4.15,14.36 3.89,14.31C4.43,16 6,17.26 7.89,17.29C6.43,18.45 4.58,19.13 2.56,19.13C2.22,19.13 1.88,19.11 1.54,19.07C3.44,20.29 5.7,21 8.12,21C16,21 20.33,14.46 20.33,8.79C20.33,8.6 20.33,8.42 20.32,8.23C21.16,7.63 21.88,6.87 22.46,6Z" />
                                </svg>
                            </a>
                            <a href="#" className="social-icon">
                                <svg viewBox="0 0 24 24" width="24" height="24">
                                    <path fill="#dfe6ff" d="M7.8,2H16.2C19.4,2 22,4.6 22,7.8V16.2A5.8,5.8 0 0,1 16.2,22H7.8C4.6,22 2,19.4 2,16.2V7.8A5.8,5.8 0 0,1 7.8,2M7.6,4A3.6,3.6 0 0,0 4,7.6V16.4C4,18.39 5.61,20 7.6,20H16.4A3.6,3.6 0 0,0 20,16.4V7.6C20,5.61 18.39,4 16.4,4H7.6M17.25,5.5A1.25,1.25 0 0,1 18.5,6.75A1.25,1.25 0 0,1 17.25,8A1.25,1.25 0 0,1 16,6.75A1.25,1.25 0 0,1 17.25,5.5M12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9Z" />
                                </svg>
                            </a>
                            <a href="#" className="social-icon">
                                <svg viewBox="0 0 24 24" width="24" height="24">
                                    <path fill="#dfe6ff" d="M19,3A2,2 0 0,1 21,5V19A2,2 0 0,1 19,21H5A2,2 0 0,1 3,19V5A2,2 0 0,1 5,3H19M18.5,18.5V13.2A3.26,3.26 0 0,0 15.24,9.94C14.39,9.94 13.4,10.46 12.92,11.24V10.13H10.13V18.5H12.92V13.57C12.92,12.8 13.54,12.17 14.31,12.17A1.4,1.4 0 0,1 15.71,13.57V18.5H18.5M6.88,8.56A1.68,1.68 0 0,0 8.56,6.88C8.56,5.95 7.81,5.19 6.88,5.19A1.69,1.69 0 0,0 5.19,6.88C5.19,7.81 5.95,8.56 6.88,8.56M8.27,18.5V10.13H5.5V18.5H8.27Z" />
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>
                <div className="footer-bottom">
                    <p>© 2024 IndianArtMate. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};

export default Search;
