const express = require('express')
const router = express.Router();
const data = require('../data')
const userData = data.users;
const eventData = data.events;

router.get('/', async (req, res)=>{
    if( !req.session.user ){
        res.redirect('/');
        return;
    }
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

module.exports = router;
