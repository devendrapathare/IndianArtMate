import React from 'react'
import './ChattingPage.css'
import ChattingSidebar from '../../components-p2/ChattingSidebar/ChattingSidebar'
import MessageContainer from '../../components-p2/MessageContainer/MessageContainer'

const ChattingPage = () => {
  return (
    <div className='ChattingPage-container'>
      <div className="chat-left-block">
        <ChattingSidebar />
      </div>
      <div className="chat-right-block">
        <MessageContainer />
      </div>
    </div>
  )
}

export default ChattingPage