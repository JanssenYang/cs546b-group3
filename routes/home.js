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
        let friend = user.friends;
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
        // console.log(event);
        for( let i=0; i<event.length; i++ ){
            let aEvent = await eventData.getEvent(event[i]);
            let tempForm={
                eventName: aEvent.eventName,
                eventdate: aEvent.date,
                eventLocation: aEvent.location,
                vis: aEvent.visibility,
                eventId: event[i]
            };
            eventNameAndTime.push(tempForm);
        }


        let obj={
            title: `${user.userName}'s Home`,
            userName: user.userName,
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
router.get("/:id", async(req, res)=>{
    if(!req.session.user){
        res.status(403).render("layouts/error", {title: "403 Error: Not Authenticated", error: "Please login to view your profile."});
        return;
    }
    try{
        const eventId = req.params.id;
        const user = req.session.user;
        // console.log( eventId );
        // console.log(user);
        let mark=false;
        const event = await eventData.getEvent(eventId);
        // console.log(event);
        if( event.eventHostID === user._id.toString() ) mark = true;
        if( !mark ) res.redirect('/');
        // console.log(mark)
        let a = await eventData.changeVisibility(eventId);
        // console.log(a);
        res.redirect('/');
    }
    catch(e){
        res.status(500).render("layouts/error", {
            title: "500 Error: Interval Error",
            error: e 
        });
    }
});


module.exports = router;
