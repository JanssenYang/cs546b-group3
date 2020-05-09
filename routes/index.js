const userRoute = require('./users')
const eventRoute = require('./events')
const homeRoute = require('./home');
const searchRoute = require('./search')
const path = require('path')

const constructorMethod = app => {
    app.use('/home', homeRoute);
    app.use('/users', userRoute)
    app.use('/events', eventRoute)
    app.use('/search', searchRoute)
    
    app.get('/', (req, res) => {
        if(req.session.user){
            //An authenticated user should never see the login screen
            res.redirect(`/home`);
        }
        else{
            res.render('layouts/login', {
                title: 'Login'
            })
    }
})
    app.use('*', (req, res) => {
        res.sendStatus(404);
    })
}

module.exports = constructorMethod