import React from 'react'
import './MessageContainer.css'
import Messages from './Messages/Messages'
import MessageInput from './MessageInput/MessageInput'
import { useChatContext } from '../../context/chatContext/chatContext'
import { useAuthContext } from '../../context/AuthContext/AuthContext'

const MessageContainer = () => {
  const { Receiver } = useChatContext()
  
  return (
    <div className='MessageContainer-container'>
      {!Receiver ? (
        <NoChatSelected />
      ) : (
        <>
          <div className="MessageContainer-header">
            <div className="MessageContainer-content">
              <span className='span1'>To:</span>
              <span className='span2'>{Receiver.userName}</span>
            </div>
          </div>
          <div className='Messages'>
            <Messages />
          </div>
          <MessageInput />
        </>
      )}
    </div>
  )
}

const NoChatSelected = () => {
  const { authUser } = useAuthContext()

  return(
    <div className='noChatSelected-container'>
      <div className='noChatSelected-data'>
        <div className="welcome-header">
          <div className="welcome-emoji">🎨</div>
          <h2>Welcome to MyChats</h2>
        </div>
        <p className="welcome-username">Hello, <span>{authUser.userName}</span> 🎉</p>
        <div className="welcome-instruction">
          <p>Select a contact from the list or search for someone to start a conversation</p>
          <div className="welcome-arrow">👈</div>
        </div>
      </div>
    </div>
  )
}

export default MessageContainer
