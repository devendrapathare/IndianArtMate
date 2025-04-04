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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigate = useNavigate()

  const { getTotalCartAmount } = useContext(CartContext)
  const userId = authUser?._id;
  const {url} = usePostContext();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
    if (isMobileMenuOpen) setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    if (isSidebarOpen) setIsSidebarOpen(false);
  };

  const onNavClick = (section) => {
    // console.log(`Navigating to ${section}`);
    setIsMobileMenuOpen(false);
  };


  useEffect(() => {
    const fetchUserProfile = async () => {
      if (authUser) {

        try {
          
          const response = await fetch(`${url}/users/${userId}`);
          // console.log("response:", response);
          
          if (!response.ok) throw new Error('Network response was not ok');
          const data = await response.json();

          const user = data.user;
          let fullImageUrl;

          // console.log("user from nav:", user);

          if (user.profilePic.startsWith('http')) {
            fullImageUrl = user.profilePic;
          } else {
            console.log("in else");
            fullImageUrl = `${url}/profilePics${user.profilePic.split('/profilePic')[1]}`;
          }

          setImage(fullImageUrl);
          // console.log('fullImageUrl', fullImageUrl);

        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      };
    }
    // console.log("image:", image);



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
              <svg xmlns="http://www.w3.org/2000/svg" className="img flaticon" viewBox="0 0 24 24">
                <path d="M3,6h18c0.6,0,1-0.4,1-1s-0.4-1-1-1H3C2.4,4,2,4.4,2,5S2.4,6,3,6z M21,11H3c-0.6,0-1,0.4-1,1s0.4,1,1,1h18 c0.6,0,1-0.4,1-1S21.6,11,21,11z M21,18H3c-0.6,0-1,0.4-1,1s0.4,1,1,1h18c0.6,0,1-0.4,1-1S21.6,18,21,18z" fill="#fff"/>
              </svg>
            </button>
          )}
          <h2 className="site-title"><span className="site-title-highlight">Indian</span>ArtMate</h2>
        </div>
        <div className="left common">
          <div className="nav-icon">
            <Link to='/' onClick={() => onNavClick('home')}>
              <svg xmlns="http://www.w3.org/2000/svg" className="img flaticon" viewBox="0 0 24 24">
                <path d="M12,3c0,0-6.186,5.34-9.643,8.232C2.154,11.416,2,11.684,2,12c0,0.553,0.447,1,1,1h2v7c0,0.553,0.447,1,1,1h3 c0.553,0,1-0.448,1-1v-4h4v4c0,0.552,0.447,1,1,1h3c0.553,0,1-0.447,1-1v-7h2c0.553,0,1-0.447,1-1 c0-0.316-0.154-0.584-0.383-0.768C18.184,8.34,12,3,12,3z" fill="#fff"/>
              </svg>
            </Link>
          </div>
          {!authUser ? (
            <div className="nav-icon">
              <svg xmlns="http://www.w3.org/2000/svg" className="img flaticon" viewBox="0 0 24 24" onClick={() => setshowLogin(true)}>
                <path d="M12,12c2.8,0,5-2.2,5-5s-2.2-5-5-5S7,4.2,7,7S9.2,12,12,12z M12,3c2.2,0,4,1.8,4,4s-1.8,4-4,4S8,9.2,8,7S9.8,3,12,3z" fill="#fff"/>
                <path d="M12,13c-5,0-9,4-9,9v1h18v-1C21,17,17,13,12,13z M4,22c0.2-4,3.3-7.4,7.3-7.9c0.2,0,0.5,0,0.7,0s0.5,0,0.7,0 c4,0.5,7.1,3.9,7.3,7.9H4z" fill="#fff"/>
              </svg>
            </div>
          ) : (
            <>
              <div className="nav-icon">
                <Link to='/SearchPost' onClick={() => onNavClick('search')}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="img flaticon" viewBox="0 0 24 24">
                    <path d="M21.7,20.3L18,16.6c1.2-1.5,2-3.5,2-5.6c0-5-4-9-9-9s-9,4-9,9s4,9,9,9c2.1,0,4.1-0.7,5.6-2l3.7,3.7 c0.2,0.2,0.5,0.3,0.7,0.3s0.5-0.1,0.7-0.3C22.1,21.3,22.1,20.7,21.7,20.3z M4,11c0-3.9,3.1-7,7-7s7,3.1,7,7s-3.1,7-7,7 S4,14.9,4,11z" fill="#fff"/>
                  </svg>
                </Link>
              </div>
              <div className="nav-icon">
                <Link to="/feedPage" onClick={() => onNavClick('feed')}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="img flaticon" viewBox="0 0 24 24">
                    <path d="M6,2h12c1.1,0,2,0.9,2,2v16c0,1.1-0.9,2-2,2H6c-1.1,0-2-0.9-2-2V4C4,2.9,4.9,2,6,2z M6,4v16h12V4H6z M8,6h8v2H8V6z M8,10h8v2H8V10z M8,14h8v2H8V14z" fill="#fff"/>
                  </svg>
                </Link>
              </div>
              <div className="nav-icon">
                <Link to='/ProfilePage' onClick={() => onNavClick('profile')}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="img flaticon" viewBox="0 0 24 24">
                    <path d="M12,12c2.8,0,5-2.2,5-5s-2.2-5-5-5S7,4.2,7,7S9.2,12,12,12z M12,4c1.7,0,3,1.3,3,3s-1.3,3-3,3S9,8.7,9,7S10.3,4,12,4z" fill="#fff"/>
                    <path d="M12,13c-4.3,0-8,3.7-8,8v1h16v-1C20,16.7,16.3,13,12,13z M6,20c0.2-2.3,2.1-5,6-5s5.8,2.7,6,5H6z" fill="#fff"/>
                  </svg>
                </Link>
              </div>
              <div className="nav-icon">
                <Link to='/myChats' onClick={() => onNavClick('chats')}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="img flaticon" viewBox="0 0 24 24">
                    <path d="M20,4H4C2.9,4,2,4.9,2,6v12c0,1.1,0.9,2,2,2h16c1.1,0,2-0.9,2-2V6C22,4.9,21.1,4,20,4z M20,18H4V8l8,5l8-5V18z M20,6.8 l-8,5l-8-5V6h16V6.8z" fill="#fff"/>
                  </svg>
                </Link>
              </div>
              <div className="cart-dot nav-icon">
                <Link to='/cart' onClick={() => onNavClick('cart')}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="img flaticon" viewBox="0 0 24 24">
                    <path d="M7,18c-1.1,0-2,0.9-2,2s0.9,2,2,2s2-0.9,2-2S8.1,18,7,18z M1,3c0,0.6,0.4,1,1,1h1l3.6,7.6l-1.3,2.4C4.4,15.3,5.2,17,7,17 h11c0.6,0,1-0.4,1-1s-0.4-1-1-1H7l1-2h7.4c0.8,0,1.5-0.4,1.8-1.1L20.9,6c0.1-0.3,0-0.7-0.3-0.9C20.4,5,20.2,5,20,5H5.2L4.4,3 C4.2,2.4,3.6,2,3,2H2C1.4,2,1,2.4,1,3z M17,18c-1.1,0-2,0.9-2,2s0.9,2,2,2s2-0.9,2-2S18.1,18,17,18z" fill="#fff"/>
                  </svg>
                </Link>
                <div className={getTotalCartAmount() === 0 ? '' : "dot"}></div>
              </div>
              <div className='navbar-profile'>
                <div className="profile-icon-container">
                  <img src={image} alt="Profile" />
                  <svg xmlns="http://www.w3.org/2000/svg" className="profile-dropdown-indicator" viewBox="0 0 24 24" width="12" height="12">
                    <path d="M7.41,8.59L12,13.17l4.59-4.58L18,10l-6,6l-6-6L7.41,8.59z" fill="#FFD700"/>
                  </svg>
                </div>
                <ul className="nav-profile-dropdown">
                  <li>
                    <svg xmlns="http://www.w3.org/2000/svg" className="img flaticon-small" viewBox="0 0 24 24" style={{ width: '20px', height: '20px' }}>
                      <path d="M19,8h-1.5V6c0-2.8-2.2-5-5-5h-1C8.7,1,6.5,3.2,6.5,6v2H5c-1.1,0-2,0.9-2,2v10c0,1.1,0.9,2,2,2h14c1.1,0,2-0.9,2-2V10 C21,8.9,20.1,8,19,8z M8.5,6c0-1.7,1.3-3,3-3h1c1.7,0,3,1.3,3,3v2h-7V6z M19,20H5V10h14V20z" fill="#5d7b9d"/>
                      <path d="M12,16c0.8,0,1.5-0.7,1.5-1.5S12.8,13,12,13s-1.5,0.7-1.5,1.5S11.2,16,12,16z" fill="#5d7b9d"/>
                    </svg>
                    <p onClick={() => navigate('/myOrders')} style={{ cursor: 'pointer' }}>MyOrders</p>
                  </li>
                  <hr />
                  <li>
                    <svg xmlns="http://www.w3.org/2000/svg" className="img flaticon-small" viewBox="0 0 24 24" style={{ width: '20px', height: '20px' }}>
                      <path d="M16,13v-2h-5V8l-5,4l5,4v-3H16z" fill="#5d7b9d"/>
                      <path d="M20,3H11c-0.6,0-1,0.4-1,1s0.4,1,1,1h9v14H11c-0.6,0-1,0.4-1,1s0.4,1,1,1h9c1.1,0,2-0.9,2-2V5C22,3.9,21.1,3,20,3z" fill="#5d7b9d"/>
                    </svg>
                    <p onClick={logout} style={{ cursor: 'pointer' }}>Logout</p>
                  </li>
                </ul>
              </div>
            </>
          )}
        </div>
        
        {/* Mobile Menu Button */}
        <button className="mobile-menu-button" onClick={toggleMobileMenu}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M3,6h18c0.6,0,1-0.4,1-1s-0.4-1-1-1H3C2.4,4,2,4.4,2,5S2.4,6,3,6z M21,11H3c-0.6,0-1,0.4-1,1s0.4,1,1,1h18 c0.6,0,1-0.4,1-1S21.6,11,21,11z M21,18H3c-0.6,0-1,0.4-1,1s0.4,1,1,1h18c0.6,0,1-0.4,1-1S21.6,18,21,18z" fill="#fff"/>
          </svg>
        </button>
      </div>
      
      {/* Mobile Navigation Menu */}
      <div className={`mobile-nav ${isMobileMenuOpen ? 'open' : ''}`}>
        <div className="mobile-nav-items">
          <div className="mobile-nav-item">
            <Link to='/' onClick={() => onNavClick('home')}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path d="M12,3c0,0-6.186,5.34-9.643,8.232C2.154,11.416,2,11.684,2,12c0,0.553,0.447,1,1,1h2v7c0,0.553,0.447,1,1,1h3 c0.553,0,1-0.448,1-1v-4h4v4c0,0.552,0.447,1,1,1h3c0.553,0,1-0.447,1-1v-7h2c0.553,0,1-0.447,1-1 c0-0.316-0.154-0.584-0.383-0.768C18.184,8.34,12,3,12,3z" fill="#fff"/>
              </svg>
              Home
            </Link>
          </div>
          {!authUser ? (
            <div className="mobile-nav-item">
              <a href="#" onClick={() => { setshowLogin(true); onNavClick('login'); }}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <path d="M12,12c2.8,0,5-2.2,5-5s-2.2-5-5-5S7,4.2,7,7S9.2,12,12,12z M12,3c2.2,0,4,1.8,4,4s-1.8,4-4,4S8,9.2,8,7S9.8,3,12,3z" fill="#fff"/>
                  <path d="M12,13c-5,0-9,4-9,9v1h18v-1C21,17,17,13,12,13z M4,22c0.2-4,3.3-7.4,7.3-7.9c0.2,0,0.5,0,0.7,0s0.5,0,0.7,0 c4,0.5,7.1,3.9,7.3,7.9H4z" fill="#fff"/>
                </svg>
                Login
              </a>
            </div>
          ) : (
            <>
              <div className="mobile-nav-item">
                <Link to='/SearchPost' onClick={() => onNavClick('search')}>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path d="M21.7,20.3L18,16.6c1.2-1.5,2-3.5,2-5.6c0-5-4-9-9-9s-9,4-9,9s4,9,9,9c2.1,0,4.1-0.7,5.6-2l3.7,3.7 c0.2,0.2,0.5,0.3,0.7,0.3s0.5-0.1,0.7-0.3C22.1,21.3,22.1,20.7,21.7,20.3z M4,11c0-3.9,3.1-7,7-7s7,3.1,7,7s-3.1,7-7,7 S4,14.9,4,11z" fill="#fff"/>
                  </svg>
                  Search
                </Link>
              </div>
              <div className="mobile-nav-item">
                <Link to="/feedPage" onClick={() => onNavClick('feed')}>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path d="M6,2h12c1.1,0,2,0.9,2,2v16c0,1.1-0.9,2-2,2H6c-1.1,0-2-0.9-2-2V4C4,2.9,4.9,2,6,2z M6,4v16h12V4H6z M8,6h8v2H8V6z M8,10h8v2H8V10z M8,14h8v2H8V14z" fill="#fff"/>
                  </svg>
                  Feed
                </Link>
              </div>
              <div className="mobile-nav-item">
                <Link to='/ProfilePage' onClick={() => onNavClick('profile')}>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path d="M12,12c2.8,0,5-2.2,5-5s-2.2-5-5-5S7,4.2,7,7S9.2,12,12,12z M12,4c1.7,0,3,1.3,3,3s-1.3,3-3,3S9,8.7,9,7S10.3,4,12,4z" fill="#fff"/>
                    <path d="M12,13c-4.3,0-8,3.7-8,8v1h16v-1C20,16.7,16.3,13,12,13z M6,20c0.2-2.3,2.1-5,6-5s5.8,2.7,6,5H6z" fill="#fff"/>
                  </svg>
                  Profile
                </Link>
              </div>
              <div className="mobile-nav-item">
                <Link to='/myChats' onClick={() => onNavClick('chats')}>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path d="M20,4H4C2.9,4,2,4.9,2,6v12c0,1.1,0.9,2,2,2h16c1.1,0,2-0.9,2-2V6C22,4.9,21.1,4,20,4z M20,18H4V8l8,5l8-5V18z M20,6.8 l-8,5l-8-5V6h16V6.8z" fill="#fff"/>
                  </svg>
                  Chats
                </Link>
              </div>
              <div className="mobile-nav-item">
                <Link to='/cart' onClick={() => onNavClick('cart')}>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path d="M7,18c-1.1,0-2,0.9-2,2s0.9,2,2,2s2-0.9,2-2S8.1,18,7,18z M1,3c0,0.6,0.4,1,1,1h1l3.6,7.6l-1.3,2.4C4.4,15.3,5.2,17,7,17 h11c0.6,0,1-0.4,1-1s-0.4-1-1-1H7l1-2h7.4c0.8,0,1.5-0.4,1.8-1.1L20.9,6c0.1-0.3,0-0.7-0.3-0.9C20.4,5,20.2,5,20,5H5.2L4.4,3 C4.2,2.4,3.6,2,3,2H2C1.4,2,1,2.4,1,3z M17,18c-1.1,0-2,0.9-2,2s0.9,2,2,2s2-0.9,2-2S18.1,18,17,18z" fill="#fff"/>
                  </svg>
                  Cart {getTotalCartAmount() > 0 && <span className="mobile-cart-dot">•</span>}
                </Link>
              </div>
              <div className="mobile-nav-item">
                <Link to='/myOrders' onClick={() => onNavClick('orders')}>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path d="M19,8h-1.5V6c0-2.8-2.2-5-5-5h-1C8.7,1,6.5,3.2,6.5,6v2H5c-1.1,0-2,0.9-2,2v10c0,1.1,0.9,2,2,2h14c1.1,0,2-0.9,2-2V10 C21,8.9,20.1,8,19,8z M8.5,6c0-1.7,1.3-3,3-3h1c1.7,0,3,1.3,3,3v2h-7V6z M19,20H5V10h14V20z" fill="#fff"/>
                  </svg>
                  Orders
                </Link>
              </div>
              <div className="mobile-nav-item">
                <a href="#" onClick={() => { logout(); onNavClick('logout'); }}>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path d="M16,13v-2h-5V8l-5,4l5,4v-3H16z" fill="#fff"/>
                    <path d="M20,3H11c-0.6,0-1,0.4-1,1s0.4,1,1,1h9v14H11c-0.6,0-1,0.4-1,1s0.4,1,1,1h9c1.1,0,2-0.9,2-2V5C22,3.9,21.1,3,20,3z" fill="#fff"/>
                  </svg>
                  Logout
                </a>
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
