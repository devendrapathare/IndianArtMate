import React from 'react';
import './ChattingSidebar.css';
import SearchInputs from './SearchInputs/SearchInputs';
import Conversations from './Conversations/Conversations';
import LogOutButton from './LogOutButton/LogOutButton';
import './tailwind.css';

const ChattingSidebar = () => {
  return (
    <div className='ChattingSidebar-container'>
      <div className="sidebar-main-block">
        <div className="search-section">
          <h2 className="section-title">Find Contacts</h2>
          <SearchInputs />
        </div>
        
        <div className="conversations-section">
          <h2 className="section-title">Recent Chats</h2>
          <Conversations />
        </div>
      </div>
    </div>
  );
};

export default ChattingSidebar;
