const mongoose = require('mongoose');

const connectDb = async (url) => {
  mongoose
    .connect(url)
    .then(() => {
      console.log('Baza podłączona poprawnie');
    })
    .catch((err) => {
      return err;
    });
};

module.exports = connectDb;
