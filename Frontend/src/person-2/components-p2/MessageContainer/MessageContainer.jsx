import React from 'react'
import './MessageContainer.css'
import Messages from './Messages/Messages'
import MessageInput from './MessageInput/MessageInput'
import { useChatContext } from '../../context/chatContext/chatContext'
import { useAuthContext } from '../../context/AuthContext/AuthContext'

const MessageContainer = () => {

  const { Receiver } = useChatContext()
  // console.log('receivdef',Receiver);
  

  return (
    <div className='MessageContainer-container'>
      {!Receiver ? (
        <NoChatSelected />
      ) : (
        <>
          <div className="MessageContainer-content">
            <span className='span1'>To:</span>{" "}
            <span className='span2'>{Receiver.userName}</span>
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

const NoChatSelected = () =>{

  const { authUser } = useAuthContext()

  return(
    <div className='noChatSelected-container'>
      <div className='noChatSelected-data'>
        <p>Welcome 🎉🎊 {authUser.userName} 🥳❤️</p>
        <p>Start Conversation by sending a message</p>
      </div>
    </div>
  )
}

export default MessageContainer
