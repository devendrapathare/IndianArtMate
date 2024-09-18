import React, { useRef, useState, useEffect, useContext } from 'react';
import './UploadPost.css';
import { useAuthContext } from '../../context/AuthContext/AuthContext';
import axios from 'axios'
import toast from 'react-hot-toast'
import { usePostContext } from '../../context/PostContext/PostContext'

const UploadPost = () => {
    const [image, setImage] = useState(null);
    const [data, setData] = useState({
        title: '',
        description: '',
        category: 'Painting',
        price: '',
        userId: '' // Add userId to the data state
    });
    

    const fileInputRef = useRef(null);
    const { authUser } = useAuthContext();

    const { fetchPostList,posts } = usePostContext(); 
    console.log("post",posts);
    

    useEffect(() => {
        if (authUser && authUser._id) {
            setData(prevData => ({ ...prevData, userId: authUser._id }));
        }
    }, [authUser]);


    const handleTextClick = () => {
        fileInputRef.current.click();
    };

    const onChangeHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setData(prevData => ({ ...prevData, [name]: value }));
    };


    const handleSubmit = async (event) => {

        try {
            console.log("Submitting data:", data,image);
            const formData = new FormData();
            formData.append('image', image);
            formData.append('title', data.title);
            formData.append('description', data.description);
            formData.append('category', data.category);
            formData.append('price', Number(data.price));
            formData.append('userId', data.userId); 
            const response = await axios.post('/api/post/uploadPost',formData)
            if(response.data.success){
                setdata({
                    // image: image,
                    title: '',
                    description: '',
                    category: 'Painting',
                    price: '',
                    userId: ''
                })               
                setImage(false)
                toast.success(response.data.message)
                fetchPostList()
              }
              else{
                toast.error(response.data.message)
              }
        } catch (error) {
            console.error("Error submitting data:", error);
        }
    };
    // console.log("data",image);
    
    
    
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
                        />
                    </div>
                    <button onClick={handleTextClick} >Click Here to Upload</button>
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
                        />
                    </div>
                    <div className="add-product-description flex-col">
                        <p>Art Description</p>
                        <textarea 
                        name="description" 
                        rows='6' 
                        placeholder='Write Content here' 
                        required
                        onChange={onChangeHandler}
                        ></textarea>
                    </div>
                    <div className="add-category-price">
                        <div className="add-category flex-col">
                            <p>Art Category</p>
                            <select onChange={onChangeHandler} name="category">
                                <option value="Painting">Painting</option>
                                <option value="Sculpture">Sculpture</option>
                                <option value="Textile Arts">Textile Arts</option>
                                <option value="Crafts">Crafts</option>
                                <option value="Jewelry Making">Jewelry Making</option>
                                <option value="Papercraft">Papercraft</option>
                                <option value="Ceramics">Ceramics</option>
                                <option value="Textile Printing">Textile Printing</option>
                            </select>

                        </div>
                        <div className="add-price flex-col">
                            <p>Art Price</p>
                            <input 
                            type="Number" 
                            name="price" 
                            placeholder='Enter Amount' 
                            onChange={onChangeHandler}
                            />
                        </div>
                    </div>
                    <button  type='submit' className='add-button'>Share</button>
                </div>
            </form>

        </div>
    )
}

export default UploadPost
