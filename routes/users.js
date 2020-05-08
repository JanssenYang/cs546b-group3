const express = require('express')
const router = express.Router();
const data = require('../data')
const userData = data.users
const path = require('path')
const bcrypt = require("bcryptjs");
const xss = require("xss");

router.get('/new', async (req, res) => {
    res.render('layouts/register', {
        title: 'Create an account',
        errors: [],
        hasErrors: false
    })
    return
})

router.post('/register', async (req, res) => {
    let userInfo = req.body
    let errors = []

    if (!xss(userInfo.firstName)) {
        errors.push('First name not provided')
    }

    if (!xss(userInfo.lastName)) {
        errors.push('Last name not provided')
    }

    if(!xss(userInfo.userName)) {
        errors.push('Username not provided')
    }

    if(!xss(userInfo.password)) {
        errors.push('Password not provided')
    }

    if(!xss(userInfo.email)) {
        errors.push('Email not provided')
    }

    if(errors.length > 0) {
        res.render('layouts/register', {
            title: 'Create an account',
            errors: errors,
            hasErrors: true
        })
        return
    }

    const hash = await bcrypt.hash(xss(userInfo.password), 16);
    try {
        const newUser = await userData.addUser(
            xss(userInfo.firstName),
            xss(userInfo.lastName),
            xss(userInfo.userName),
            hash,
            xss(userInfo.email)
    )

        //Set the AuthCookie and have it expire in 1 hour
        req.session.user = newUser;
        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + 1);
        req.session.cookie.expires = expiresAt;

        res.render('users/profile', {
            title: `${xss(userInfo.userName)}'s Account`,
            userName: xss(userInfo.userName)
        })
        return
    } catch (e) {
        res.render('layouts/register', {
            title: 'Create an account',
            errors: [e],
            hasErrors: true
        })
        return
    }
    
})

router.post('/login', async (req, res) => {
    let userInfo = req.body
    let errors = []

    if (!xss(userInfo.userName)) {
        errors.push('Username not provided')
    }

    if (!xss(userInfo.password)) {
        errors.push('Password not provided')
    }

    if (errors.length > 0) {
        res.render('layouts/login', {
            title: 'Welcome',
            errors: errors,
            hasErrors: true
        })
        return
    }

    try {
        //Note: username is case sensitive
        const getUser = await userData.getUserByUserName(xss(userInfo.userName))
        const hashedPassword = getUser.hashedPassword;
        let match = await bcrypt.compare(xss(userInfo.password), hashedPassword);
        if (match) {
            //Set the AuthCookie and have it expire in 1 hour
            req.session.user = getUser;
            const expiresAt = new Date();
            expiresAt.setHours(expiresAt.getHours() + 1);
            req.session.cookie.expires = expiresAt;
            res.redirect(`/users/${xss(userInfo.userName)}`)
            return
        } else {
            throw 'Username and/or password incorrect'
        }
    } catch (e) {
        res.render('layouts/login', {
            title: 'Login',
            errors: ['Username and/or password incorrect'], //explicitly writing this b/c getUserByUserName() could throw an error itself
            hasErrors: true
        })
    }

})

router.get("/logout", async (req, res) => {
    let firstName = req.session.user.firstName;

    //Expire the AuthCookie
    const anHourAgo = new Date();
    anHourAgo.setHours(anHourAgo.getHours() - 1);
    req.session.cookie.expires = anHourAgo;

    res.render("layouts/logout", {title: "Logged Out", firstName: firstName});
});

//This route will be for displaying the user's profile page (event calendar, friends, add event, etc.)
//It will also be the route for viewing a friend's calendar/profile (if the given userName is a friend of the logged-in user)
router.get('/:userName', async (req, res) => {
    //If an non-authenticated user tries to access their profile page
    if(!req.session.user){
        res.status(403).render("layouts/error", {title: "403 Error: Not Authenticated", error: "Please login to view your profile."});
        return;
    }
    try{
        //Possible for this user to not exist, will throw and be caught below
        const getUser = await userData.getUserByUserName(req.params.userName);

        //If the user is logged in and the userName is not their own, check to see
        //if the user is friend's with that person. If not, they can't view their profile.
        if(req.params.userName !== req.session.user.userName){
            const friendsList = req.session.user.friends;
            let found = false;
            for(let index = 0; index < friendsList.length; index++){
                if(getUser._id.toString() === friendsList[index]){
                    //The user can view this person's profile because they are friends
                    found = true;
                    break;
                }
            }
            if(found == false){
                throw "You do not have access view this user's profile (you are not friends with them).";
            }
        }
        //this will be where we get event info from mongo and display in the user's calendar
        res.render('users/profile', {
            title: `${req.params.userName}'s Account`,
            userName: req.params.userName
        })
    }catch(e){
        res.status(404).render("layouts/error", {
            title: "404 Error: Not Found",
            error: e 
        });
    }
})

module.exports = router;
