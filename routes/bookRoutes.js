const express = require('express');
const router  = express.Router();
const Book    = require('../models/book');
const Author  = require('../models/author');
const ensureLogin = require('connect-ensure-login')

// router.use((req, res, next) => {
//     if (req.session.currentUser) {
//       next();
//     } else {
//       res.redirect("/login");
//     }
//   });
// this way make all the routes in the file private (and also any other routes
// that are connected to app.js AFTER this file)

router.get('/books',ensureLogin.ensureLoggedIn(), (req, res, next) => {
    // if(!req.session.currentUser){
    //     res.redirect('/login');
    //     return;
    // } // this way you can use to make ONE SINGLE ROUTE private but oyu have to do it in every route that you want to restrict
    Book.find()
    .populate('author')
    .then((listOfBooks)=>{
        res.render('books', {listOfBooks});
    })
    .catch((err)=>{
        next(err); 
     })
});


router.get('/books/new', (req, res, next) =>{
    Author.find()
    .then((allTheAuthors)=>{
        res.render('newBook', {allTheAuthors});
    })
    .catch((err)=>{
        next(err);
    })
});




router.post('/books/create', (req, res, next)=>{
   const newBook = new Book({
    title: req.body.title,
    author: req.body.author,
    description: req.body.description,
    rating: req.body.rating
   })

//    const newBook = new Book(req.body)
// ^ this is super fancy mode, use if you dare

   newBook.save()
   .then((response)=>{
       res.redirect('/books')
   })
   .catch((err)=>{
       next(err);
   }) 

})

router.get('/books/:id/edit', (req, res, next)=>{
   Book.findById(req.params.id)
   .then((theBook)=>{

        Author.find()
        .then((allTheAuthors)=>{

            allTheAuthors.forEach((author)=>{

                if(author._id.equals(theBook.author)){
                
                    author.yes = true;
                }
            })        
            res.render('editBook', {theBook: theBook, allTheAuthors: allTheAuthors})
        })
        .catch((err)=>{
            next(err)
        })
   })
   .catch((err)=>{
       next(err);
   })
})


router.post('/books/:id/update', (req, res, next)=>{
    Book.findByIdAndUpdate(req.params.id, {
        title: req.body.title,
        author: req.body.author,
        description: req.body.description,
        rating: req.body.rating
    })
    .then((theBook)=>{
        res.redirect('/books/'+theBook._id)
    })
    .catch((err)=>{
        next(err);
    })  
})

router.post('/books/:id/delete', (req, res, next)=>{
    Book.findByIdAndRemove(req.params.id)
    .then((reponse)=>{
        res.redirect('/books');
    })
    .catch((err)=>{
        next(err);
    })
})


router.get('/books/:id', (req, res, next) => {
    const id = req.params.id;
    Book.findById(id)
    .populate('author')
    .then((theBook)=>{    
        res.render('bookDetails',  {theBook: theBook});
    })
    .catch((err)=>{
       next(err); 
    })
});

// this is what theBook looks like
// {title: 'animal farm', description: 'lorem ipsum dolor', reviews: [{}, {}, {}]     }





module.exports = router;
