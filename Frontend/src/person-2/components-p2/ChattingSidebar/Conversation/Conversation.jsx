import React, { useEffect, useState, useRef } from 'react'
import './Conversation.css'
import { useAuthContext } from '../../../context/AuthContext/AuthContext'
import { usePostContext } from '../../../context/PostContext/PostContext'
import { useChatContext } from '../../../context/chatContext/chatContext'
import { useConversation } from '../../../Zustand/UseConversation'
import { set } from 'lodash'
import UseGetMessages from '../../../hooks/UseGetMessages/UseGetMessages'

const Conversation = ({ participants, message }) => {
  const { authUser } = useAuthContext();
  const [ReceiverData, setReceiverData] = useState([]);
  const [fullImageUrl, setFullImageUrl] = useState('');
  const [receiverId, setReceiverId] = useState('');
  const { url } = usePostContext();
  const { getMessageReceiverDetails } = useChatContext();
  const { setSelectedConversation } = useConversation();
  const [UserLastMessage, setUserLastMessage] = useState([])
  const [hasNewMessage, setHasNewMessage] = useState(false);
  const prevMessageIdRef = useRef(null);

  const { loading, messages } = UseGetMessages()


  async function fetchReceiverData() {
    let tempReceiverId;

    if (authUser._id === participants[0]) {
      tempReceiverId = participants[1];
    } else if (authUser._id === participants[1]) {
      tempReceiverId = participants[0];
    }

    setReceiverId(tempReceiverId);

    try {
      const response = await fetch(`${url}/users/${tempReceiverId}`);
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setReceiverData(data.user);

      // Set fullImageUrl
      if (data.user && data.user.profilePic) {
        if (data.user.profilePic.startsWith('http')) {
          setFullImageUrl(data.user.profilePic);
          // console.log('fullImageUrl 1', data.user.profilePic);
        } else {
          const imageUrl = `${url}/profilePics${data.user.profilePic.split('/profilePic')[1]}`;
          setFullImageUrl(imageUrl);
          // console.log('fullImageUrl 2', imageUrl);
        }
      } else {
        console.log('ReceiverData or ReceiverData.profilePic is undefined');
      }
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    fetchReceiverData();
  }, [authUser, participants]);

  const handleChat = async () => {
    await getMessageReceiverDetails(receiverId);
    setSelectedConversation(receiverId);
    setHasNewMessage(false); // Reset new message state when clicking on conversation
  };

  const lastMessgeId = message.slice(-1)[0]
  // console.log('lastMessgeId',lastMessgeId);


  async function getUserLastMessage() {

    try {

      const response = await fetch(`${url}/api/messages/getUserLastMessage/${lastMessgeId}`)
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      
      // Check if this is a new message
      if (prevMessageIdRef.current !== lastMessgeId) {
        // Only animate if this isn't the first load
        if (prevMessageIdRef.current !== null) {
          setHasNewMessage(true);
          
          // Reset animation after 2 seconds
          setTimeout(() => {
            setHasNewMessage(false);
          }, 2000);
        }
        prevMessageIdRef.current = lastMessgeId;
      }
      
      setUserLastMessage(data)

    } catch (error) {
      console.error(error)
    }

  }

  useEffect(() => {
    getUserLastMessage();
  }, [message,messages,participants])

  // console.log('UserLastMessage', UserLastMessage.message);



  return (
    <>
      <div 
        onClick={handleChat} 
        className={`Conversation-container ${hasNewMessage ? 'new-message' : ''}`}
      >
        <div className="Conversation-dp">
          <img src={fullImageUrl} alt="" />
        </div>
        <div className="Conversation-other-info">
          <div className="user-name">
            <p>{ReceiverData.userName}</p>
          </div>
          <div className="latestMessage">
            {UserLastMessage ? (
              <p>
                {UserLastMessage.senderId === authUser._id ? 'You: ' : ''}
                {UserLastMessage.message ? (
                  <>
                    {UserLastMessage.message.split(' ').slice(0, 4).join(' ')}
                    {UserLastMessage.message.split(' ').length > 4 ? ' ....' : ''}
                  </>
                ) : ''}
              </p>
            ) : (
              <p>Start a conversation</p>
            )}
          </div>
        </div>
      </div>
      <hr />
    </>
  );
};

export default Conversation;
