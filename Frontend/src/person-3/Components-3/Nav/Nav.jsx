import React, { useContext } from 'react';
import './Nav.css';
import { Link } from 'react-router-dom';
import { useAuthContext } from '../../../person-2/context/AuthContext/AuthContext';
import { assets } from '../../../assets/assets';
import UseLogout from '../../../person-2/hooks/UseLogout/UseLogout';
import { CartContext } from '../../../person-2/context/CartContext/CartContext';

const Nav = ({ setshowLogin }) => {

  const { authUser } = useAuthContext();
  // console.log(authUser);
  const { logout } = UseLogout();

 const { getTotalCartAmount } = useContext(CartContext)

  const onNavClick = (section) => {
    console.log(`Navigating to ${section}`);
  };

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
            <div className="cart-dot">
              <Link to='/cart'><h2 onClick={() => onNavClick('cart')}>Cart</h2></Link>
              <div className={getTotalCartAmount()=== 0 ? '':"dot"}></div>
            </div>
            <div className='navbar-profile'>
              <img src={authUser.profilePic} alt="Profile" />
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
