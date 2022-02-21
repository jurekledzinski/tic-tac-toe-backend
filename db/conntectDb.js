const mongoose = require('mongoose');

const connectDb = async (url) => {
  mongoose
    .connect(url)
    .then()
    .catch((err) => {
      return err;
    });
};

module.exports = connectDb;
