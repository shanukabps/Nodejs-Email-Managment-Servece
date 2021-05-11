/**
 *@dbusername=admin
 *@password=admin
 * This is Node js Server file
 * Make handle  route and calling data mongodb data base done by this
 * use trigger function with with realm mongodb achive this
 *
 * @Routes Folder include the Routes for Emails
 * @Models Folder include Datebase Model for Email
 */

/**
 *@EmailsRouts definde route in route folder EmailsRoute and import it
 *
 *
 */
const express = require("express");
const mongoose = require("mongoose");
const winston = require("winston/lib/winston/config");
const emailsRoute = require("./routes/emailsRotue");

//app config
const app = express();
const PORT = process.env.PORT || 2010;

app.use(express.json());

//use to connect to mongodb
MONGOURI =
  "mongodb+srv://admin:admin@cluster0.q8wsj.mongodb.net/emailstore?retryWrites=true&w=majority";
//connect to mongodb server
mongoose
  .connect(MONGOURI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => console.log("Connect to MongoDB.."))
  .catch((err) =>
    console.error("Could not connct to MongoDB....", err.message)
  );

app.use("/", emailsRoute);

/**
 *
 * listen to port
 */
app.listen(PORT, () => console.log(`listening on localhost:${PORT}`));

// //using this for testing
// const server = app.listen(port, () =>
//   winston.infor(`listening on localhost:${PORT}`)
// );
