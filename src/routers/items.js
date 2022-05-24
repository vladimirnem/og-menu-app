const express = require('express')
const db = require('../db/pg.js')
const { getMenuItems } = require('../models/items.js')

const router = new express.Router()


router.post('/it', async(req, res) => {
    try {

        const menuItems = {
            menuType: 'cold',
            modifiers: {
                nuts: true,

            }
        }
        const items = await getMenuItems(menuItems)
        res.status(222).send(items)

    } catch (e) {
        throw new Error(e)
    }
})


module.exports = router