const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
const { DB_HOST } = process.env;

mongoose.set("strictQuery", false);

const connection = mongoose.connect(DB_HOST, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

module.exports = connection;
