const express      = require('express');
const userRouter   = express.Router();
const User         = require('../models/user');
const bcrypt       = require('bcryptjs');
const passport     = require('passport');
const ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn;
const PizzaBox         = require('../models/pizzabox');


userRouter.get('/mapsTest', (req, res, next)=>{

  res.render('maptest');
})

userRouter.get('/signup', (req, res, next)=>{

    res.render('userViews/signupPage', {css: ['style.css']});
})

userRouter.post("/signup", (req, res, next)=>{
    const password = req.body.password;
    const username = req.body.username;
    const usertype = req.body.usertype;
    const creditcard = req.body.creditcard;
    if(password === "" || username === ""){
      res.render('userViews/signupPage', {css: ['style.css'], errorMessage: "Please fill in both a username and password to proceed."});
      return;
    }

    if (usertype === "null") {
      res.render('userViews/signupPage', {css: ['style.css'], errorMessage: "Please choose what type of user you are"});
    return;
    }
  
    User.findOne({'username': username})
    .then((response)=>{
      if(response !== null){
        res.render('userViews/signupPage', {css: ['style.css'], errorMessage: `Sorry ${username} is taken, please select another name.`});
        return;
      } //ends IF statement
  
      const salt        = bcrypt.genSaltSync(10);
      const hashedPassword = bcrypt.hashSync(password, salt);
  
      //now we create users/password objects
      User.create({username: username, password: hashedPassword, usertype: usertype, creditcard: creditcard})
      .then((response)=>{
        console.log("---------------------------------------------");
        res.redirect('/');
      })
      .catch((err)=>{
        next(err);
      });
  
    });
  });



userRouter.get("/login", (req, res, next) => {
    res.render("index", {css: ['style.css'], "message":req.flash("error")});
  });
  

userRouter.post("/login", passport.authenticate("local", {
    successRedirect: "/home/",  
    failureRedirect: "/login",
    failureFlash: true,
    passReqToCallback: true
  }));


// userRouter.get('/login', (req, res, next)=>{
//     res.render('userViews/loginPage');
// });

// userRouter.post('/login', (req, res, next)=>{
//     const theUsername = req.body.theUsername;
//     const thePassword = req.body.thePassword;
//     if (theUsername === "" || thePassword === "") {
//         res.render("userViews/loginPage", {errorMessage: "Indicate a username and a password to log in"});
//         return;
//       }
//     User.findOne({ "username": theUsername }, (err, user) => {
//         if (err || !user) {
//           res.render("userViews/loginPage", {errorMessage: "Sorry, that username doesn't exist" });
//           return;
//         }
//         if (bcrypt.compareSync(thePassword, user.password)) {
//           // Save the login in the session!
//           req.session.currentUser = user;
//           res.redirect("/");
//         } else {
//           res.render("userViews/loginPage", {errorMessage: "Incorrect password"});
//         }
//     }); // this ends the callback that runs after then User.findOne

    

//   });//this ends the route


userRouter.get("/home/", ensureLoggedIn('/'), (req, res, next)=>{
  
  if (req.user.usertype === "Restaurant") {
    res.render('userViews/pizzaBoxViews/pizzaBoxHome', {css: ['style.css'], user: req.user});
  }
  
  if (req.user.usertype === "Customer") {
    const blah = "awesome"
    PizzaBox.find({
      status: "active"
    })
    .then((activePizzaBoxes)=>{
      res.render('userViews/customerViews/customerHome', {user: req.user, activePizzaBoxes, css: ['style2.css']});
    })
    .catch((err)=>{
      next(err);
    })
  }
  
});



userRouter.get("/myAccount",ensureLoggedIn('/'), (req, res, next)=>{
  res.render('userViews/myAccount', {css: ['style.css'], user: req.user})
})


userRouter.get("/stripe",ensureLoggedIn('/'), (req, res, next)=>{
 
  const pizzabox = req.body.pBox;
  console.log(pizzabox);
  // if (pizzabox === theUser._id){
  //   res.render('userViews/customerViews/customerHome.hbs', {css: ['style.css'], pizzabox: pizzabox, user: theUser, message: "You can't buy your own pizzabox!"})
  //   return
  // }


  res.render('stripe', {css: ['style.css'], user: req.user, pizzabox:pizzabox})
})


userRouter.get("/logout", ensureLoggedIn('/'), (req, res, next) => {
    req.logout();
    res.redirect("/");
  });


  // PizzaBox Routes: Customer Side








module.exports = userRouter;