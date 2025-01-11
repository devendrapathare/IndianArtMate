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

    const GotoArtistProfile = (artistId)=>{
        navigate(`/temp/${artistId}`);
    }

    return (
        <div className="search-parent-div">
            <h2>Search</h2>
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

            {error && <p style={{ color: "red" }}>{error}</p>}

            {(results.length > 0 || resultsArt.length > 0) && (
                <div className="search-result-container">
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
            )}
        </div>
    );
};

export default Search;
