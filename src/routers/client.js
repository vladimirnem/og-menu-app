const express = require('express')
const val = require('validator')
const db = require('../db/pg.js')
require('../models/client.js')


const router = new express.Router()


router.post('/cl', async(req, res) => {
    try {
        const clientCr = {
            name: 'me',
            email: 'lindman@gmail.com',
            address: '45 Ventura ct',
            id: 'dc2e7e08-11b0-46ae-b6b6-ab57ed90c541'
        }
        const address = req.body.address
        const response = await deleteClient(clientCr)
        res.status(200).send(response)
    } catch (e) {
        console.log(e)
        res.status(400).send(e)
    }

})




module.exports = router