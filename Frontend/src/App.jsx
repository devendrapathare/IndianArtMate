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
import Chat from './person-3/Components-3/chat/Chat';
import ProductDesPage from './person-2/Pages-p2/ProductDesPage/ProductDesPage';
import { Toaster } from 'react-hot-toast';
import { useAuthContext } from './person-2/context/AuthContext/AuthContext';
import Temp from './person-3/Components-3/temp';
import PlaceOrder from './person-2/Pages-p2/PlaceOrder/PlaceOrder';
import MyOrders from './person-2/Pages-p2/MyOrders/MyOrders';
import Verify from './person-2/Pages-p2/Verify/Verify';
import ReceivedOrder from './person-2/Pages-p2/ReceivedOrder/ReceivedOrder';
import Show_resp_respting from './person-3/Components-3/Show_resp_respting';


function App() {
    const { authUser } = useAuthContext();
    const userId = authUser?._id
    const [showLogin, setshowLogin] = useState(false);

    return (
        <>
            {showLogin && <Login setshowLogin={setshowLogin} />}
            <div className="app">
                <Nav setshowLogin={setshowLogin} />
                <Routes>
                    <Route path="/" element={<Homepage />} />
                    <Route path="/profilePage" element={<ProfilePage current_id = {userId} />} />
                    <Route path="/myStore" element={<My_Store />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/myChats" element={<Chat />} />
                    <Route path="/productDes" element={<ProductDesPage />} />
                    <Route path="/UpdateProfilePage" element={<UpdateProfilePage />} />
                    <Route path = "/temp/:id" element={<Temp/>}/>
                    <Route path = "/order" element={<PlaceOrder />}/>
                    <Route path = "/myOrders" element={<MyOrders />}/>
                    <Route path = "/verify" element={<Verify />}/>
                    <Route path = "/receivedOrders" element={<ReceivedOrder />}/>
                    {/* <Route path = "/myProfileDetails/:whatToDo/:userId" element={<ProfilePage current_id = {userId}/>}/> */}
                    <Route path = "/myProfileDetails/:whatToDo/:userId" element={<Show_resp_respting/>}/>
                </Routes>
                <Toaster />
            </div>
            <Footer />
        </>
    );
}

export default App;
