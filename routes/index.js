const express = require('express');
const router  = express.Router();


/* GET home page */
router.get('/', (req, res, next) => {
  //no matter where in the app, can reach the user
  res.render('index', {theUser: req.user});
});

module.exports = router;


