const express = require('express')
const val = require('validator')
const db = require('../db/pg.js')
require('../models/client.js')


const router = new express.Router()


// Client route options


module.exports = router