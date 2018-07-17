const express      = require('express');
const pizzaBoxRouter   = express.Router();
const PizzaBox         = require('../models/pizzabox');
const passport     = require('passport');
const ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn;


pizzaBoxRouter.get('/newPizzaBox', (req, res, next)=>{
  if(req.user.usertype !== 'Restaurant') {
    res.redirect('/')
    return;
  }



  res.render('userViews/pizzaBoxViews/newPizzaBox', {user: req.user})
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