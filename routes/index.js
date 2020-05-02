const userRoute = require('./users')
const path = require('path')

const constructorMethod = app => {
   app.get('/', (req, res) => {
        if(req.session.user){
            //An authenticated user should never see the login screen
            res.redirect(`/users/${req.session.user.userName}`);
        }
        else{
            res.render('layouts/login', {
                title: 'Login'
            })
        }
    })
    app.use('/users', userRoute)
    app.use('*', (req, res) => {
        res.sendStatus(404);
    })
}

module.exports = constructorMethod