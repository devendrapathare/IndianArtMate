import React, { useState } from 'react'
import './MessageInput.css'
import { assets } from '../../../../assets/assets'
import UseSendMessage from '../../../hooks/UseSendMessage/UseSendMessage'
import { useChatContext } from '../../../context/chatContext/chatContext'

const MessageInput = () => {

  const [Message, setMessage] = useState('')

  const { loading, sendMessage } = UseSendMessage()

  const { Receiver } = useChatContext()
  // console.log('Receiver', Receiver);


  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!Message) return
    // console.log('message',Message); 
    await sendMessage(Message)
    setMessage('')
  }

  return (
    <form onSubmit={handleSubmit} className='messageInput-form' action="">
      <div className='messageInput-container'>
        <input
          className='messageInput-input'
          type="text"
          placeholder='Type a message...'
          value={Message}
          onChange={(e) => setMessage(e.target.value)}
        />

        <button className='messageInput-button'>
          <img className='buttonImg' src={assets.sendArrow} alt="" />
        </button>
      </div>
    </form>
  )
}

export default MessageInput