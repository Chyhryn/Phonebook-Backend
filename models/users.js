const { Schema, model } = require("mongoose");

const contactsSchema = new Schema({
  name: { type: String, required: true },
  number: { type: String, required: true },
});

const userSchema = new Schema({
  password: {
    type: String,
    required: [true, "Set password for user"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
  },
  contacts: { type: [contactsSchema], required: true },
  token: String,
});

const Users = model("user", userSchema);

module.exports = Users;
