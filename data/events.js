const mongoCollections = require('../config/mongoCollections');
const users = mongoCollections.users;
const events = mongoCollections.events;
const { ObjectId } = require('mongodb');

module.exports = {
    async addEvent(eventName, visibility, date, timeStart, timeEnd, location, eventHostID,){
        if (!eventName) throw 'Error: Event name not supplied.';
        if (!visibility) throw 'Error: Visibility not supplied.';
        if (!date) throw 'Error: Date not supplied.';
        if (!timeStart) throw 'Error: Start time not supplied.';
        if (!timeEnd) throw 'Error: End time not supplied.';
        if (!location) throw 'Error: Location not supplied.';
        if (!eventHostID) throw 'Error: Event host ID not supplied.';
        if (typeof eventName !== 'string') throw 'Error: First name must be a string.';
        if (typeof visibility !== 'string') throw 'Error: Last name must be a string.';
        //Having the date be a date object will make it easier to work with
        if (Object.prototype.toString.call(date) !== '[object Date]') throw 'Error: Date must be a date object.';
        if (typeof timeStart !== 'string') throw 'Error: Start time must be a string.';
        if (typeof timeEnd !== 'string') throw 'Error: End time must be a string.';
        if (typeof location !== 'string') throw 'Error: Location must be a string.';
        if (typeof eventHostID !== 'string') throw 'Error: Event host ID must be a string.';

        const eventCollection = await events();
        const userCollection = await users();

        let event = {
            eventName: eventName,
            visibility: visibility,
            date: date,
            timeStart: timeStart,
            timeEnd: timeEnd,
            location: location,
            eventHostID: eventHostID,
            participants: [eventHostID],
            comments: []
        };

        const insertEvent = await eventCollection.insertOne(event);
        if (insertEvent.insertedCount === 0) throw 'Error: could not add event.';

        const id = insertEvent.insertedId;
        const insertedEvent = await this.getEvent(id);

        //Add event id to user's event list 
        const userObjId = ObjectId.createFromHexString(eventHostID);
        const user = await userCollection.findOne({_id: userObjId});
        if (user === null) throw 'Error: No user found.'
        
        let eventList = user.events;
        eventList.push(id.toString()); //adds the new event id to the event list
        user.events = eventList; 
        const updatedInfo = await userCollection.updateOne({_id: userObjId}, {$set: user});
        if (updatedInfo.modifiedCount === 0) {
            throw 'Error: could not update user successfully.';
        }

        return insertedEvent;
    },

    async getAllEvents(){
        const eventCollection = await events();

        const allEvents = await eventCollection.find({}).toArray();

        return allEvents;
    },

    async getEvent(id){
        if (!id) throw 'Error: event ID must be provided';
        if (typeof id !== 'string' && typeof id !== 'object') throw 'Error: event ID must be a string or object ID.'
        if (typeof id === 'string') {
            id = ObjectId.createFromHexString(id);
        }

        const eventCollection = await events();

        const event = await eventCollection.findOne({ _id: id })
        if (event === null) throw 'Error: No event has the input ID.';

        return event;
    },

    async addComment(eventID, username, commentText, date, time){
        if (!eventID) throw 'Error: event ID must be provided.';
        if (!username) throw 'Error: username must be provided.';
        if (!commentText) throw 'Error: comment text must be provided.';
        if (!date) throw 'Error: date must be provided.';
        if (!time) throw 'Error: time must be provided.';
        if (typeof eventID !== 'string' && typeof eventID !== 'object') throw 'Error: event ID must be a string or object ID.'
        if (typeof eventID === 'string') {
            eventID = ObjectId.createFromHexString(eventID);
        }
        if (typeof username !== 'string') throw 'Error: username must be a string.';
        if (typeof commentText !== 'string') throw 'Error: comment text must be a string.';
        if (Object.prototype.toString.call(date) !== '[object Date]') throw 'Error: date must be a date object.';
        if (typeof time !== 'string') throw 'Error: time must be a string.';

        const eventCollection = await events();

        let commentID = ObjectId();
        let comment = {
            _id: commentID,
            username: username,
            commentText: commentText,
            date: date,
            time: time
        };

        //Add the comment subdocument to the comments list of the event
        const updatedInfo = await eventCollection.updateOne({_id: eventID}, {$push: {'comments': comment}});
        if (updatedInfo.modifiedCount === 0) {
            throw 'Error: could not update event comment list successfully.';
        }

        return comment;
    },

    async removeEvent(id){
        if (!id) throw 'Error: event ID must be provided';
        if (typeof id !== 'string' && typeof id !== 'object') throw 'Error: event ID must be a string or object ID.'
        if (typeof id === 'string') {
            id = ObjectId.createFromHexString(id);
        }

        const eventCollection = await events();
        const userCollection = await users();

        const deletedEvent = await this.getEvent(id);
        const participants = deletedEvent.participants;

        //Delete the event from each participant's event list
        for(index = 0; index < participants.length; index++){
            let userID = participants[index];
            let userObjId = ObjectId.createFromHexString(userID);
            let user = await userCollection.findOne({_id: userObjId});
            
            let eventList = user.events;
            let ind = eventList.indexOf(id.toString());
            eventList.splice(ind, 1); //removes the event from the user's event list
            user.events = eventList; 
            const updatedInfo = await userCollection.updateOne({_id: user._id}, {$set: user});
            if (updatedInfo.modifiedCount === 0) {
                throw 'Error: could not update user successfully';
            }
        }

        const deletionInfo = await eventCollection.deleteOne({_id: id});
        if (deletionInfo.deletedCount === 0) {
            throw `Error: could not delete event with id of ${id}`;
        }

        return deletedEvent;
    },

    async changeVisibility(eventID){
        if (!eventID) throw 'Error: event ID must be provided.';
        if (typeof eventID !== 'string' && typeof eventID !== 'object') throw 'Error: event ID must be a string or object ID.'
        if (typeof eventID === 'string') {
            eventID = ObjectId.createFromHexString(eventID);
        }
        const eventCollection = await events();
        const change = await this.getEvent(eventID);
        if( change.visibility === "public" ){
            change.visibility = "private";
        }else change.visibility = "public";

        const updatedInfo = await eventCollection.updateOne( {_id:eventID}, {$set:change} );
        if( updatedInfo === 0 ) throw 'could not change the visibility';

        return change;
    }
}