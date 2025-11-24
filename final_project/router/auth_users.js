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

const userExists = (username)=>{ //returns boolean
    //write code to check is the username is valid
    if (!username) {
      console.error("ERROR - Username not provided!");
      return false;
    }
  
    for (let i = 0; i < users.length; i++) {
      if (users[i].username === username) {
        console.error("User " + username + " already exists.");
        return true;
      }
    }
  
    console.log("ERROR - Username " + username + " does not exist!");
    return false;
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
      data: password
     }, 'access', { expiresIn: 60 * 60 });

    req.session.authorization = {
      accessToken, username
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
  return res.status(300).json({message: "/auth/review/:isbn - Yet to be implemented"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
module.exports.authenticatedUser = authenticatedUser;
