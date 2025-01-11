import React from 'react'
import './Conversations.css'
import Conversation from '../Conversation/Conversation'
import UserGetUserAllConversations from '../../../hooks/UserGetUserAllConversations/UserGetUserAllConversations'

const Conversations = () => {

  const { AllConversationId, loading } = UserGetUserAllConversations()
  // console.log('AllConversationId', AllConversationId);

  return (
    <div className='Conversations-container'>
      {AllConversationId && AllConversationId.map(conversation => (
        <Conversation key={conversation._id} participants={conversation.participants} message={conversation.messages
        } />
      ))}
    </div>
  )
}

export default Conversations
