const express = require("express");
const db = require("../db/pg.js");
const { getMenuItems } = require("../models/items.js");

const router = new express.Router();

module.exports = router;
