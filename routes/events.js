const express = require('express');
const router = express.Router();
const data = require('../data');
const eventData = data.events;
const userData = data.users;
const path = require('path');
const xss = require("xss");

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

router.get("/", async(req, res) => { //change data types of events
    let events = await eventData.getAllEvents();
    let publicEvents = [];
    let empty = false;
    for(i = 0; i < events.length; i++){
        if(events[i].visibility === "public"){
            publicEvents.push(events[i]);
        }
    }
    //sort by date
    if(publicEvents.length === 0){        
        empty = true;
    }
    res.render("events/publicEvents",{
        events: publicEvents,
        empty: empty
    });
});

//Consider date, start, and end to all be date inputs
//add link to delete event???
router.post("/newEvent", async(req, res) => {
    let event = {
        nameInp: xss(req.body.name),
        locationInp: xss(req.body.location),
        dateInp: new Date(xss(req.body.date) + " " + xss(req.body.start)), //just get m/d/y
        startInp: xss(req.body.start),
        endInp: xss(req.body.end),
    };
    console.log(req.body.date);
    console.log(event.dateInp);
    let newEvent = await eventData.addEvent(event.nameInp, "public", event.dateInp, event.startInp, event.endInp, event.locationInp, req.session.user._id);
    res.render("partials/addAjaxEvent", {
        layout: null,
        ...newEvent
    });
});

module.exports = router;