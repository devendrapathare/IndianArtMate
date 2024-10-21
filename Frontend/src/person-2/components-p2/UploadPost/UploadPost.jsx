import React, { useRef, useState, useEffect } from 'react';
import './UploadPost.css';
import { useAuthContext } from '../../context/AuthContext/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import { usePostContext } from '../../context/PostContext/PostContext';
// import { useNavigate } from 'react-router-dom';


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
    // const navigate = useNavigate();


    const fileInputRef = useRef(null);
    const { authUser } = useAuthContext();
    const { fetchPostList, fetchLoggedInUserPostList, url } = usePostContext(); 

    // const NavigationForPosts = (isOwner,userId) => {
    //     // console.log("userId:", userId);
    //     navigate(`/myFeed/${isOwner}/${userId}`);
    //   };
    

    useEffect(() => {
        if (authUser && authUser._id) {
            setData(prevData => ({ ...prevData, userId: authUser._id }));
        }
    }, [authUser]);

    const handleToggleChange = () => {
        setIsBiddingActive(prev => !prev);
    };

    const handleTextClick = () => {
        fileInputRef.current.click();
    };

    const onChangeHandler = (event) => {
        const { name, value } = event.target;
        let updatedValue = value;

        if(name === 'price' || name === 'duration'){
            updatedValue = Number(value);
        }

        setData(prevData => ({ ...prevData, [name]: updatedValue }));
    };

    useEffect(() => {
        return () => {
            if (image) {
                URL.revokeObjectURL(image);
            }
        };
    }, [image]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsSubmitting(true);
        try {
            console.log("Submitting data:", data, image, isBiddingActive);
    
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
            formData.append('duration', Number(data.duration)); // Include duration
    
            const uploadResponse = await axios.post(`${url}/api/post/uploadPost`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
    
            if(uploadResponse.data.success){
                
                await fetchLoggedInUserPostList();  
                // NavigationForPosts(true,authUser._id)
    
                if(isBiddingActive){
                    const respectorsResponse = await axios.get(`http://localhost:5000/users/${authUser._id}`);
                    if(respectorsResponse.data.success){
                        const respectors = respectorsResponse.data.user.respectors; 
                        
                        if(!Array.isArray(respectors)){
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
    
                        const biddingResponse = await axios.post('http://localhost:5000/api/bidding/start', biddingData, {
                            headers: {
                                'Content-Type': 'application/json'
                            }
                        });
    
                        if(biddingResponse.data.success){
                            toast.success(biddingResponse.data.message);
                        } else {
                            toast.error(biddingResponse.data.message);
                        }
                    } else {
                        toast.error('Failed to fetch respectors.');
                    }
                }
            } else {
                toast.error(uploadResponse.data.error);
            }
            window.location.reload();
        } catch (error) {
            console.error("Error submitting data:", error);
            toast.error('An error occurred while uploading the post.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className='UploadPost-container'>
            <form onSubmit={handleSubmit}>
                <div className="header">
                    <p>Upload Your Post</p>
                </div>

                <div className="add-image-upload">
                    <p>Upload Image</p>
                    <div className="img-contain">
                        {image && (
                            <img src={URL.createObjectURL(image)} alt="Preview" />
                        )}
                        <input
                            ref={fileInputRef}
                            onChange={(e) => setImage(e.target.files[0])}
                            type="file"
                            id="image"
                            hidden
                            required
                            accept="image/*"
                        />
                    </div>
                    <button type="button" onClick={handleTextClick} >Click Here to Upload</button>
                </div>

                <div className="information-fields">
                    <div className="add-product-name flex-col">
                        <p>Art Name</p>
                        <input 
                            type="text"
                            name="title" 
                            placeholder='Type Here'
                            onChange={onChangeHandler}
                            value={data.title}
                            required
                        />
                    </div>
                    <div className="add-product-description flex-col">
                        <p>Art Description</p>
                        <textarea 
                            name="description" 
                            rows='3' 
                            placeholder='Write Content here' 
                            required
                            onChange={onChangeHandler}
                            value={data.description}
                        ></textarea>
                    </div>

                    {/* Duration Input */}
                    <div className="add-duration flex-col">
                        <p>Auction Duration (Hours)</p>
                        <input 
                            type="number" 
                            name="duration" 
                            placeholder='Enter Duration in Hours' 
                            onChange={onChangeHandler}
                            value={data.duration}
                            min="1"
                            required
                        />
                    </div>

                    <div className="add-category-price">
                        <div className="add-category flex-col">
                            <p>Art Category</p>
                            <select onChange={onChangeHandler} name="category" value={data.category}>
                                <option value="Painting">Painting</option>
                                <option value="Handlooms">Handlooms</option>
                                <option value="HandCrafts">HandCrafts</option>
                            </select>
                        </div>
                        <div className="add-price flex-col">
                            <p>Art Price (₹)</p>
                            <input 
                                type="number" 
                                name="price" 
                                placeholder='Enter Amount' 
                                onChange={onChangeHandler}
                                value={data.price}
                                min="0"
                                required
                            />
                        </div>
                    </div>
                    
                    {/* Toggle for starting bidding */}
                    <div className="start-bidding-toggle flex-col">
                        <label className="toggle-label">
                            <input 
                                type="checkbox" 
                                checked={isBiddingActive}
                                onChange={handleToggleChange}
                            />
                            Start Bidding
                        </label>
                    </div>

                    <button type='submit' className='add-button' disabled={isSubmitting}>
                        {isSubmitting ? 'Submitting...' : 'Share'}
                    </button>
                </div>
            </form>
        </div>
    )
}

export default UploadPost;
