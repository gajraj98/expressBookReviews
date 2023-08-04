const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ 
    let userswithsamename = users.filter((user)=>{
        return user.username === username
      });
      if(userswithsamename.length > 0){
        return true;
      } else {
        return false;
      }
}

const authenticatedUser = (username,password)=>{
    console.log(users.length);
    let validusers = users.filter((user)=>{
        return (user.username === username && user.password === password)
      });
      if(validusers.length > 0){
        return true;
      } else {
        return false;
      }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (!username || !password) {
    return res.status(404).json({message: "Error logging in"});
  }
      if(authenticatedUser(username,password)){
          const accesstoken = jwt.sign({
              data:password
          },'access',{expiresIn:60*60})
          req.session.authenticated = {
            accesstoken, username
          };
           return res.status(200).send("User successfully logged in")
      }
      else{
        return res.status(403).json({message: "Invalid Login. Check username and password"});
      }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const isbn = req.params.isbn;
  if(isbn){
      const book = Object.values(books).filter((book)=>book.isbn==isbn);
      book.reviews =req.body.reviews;
      res.send(book);
  }
  else
  return res.status(300).json({message: "not book found corresponding isbn"});
});
regd_users.delete("/auth/review/:isbn", (req, res) => {
    //Write your code here
    const isbn = req.params.isbn;
    if(isbn){
        const book = Object.values(books).filter((book)=>book.isbn==isbn);
       delete books[book];
       res.send(`book ${isbn} is delete succesfully`);
    }
    else
    return res.status(300).json({message: "not book found corresponding isbn"});
  });

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
