const express = require('express');
const app = express();
const session = require('express-session');
const static = express.static(__dirname + '/public');
const configRoutes = require('./routes');
const exphbs = require('express-handlebars');

app.use('/public', static);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

app.use(
	session({
		name: "AuthCookie",
		secret: "some secret string!",
		saveUninitialized: true,
		resave: false,
	})
);

//If an already-authenticated user tries to make a new account
app.use("/users/new", (req, res, next) => {
	if(req.session.user){
		res.status(409).render("layouts/error", {title: "409 Error: Conflict", error: "Please logout before registering a new user."});
    }
    else{
		next();
	}
});

//If a non-authenticated user tries to logout, just bring them back to the login page
app.use("/users/logout", (req, res, next) => {
	if(!req.session.user){
		res.render("layouts/login", {title: "Login", hasErrors: false});
    }
    else{
		next();
	}
});

configRoutes(app);

app.listen(3000, () => {
	console.log("We've now got a server!");
	console.log('Your routes will be running on http://localhost:3000');
});