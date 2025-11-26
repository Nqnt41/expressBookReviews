const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
  //write code to check is the username is valid
  if (!username) {
    console.error("ERROR - Username not provided!");
    return false;
  }

  for (let i = 0; i < users.length; i++) {
    if (users[i].username === username) {
      console.error("ERROR - Username " + username + " already exists!");
      return false;
    }
  }

  console.log("Username " + username + " is valid!");
  return true;
}

const authenticatedUser = (username,password)=>{ //returns boolean
  //write code to check if username and password match the one we have in records.
  if (!username && !password) {
    console.error("ERROR - Username and Password not provided!");
  }
  else if (!username) {
    console.error("ERROR - Username not provided!");
    return false;
  }
  else if (!password) {
    console.error("ERROR - Password not provided!");
    return false;
  }

  if (!isValid(username)) {
    return false;
  }
  else {
    console.log("No issues found with username or password.");
    return true;
  }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(404).json({ message: "Error logging in" });
  }

  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign({
      username: username
     }, 'access', { expiresIn: 60 * 60 });

    req.session.authorization = {
      accessToken
    }

    return res.status(200).send("User " + username + " successfully logged in\n");
  } 
  else {
    return res.status(208).json({ message: "Invalid Login. Check username and password" });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  // http://localhost:5000/customer/auth/review/2?review=I thought the book was excellent.
  const isbn = req.params.isbn;
  let book = books[isbn];

  if (!book) {
    return res.send("Invalid ISBN!");
  }

  if (!req.session || !req.session.authorization) {
    return res.status(403).json({ message: "User not logged in" });
  }

  const token = req.session.authorization.accessToken;

  jwt.verify(token, "access", (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "User not authenticated" });
    }

    const username = decoded.username;

    if (!book.reviews) {
      book.reviews = {};
    }
    book.reviews[username] = req.query.review;

    return res.status(200).json(book);
  });
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    //Write your code here
    const isbn = req.params.isbn;
    let book = books[isbn];
  
    if (!book) {
      return res.send("Invalid ISBN!");
    }
  
    if (!req.session || !req.session.authorization) {
      return res.status(403).json({ message: "User not logged in" });
    }
  
    const token = req.session.authorization.accessToken;
  
    jwt.verify(token, "access", (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: "User not authenticated" });
      }
  
      const username = decoded.username;
      console.log(username)
      console.log(book.reviews)
  
      if (book && book.reviews && book.reviews[username]) {
        delete book.reviews[username];
        return res.status(200).json(book);
      }
      else {
        return res.status(404).json({ message: "Review not found" });
      }
    });
  });

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
module.exports.authenticatedUser = authenticatedUser;
