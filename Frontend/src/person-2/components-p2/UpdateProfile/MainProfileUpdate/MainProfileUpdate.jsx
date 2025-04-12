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
    phoneNumber: '', // <-- add this
  });
  

  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`http://localhost:5000/users/${userId}`);
        const userData = response.data.user;

        setUser(userData);
        setFormData({
          userName: userData.userName || '',
          bio: userData.bio || '',
          email: userData.email || '',
          addressLine1: userData.addressLine1 || '',
          addressLine2: userData.addressLine2 || '',
          profile_type: userData.profile_type || '',
          phoneNumber: userData.phoneNumber || '', // ✅
        });
        
      } catch (e) {
        console.log("Error fetching data:", e);
        setMessage({ text: 'Failed to load profile data. Please try again.', type: 'error' });
      } finally {
        setIsLoading(false);
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
    setIsLoading(true);
    setMessage({ text: '', type: '' });

    const updatedData = {
      userName: formData.userName || user.userName,
      bio: formData.bio || user.bio,
      email: formData.email || user.email,
      addressLine1: formData.addressLine1 || user.addressLine1,
      addressLine2: formData.addressLine2 || user.addressLine2,
      profile_type: formData.profile_type || user.profile_type,
      phoneNumber: formData.phoneNumber || user.phoneNumber, 
    };
    

    try {
      const response = await axios.put(`http://localhost:5000/profile/update/${userId}`, updatedData);
      setMessage({ text: 'Profile updated successfully!', type: 'success' });
      console.log("Updated data:", response.data);
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage({ text: 'Failed to update profile. Please try again.', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='MainProfileUpdate-container'>
      <div className="MainProfileUpdate-header">
        Update Details Here
      </div>
      <form className='address-detail-container' onSubmit={handleSubmit}>
        <div className="form-section">
          <div className="form-field name-update">
            <label htmlFor="userName">Name:</label>
            <input
              type="text"
              id="userName"
              name="userName"
              value={formData.userName}
              onChange={handleChange}
              placeholder="Enter your name"
              required
            />
          </div>

          <div className="form-field email-update">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="form-section">
            <div className="form-field mobile-update">
              <label htmlFor="phoneNumber">Mobile Number:</label>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber || ''}
                onChange={handleChange}
                placeholder="Enter your mobile number"
                required
              />
            </div>
          </div>

          <div className="form-field profile-type-update">
            <label htmlFor="profile_type">Profile Type:</label>
            <select
              id="profile_type"
              name="profile_type"
              value={formData.profile_type}
              onChange={handleChange}
              required
            >
              <option value="">Select a profile type</option>
              <option value="Painting">Painter</option>
              <option value="Handlooms">Handloom Artist</option>
              <option value="Handcrafts">Handcraft Artist</option>
            </select>
          </div>

          <div className="form-field bio-update">
            <label htmlFor="bio">Bio:</label>
            <textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              placeholder="Tell us about yourself and your art"
              rows="4"
            ></textarea>
          </div>
        </div>

        <div className="form-section">
          <div className="form-field address-update">
            <label>Address:</label>
            <div className="address-fields">
              <div className="address-field">
                <label htmlFor="addressLine1">Address Line 1:</label>
                <input
                  type="text"
                  id="addressLine1"
                  name="addressLine1"
                  value={formData.addressLine1}
                  onChange={handleChange}
                  placeholder="Street address"
                  required
                />
              </div>
              <div className="address-field">
                <label htmlFor="addressLine2">Address Line 2:</label>
                <input
                  type="text"
                  id="addressLine2"
                  name="addressLine2"
                  value={formData.addressLine2}
                  onChange={handleChange}
                  placeholder="City, State, Pin code"
                  required
                />
              </div>
            </div>
          </div>
        </div>

        {message.text && (
          <div className={`message ${message.type}`}>
            {message.text}
          </div>
        )}

        <div className="form-actions">
          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Updating...' : 'Update Profile'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default MainProfileUpdate;
