const jwt = require('jsonwebtoken')
const { generateAuthToken, findUserById } = require('../models/user.js')

async function authenticateToken(req, res, next) {
    try {

        const auth = req.header('Authorization').replace('Bearer ', '')
        const decoded = jwt.verify(auth, process.env.JWT_KEY)
        const user = await findUserById(decoded.id)
        if (user.rowCount === 0) {
            throw new Error()
        }
        req.token = auth
        req.user = user.rows[0]
        next()
    } catch (e) {
        res.status(401).send({ error: 'please Authorized .' + e })
    }
}

module.exports = { authenticateToken }