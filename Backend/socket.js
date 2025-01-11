import { Server } from 'socket.io';

let io;

function initializeSocket(server) {

    io = new Server(server, {
        cors: {
            origin: ["http://localhost:3000"],
            methods: ["GET", "POST"]
        }
    });

    io.on('connection', (socket) => {
        console.log(`user Connected with id: ${socket.id}`);

        const userId = socket.handshake.query.userId
        // console.log('socket', socket.handshake.query);

        // console.log('userId', userId);

        if (userId != "undefined") {
            userSocketMap[userId] = socket.id
        }

        io.emit('getOnlineUsers', Object.keys(userSocketMap))

        socket.on('disconnect', () => {
            console.log(`user Disconnected with id: ${socket.id}`);
            delete userSocketMap[userId]
            io.emit('getOnlineUsers', Object.keys(userSocketMap))
        });
    });
}

export const getReceiverSocketId = (receiverId) => {
    console.log('sockertreceier',receiverId);
    
    return userSocketMap[receiverId]
}

const userSocketMap = {}//{userId:socketId}

export { initializeSocket,io };