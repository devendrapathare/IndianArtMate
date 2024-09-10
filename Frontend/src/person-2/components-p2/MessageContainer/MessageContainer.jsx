import React from 'react'
import './MessageContainer.css'
import Messages from './Messages/Messages'

const MessageContainer = () => {
  return (
    <div className='MessageContainer-container'>
      <div className="MessageContainer-content">
      <span className='span1'>To:</span>{" "}
      <span className='span2'>Shaswat Mishra</span>
      </div>

      <Messages />
    </div>
  )
}

export default MessageContainer
