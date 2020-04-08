
const eventRoutes = require('./events');
const userRoutes = require('./users');
const path = require('path');

const constructorMethod = (app) => {
    app.use('/search', (req, res)=>{
        res.sendFile(path.resolve('static/search.html'));
    });
	app.use('/events', postRoutes);
    app.use('/users', userRoutes);
    app.use('/', (req,res)=>{
        //Home Page without log in
        res.sendFile(path.resolve('static/index.html'));
    });

	app.use('*', (req, res) => {
		res.redirect('/');
	});
};

module.exports = constructorMethod;