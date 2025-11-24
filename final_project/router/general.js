const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

let authenticatedUser = require("./auth_users.js").authenticatedUser;

public_users.post("/register", (req,res) => {
  //Write your code here

  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(404).json({ message: "Error logging in" });
  }

  // Authenticate user
  if (authenticatedUser(username, password)) {
    // Generate JWT access token
    /*let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60 * 60 });

    // Store access token and username in session
    req.session.authorization = {
      accessToken, username
    }*/

    users.push({username: username, password: password});
    return res.status(200).send("User " + username + " successfully registered\n");
  } 
  else {
    return res.status(208).send("Invalid Registration. User " + username + " already exists.\n");
  }
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  return res.send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  let book = books[isbn];

  if (book) {
    return res.send(JSON.stringify(book, null, 4));
  }
  else {
    return res.send("Invalid ISBN!");
  }
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  
  let returnBooks = [];

  const author = req.params.author;

  Object.values(books).forEach(book => {
    if (author.toLowerCase() === book.author.toLowerCase()) {
      returnBooks.push(book);
    }
  });

  return res.send(JSON.stringify(returnBooks, null, 4));
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  
  let returnBooks = [];

  const title = req.params.title;

  Object.values(books).forEach(book => {
    if (title.toLowerCase() === book.title.toLowerCase()) {
      returnBooks.push(book);
    }
  });

  return res.send(JSON.stringify(returnBooks, null, 4));
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  let book = books[isbn];

  if (book) {
    return res.send(JSON.stringify(book.reviews,  null, 4));
  }
  else {
    return res.send("Invalid ISBN!");
  }
});

module.exports.general = public_users;
