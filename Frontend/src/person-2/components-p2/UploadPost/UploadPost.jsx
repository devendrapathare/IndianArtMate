import React, { useRef, useState, useEffect } from 'react';
import './UploadPost.css';
import { useAuthContext } from '../../context/AuthContext/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import { usePostContext } from '../../context/PostContext/PostContext';
import { Switch } from '@mui/material';
// Import icons from our consolidated file
import {
  ImageIcon,
  CloudUploadIcon,
  InfoIcon,
  CheckCircleIcon,
  TitleIcon,
  DescriptionIcon,
  CategoryIcon,
  PriceCheckIcon,
  GavelIcon,
  TimerIcon
} from './UploadIcons';
import { useNavigate, useLocation } from 'react-router-dom';
import { CheckCircle } from "@mui/icons-material";

const UploadPost = () => {
    const [image, setImage] = useState(null);
    const [data, setData] = useState({
        title: '',
        description: '',
        category: 'Painting',
        price: '',
        userId: '',
        duration: 24
    });
    const [isBiddingActive, setIsBiddingActive] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [imagePreview, setImagePreview] = useState(null);
    const [uploadSuccess, setUploadSuccess] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [redirectCount, setRedirectCount] = useState(3);
    const fileInputRef = useRef(null);
    const { authUser } = useAuthContext();
    const { fetchPostList, fetchLoggedInUserPostList, url } = usePostContext();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (authUser && authUser._id) {
            setData(prevData => ({ ...prevData, userId: authUser._id }));
        }
    }, [authUser]);

    // Redirect countdown timer
    useEffect(() => {
        let timer;
        if (uploadSuccess && redirectCount > 0) {
            timer = setTimeout(() => {
                setRedirectCount(prev => prev - 1);
            }, 1000);
        } else if (uploadSuccess && redirectCount === 0) {
            // Navigate to profile page with a hash to scroll to posts
            navigate('/ProfilePage');
        }
        return () => clearTimeout(timer);
    }, [uploadSuccess, redirectCount, navigate]);

    // Handle automatic scrolling when redirected to profile with #posts
    const ensureScroll = () => {
        if (location.hash === '/ProfilePage') {
            // Add a small delay to ensure the DOM has updated
            setTimeout(() => {
                const postsElement = document.getElementById('posts');
                if (postsElement) {
                    postsElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                } else {
                    // Fallback to scroll to a reasonable position if element not found
                    window.scrollTo({
                        top: document.querySelector('.profile-feed')?.offsetTop || 400,
                        behavior: 'smooth'
                    });
                }
            }, 500);
        }
    };

    // Call ensureScroll when component mounts or location changes
    useEffect(() => {
        ensureScroll();
    }, [location]);

    const handleToggleChange = () => {
        setIsBiddingActive(prev => !prev);
    };

    const handleTextClick = () => {
        fileInputRef.current.click();
    };

    const onChangeHandler = (event) => {
        const { name, value } = event.target;
        let updatedValue = value;

        if (name === 'price' || name === 'duration') {
            updatedValue = Number(value);
        }

        setData(prevData => ({ ...prevData, [name]: updatedValue }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 10 * 1024 * 1024) {
                toast.error('Image size exceeds 10MB limit.');
                return;
            }
            
            setImage(file);
            const previewUrl = URL.createObjectURL(file);
            setImagePreview(previewUrl);
            
            // Show success toast
            toast.success('Image selected successfully!', {
                icon: '🖼️',
                style: {
                    borderRadius: '10px',
                    background: 'rgb(255, 249, 215)',
                    color: 'rgb(123, 157, 224)',
                }
            });
        }
    };

    useEffect(() => {
        return () => {
            if (imagePreview) {
                URL.revokeObjectURL(imagePreview);
            }
        };
    }, [imagePreview]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsSubmitting(true);
        try {
            if (!image) {
                toast.error('Please upload an image.');
                setIsSubmitting(false);
                return;
            }
    
            const formData = new FormData();
            formData.append('image', image);
            formData.append('title', data.title);
            formData.append('description', data.description);
            formData.append('category', data.category);
            formData.append('price', Number(data.price));
            formData.append('userId', data.userId);
            formData.append('duration', Number(data.duration)); 
    
            // Show loading toast
            const loadingToast = toast.loading('Uploading your artwork...', {
                style: {
                    borderRadius: '10px',
                    background: 'rgb(255, 249, 215)',
                    color: 'rgb(123, 157, 224)',
                }
            });
            
            const uploadResponse = await axios.post(`${url}/api/post/uploadPost`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
    
            toast.dismiss(loadingToast);
            
            if (uploadResponse.data.success) {
                await fetchLoggedInUserPostList();
                
                let successMsg = "Artwork uploaded successfully!";
                setSuccessMessage(successMsg);
                
                toast.success(successMsg, {
                    icon: '🎨',
                    duration: 5000,
                    style: {
                        borderRadius: '10px',
                        background: 'rgb(255, 249, 215)',
                        color: 'rgb(123, 157, 224)',
                    }
                });
    
                if (isBiddingActive) {
                    const respectorsResponse = await axios.get(`${url}/users/${authUser._id}`);
                    if (respectorsResponse.data.success) {
                        const respectors = respectorsResponse.data.user.respectors;
    
                        if (!Array.isArray(respectors)) {
                            toast.error('Respectors data is invalid.');
                            setIsSubmitting(false);
                            return;
                        }
    
                        const biddingData = {
                            postId: uploadResponse.data.postId,
                            startingPrice: Number(data.price),
                            duration: Number(data.duration),
                            respectors: respectors
                        };
    
                        const biddingResponse = await axios.post(`${url}/api/bidding/start`, biddingData, {
                            headers: { 'Content-Type': 'application/json' }
                        });
    
                        if (biddingResponse.data.success) {
                            toast.success(biddingResponse.data.message, {
                                icon: '🔨',
                                style: {
                                    borderRadius: '10px',
                                    background: 'rgb(255, 249, 215)',
                                    color: 'rgb(123, 157, 224)',
                                }
                            });
                            
                            setSuccessMessage("Artwork uploaded and auction started!");
                        } else {
                            toast.error(biddingResponse.data.message);
                        }
                    } else {
                        toast.error('Failed to fetch respectors.');
                    }
                }
                
                // Show success state
                setUploadSuccess(true);
                
            } else {
                toast.error(uploadResponse.data.error || "Something went wrong");
            }
        } catch (error) {
            console.error("Error submitting data:", error);
            
            if (error.response && error.response.data && error.response.data.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error('Something went wrong while submitting the post.');
            }
        } finally {
            setIsSubmitting(false);
        } 
    };
    
    if (uploadSuccess) {
        return (
            <div className='upload-post-page'>
                <div className='upload-post-container'>
                    <div className="upload-post-header">
                        <h1>Upload Successful!</h1>
                        <p>Your artwork has been shared with the community</p>
                    </div>
                    <div className="upload-success">
                        <div className="success-icon">
                            <CheckCircle sx={{ fontSize: 70, color: "rgb(123, 157, 224)" }} />
                        </div>
                        <h2>{successMessage}</h2>
                        <p>Your artistic contribution is now available for everyone to appreciate.</p>
                        <p className="success-redirect">Redirecting to your posts in {redirectCount} seconds...</p>
                        <button
                            className="view-posts-button"
                            onClick={() => navigate('/ProfilePage')}
                        >
                            View My Posts Now
                        </button>
                    </div>
                </div>
            </div>
        );
    }
    
    return (
        <div className='upload-post-page'>
            <div className='upload-post-container'>
                <div className="upload-post-header">
                    <h1>Upload Your Artwork</h1>
                    <p>Share your creative work with the community</p>
                </div>
                
                <form className='upload-post-form' onSubmit={handleSubmit}>
                    <div className="upload-post-layout">
                        <div className="upload-left-section">
                            <div className="upload-image-container">
                                {imagePreview ? (
                                    <img 
                                        src={imagePreview} 
                                        alt="Artwork preview" 
                                        className="artwork-preview"
                                    />
                                ) : (
                                    <div className="upload-placeholder">
                                        <ImageIcon style={{ fontSize: 64, color: 'rgb(123, 157, 224)', opacity: 0.7 }} />
                                        <p>No image selected</p>
                                    </div>
                                )}
                                <input
                                    ref={fileInputRef}
                                    onChange={handleImageChange}
                                    type="file"
                                    hidden
                                    accept="image/*"
                                />
                            </div>
                            <button 
                                type="button" 
                                onClick={handleTextClick}
                                className="upload-image-button"
                            >
                                <CloudUploadIcon /> 
                                Select Image
                            </button>
                            
                            <div className="upload-tips">
                                <InfoIcon style={{ fontSize: 20, marginRight: 8 }} />
                                <div>
                                    <h4>Upload Tips</h4>
                                    <ul>
                                        <li>Use high-quality images</li>
                                        <li>Recommended resolution: 1200×1200px</li>
                                        <li>Maximum file size: 10MB</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        
                        <div className="upload-right-section">
                            <div className="form-field">
                                <label>
                                    <TitleIcon style={{ fontSize: 18, marginRight: 8, verticalAlign: 'middle' }} />
                                    Artwork Title
                                </label>
                                <input 
                                    type="text" 
                                    name="title" 
                                    placeholder="Enter your artwork title" 
                                    value={data.title} 
                                    onChange={onChangeHandler}
                                    required 
                                />
                            </div>
                            
                            <div className="form-field">
                                <label>
                                    <DescriptionIcon style={{ fontSize: 18, marginRight: 8, verticalAlign: 'middle' }} />
                                    Description
                                </label>
                                <textarea 
                                    name="description" 
                                    placeholder="Describe your artwork" 
                                    value={data.description} 
                                    onChange={onChangeHandler}
                                    rows="4"
                                    required
                                ></textarea>
                            </div>
                            
                            <div className="form-row">
                                <div className="form-field">
                                    <label>
                                        <CategoryIcon style={{ fontSize: 18, marginRight: 8, verticalAlign: 'middle' }} />
                                        Category
                                    </label>
                                    <select 
                                        name="category" 
                                        value={data.category} 
                                        onChange={onChangeHandler}
                                    >
                                        <option value="Painting">Painting</option>
                                        <option value="Sketch">Sketch</option>
                                        <option value="Digital Art">Digital Art</option>
                                    </select>
                                </div>
                                
                                <div className="form-field">
                                    <label>
                                        <PriceCheckIcon style={{ fontSize: 18, marginRight: 8, verticalAlign: 'middle' }} />
                                        Price (₹)
                                    </label>
                                    <input 
                                        type="number" 
                                        name="price" 
                                        placeholder="Set your price" 
                                        value={data.price} 
                                        onChange={onChangeHandler}
                                        min="0" 
                                        required 
                                    />
                                </div>
                            </div>
                            
                            <div className="form-field bidding-toggle">
                                <label>
                                    <GavelIcon style={{ fontSize: 18, marginRight: 8, verticalAlign: 'middle' }} />
                                    Enable Auction
                                </label>
                                <div className="toggle-container">
                                    <Switch 
                                        checked={isBiddingActive} 
                                        onChange={handleToggleChange}
                                        color="primary"
                                    />
                                    <span>{isBiddingActive ? 'Auction Enabled' : 'Auction Disabled'}</span>
                                </div>
                            </div>
                            
                            {isBiddingActive && (
                                <div className="form-field auction-duration">
                                    <label>
                                        <TimerIcon style={{ fontSize: 18, marginRight: 8, verticalAlign: 'middle' }} />
                                        Auction Duration (Hours)
                                    </label>
                                    <input 
                                        type="number" 
                                        name="duration" 
                                        placeholder="Enter duration in hours" 
                                        value={data.duration} 
                                        onChange={onChangeHandler}
                                        min="1" 
                                        required 
                                    />
                                </div>
                            )}
                            
                            <button 
                                type="submit" 
                                className="submit-button" 
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Uploading...' : 'Share Artwork'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UploadPost;
