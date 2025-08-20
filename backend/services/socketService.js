import { io } from 'socket.io-client';

let socket;

export const initiateSocketConnection = (userId) => {
  if (socket) return;

  socket = io('http://localhost:5001', {
    query: { userId },
  });

  console.log(`Connecting socket for user ${userId}...`);

  socket.on('connect', () => {
    console.log('Connected to socket server!');
  });
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const subscribeToMessages = (callback) => {
  if (!socket) return;
  socket.on('newMessage', (message) => {
    callback(message);
  });
};

export const sendMessage = (messageData) => {
  if (socket) {
    socket.emit('sendMessage', messageData);
  }
};