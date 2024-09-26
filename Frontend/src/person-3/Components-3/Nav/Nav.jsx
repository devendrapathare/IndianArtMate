import React,{useState,useEffect} from 'react';
import './Nav.css';
import { Link } from 'react-router-dom';
import { useAuthContext } from '../../../person-2/context/AuthContext/AuthContext';
import { assets } from '../../../assets/assets';
import UseLogout from '../../../person-2/hooks/UseLogout/UseLogout';

const Nav = ({ setshowLogin }) => {

  const { authUser } = useAuthContext();
  const userId = authUser?._id
  const [image , setImage] = useState(null)
  
  const { logout } = UseLogout();


  const onNavClick = (section) => {
    console.log(`Navigating to ${section}`); 
  };
  useEffect(() => {

    const fetchUserProfile = async () => {
      try {
        const response = await fetch(`http://localhost:5000/users/${userId}`);
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
  
        let fullImageUrl;
      
      if (data.profilePic.startsWith('http')) {
        fullImageUrl = data.profilePic;
      } else {
        fullImageUrl = `http://localhost:5000/profilePics${authUser.profilePic.split('/profilePic')[1]}`;
      }
        setImage(fullImageUrl);
        console.log("Profile Pic URL image:", image);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
  
    fetchUserProfile();
  }, [image]);

  return (
    <div className='nav'>
      <div className="right common">
        <h2>Indian_ArtMate</h2>
      </div>
      <div className="left common">
        <Link to='/'><h2>Home</h2></Link>

        {!authUser ? (
          <h2 onClick={() => setshowLogin(true)}>Login</h2>
        ) : (
          <>
            <Link to='/myStore'><h2 onClick={() => onNavClick('store')}>My Store</h2></Link>
            <Link to='/ProfilePage'><h2 onClick={() => onNavClick('profile')}>My Profile</h2></Link>
            <Link to='/myChats'><h2 onClick={() => onNavClick('chats')}>My Chats</h2></Link>
            <Link to='/cart'><h2 onClick={() => onNavClick('cart')}>Cart</h2></Link>
            <div className='navbar-profile'>
              {/* <img src={authUser.profilePic} alt="Profile" /> */}
              <img src={image} alt="Profile" />
              <ul className="nav-profile-dropdown">
                <li>
                  <img 
                    src={assets.logout_icon} 
                    alt="Logout" 
                    onClick={logout} 
                    style={{ cursor: 'pointer' }}
                  />
                  <p onClick={logout} style={{ cursor: 'pointer' }}>Logout</p>
                </li>
              </ul>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Nav;
