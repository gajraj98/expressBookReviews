const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const app = express();
const axios = require('axios');

public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;
  if(!username||!password){
    return res.status(403).json({message: "either username or password is missing"});
  }
  if(users[username]){
    return res.status(403).json({message: "user is already exists"});
  }  
  users.push({"username":username,"password":password});
  console.log(users.length);
  return res.status(200).json({message: "user successfuly registered"});
});

// Get the book list available in the shop
public_users.get('/',async function(req,res){
   try{
      res.send(JSON.stringify(books,null,4))
   }
   catch(error){
       res.status(300).json({message:"Yet to be implemented"})
   }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
  //Write your code here
  try{
      const isbn = req.params.isbn;
      if(!isbn){
          res.status(400).json({message:"please provid isbn number"});
      }
      const book = books[isbn];
      if(!book){
        res.status(404).json({message:"No book found corresponding isbn number"});
      }
      res.send(book);
  }
  catch(error){
    res.status(500).json({ message: 'Failed to fetch books' });
  }
 });
  
// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
  //Write your code here
   
  try{
      const author  = req.params.author;
      if (!author) {
        return res.status(400).json({ message: 'Author name is required' });
      }
      const list  = Object.values(books).filter((book)=>book.author===author);
      res.send(list);
  }
  catch(error){
      res.status(500).json({ message: 'Failed to fetch books' });
  }
});

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
  //Write your code here
  try{
    const title  = req.params.title;

    if (!title) {
      return res.status(400).json({ message: 'Author name is required' });
    }
    const list  = Object.values(books).filter((book)=>book.title===title);
    res.send(list);
}
catch(error){
    console.error("Error:", error);
    res.status(500).json({ message: 'Failed to fetch books from title' });
}
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  if (books[isbn]) {
    res.send(books[isbn].reviews);
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

module.exports.general = public_users;