const express = require('express');
let books = require("./booksdb.js");
const jwt = require("jsonwebtoken");
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
    let accessToken = jwt.sign({
      username: username
    }, 'access', { expiresIn: 60 * 60 });

    req.session.authorization = {
      accessToken
    }

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
  let myPromise = new Promise((resolve, reject) => {
    resolve(books);
  });

  myPromise.then(result => {
    return res.send(JSON.stringify(result, null, 4));
  }).catch (err => {
    res.status(400).json( {message: "An error occurred.", error: err} )
  });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;

  let myPromise = new Promise((resolve, reject) => {
    let book = books[isbn];

    if (book) {
      resolve(book);
    }
    else {
      reject("ERROR - Invalid ISBN!");
    }
  });

  myPromise.then(result => {
    return res.send(JSON.stringify(result, null, 4));
  }).catch(err => {
    res.status(400).json( {message: "An error occurred.", error: err} )
  })
});

// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const author = req.params.author;

  let myPromise = new Promise((resolve, reject) => {
    let returnBooks = [];

    Object.values(books).forEach(book => {
      if (author.toLowerCase() === book.author.toLowerCase()) {
        returnBooks.push(book);
      }
    });

    resolve(returnBooks);
  });

  myPromise.then(result => {
    return res.send(JSON.stringify(result, null, 4));
  }).catch(err => {
    res.status(400).json( {message: "An error occurred.", error: err} )
  })
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const title = req.params.title;

  let myPromise = new Promise((resolve, reject) => {
    let returnBooks = [];

    Object.values(books).forEach(book => {
      if (title.toLowerCase() === book.title.toLowerCase()) {
        returnBooks.push(book);
      }
    });

    resolve(returnBooks);
  });

  myPromise.then(result => {
    return res.send(JSON.stringify(result, null, 4));
  }).catch(err => {
    res.status(400).json( {message: "An error occurred.", error: err} )
  })
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
