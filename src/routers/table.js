const express = require('express')
const db = require('../db/pg.js')
const {
    updateUserName,
    updateUserPassword,
    findUserProfile,
    deleteUser,
    createUser
} = require('../models/user.js')
const { authenticateToken } = require('../middleware/authorization.js')

const router = new express.Router()

router.post('/ct', async(req, res) => {
    try {

        const response = await createUser(req.body)
        res.status(200).send(response)
    } catch (e) {
        res.status(400).send(e)
    }

})
router.get('/ctt', authenticateToken, async(req, res) => {
    res.status(200).send({ messgae: 'Authorized', user: req.user })
})



module.exports = router