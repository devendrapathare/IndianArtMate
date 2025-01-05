import { createContext, useContext, useState } from "react";
import { usePostContext } from "../PostContext/PostContext";
import toast from 'react-hot-toast';

export const ChatContext = createContext();

const ChatContextProvider = ({ children }) => {

    const [MyId, setMyId] = useState('')
    const [Receiver, setReceiver] = useState('')

    const { url } = usePostContext();

    // console.log('MyId', MyId);
    // console.log('ReceiverId', Receiver);

    const getMessageReceiverDetails = async (id) => {

        try {

            const response = await fetch(`${url}/api/messages/receiverDetail/${id}`)
            const data = await response.json()
            if (data.error) {
                throw new Error(data.error)
            }
            setReceiver(data)
            
        } catch (error) {
            toast.error(error.message)
        }

    }
    
    const contextValue = {
        MyId,
        setMyId,
        Receiver,
        setReceiver,
        getMessageReceiverDetails
    }

    return (
        <ChatContext.Provider value={contextValue}>
            {children}
        </ChatContext.Provider>
    )
}

// Custom hook to use the PostContext
export const useChatContext = () => {
    return useContext(ChatContext);
};


export default ChatContextProvider;