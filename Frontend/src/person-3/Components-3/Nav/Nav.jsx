import React, { useState, useEffect, useContext } from 'react';
import './Nav.css';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../../person-2/context/AuthContext/AuthContext';
import { assets } from '../../../assets/assets';
import UseLogout from '../../../person-2/hooks/UseLogout/UseLogout';
import { CartContext } from '../../../person-2/context/CartContext/CartContext';
import Sidebar from './Sidebar'; // Adjust the path as necessary
import { usePostContext } from '../../../person-2/context/PostContext/PostContext';

const Nav = ({ setshowLogin }) => {
  const { authUser } = useAuthContext();
  const { logout } = UseLogout();
  const [image, setImage] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navigate = useNavigate()

  const { getTotalCartAmount } = useContext(CartContext)
  const userId = authUser?._id;
  const url = usePostContext();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const onNavClick = (section) => {
    console.log(`Navigating to ${section}`);
  };


  useEffect(() => {
    const fetchUserProfile = async () => {
      if(authUser){

        try {
          const response = await fetch(`http://localhost:5000/users/${userId}`);
          if (!response.ok) throw new Error('Network response was not ok');
          const data = await response.json();
  
          const user = data.user;
          let fullImageUrl;
  
          // console.log("user from nav:", user);
  
          if (user.profilePic.startsWith('http')) {
            fullImageUrl = user.profilePic;
          } else {
            // console.log("in else");
            fullImageUrl = `http://localhost:5000/profilePics${user.profilePic.split('/profilePic')[1]}`;
          }
  
          setImage(fullImageUrl);
          // console.log(image);
  
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      };
      }

    const intervalId = setInterval(() => {
      fetchUserProfile();
    }, 600000);

    fetchUserProfile();

    return () => clearInterval(intervalId);
  }, [userId]);

  return (
    <>
      <div className='nav'>
        <div className="right common">
          {authUser && ( 
            <button className="sidebar-toggle-btn" onClick={toggleSidebar}>
              &#9776;
            </button>
          )}
          <h2>Indian_ArtMate</h2>
        </div>
        <div className="left common">
          <div className="nav-icon">
          <Link to='/'>
            {/* <div className="icon"> */}
             <img className='img' src={assets.home_icon} alt="Home" />
             {/* <p>Home</p> */}

            {/* </div> */}
            </Link>
            
          </div>
          {!authUser ? (
            <div className="nav-icon">
              <img className='img' src={assets.login_icon} alt="Login" onClick={() => setshowLogin(true)} />
            </div>
            // <h2 onClick={() => setshowLogin(true)}>Login</h2>
          ) : (
            <>
              <div className="nav-icon">
                <Link to='/myStore'><img className='img' src={assets.store_icon} alt="Store" onClick={() => onNavClick('store')} /></Link>
              </div>
              <div className="nav-icon">
                <Link to='/SearchPost'>Search</Link>
              </div>
              <div className="nav-icon">
                <Link to='/ProfilePage'><img className='img' src={assets.profile_icon} alt="My Profile" onClick={() => onNavClick('profile')} /></Link>
              </div>
              {/* <div className="nav-icon">
                <Link to='/myChats'><img className='img' src={assets.chat_icon} alt="My Chats" onClick={() => onNavClick('chats')} /></Link>
              </div> */}
              {/* <Link to='/myStore'><h2 onClick={() => onNavClick('store')}>My Store</h2></Link>
              <Link to='/ProfilePage'><h2 onClick={() => onNavClick('profile')}>My Profile</h2></Link>
              <Link to='/myChats'><h2 onClick={() => onNavClick('chats')}>My Chats</h2></Link> */}
              <div className="cart-dot nav-icon">
              <Link to='/cart'><img className='img' src={assets.cart_icon} alt="Cart" onClick={() => onNavClick('cart')} /></Link> 
                <div className={getTotalCartAmount() === 0 ? '' : "dot"}></div>
              </div>
              <div className='navbar-profile'>
                <img src={image} alt="Profile" />
                <ul className="nav-profile-dropdown">
                  <li>
                    <img
                      src={assets.order_delivery}
                      alt="myOrders"
                      onClick={logout}
                      style={{ cursor: 'pointer' }}
                    />
                    <p onClick={() => navigate('/myOrders')} style={{ cursor: 'pointer' }}>MyOrders</p>
                  </li>
                  <hr />
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
      {authUser && ( 
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      )}
    </>
  );
};

export default Nav;
