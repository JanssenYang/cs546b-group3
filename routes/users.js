const express = require('express')
const router = express.Router();
const data = require('../data')
const userData = data.users
const path = require('path')

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

    if (!userInfo.firstName) {
        errors.push('First name not provided')
    }

    if (!userInfo.lastName) {
        errors.push('Last name not provided')
    }

    if(!userInfo.userName) {
        errors.push('Username not provided')
    }

    if(!userInfo.password) {
        errors.push('Password not provided')
    }

    if(!userInfo.email) {
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

    try {
        const newUser = await userData.addUser(
            userInfo.firstName,
            userInfo.lastName,
            userInfo.userName,
            userInfo.password,
            userInfo.email
    )
        res.render('users/profile', {
            title: `${userInfo.userName}'s Account`,
            userName: userInfo.userName
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

    if (!userInfo.userName) {
        errors.push('Username not provided')
    }

    if (!userInfo.password) {
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
        const getUser =  await userData.getUserByUserName(userInfo.userName)
        if (getUser !== null && getUser.password === userInfo.password) {
            res.redirect(`/users/${userInfo.userName}`)
            return
        } else {
            throw 'Username and/or password incorrect'
        }
    } catch (e) {
        res.render('layouts/login', {
            title: 'Welcome',
            errors: [e],
            hasErrors: true
        })
    }

})

router.get('/:userName', async (req, res) => {
    res.render('users/profile', {
        title: 'Your Profile',
        userName: req.params.userName
    })
})

module.exports = router;
