const express = require('express');
const router = express.Router();
const data = require('../data');
const eventData = data.events;
const userData = data.users;
const path = require('path')

//Single event page
router.get('/:id', async (req, res) => {
    const event = await eventData.getEvent(req.params.id);
    const participants = event.participants;
    let participantObjects = [];
    for(let index = 0; index < participants.length; index++){
        let participant = await userData.getUserById(participants[index]);
        let participantObject = {
            userName: participant.userName,
            name: participant.firstName + " " + participant.lastName
        }
        participantObjects.push(participantObject);
    }
    res.render('events/singleEvent', 
        {
            event: event,
            numParticipants: participants.length,
            participants: participantObjects
        });
});

module.exports = router;