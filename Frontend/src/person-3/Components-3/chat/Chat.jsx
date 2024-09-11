import React from 'react';
import './Chat.css';
import { artistProfile } from '../../../assets/assets'; // Import the artistProfile array

const users = [
  { name: 'Shaswat Mishra', message: 'No Message Available', img: artistProfile.find(profile => profile.name === 'artist1').image },
  { name: 'Krish Mishra', message: 'No Message Available', img: artistProfile.find(profile => profile.name === 'artist2').image },
  { name: 'Biswal Mishra', message: 'No Message Available', img: artistProfile.find(profile => profile.name === 'artist3').image },
  { name: 'Ram Mishra', message: 'No Message Available', img: artistProfile.find(profile => profile.name === 'artist4').image },
  { name: 'Niraj Mishra', message: 'No Message Available', img: artistProfile.find(profile => profile.name === 'artist5').image },
  { name: 'Goku Mishra', message: 'No Message Available', img: artistProfile.find(profile => profile.name === 'artist6').image },
  { name: 'Naruto Mishra', message: 'No Message Available', img: artistProfile.find(profile => profile.name === 'artist1').image }, // Example repeat
  { name: 'Sam ', message: 'No Message Available', img: artistProfile.find(profile => profile.name === 'artist2').image }, // Example repeat
];

const Chat = () => {
  return (
    <div className="my-chat-box">
      <div className="side-bar">
        <div className="user-list">
          <input id='search' type="text" placeholder="Search..." />
          {users.map((user, index) => (
            <div className="user-card" key={index}>
              <img src={user.img} alt={`${user.name}`} className="user-img" />
              <div className="user-info">
                <h4>{user.name}</h4>
                <p>{user.message}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="chat-field">
        <div className="visible-chat"></div>
        <div className="chat-input">
          <input type="text" name="" id="" />
          <button>Send</button>
        </div>
      </div>
      <div className="notification">
        <h3><u>Notifications Received</u></h3>
        <div className="notification-received">
          <div className="user-list">
            {users.map((user, index) => (
              <div className="user-card" key={index}>
                <img src={user.img} alt={`${user.name}`} className="user-img" />
                <div className="user-info">
                  <h4>{user.name}</h4>
                  <p>{user.message}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
