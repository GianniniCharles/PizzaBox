const express = require('express');
const router  = express.Router();


/* GET home page */
router.get('/', (req, res, next) => {
  //no matter where in the app, can reach the user
  if (req.user){
  res.redirect('/home');
  return;
  }
  res.render('index', {theUser: req.user ,css: ['style.css']});
});


// , 
module.exports = router;


