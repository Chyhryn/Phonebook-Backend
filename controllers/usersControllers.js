const bcrypt = require("bcrypt");
const { findUser, createUser, updateContacts } = require("../services");
const { generateToken } = require("../utils");

// * User controllers

const registerUser = async (req, res) => {
  const { email, password } = req.body;
  const salt = Number(process.env.SALT);

  const checkUser = await findUser({ email });
  if (checkUser) {
    return res.status(409).json({ message: "Email in use" });
  }

  const hashPassword = bcrypt.hashSync(password, salt, function (err) {
    return res.status(400).json({ message: err.message });
  });

  const user = await createUser({
    ...req.body,
    password: hashPassword,
    contacts: [],
  });
  if (!user) {
    return res.status(400).json({ message: "Can`t create user!" });
  }

  const token = generateToken({ id: user._id });
  user.token = token;

  const updateUserWithToken = await user.save();

  if (!updateUserWithToken) {
    return res.status(400).json({ message: "Can`t save token" });
  }

  res.status(201).json({
    token: user.token,
    user: { email: user.email },
  });
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  const user = await findUser({ email });
  const comparePassword = bcrypt.compareSync(password, user.password);

  if (!user || !comparePassword) {
    return res.status(401).json({ message: "Email or password is wrong" });
  }

  const token = generateToken({ id: user._id });
  user.token = token;

  const updateUserWithToken = await user.save();

  if (!updateUserWithToken) {
    return res.status(400).json({ message: "Can`t save token" });
  }

  res.status(200).json({
    token: user.token,
    user: { email: user.email },
  });
};

const logoutUser = async (req, res) => {
  const id = req.user;

  const user = await findUser({ _id: id });
  if (!user) {
    return res.status(401).json("Not authorized");
  }

  user.token = null;
  const updatedUserWithoutToken = await user.save();
  if (!updatedUserWithoutToken) {
    return res.status(400).json({ message: "Can`t delete token" });
  }

  res.status(204).json({ message: "No Content" });
};

const refreshUser = async (req, res) => {
  const id = req.user;

  const user = await findUser({ _id: id });
  if (!user) {
    return res.status(401).json("Not authorized");
  }

  res.status(200).json({ email: user.email });
};

// * Contacts controllers

const getContacts = async (req, res) => {
  const id = req.user;

  const user = await findUser({ _id: id });
  if (!user) {
    return res.status(401).json("Can't find user");
  }

  return res.status(200).json({ items: user.contacts });
};

const addContact = async (req, res) => {
  const id = req.user;

  const user = await findUser({ _id: id });
  if (!user) {
    return res.status(401).json("Can't find user");
  }

  user.contacts.push(req.body);

  await updateContacts({ _id: id }, { contacts: user.contacts });

  return res.status(201).json({ items: user.contacts });
};

const deleteContact = async (req, res) => {
  const id = req.user;
  const contactId = req.params.id;

  const user = await findUser({ _id: id });
  if (!user) {
    return res.status(401).json("Can't find user");
  }

  const updatedContacts = user.contacts.filter(
    (contact) => contact._id != contactId
  );

  await updateContacts({ _id: id }, { contacts: updatedContacts });

  res.status(200).json({ id, message: "contact deleted" });
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  getContacts,
  addContact,
  deleteContact,
  refreshUser,
};
