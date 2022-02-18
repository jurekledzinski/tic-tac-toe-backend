const history = require('connect-history-api-fallback');
const compression = require('compression');
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server, {
  cors: {
    origin: 'https://hungry-tesla-ef1a08.netlify.app',
    credentials: true,
  },
});

const cors = require('cors');
const helmet = require('helmet');
const xss = require('xss-clean');

const resultsRoutes = require('./routes/results');
const socketRoute = require('./controllers/socket');
socketRoute.live(io);

app.use(history());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(compression());
app.use(helmet());
app.disable('x-powered-by');
app.use(
  cors({
    credentials: true,
    origin: 'https://hungry-tesla-ef1a08.netlify.app',
  })
);
app.use(xss());

app.use((req, res, next) => {
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self' ik.imagekit.io *.ik.imagekit.io mongodb.com *.mongodb.com; img-src * 'self' data: https:;font-src *; object-src 'self';script-src 'self';style-src 'self' 'unsafe-inline' fontawesome.com *.fontawesome.com fonts.google.com *.fonts.google.com fonts.googleapis.com *.fonts.googleapis.com;"
  );
  next();
});

app.use((req, res, next) => {
  res.header('Cross-Origin-Resource-Policy', 'cross-origin');
  next();
});

app.use('/api/v1/results', resultsRoutes);

app.use((error, req, res, next) => {
  res.status(404);
  error.message = 'Not found';
  next(error);
});

app.use((error, req, res, next) => {
  res.status(res.statusCode || 500);
  error.message = 'Server error';
  res.json({ message: error });
  next(error);
});

module.exports = server;
