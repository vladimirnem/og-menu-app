const db = require('../db/pg')


//Get All items by menu type
async function getMenuItems(menuItems) {
    const req = menuItems
    let queryModifier = ''
    const queryValues = []
    queryValues[0] = req.menuType
    if (req.modifiers === undefined) {
        try {
            const query = {
                text: 'Select name, description,menu_type from dishes where menu_type=$1 ;',
                values: [req.menuType]
            }
            const res = await db.query(query)
            return res.rows

        } catch (e) {
            throw new Error(e)
        }
    } else {
        try {
            if (req.modifiers.kosher !== undefined) {
                queryValues.push(req.modifiers.kosher)
                queryModifier = ' and kosher=$' + queryValues.length

            }
            if (req.modifiers.vegan !== undefined) {
                queryValues.push(req.modifiers.vegan)
                queryModifier = ' and vegan=$' + queryValues.length
            }
            if (req.modifiers.nuts !== undefined) {
                queryValues.push(req.modifiers.nuts)
                queryModifier = ' and nuts=$' + queryValues.length
            }
            if (req.modifiers.pork !== undefined) {
                queryValues.push(req.modifiers.pork)
                queryModifier = ' and pork=$' + queryValues.length
            }
            if (req.modifiers.shellfish !== undefined) {
                queryValues.push(req.modifiers.shellfish)
                queryModifier = ' and shellfish=$' + queryValues.length
            }
            const query = {
                text: 'select * from dishes where menu_type=$1' + queryModifier,
                values: queryValues
            }
            console.log(query)
            const res = await db.query(query)
            return res.rows
        } catch (e) {
            throw new Error(e)
        }

    }
}


module.exports = { getMenuItems }