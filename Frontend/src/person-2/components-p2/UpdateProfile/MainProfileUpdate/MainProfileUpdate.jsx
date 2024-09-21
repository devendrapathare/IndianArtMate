import React, { useEffect, useState } from 'react';
import './MainProfileUpdate.css';
import { useAuthContext } from '../../../../person-2/context/AuthContext/AuthContext'; 
import axios from 'axios';  
import { useNavigate } from 'react-router-dom';
// import somthing from ''


const MainProfileUpdate = () => {
  const { authUser } = useAuthContext();
  const userId = authUser?._id; 
  const [user, setUser] = useState({}); 
  const navigate = useNavigate();

  // = () => {
  //     navigate('../UpdateProfile');
  // };

  const [formData, setFormData] = useState({
    userName: '',
    bio: '',
    email: '',
    addressLine1: '',  
    addressLine2: '',
    profile_type: '',  
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/users/${userId}`);
        const userData = response.data;
        setUser(userData); 
        setFormData({
          userName: userData.userName || '',
          bio: userData.bio || '',
          email: userData.email || '',
          addressLine1: userData.addressLine1 || '',
          addressLine2: userData.addressLine2 || '',
          profile_type: userData.profile_type || '',  // Fetching profile_type from API
        });
      } catch (e) {
        console.log("Error fetching data:", e);
      }
    };
    fetchData();
  }, [userId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // If fields are empty, use the original user data fetched from the API
    const updatedData = {
      userName: formData.userName || user.userName,
      bio: formData.bio || user.bio,
      email: formData.email || user.email,
      addressLine1: formData.addressLine1 || user.addressLine1,
      addressLine2: formData.addressLine2 || user.addressLine2,
      profile_type: formData.profile_type || user.profile_type,  // Include profile_type
    };

    try {
      const response = await axios.put(`http://localhost:5000/profile/update/${userId}`, updatedData);
      alert('Profile updated successfully!');
      console.log("Updated data:", response.data);
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile.');
    }
  };

  return (
    <div className='MainProfileUpdate-container'>
      <div className="MainProfileUpdate-header">
        Update Details Here
      </div>
      <form className='address-detail-container' onSubmit={handleSubmit}>
        <div className="name-update">
          <span>Name:</span>
          <input 
            type="text" 
            name="userName" 
            value={formData.userName} 
            onChange={handleChange} 
            placeholder="Enter your name" 
            required 
          />
        </div>

        <div className="bio-update">
          <span>Bio:</span>
          <textarea 
            name="bio" 
            value={formData.bio} 
            onChange={handleChange} 
            placeholder="Enter your bio"
          ></textarea>
        </div>

        <div className="email-update">
          <span>Email:</span>
          <input 
            type="email" 
            name="email" 
            value={formData.email} 
            onChange={handleChange} 
            placeholder="Enter your email" 
            required 
          />
        </div>
        <div className="profile-type-update">
          <span>Profile Type:</span>
          <select 
            name="profile_type" 
            value={formData.profile_type} 
            onChange={handleChange} 
            required
          >
            <option value="">Select a profile type</option>
            <option value="Painting">Painter</option>
            <option value="Handlooms">Handloom Artiest</option>
            <option value="Handcrafts">Handcraft Artiest</option>
          </select>
        </div>

        <div className="update-address">
          <span>Address:</span>
          <div className="address-differentiate">
            <div className="address-line">
              <span>Address Line 1:</span>
              <input 
                type="text" 
                name="addressLine1" 
                value={formData.addressLine1} 
                onChange={handleChange} 
                placeholder="Enter address line 1" 
                required
              />
            </div>
            <div className="address-line">
              <span>Address Line 2:</span>
              <input 
                type="text" 
                name="addressLine2" 
                value={formData.addressLine2} 
                onChange={handleChange} 
                placeholder="Enter address line 2"
                required
              />
            </div>
          </div>
        </div>

       
        <button type="submit" >Update</button>
      </form>
    </div>
  );
};

export default MainProfileUpdate;
