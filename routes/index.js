
const eventRoutes = require('./events');
const userRoutes = require('./users');
const searchRoutes = require('./search');
const path = require('path');

const constructorMethod = (app) => {
    app.use('/search', searchRoutes);
	app.use('/events', postRoutes);
    app.use('/users', userRoutes);
    app.use('/', (req,res)=>{
        //Home Page without log in
        res.render('home/');
    });

	app.use('*', (req, res) => {
		res.redirect('/');
	});
};

module.exports = constructorMethod;