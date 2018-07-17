const express      = require('express');
const pizzaBoxRouter   = express.Router();
const PizzaBox         = require('../models/pizzabox');
const passport     = require('passport');
const ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn;


pizzaBoxRouter.get('/newPizzaBox', ensureLoggedIn('/'), (req, res, next)=>{
  if(req.user.usertype !== 'Restaurant') {
    res.redirect('/')
    return;
  }

  res.render('userViews/pizzaBoxViews/newPizzaBox', {user: req.user})
});


pizzaBoxRouter.post('/newPizzaBox', ensureLoggedIn('/'), (req, res, next)=>{
  if(req.user.usertype !== 'Restaurant') {
    res.redirect('/')
    return; 
  }

  const store = req.body.store;
  const imgsrc = req.body.imgsrc;
  const pizzaname = req.body.pizzaname;
  const description = req.body.description;
  const originlocation = req.body.originlocation;
  const targetlocation = req.body.targetlocation;
  const pizzaboxer = req.body.userId;
  const purchasedby = req.body.purchasedby;
  const timetolive = req.body.timelimit;
  const status = req.body.status;
  
  if(store === ""||imgsrc === ""||pizzaname ===""||originlocation ===""||targetlocation ===""||pizzaboxer ===""||purchasedby ===""||timetolive ===""){
    
    res.render('userViews/pizzaBoxViews/newPizzaBox.hbs', {errorMessage: "Please fill in all fields."});
      return;
  }

  PizzaBox.create({store: store, imgsrc: imgsrc, pizzaname: pizzaname, description: description, originlocation: originlocation, targetlocation: targetlocation, pizzaboxer: pizzaboxer, purchasedby: purchasedby, timelimit:timetolive, status: status})
  .then((response)=>{
    console.log("--------------------------------------------- Completed");
    res.redirect('/myPizzaBoxes');
  })
  .catch((err)=>{
    next(err);
  });

});


pizzaBoxRouter.get('/myPizzaBoxes',ensureLoggedIn('/'), (req, res, next)=>{
  if(req.user.usertype !== 'Restaurant') {
    res.redirect('/')
    return; 
  }
  res.render('userViews/pizzaBoxViews/myPizzaBoxes.hbs', {user: req.user});
});




// router.get('/books',ensureLogin.ensureLoggedIn(), (req, res, next) => {
//   // if(!req.session.currentUser){
//   //     res.redirect('/login');
//   //     return;
//   // } // this way you can use to make ONE SINGLE ROUTE private but oyu have to do it in every route that you want to restrict
//   Book.find()
//   .populate('author')
//   .then((listOfBooks)=>{
//       res.render('books', {listOfBooks});
//   })
//   .catch((err)=>{
//       next(err); 
//    })
// });


module.exports = pizzaBoxRouter;