const Sentry = require('@sentry/node-experimental');
const dotenv = require('dotenv').config();
Sentry.init({
  dsn: process.env.SENTRY_SERVER_DSN,
  tracesSampleRate: 1.0,
  debug: true,
});

const express = require('express');
const cors = require('cors');
require('./config/mongo');

const {VerifyToken, VerifySocketToken} = require('./middlewares/VerifyToken');
const chatRoomRoutes = require('./routes/chatRoom');
const chatMessageRoutes = require('./routes/chatMessage');
const userRoutes = require('./routes/user');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(VerifyToken);

const PORT = process.env.PORT || 8080;

app.use('/api/room', chatRoomRoutes);
app.use('/api/message', chatMessageRoutes);
app.use('/api/user', userRoutes);

const server = app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

const { Server } = require('socket.io');
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    credentials: true,
  },
});

io.use(VerifySocketToken);

global.onlineUsers = new Map();

const getKey = (map, val) => {
  for (let [key, value] of map.entries()) {
    if (value === val) return key;
  }
};

io.on('connection', (socket) => {
  global.chatSocket = socket;

  socket.on('addUser', (userId) => {
    onlineUsers.set(userId, socket.id);
    socket.emit('getUsers', Array.from(onlineUsers));
  });

  socket.on('sendMessage', ({ senderId, receiverId, message }) => {
    const sendUserSocket = onlineUsers.get(receiverId);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit('getMessage', {
        senderId,
        message,
      });
    }
  });

  socket.on('disconnect', () => {
    onlineUsers.delete(getKey(onlineUsers, socket.id));
    socket.emit('getUsers', Array.from(onlineUsers));
  });
});
