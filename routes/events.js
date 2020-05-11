const express = require('express');
const router = express.Router();
const data = require('../data');
const eventData = data.events;
const userData = data.users;
const path = require('path');
const xss = require("xss");

//Single event page
router.get('/:id', async (req, res) => {
    try{
        const event = await eventData.getEvent(xss(req.params.id));
    
        const participants = event.participants;
        let participantObjects = [];
        let inEvent = false;
        let owner = false;
        for(let index = 0; index < participants.length; index++){
            let participant = await userData.getUserById(participants[index]);
            let participantObject = {
                userName: participant.userName,
                name: participant.firstName + " " + participant.lastName
            }
            participantObjects.push(participantObject);                
        }
        if(event.eventHostID === req.session.user._id){
            owner = true;
        }
        if((participantObjects.map((obj) => {return obj.userName})).includes(req.session.user.userName)){
            inEvent = true;
        }
        let isPrivate = false;
        if(event.visibility === "private"){
            isPrivate = true;
        }
        res.render('events/singleEvent', 
            {
                event: event,
                numParticipants: participants.length,
                participants: participantObjects,
                userId: req.session.user._id,
                inEvent: inEvent,
                owner: owner,
                isPrivate: isPrivate
            });
        return;
    }
    catch(e){
        res.status(500).render("events/eventErrors", {error: e});
        return;
    }
});

router.get("/", async(req, res) => {    
    try{
        let events = await eventData.getAllEvents();
        let publicEvents = [];
        let empty = false;
        for(i = 0; i < events.length; i++){
            if(events[i].visibility === "public"){
                publicEvents.push(events[i]);
            }
        }
        if(publicEvents.length === 0){        
            empty = true;
        }
        res.render("events/publicEvents",{
            events: publicEvents,
            empty: empty
        });
        return;
    }
    catch(e){
        res.status(500).render("events/eventErrors", {error: e});
        return;
    }
});

router.post("/newEvent", async(req, res) => {
    try{
        let event = {
            nameInp: xss(req.body.name),
            locationInp: xss(req.body.location),
            dateInp: new Date(xss(req.body.date) + " " + xss(req.body.start)),
            startInp: xss(req.body.start),
            endInp: xss(req.body.end),
        };
        let newEvent = await eventData.addEvent(event.nameInp, "public", event.dateInp, event.startInp, event.endInp, event.locationInp, req.session.user._id);
        res.render("partials/addAjaxEvent", {
            layout: null,
            ...newEvent
        });
        return;
    }
    catch(e){
        res.status(500).render("events/eventErrors", {error: e});
        return;
    }
});

router.post("/joinEvent:id", async(req, res) => { 
    try{
        await userData.addEvent(req.session.user.userName, xss(req.params.id));
        res.redirect("/events/" + xss(req.params.id));
        return;
    }
    catch(e){
        res.status(500).render("events/eventErrors", {error: e});
        return;
    }
});

router.post("/leaveEvent:id", async(req, res) => {
    try{
        await userData.leaveEvent(req.session.user.userName, xss(req.params.id));
        res.redirect("/events/" + xss(req.params.id));
        return;
    }
    catch(e){
        res.status(500).render("events/eventErrors", {error: e});
        return;
    }
});

router.post("/deleteEvent:id", async(req, res) => {
    try{
        const deletedEvent = await eventData.removeEvent(xss(req.params.id));
        if(deletedEvent.visibility === "public"){
            res.redirect("/events");
        }
        else{
            res.redirect("/home");
        }
        return;
    }
    catch(e){
        res.status(500).render("events/eventErrors", {error: e});
        return;
    }
});

router.post("/addComment:id", async(req, res) => {
    try{
        let currDate = new Date();
        await eventData.addComment(xss(req.params.id), req.session.user.userName, xss(req.body["commentText"]), currDate, currDate.getHours() + ":" + currDate.getMinutes());
        res.redirect("/events/" + xss(req.params.id));
        return;
    }
    catch(e){
        res.status(500).render("events/eventErrors", {error: e});
        return;
    }
});

module.exports = router;