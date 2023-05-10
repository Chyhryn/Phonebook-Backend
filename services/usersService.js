const Users = require("../models/users");

const createUser = ({ ...arg }) => {
  return Users.create(arg);
};

const findUser = ({ ...arg }) => {
  return Users.findOne(arg);
};

const updateContacts = (_id, body) => {
  return Users.findByIdAndUpdate(_id, body);
};

module.exports = {
  findUser,
  createUser,
  updateContacts,
};
