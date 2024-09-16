import React, { useState } from 'react';
import './App.css';
import ProfilePage from './person-2/Pages-p2/profilePage/ProfilePage';
import Homepage from './person-3/Homepage/Homepage';
import Nav from './person-3/Components-3/Nav/Nav';
import Footer from './person-2/components-p2/Footer/Footer';
import My_Store from './person-3/Components-3/Store/CreateNewStore/My_Store';
import UpdateProfilePage from './person-2/Pages-p2/UpdateProfilePage/UpdateProfilePage';
import Login from './person-3/Components-3/Register/Login/Login';
import Cart from './person-2/Pages-p2/Cart/Cart';
import { Route, Routes } from 'react-router-dom';
import ChattingPage from './person-2/Pages-p2/ChattingPage/ChattingPage';
import Chat from './person-3/Components-3/chat/Chat';
import ProductDesPage from './person-2/Pages-p2/ProductDesPage/ProductDesPage';
import { Toaster } from 'react-hot-toast';

function App() {
  const [showLogin, setshowLogin] = useState(false);

  return (
    <>
      {showLogin ? <Login setshowLogin={setshowLogin} /> : <></>}
      <div className="app">
        <Nav setshowLogin={setshowLogin} />
        <Routes>
          <Route path='/' element={<Homepage />} />
          <Route path='/ProfilePage' element={<ProfilePage />} />
          <Route path='/myStore' element={<My_Store />} />
          <Route path='/cart' element={<Cart />} />
          <Route path='/myChats' element={<Chat />} />
          <Route path='/productDes' element={<ProductDesPage />} />
        </Routes>
        <Toaster />
      </div>
      <Footer />
    </>
  );
}

export default App;
