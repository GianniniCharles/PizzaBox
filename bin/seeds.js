const mongoose = require('mongoose');
const Book = require('../models/book');
const Author = require('../models/author');

const dbName = 'library-app'
mongoose.connect(`mongodb://localhost/${dbName}`);


const jrr = {_id: new mongoose.Types.ObjectId(), name: "JRR", lastName: "Tolkien", nationality: "British", birthday: '01/03/1892'}
const george = {_id: new mongoose.Types.ObjectId(), name: "George", lastName: "Orwell", nationality: "British", birthday: '06/25/1903'}

const authors = [jrr, george];



const books = [
{
  title: "the hobbit",
  description: "short people go on a quest",
  author: jrr._id,
  rating: 7
},
{ 
  title: "lord of the rings",
  description: "trees walk around a fight, small people grow big, dead people come back to life, etc.",
  author: jrr._id,
  rating: 10
},
  {
    title: "Animal Farm",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    author: george._id,
    rating: 9
  },
  {
    title: "1984",
    description: 'dystopian futuristic society where the government controls everything.  Basically Black Mirror.',
    author: george._id,
    rating: 5
  }
]


Author.create(authors)
.then((response)=>{

  console.log(`created ${response.length} authors`);

//book .create method inside the .then for the author.create
    Book.create(books)
    .then((result)=>{
        console.log(`created ${result.length} books`);
        mongoose.disconnect();
    })
    .catch((err)=>{
        console.log(err)
    })

    //book.create ends here



})
.catch((err)=>{
  console.log('didnt work', err)
})




