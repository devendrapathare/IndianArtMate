import React, { useState, useEffect } from 'react'
import './TopArtistProfileDisplay.css'
import TopArtistProfile from '../../Profile/TopArtistProfile/TopArtistProfile'

const TopArtistProfileDisplay = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [artists, setArtists] = useState([]);

    useEffect(() => {
        const fetchArtists = async () => {
            try {
                setLoading(true);
                // Replace this with your actual API call
                // const response = await fetch('/api/artists');
                // const data = await response.json();
                // setArtists(data);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching artists:', err);
                setError(true);
                setLoading(false);
            }
        };

        fetchArtists();
    }, []);

    return (
        <div className='TopArtistProfileDisplay-container'>
            <div className="TopArtistProfileDisplay-header">
                <p>More Artists Profile</p>
            </div>
            <div className="mapping">
                {loading ? (
                    <div className="loading">Loading artists...</div>
                ) : error ? (
                    <div className="error-message">
                        Error fetching data. Please try again later.
                    </div>
                ) : (
                    <TopArtistProfile />
                )}
            </div>
        </div>
    )
}

export default TopArtistProfileDisplay
