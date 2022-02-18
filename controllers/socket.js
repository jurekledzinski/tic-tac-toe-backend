const OnlinePlayers = require('../models/onlinePlayers');

const prepareDataGame = async (socketId, anotherSocketId) => {
  const sender = await OnlinePlayers.findOne({
    idSocket: socketId,
  }).select(['-__v']);

  const receiver = await OnlinePlayers.findOne({
    idSocket: anotherSocketId,
  }).select(['-__v']);

  const dataGame = {
    option: sender.option,
    namePlayer1: sender.name,
    namePlayer2: receiver.name,
    sign1: 'x',
    sign2: 'o',
    wins1: 0,
    wins2: 0,
    draws: 0,
    winner: '',
    loser: '',
    draw: false,
    email1: sender.email,
    email2: receiver.email,
    id: '',
    idSocket1: sender.idSocket,
    idSocket2: receiver.idSocket,
  };

  return dataGame;
};

let arrSign = [];
let checkFlag = true;
let move = [];

module.exports.live = (io) => {
  io.on('connection', async (socket) => {
    socket.on('join', async (msg) => {
      const restUsers = await OnlinePlayers.find({}).select(['-__v']);
      socket.join('join');
      socket.to('join').emit('join', restUsers);
      const id = msg;
      const usersOnline = await OnlinePlayers.find({ _id: { $ne: id } }).select(
        ['-__v']
      );
      socket.emit('join', usersOnline);
    });

    socket.on('private message', async (anotherSocketId, msg) => {
      const dataGame = await prepareDataGame(socket.id, anotherSocketId);
      socket.to(anotherSocketId).emit('private message', msg);
      let idTimeout = setTimeout(() => {
        socket.to(anotherSocketId).emit('private modal', dataGame);
        clearTimeout(idTimeout);
      }, 300);
    });

    socket.on('play again', async (anotherSocketId, msg) => {
      const dataGame = await prepareDataGame(socket.id, anotherSocketId);
      socket.to(anotherSocketId).emit('play again', msg);
      let idTimeout = setTimeout(() => {
        socket.to(anotherSocketId).emit('private modal', dataGame);
        clearTimeout(idTimeout);
      }, 300);
    });

    socket.on('start again', (anotherSocketId, data, msg) => {
      socket.to(anotherSocketId).emit('start again', data, msg);
    });

    socket.on('start game', (anotherSocketId, data, msg) => {
      socket.to(anotherSocketId).emit('start game', data, msg);
    });

    socket.on('game win', (anotherSocketId, msg1, msg2) => {
      socket.to(anotherSocketId).emit('game win', msg1, msg2);
    });

    socket.on('game lost', async (anotherSocketId, msg) => {
      socket.to(anotherSocketId).emit('game lost', msg);
    });

    socket.on('game draw', (anotherSocketId, msg) => {
      socket.to(anotherSocketId).emit('game draw', msg);
    });

    socket.on('game board', (anotherSocketId, msg) => {
      socket.to(anotherSocketId).emit('game board', msg);
    });

    socket.on('draw sign', (anotherSocketId) => {
      const draw = Math.round(Math.random() * 1);
      const flagDraw = draw ? true : false;
      if (!arrSign.length) arrSign.push({ sign1: flagDraw, sign2: !flagDraw });
      if (checkFlag) {
        const drawMove = Math.round(Math.random() * 1);
        const flagMove = drawMove ? true : false;
        if (!move.length) move.push(flagMove);
        socket.to(anotherSocketId).emit('draw sign', arrSign[0], move[0]);
        checkFlag = false;
      } else {
        socket.to(anotherSocketId).emit('draw sign', arrSign[0], move[0]);
        arrSign = [];
        checkFlag = true;
        move = [];
      }
    });

    socket.on('game move', (anotherSocketId, msg) => {
      socket.to(anotherSocketId).emit('game move', msg);
    });

    socket.on('player left', (anotherSocketId, msg) => {
      socket.to(anotherSocketId).emit('player left', true, msg);
    });

    socket.on('player remove list', (msg) => {
      socket.broadcast.emit('player remove list', msg);
    });

    socket.on('player disable', (msg1, msg2, msg3) => {
      io.emit('player disable', msg1, msg2, msg3);
    });

    socket.on('disconnect', async () => {
      await OnlinePlayers.findOneAndDelete({
        idSocket: socket.id,
      });

      const restUsers = await OnlinePlayers.find({}).select(['-__v']);
      socket.broadcast.emit('leave', restUsers);
    });
  });
};
