const userRoute = require('./users')
const path = require('path')

const constructorMethod = app => {
   app.get('/', (req, res) => {
        res.render('layouts/login', {
            title: 'Hello'
        })
    })
    app.use('/users', userRoute)
    app.use('*', (req, res) => {
        res.redirect('/')
    })
}

module.exports = constructorMethod