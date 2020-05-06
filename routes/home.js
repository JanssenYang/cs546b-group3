const express = require('express')
const router = express.Router();
const data = require('../data')
const userData = data.users;
const eventDate = data.events;

router.get('/', async (req, res)=>{
    if( !req.session.user ){
        res.redirect('/');
        return;
    }
    try{
        let user = req.session.user;
        let friendNameAndLink=[{userName:"testname", userId: "testId"}];
        let eventNameAndTime=[{eventName:"group meeting", eventdate: new Date(),eventId: "testEventId"}];
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

module.exports = router;
