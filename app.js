require('dotenv').config();

const bodyParser        = require('body-parser');
const cookieParser      = require('cookie-parser');
const express           = require('express');
const favicon           = require('serve-favicon');
const hbs               = require('hbs');
const mongoose          = require('mongoose');
const logger            = require('morgan');
const path              = require('path');
const session           = require("express-session");
const MongoStore        = require("connect-mongo")(session);
const app               = express();
const passport          = require('passport');
const LocalStrategy     = require('passport-local').Strategy;//LocalStrategy is a constructor function
const bcrypt            = require('bcryptjs');
const flash             = require('connect-flash');
const ensureLogin       = require('connect-ensure-login');
const User              = require('./models/user')

// process.env.MONGODB_URI
// 'mongodb://localhost/PizzaBox'
mongoose.Promise = Promise;
mongoose      
  .connect(process.env.MONGODB_URI, {useMongoClient: true})
  .then(() => {
    console.log('Connected to Mongo!')
  }).catch(err => {
    console.error('Error connecting to mongo', err)
  });

const app_name = require('./package.json').name;
const debug = require('debug')(`${app_name}:${path.basename(__filename).split('.')[0]}`);


// Middleware Setup
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Express View engine setup

app.use(require('node-sass-middleware')({
  src:  path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  sourceMap: true
}));
      

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));


//WE WILL CHANGE THE SESSION LOGIC BECAUSE PASSPORT WILL HANDLE IT

//Here we set our cookie and mentioned MongoStore
// app.use(session({
//   secret: "basic-auth-secret",
//   cookie: { maxAge: 60000 },
//   store: new MongoStore({
//     mongooseConnection: mongoose.connection,
//     ttl: 24 * 60 * 60 
//   })
// }));


//Here passport handles it and will look for the express session.
// app.js
app.use(session({

  secret: "our-passport-local-strategy-app",
  resave: true,
  saveUninitialized: true
}));








// default value for title local
app.locals.title = 'PizzaBox';

//Passport methods//Set these RIGHT BEFORE ROUTES to prevent ERRORs. All about how passport works
//When using passport, 

//PUT THESE BEFORE INITIALIZE: These get called automatically when user saved to a session or call info out
//hashes: a verylight, very fast one.
passport.serializeUser((user, cb) => {
  cb(null, user._id);
});

passport.deserializeUser((id, cb) => {
  User.findById(id, (err, user) => {
    if (err) { return cb(err); }
    cb(null, user);
  });
});

app.use(flash());


passport.use(new LocalStrategy((username, password, next) => {
  User.findOne({ username }, (err, user) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return next(null, false, { message: "Incorrect username" });
    }
    if (!bcrypt.compareSync(password, user.password)) {
      return next(null, false, { message: "Incorrect password" });
    }

    return next(null, user);
  });
}));


app.use(passport.initialize()); //Turn passport on 

app.use(passport.session());


const index = require('./routes/index');
app.use('/', index);

const userRoutes = require('./routes/userRoutes');
app.use('', userRoutes);

const pizzaBoxerRoutes = require('./routes/pizzaBoxerRoutes', ensureLogin.ensureLoggedIn());
app.use('', pizzaBoxerRoutes);



module.exports = app;
