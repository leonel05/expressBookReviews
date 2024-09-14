const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (isValid(username)) {
      users.push({"username": username, "password": password});
      return res.status(200).json({ message: "User successfully registered. Now you can login"});
    } else {
      return res.status(404).json({ message: "User already exists!"})
    }
  }

  return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  return res.send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  return res.send(books[isbn]);
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  const keys = Object.keys(books);
  let filtered_books = [];

  keys.forEach(isbn => {
    if (books[isbn].author === author) {
      filtered_books.push(books[isbn]);
    }
  });

  return res.send(filtered_books);
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  const keys = Object.keys(books);
  let filtered_books = [];

  keys.forEach(isbn => {
    if (books[isbn].title === title) {
      filtered_books.push(books[isbn]);
    }
  });

  return res.send(filtered_books);
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;

  if (books[isbn]) {
    return res.send(books[isbn].reviews);
  }

  res.status(404).json({ message: "No book with this isbn."})
});

const allBooks = async (url) => {
  let req = axios.get(url);

  req.then(results => {
    let asyncBooks = results.books;
    return asyncBooks;
  })
  .catch(err => {
    console.log(err.toString());
  });
};

const bookDetailsByIsbn = async (isbn, url) => {
  const req = axios.get(url);
  return (await req).books[isbn];
};

const bookDetailsByAuthor = (author, url) => {
  let req = axios.get(url);

  req.then(results => {
    let books = results.books;
    const keys = Object.keys(books);
    let filtered_books = [];

    keys.forEach(isbn => {
      if (books[isbn].author === author) {
        filtered_books.push(books[isbn]);
      }
    });
    return filtered_books;
  })
  .catch(err => {
    console.log(err.toString());
  });
};

const bookDetailsByTitle = (title, url) => {
  let req = axios.get(url);

  req.then(results => {
    let books = results.books;
    const keys = Object.keys(books);
    let filtered_books = [];

    keys.forEach(isbn => {
      if (books[isbn].title === title) {
        filtered_books.push(books[isbn]);
      }
    });
    return filtered_books;
  })
  .catch(err => {
    console.log(err.toString());
  });
};

module.exports.general = public_users;
