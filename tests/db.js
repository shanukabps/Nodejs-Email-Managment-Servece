const winston = require("winston");
const mongoose = require("mongoose");

module.exports = function () {
  MONGOURI =
    "mongodb+srv://admin:admin@cluster0.q8wsj.mongodb.net/emailstore?retryWrites=true&w=majority";
  mongoose
    .connect(MONGOURI, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    })
    .then(() => winston.info("Testing Connect to MongoDBTest EmailStore.."))
    .catch((err) =>
      console.error("Could not connct to MongoDB....", err.message)
    );
};
