import React from 'react';
import './Nav.css';

const Nav = ({ onNavClick }) => {
  return (
    <>
      <div className='nav'>
        <div className="right common">
          <h2>Indian_ArtMate</h2>
        </div>
        <div className="left common">
          <h2 onClick={() => onNavClick('home')}>Home</h2>
          <h2 onClick={() => onNavClick('store')}>My Store</h2>
          <h2 onClick={() => onNavClick('profile')}>My Profile</h2>
          <h2 onClick={() => onNavClick('chats')}>My Chats</h2>
          <h2 onClick={() => onNavClick('cart')}>Cart</h2>
          <h2 onClick={() => onNavClick('login')}>Login</h2>
        </div>
      </div>
    </>
  );
};

export default Nav;
