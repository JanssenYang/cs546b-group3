const mongoCollections = require('../config/mongoCollections')
const users = mongoCollections.users
const events = mongoCollections.events
const { ObjectId } = require('mongodb')

module.exports = {
    async addUser(firstName, lastName, userName, password, email) {
        //CHECK TYPES
        if (!firstName) throw 'Error: First name not supplied.'
        if (!lastName) throw 'Error: Last name not supplied.'
        if (!userName) throw 'Error: Username not supplied.'
        if (!password) throw 'Error: Password not supplied.'
        if (!email) throw 'Error: Email not supplied.'

        const userCollection = await users()

        let newUser = {
            firstName: firstName,
            lastName: lastName,
            userName: userName,
            password: password,
            email: email
        }

        const checkId = await userCollection.findOne({ userName: userName})
        if (checkId !== null) throw 'Error: Username already in use.' 

        const insertUser = await userCollection.insertOne(newUser)
        if (insertUser.insertedCount === 0) throw 'Error: Failed to insert user.'

        const newId = insertUser.insertedId
        const user = await this.getUserById(newId)

        return user

    }, 

    async getUserByUserName(userName) {
        if (!userName) throw 'Error: Username must be provided.'
        if (typeof userName !== 'string') throw 'Error: Username must be a string.'

        const userCollection = await users()
        const userGet = await userCollection.findOne({ userName: userName })
        if (userGet === null) throw 'Error: No user has the input username.'

        return userGet
    },

    async getUserById(id) {
        if (!id) throw 'Error: no ID.'
        if (typeof id !== 'string' && typeof id !== 'object') throw 'ID must be a string or object ID.'

        if (typeof id === 'string') {
            id = ObjectId.createFromHexString(id)
        }

        const userCollection = await users()
        const userGet = await userCollection.findOne({ _id: id })
        if (userGet === null) throw 'Error: No band has the input ID.'

        return userGet
    }
}