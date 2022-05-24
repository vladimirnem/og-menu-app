require('dotenv').config()
const db = require('../db/pg.js')
const val = require('validator')
const bcrypt = require('bcrypt')




// Create Client
async function createClient(client) {
    if (val.isEmptry(client.name) || val.isEmptry(client.email) || val.isEmptry(client.address) || val.isEmail(client.email)) {
        return { text: 'Please, provide full information about Client.' }
    }

    try {
        const hash = await bcrypt.hash(client.password, 8)
        const query = {
            text: 'Insert into clients (name,email,address,password) values($1,$2,$3) returning *;',
            values: [client.name, client.email, client.address, client.password]
        }
        const res = await db.query(query)
        return res.rows[0]

    } catch (e) {
        throw new Error(e)
    }
}


// Find Client by id
async function findClientById(client) {
    if (client.id === undefined) {
        return { text: 'I dont see any Clients here.' }
    }
    try {
        const query = {
            text: 'select name,email from clients where id=$1',
            values: [client.id]
        }
        const res = await db.query(query)
        return res.rows[0]

    } catch (e) {
        throw new Error(e)
    }
}

// Update client name
async function updateClientName(client, name) {
    console.log(client.name)
    console.log(name)
    if (client.name === name) {
        return { text: 'I dont see difference. Maybe you try another one.' }
    }
    try {
        const query = {
            text: 'Update clients set name=$1 where id=$2 returning *;',
            values: [name, client.id]
        }
        const res = await db.query(query)
        return res.rows[0]
    } catch (e) {
        throw new Error(e)
    }
}

// Update client name
async function updateClientEmail(client, email) {
    if (client.email === email || !val.isEmail(email)) {
        return { text: 'I dont see difference. Maybe you try another one.' }
    }
    try {
        const query = {
            text: 'Update clients set email=$1 where id=$2 returning *;',
            values: [email, client.id]
        }
        const res = await db.query(query)
        return res.rows[0]
    } catch (e) {
        throw new Error(e)
    }
}

// Update address of Event
async function updateClientAddress(client, address) {
    if (val.isEmpty(address)) {
        return { text: 'Looks like there is no Event Location. Please Provide address of venue' }
    }
    try {
        const query = {
            text: 'Update clients set name=$1 where id=$2 returning *;',
            values: [address, client.id]
        }
        const res = await db.query(query)
        return res.rows[0]
    } catch (e) {
        throw new Error(e)
    }
}


// Delete Client
async function deleteClient(client) {
    try {
        const query = {
            text: 'Delete from clients where id=$1;',
            values: [client.id]
        }
        const res = await db.query(query)
        if (res.rowCount > 0) {
            return { text: 'Client has Successfuly Deleted' }
        } else {
            return { text: 'Hmmm.I cant find anyone here. Try again.' }
        }
    } catch (e) {
        throw new Error(e)
    }
}




module.exports = {
    createClient,
    findClientById,
    updateClientName,
    updateClientEmail,
    updateClientAddress,
    deleteClient
}