import React from 'react';
import './Nav.css';
import { Link } from 'react-router-dom';

const Nav = ({ onNavClick }) => {
  return (
    <>
      <div className='nav'>
        <div className="right common">
          <h2>Indian_ArtMate</h2>
        </div>
        <div className="left common">
          <Link to='/'><h2>Home</h2></Link>
          <Link to='/myStore'><h2 onClick={() => onNavClick('store')}>My Store</h2></Link>
          <Link to='/ProfilePage'><h2 onClick={() => onNavClick('profile')}>My Profile</h2></Link>
          <Link to='/myChats'><h2 onClick={() => onNavClick('chats')}>My Chats</h2></Link>
          <Link to='/cart'><h2 onClick={() => onNavClick('cart')}>Cart</h2></Link>
          <Link to='/login'><h2 onClick={() => onNavClick('login')}>Login</h2></Link>
        </div>
      </div>
    </>
  );
};

export default Nav;
