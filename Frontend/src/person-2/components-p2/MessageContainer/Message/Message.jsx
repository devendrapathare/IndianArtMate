import React from 'react'
import './Message.css'
import { assets } from '../../../../assets/assets'

const Message = () => {
  return (
    <div className={`chat chat-end px-10`}>
    <div className='chat-image avatar'>
        <div className='w-10 rounded-full'>
            <img src={assets.profileTest} alt="Tailwind CSS chat buble component" />
        </div>
    </div>
    <div className={`chat-bubble text-color `}>Hello EveryOne</div>
    <div className={`chat-footer opacity-50 text-xs flex gap-1`}>12 PM</div>
</div>
  )
}

export default Message
