import React, { useEffect, useRef } from 'react'
import './Messages.css'
import Message from '../Message/Message'
import UseListenMessage from '../../../hooks/UseListenMessage/UseListenMessage'
import UseGetMessages from '../../../hooks/UseGetMessages/UseGetMessages'
import MessageSkeleton from '../../../Skeletons/MessageSkeleton/MessageSkeleton'

const Messages = () => {

  UseListenMessage()

  const { loading, messages } = UseGetMessages()

  const lastMessageRef = useRef()

  useEffect(() => {

    setTimeout(()=>{
      lastMessageRef.current?.scrollIntoView({behavior: 'smooth'})
    },100)

  }, [messages])
  // console.log('messages',messages);
  
  return (
    <div className='Messages-container'>
      {!loading && messages.length > 0 && messages.map((message) => (
        <div key={message._id} ref={lastMessageRef}>
          <Message message={message} />
        </div> 
      ))}

      {loading && [Array(3)].map((_,idx)=> <MessageSkeleton key={idx} />)}

      {!loading && messages.length === 0 && (
        <p className='start-conv'>Send Message To Start the Conversation</p>
      )}
    </div>
  )
}

export default Messages
