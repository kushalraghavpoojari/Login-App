var express = require('express');
var app = express();
var mongoose = require('mongoose');
var cors = require('cors');
var bodyParser = require('body-parser');
var User = require('./models/User.js');
var jwt = require('jwt-simple');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var request = require('request');
var moment = require('moment');
var config = require('./config.js');
var expressJWT = require('express-jwt');
var bcrypt = require('bcryptjs');
var crypto = require('crypto');
var mailer = require('nodemailer');
var smtp = require("nodemailer-smtp-transport");

//var port = process.env.PORT || 8080;

var environment = process.env.NODE_ENV;
mongoose.connect(config.MONGOOSE_CONNECTON);

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(cors());
app.use( passport.initialize());
app.use('/authCheck', expressJWT({secret: process.env.SECRET || config.TOKEN_SECRET}));

passport.serializeUser(function(user, done){
    done(null, user.id);
});

console.log('About to crank up node');
console.log('PORT=' + config.PORT);
console.log('NODE_ENV=' + environment);


switch (environment) {
    case 'build':
        console.log('** BUILD **');
        app.use(express.static('./build/'));
        app.use('/*', express.static('./build/index.html'));
        break;
    default:
        console.log('** DEV **');
        app.use(express.static('./src/client/'));
        app.use(express.static('./src/'));
        app.use(express.static('./'));
        // app.use(express.static('./tmp/'));
       // app.use('/*', express.static('./src/client/index.html'));
        break;
}

var createJWT = require('./routes/authentication/createJWT.js');
var login = require('./routes/authentication/login/index.js');
var google = require('./routes/authentication/socialLogin/google.js');
var facebook = require('./routes/authentication/socialLogin/facebook.js');



var dashboard = [
    'Wendy',
    'Chipotle',
    'Pizaa Hut',
    'Dunkin'
];

app.get('/dash', function(req,res){
    
    if(!req.headers.authorization){
        return res.status(401).send({message: 'You are not authorized'});    
    }
    // var token = req.headers.authorization.split(' ')[1];
    // var payload = jwt.decode(token,config.TOKEN_SECRET);

    // if(!payload.sub){
    //     res.status(401).send({
    //         message: 'You are not authorized!'
    //     });
    // }
    
    res.json(dashboard);
});

login(app, User, createJWT, process.env.SECRET || config.TOKEN_SECRET, bcrypt, crypto, mailer, smtp,
      process.env.OWNER_SERVICE || config.OWNER_SERVICE, process.env.OWNER_EMAIL || config.OWNER_EMAIL,
      process.env.OWNER_PASSWORD || config.OWNER_PASSWORD);
// dashboard(app, User, ObjectID);
// github(app, request, User, createJWT, process.env.TOKEN_SECRET || config.TOKEN_SECRET, process.env.GITHUB_SECRET || config.GITHUB_SECRET, qs);
facebook(app, request, User, createJWT, process.env.TOKEN_SECRET || config.TOKEN_SECRET, process.env.FACEBOOK_SECRET || config.FACEBOOK_SECRET);
google(app, request, User, createJWT, process.env.TOKEN_SECRET || config.TOKEN_SECRET, process.env.GOOGLE_SECRET || config.GOOGLE_SECRET);

app.listen(config.PORT, function() {
    console.log('Express server listening on port ' + config.PORT);
    console.log('env = ' + app.get('env') +
                '\n__dirname = ' + __dirname +
                '\nprocess.cwd = ' + process.cwd());
});