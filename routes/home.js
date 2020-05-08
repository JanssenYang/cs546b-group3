const express = require('express')
const router = express.Router();
const data = require('../data')
const userData = data.users;
const eventData = data.events;
const xss = require("xss");

router.get('/', async (req, res)=>{
    try{
        let tempUser = req.session.user;
        // let friendNameAndLink=[{userName:"testname", userId: "testId"}];
        // let eventNameAndTime=[{eventName:"group meeting", eventdate: new Date(),eventId: "testEventId"}];
        let friendNameAndLink=[];
        let eventNameAndTime=[];

        let user = await userData.getUserById(tempUser._id);
        let friend = user.friend;
        if(friend){
            for( let i=0; i<friend.length; i++ ){
                let person= await userData.getUserById(friend[i]);
                //use the name to show who the friend is, use id to link the friend on the page
                let tempForm={
                    userName: person.userName,
                    usersId: friend[i]
                };
                friendNameAndLink.push(tempForm);
            }
        }
        let event = user.events;
        console.log(event);
        for( let i=0; i<event.length; i++ ){
            let aEvent = await eventData.getEvent(event[i]);
            let tempForm={
                eventName: aEvent.eventName,
                eventdate: aEvent.date,
                eventId: event[i]
            };
            eventNameAndTime.push(tempForm);
        }


        let obj={
            title: `${user.userName}'s Home`,
            // userName: user.userName,
            friend: JSON.stringify(friendNameAndLink),
            event: JSON.stringify(eventNameAndTime)
        };
        res.render('home/normal', obj);
    }catch(e){
        res.status(404).render("layouts/error", {
            title: "404 Error: Not Found",
            error: e 
        });
    }
});

router.get("/newEvent", async(req, res) => {
    res.render("home/privateEventForm", {anyErrors: false});
});

router.post("/newEvent", async(req, res) => {
    let eventErrors = [];
    let anyErrors = false;
    let name = xss(req.body.privateEventName)
    let location = xss(req.body.privateLocation);
    let date = xss(req.body.privateEventDate);
    let start = xss(req.body.privateStartTime);
    let end = xss(req.body.privateEndTime);
    if(!name){
        eventErrors.push("You must input a name");
        anyErrors = true;
    }
    if(!location){
        eventErrors.push("You must input a location");
        anyErrors = true;
    }
    if(!date){
        eventErrors.push("You must input a date");
        anyErrors = true;
    }
    if(!start){
        eventErrors.push("You must input a start time");
        anyErrors = true;
    }
    if(!end){
        eventErrors.push("You must input an end time");
        anyErrors = true;
    }
    if(anyErrors){        
        res.render("home/privateEventForm", {anyErrors: true, errors: eventErrors});
        return;
    }
    else{
        try{
            await eventData.addEvent(name, "private", new Date(date + " " + start), start, end, location, req.session.user._id);
            res.redirect("/home");
            return;
        }
        catch(e){
            res.status(500).render("layouts/error", {title: "500: Internal server Error", error: e});
            return;
        }
    }
});

module.exports = router;
