const server = require('./app');

const { atlasUrl } = require('./config/config');
const connectDb = require('./db/conntectDb');

const port = process.env.PORT || 5000;

const startConnection = async () => {
  try {
    await connectDb(atlasUrl);
    server.listen(port, () => {
      console.log(`Server działa na porcie ${port}`);
    });
  } catch (err) {
    return err;
  }
};

startConnection();
