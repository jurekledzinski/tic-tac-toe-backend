const server = require('./app');

const { atlasUrl } = require('./config/config');
const connectDb = require('./db/conntectDb');

const port = process.env.PORT || 5000;

const startConnection = async () => {
  try {
    await connectDb(atlasUrl);
    server.listen(port);
  } catch (err) {
    return err;
  }
};

startConnection();
