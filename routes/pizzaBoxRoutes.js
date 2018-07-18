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
PizzaBox.find({
  pizzaboxer: req.user._id// Here put the proper query selector that works in compass: remember. it's gonna be req.user._id
})
.then((myPizzaBoxes)=>{
  res.render('userViews/pizzaBoxViews/myPizzaBoxes.hbs', {user: req.user, myPizzaBoxes});
})
.catch((err)=>{
  next(err);
})
});



pizzaBoxRouter.post("/myPizzaBoxes/edit", ensureLoggedIn('/'), (req, res, next)=>{
  if(req.user.usertype !== 'Restaurant') {
    res.redirect('/')
    return; 
  }
  const theId = req.body.id;
  PizzaBox.findById(theId)
  .then((thisPizzaBox)=>{
    res.render('userViews/pizzaBoxViews/editPizzaBox', {pizzabox: thisPizzaBox})
  })



});

pizzaBoxRouter.post("/myPizzaBoxes/update", ensureLoggedIn('/'), (req, res, next)=>{
  if(req.user.usertype !== 'Restaurant') {
    res.redirect('/')
    return; 
  }
  const theId = req.body.pizzaboxid;
  PizzaBox.findByIdAndUpdate(theId, {
  store: req.body.store,
  imgsrc: req.body.imgsrc,
  pizzaname: req.body.pizzaname,
  description: req.body.description,
  originlocation: req.body.originlocation,
  targetlocation: req.body.targetlocation,
  purchasedby: req.body.purchasedby,
  timetolive: req.body.timelimit,
  status: req.body.status,
  })
  .then((thisPizzaBox)=>{
    res.redirect('/myPizzaBoxes')
  })
  .catch((err)=>{
    next(err);
  })
});

pizzaBoxRouter.post("/myPizzaBoxes/delete", ensureLoggedIn('/'), (req, res, next)=>{
  if(req.user.usertype !== 'Restaurant') {
    res.redirect('/')
    return; 
  }
  const theId = req.body.deadPizzaBoxId;
  PizzaBox.findByIdAndRemove(theId)
.then((response)=>{
  res.redirect('/myPizzaBoxes')
})
.catch((err)=>{
  next(err);
})
});





module.exports = pizzaBoxRouter;