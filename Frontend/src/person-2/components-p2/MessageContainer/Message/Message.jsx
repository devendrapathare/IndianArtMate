import React from 'react'
import './Message.css'
import { useAuthContext } from '../../../context/AuthContext/AuthContext'
import { useChatContext } from '../../../context/chatContext/chatContext'
import { usePostContext } from '../../../context/PostContext/PostContext'
import { extractTime } from '../../../Utils/ExtractTime.js/ExtractTime'

const Message = ({message}) => {

  const { authUser } = useAuthContext()

  const { Receiver } = useChatContext()

  const { url } = usePostContext()

  // console.log('receiver',Receiver);
  // console.log('authUser',authUser);
  // console.log("user from nav:", user); 
  // console.log('message',message);
  
  const fromMe = message.senderId === authUser._id
  const formatedTime = extractTime(message.createdAt)
  const chatClassName = fromMe ? 'Chat-end' : 'chat-start'
  
  const profilePic = fromMe ? authUser.profilePic : Receiver?.profilePic
  // console.log('profilePic',profilePic);
  let fullImageUrl;
  
  if (profilePic.startsWith('http')) {
    fullImageUrl = profilePic;
  } else {
    console.log("in else");
    fullImageUrl = `${url}/profilePics${profilePic.split('/profilePic')[1]}`;
  }

  

  return (
    <div >    
      <div className={`main-chat-container ${chatClassName}`}>
        <div className='chat-image-div'>
          <img className='chat-image' src={fullImageUrl} alt="user Image" />
        </div>
        <div className='chat-data-div'>
          <div className='chat-content'>
            <p>{message.message}</p>
          </div>
          <div className='time-div'>
            <p>{formatedTime}</p>
          </div>
        </div>
      </div>
     </div>
  )
}

export default Message
