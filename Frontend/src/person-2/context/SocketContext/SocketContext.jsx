import { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuthContext } from '../AuthContext/AuthContext';

export const SocketContext = createContext();


const SocketProvider = ({ children }) => {

    const [socket, setsocket] = useState(null)

    const [onlineUsers, setonlineUsers] = useState([])

    const { authUser } = useAuthContext()
    
    useEffect(() => {
        if (authUser) {
            const socket = io('http://localhost:5000',{
                query: { userId: authUser._id }
            });

            setsocket(socket)

            socket.on('getOnlineUsers', (users) => {
                setonlineUsers(users)
            });

            return () => socket.close()
        } else {
            if (socket) {
                socket.close()
                setsocket(null)
            }
        }
        

    }, [authUser]);

    return (
        <SocketContext.Provider value={{ socket,onlineUsers }}>
            {children}
        </SocketContext.Provider>
    );
};

export const useSocketContext = ()=> {
    return useContext(SocketContext);
}

export default SocketProvider;