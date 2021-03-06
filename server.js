//Dependencies
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');
var expressValidator = require('express-validator');
var flash = require('connect-flash');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongo = require('mongodb');
var mongoose = require('mongoose');
var cors = require('cors');

//secrets file
var gzApiSecrets = require('./gzApiSecrets.js');


//MongoDB
var connString = 'mongodb://' + gzApiSecrets.mongoUser + ':' + gzApiSecrets.mongoPass + '@localhost/gzbot';
console.log(connString);

mongoose.connect(connString);
var db = mongoose.connection;

//Express - initialize
var app = express();

app.use(cors());

app.all('/', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
});

//bodyParser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use(cookieParser());
//express validator
app.use(expressValidator({
	errorFormatter: function(param, msg, value) {
		var namespace = param.split('.')
		, root = namespace.shift()
		, formParam = root;
		while(namespace.length){
			formParam += '[' + namespace.shift() + ']';
		}
		return {
			param: formParam,
			msg : msg,
			value : value
		};
	}
}));

//set static folder
app.use(express.static(path.join(__dirname, 'public')));

//express session
app.use(session({
	secret: 'secret',
	saveUninitialized: true,
	resave: true
}));

// Passport init
app.use(passport.initialize());
app.use(passport.session());

//connect flash
app.use(flash());

//global vars
app.use(function(req, res, next){
	res.locals.success_msg = req.flash('success_msg');
	res.locals.error_msg = req.flash('error_msg');
	res.locals.error = req.flash('error');
	res.locals.user = req.user || null;
	next();
});

//Routes
app.use('/api', require('./routes/api'));
app.use('/index', require('./routes/index'));
app.use('/users', require('./routes/users'));

//view engine
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphbs({defaultLayout:'layout'}));
app.set('view engine', 'handlebars');

//Start server
var port = process.env.PORT || 3000;

app.listen(port, function(){
	console.log('API is running on port 3000');
});

//app.listen(3000);
//console.log('API is running on port 3000');