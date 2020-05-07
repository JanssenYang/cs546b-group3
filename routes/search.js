const express = require('express');
const router = express.Router();
const mongoCollections = require('../config/mongoCollections');
const data = require('../data');
const events = mongoCollections.events;
const users = mongoCollections.users;
const userData = data.users;
const eventData = data.events;
const path = require('path')
const xss = require('xss')

router.get('/', async (req, res) => {
    res.render('search/events', {
        title: 'Search Events',
        hasErrors: false,
        errors: []
    })
    return
})

// I need this for the javascript to load on the /search page
router.get('/js/searchFormUpdate.js', async(req, res) => {
    res.sendFile(path.resolve("public/js/searchFormUpdate.js"))
    return
})

router.get('/searchFriends', async (req, res) => {
    res.render('search/searchFriends', {
        title: 'Search Friends'
    })
    return
})

router.get('/addFriends', async (req, res) => {
    res.render('search/addFriends', {
        title: 'Add Friends'
    })
    return
})

// For when they search events
router.post('/', async (req, res) =>  {
    let eventSearchParameter = xss(req.body.eventSearchParameter)
    let eventSearchValue = xss(req.body.searchInput)
    let errors = []

    // Check that they filled out the form
    if (!eventSearchParameter) {
        errors.push("You must search by Location, Date, or Name")
    }
    if (!eventSearchValue) {
        errors.push("You must enter a search value")
    }

    // If the form was not filled out, render a page with the errors showing
    if (errors.length !== 0) {
        res.render('search/events', {
            title: 'Search Events',
            hasErrors: true,
            errors: errors
        })
        return
    }

    let eventsFound = await eventData.getAllEvents()

    for (let i = 0; i < eventsFound.length; i++) {
        if (eventsFound[i][eventSearchParameter] !== eventSearchValue) {
            eventsFound.splice(i, 1)
            i--
        }
    }

    let currentUser = req.session.user

    for (let i = 0; i < eventsFound.length; i++) {
        // Events displayed must be public, have the user as a participant, or be made by the user
        if (eventsFound[i].visibility !== 'public' && !eventsFound[i].participants.includes(currentUser._id.toString()) && !eventsFound[i].eventHostID !== currentUser._id.toString()) {
            eventsFound.splice(i, 1)
            i--
        }
    }

    if (eventsFound.length === 0) {
        res.render('search/results', {
            title: 'Search Results',
            matchingResults: false
        })
        return
    }
    
    res.render('search/results', {
        title: 'Search Results',
        matchingResults: true,
        searchEvents: true,
        events: eventsFound
    })
    return


})

// For when they search their friends
router.post('/searchFriends', async (req, res) => {
    let friendSearchParameter = xss(req.body.searchParameter)
    let friendSearchValue = xss(req.body.searchInput.toLowerCase())
    let errors = []

    // Check that they filled out the form
    if (!friendSearchParameter) {
        errors.push("You must search by username, email, first name, or last name")
    }
    if (!friendSearchValue) {
        errors.push("You must enter a search value")
    }

    // If they did not fill out the form, render a page telling them they need to provide more info
    if (errors.length !== 0) {
        res.render('search/searchFriends', {
            title: 'Search Friends',
            hasErrors: true,
            errors: errors
        })
        return
    }

    let usersFound = await userData.getAllUsers()

    // Search users based on the user's chosen parameter

    for (let i = 0; i < usersFound.length; i++) {
        usersFound[i][friendSearchParameter] = usersFound[i][friendSearchParameter].toLowerCase()
        if (usersFound[i][friendSearchParameter] !== friendSearchValue) {
            usersFound.splice(i, 1)
            i--
        }
    }

    let currentUser = req.session.user

    // Loop through the users that match and remove anyone that they are not friends with. Also remove the user if they show up
    for (let i = 0; i < usersFound.length; i++) {
        if (!currentUser.friends.includes(usersFound[i]._id.toString())) {
            usersFound.splice(i, 1)
        } else if (usersFound[i]._id === currentUser._id) {
            usersFound.splice(i, 1)
        }
    }

    if (usersFound.length === 0) {
        res.render('search/results', {
            title: 'Search Results',
            matchingResults: false
        })
        return
    }

    res.render('search/results', {
        title: 'Search Results',
        matchingResults: true,
        searchFriends: true,
        friends: usersFound
    })
    return
})

// For when they add friends
router.post('/addFriends', async (req, res) => {
    let userSearchParameter = xss(req.body.searchParameter)
    let userSearchValue = xss(req.body.searchInput.toLowerCase())
    let errors = []

    // Check that they filled out the form
    if (!userSearchParameter) {
        errors.push("You must search by username or email")
    }
    if (!userSearchValue) {
        errors.push("You must enter a search value")
    }

    // If they did not fill out the form, render a page telling them they need to provide more info
    if (errors.length !== 0) {
        res.render('search/addFriends', {
            title: 'Add Friends',
            matchingResults: true,
            hasErrors: true,
            errors: errors
        })
        return
    }

    let usersFound = await userData.getAllUsers()
    // The length changes in the switch statement as things get removed. This saves the initial value
    usersFoundLength = usersFound.length

    // Search users based on the user's chosen parameter
    switch (userSearchParameter) {
        case "userName":
            for (let i = 0; i < usersFound.length; i++) {
                usersFound[i].userName = usersFound[i].userName.toLowerCase()
                if (usersFound[i].userName !== userSearchValue) {
                    usersFound.splice(i, 1)
                    i--
                }
            }
            break

        case "email":
            for (let i = 0; i < usersFound.length; i++) {
                usersFound[i].email = usersFound[i].email.toLowerCase()
                if (usersFound[i].email !== userSearchValue) {
                    usersFound.splice(i, 1)
                    i--
                }
            }
            break
    }

    let currentUser = req.session.user

    // Loop through the users that match and remove anyone that they are already friends with. Also remove the user if they show up
    for (let i = 0; i < usersFound.length; i++) {
        if (currentUser.friends.includes(usersFound[i]._id.toString())) {
            usersFound.splice(i, 1)
        } else if (usersFound[i]._id === currentUser._id) {
            usersFound.splice(i, 1)
        }
    }

    if (usersFound.length === 0) {
        res.render('search/results', {
            title: 'Search Results',
            matchingResults: false
        })
        return
    }
    
    res.render('search/results', {
        title: 'Search Results',
        matchingResults: true,
        addFriends: true,
        users: usersFound
    })
    return
})


// Get here by clicking on someone's username after searching in add friends
router.get('/addFriends/:userName', async (req, res) => {
    try {
        const addFriendAttempt = await userData.addFriend(req.session.user.userName, req.params.userName)
    } catch (e) {
        res.render('search/results', {
            title: 'Search Results',
            hasError: true,
            error: e
        })
    }
    
    res.redirect(`/users/${req.params.userName}`)
    return

})

module.exports = router;