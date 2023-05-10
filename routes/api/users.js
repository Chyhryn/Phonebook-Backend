const express = require("express");

const router = express.Router();
const {
  registerUser,
  loginUser,
  logoutUser,
  getContacts,
  addContact,
  deleteContact,
  refreshUser,
} = require("../../controllers/usersControllers");

const { userValidation, authValidation } = require("../../middlewares");

router.post("/register", authValidation, registerUser);

router.post("/login", authValidation, loginUser);

router.get("/logout", userValidation, logoutUser);

router.get("/current", userValidation, refreshUser);

router.get("/contacts", userValidation, getContacts);

router.post("/contacts", userValidation, addContact);

router.delete("/contacts/:id", userValidation, deleteContact);

module.exports = { usersRouter: router };
