import React from 'react'
import './ChattingSidebar.css'
import SearchInputs from './SearchInputs/SearchInputs'
import Conversations from './Conversations/Conversations'
import LogOutButton from './LogOutButton/LogOutButton'

const ChattingSidebar = () => {
  return (
    <div className='ChattingSidebar-container'>
        <SearchInputs />
      <div className="ChattingSidebar-other-content"></div>
        <Conversations />
        <LogOutButton />
    </div>
  )
}

export default ChattingSidebar
