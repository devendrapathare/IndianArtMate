import React, { useEffect, useState } from 'react';
import './SearchInputs.css';
import { FaSearch } from "react-icons/fa";
import { useAuthContext } from '../../../context/AuthContext/AuthContext';
import { useConversation } from '../../../Zustand/UseConversation';
import { useChatContext } from '../../../context/chatContext/chatContext';

const SearchInputs = () => {
    const [searchText, setSearchText] = useState('');
    const [filteredUsers, setFilteredUsers] = useState([]);

    const { setMyId, setReceiverId, getMessageReceiverDetails } = useChatContext()
    const { setSelectedConversation } = useConversation()
    const { authUser } = useAuthContext();
    

    const [allUsers, setAllUsers] = useState([]);
    const { fetchAllUserData } = useAuthContext();

    const handleChat = async (userId) => { 
        setMyId(authUser._id);
        await getMessageReceiverDetails(userId);
        setSelectedConversation(userId);
        setSearchText(''); // Reset searchText after user click
        // navigate('/myChats')
    };

    useEffect(() => {
        const getUsers = async () => {
            const users = await fetchAllUserData();
            setAllUsers(users || []);
        };
        getUsers();
    }, []);

    useEffect(() => {
        const filtered = allUsers.filter(user =>
            user.userName.toLowerCase().includes(searchText.toLowerCase())
        );
        setFilteredUsers(filtered);
    }, [searchText, allUsers]);

    return (
        <div className='SearchInputs-wrapper'>
            <form className='SearchInputs-form' onSubmit={(e) => e.preventDefault()}>
                <input
                    type="text"
                    placeholder='Search...'
                    className='SearchInputs-form-input'
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                />
                <button type='submit'>
                    <FaSearch className='SearchInputs-form-Search-icon' />
                </button>
            </form>

            {/* Searched results */}
            {searchText && (
                <div className="SearchInputs-results-wrapper">
                    <div className="SearchInputs-results">
                        {filteredUsers.length > 0 ? (
                            filteredUsers.map(user => (
                                <div
                                    key={user._id}
                                    className="SearchInputs-user"
                                    onClick={() => handleChat(user._id)} // Pass user._id to handleChat
                                >
                                    <img src={user.profilePic} alt={user.userName} />
                                    <span>{user.userName}</span>
                                </div>
                            ))
                        ) : (
                            <p className='SearchInputs-no-user'>No users found</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default SearchInputs;
