const express = require("express");
const db = require("../db/pg.js");
const {
  updateUserName,
  updateUserPassword,
  findUserProfile,
  deleteUser,
  createUser,
} = require("../models/user.js");
const { authenticateToken } = require("../middleware/authorization.js");

const router = new express.Router();

router.get("/ctt", authenticateToken, async (req, res) => {
  res.status(200).send({ messgae: "Authorized", user: req.user });
});

module.exports = router;
