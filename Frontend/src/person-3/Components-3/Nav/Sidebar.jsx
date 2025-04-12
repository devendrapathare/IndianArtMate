import React, { useState } from 'react'
import Bidding from './Bidding'
import Winning from './Winning'
import './Sidebar.css' // Importing the CSS file

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const [activeTab, setActiveTab] = useState('bidding')

  return (
    <div className={`sidebar ${isOpen ? 'open' : ''}`}>
      {/* Close Button */}
      <button className="close-button" onClick={toggleSidebar}>
        &times;
      </button>

      {/* Tab Buttons */}
      <div className="tab-buttons">
        <button 
          onClick={() => setActiveTab('bidding')}
          className={`tab-button ${activeTab === 'bidding' ? 'active' : ''}`}
        >
          Bidding
        </button>
        <button 
          onClick={() => setActiveTab('winning')}
          className={`tab-button ${activeTab === 'winning' ? 'active' : ''}`}
        >
          Winning
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'bidding' ? <Bidding /> : <Winning />}
    </div>
  )
}

export default Sidebar
