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
        if (typeof firstName !== 'string') throw 'Error: First name must be a string.'
        if (typeof lastName !== 'string') throw 'Error: Last name must be a string.'
        if (typeof userName !== 'string') throw 'Error: Username must be a string.'
        if (typeof password !== 'string') throw 'Error: Password must be a string.'
        if (typeof email !== 'string') throw 'Error: Email must be a string.'

        const userCollection = await users()

        let newUser = {
            firstName: firstName,
            lastName: lastName,
            userName: userName,
            hashedPassword: password,
            email: email,
            friends: [],
            events: []
        };

        const checkId = await userCollection.findOne({ userName: userName})
        if (checkId !== null) throw 'Error: Username already in use.' 

        const insertUser = await userCollection.insertOne(newUser)
        if (insertUser.insertedCount === 0) throw 'Error: Failed to insert user.'

        const newId = insertUser.insertedId
        const user = await this.getUserById(newId)

        return user

    }, 

    async getAllUsers(){
        const userCollection = await users();

        const allUsers = await userCollection.find({}).toArray();

        return allUsers;
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
        if (userGet === null) throw 'Error: No user has the input ID.'

        return userGet
    },

    async addFriend(username, friendUsername) {
        if (!username) throw 'Error: Username must be provided.';
        if (!friendUsername) throw 'Error: Friend username must be provided.';
        if (typeof username !== 'string') throw 'Error: username must be a string.';
        if (typeof friendUsername !== 'string') throw 'Error: Friend username must be a string.';

        const userCollection = await users();

        const user = await this.getUserByUserName(username);
        const friend = await this.getUserByUserName(friendUsername);

        //Setting it up so that if a user adds a friend, they will also be added to
        //that users' friends list
        let friendsList = user.friends;
        friendsList.push(friend._id.toString());
        user.friends = friendsList;

        let friendsList2 = friend.friends;
        friendsList2.push(user._id.toString());
        friend.friends = friendsList2;

        const updatedUser = await userCollection.updateOne({_id: user._id}, {$set: user});
        if (updatedUser.modifiedCount === 0) {
            throw 'Error: could not update user successfully';
        }

        const updatedFriend = await userCollection.updateOne({_id: friend._id}, {$set: friend});
        if (updatedFriend.modifiedCount === 0) {
            throw 'Error: could not update friend successfully';
        }

        return user;
    },

    //For when a user views a public or someone else's event and wants to add it 
    //to their event list. The event list will have event IDs as strings
    async addEvent(username, eventID){
        if (!username) throw 'Error: Username must be provided.';
        if (!eventID) throw 'Error: eventID must be provided.';
        if (typeof username !== 'string') throw 'Error: username must be a string.';
        if (typeof eventID !== 'string' && typeof eventID !== 'object') throw 'Error: eventID must be a string or object ID.';

        const userCollection = await users();
        const eventCollection = await events();

        const user = await this.getUserByUserName(username);
        if (typeof eventID === 'string') {
            eventID = ObjectId.createFromHexString(eventID);
        }
        const event = await eventCollection.findOne({_id: eventID}); 

        //Updating user's events list
        let eventList = user.events;
        eventList.push(eventID.toString());
        user.events = eventList;

        //Updating the event's participants list (list of string ID's)
        let participantsList = event.participants;
        participantsList.push(user._id.toString());
        event.participants = participantsList;

        const updatedUser = await userCollection.updateOne({_id: user._id}, {$set: user});
        if (updatedUser.modifiedCount === 0) {
            throw 'Error: could not update user successfully';
        }

        const updatedEvent = await eventCollection.updateOne({_id: eventID}, {$set: event});
        if (updatedEvent.modifiedCount === 0) {
            throw 'Error: could not update event successfully';
        }

        return user;
    }
}