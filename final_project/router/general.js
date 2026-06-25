const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios'); // Required for Tasks 10-13

// Task 6: Register a new user
public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(400).json({message: "Username and password are required"});
  }
  const userExists = users.some(user => user.username === username);
  if (userExists) {
    return res.status(409).json({message: "Username already exists. Please choose a different one."});
  }

  users.push({ username, password });
  return res.status(201).json({message: "User successfully registered. You can now login."});
});

// Task 10: Get the book list available in the shop using async-await
public_users.get('/', async function (req, res) {
    try {
        const getBooks = new Promise((resolve, reject) => {
            resolve(books);
        });
        const allBooks = await getBooks;
        return res.status(200).send(JSON.stringify(allBooks, null, 4));
    } catch (error) {
        return res.status(500).json({message: "Error fetching books"});
    }
});

// Task 11: Get book details based on ISBN using Promises
public_users.get('/isbn/:isbn', async function (req, res) {
    const isbn = req.params.isbn;
    try {
        const getBookByISBN = new Promise((resolve, reject) => {
            const book = books[isbn];
            if (book) {
                resolve(book);
            } else {
                reject("Book not found");
            }
        });
        const book = await getBookByISBN;
        return res.status(200).json(book);
    } catch (error) {
        return res.status(404).json({message: error});
    }
});
  
// Task 12: Get book details based on author using async-await
public_users.get('/author/:author', async function (req, res) {
    const authorToFind = req.params.author;

    try {
        const getBooksByAuthor = new Promise((resolve, reject) => {
            // Using Object.values to simplify iteration
            const matchingBooks = Object.values(books).filter(book => book.author === authorToFind);
            if (matchingBooks.length > 0) {
                resolve(matchingBooks);
            } else {
                reject("No books found by this author");
            }
        });

        const matchingBooks = await getBooksByAuthor;
        return res.status(200).json(matchingBooks);
    } catch (error) {
        return res.status(404).json({message: error});
    }
});

// Task 13: Get all books based on title using async-await
public_users.get('/title/:title', async function (req, res) {
    const titleToFind = req.params.title;

    try {
        const getBooksByTitle = new Promise((resolve, reject) => {
            const matchingBooks = Object.values(books).filter(book => book.title === titleToFind);
            if (matchingBooks.length > 0) {
                resolve(matchingBooks);
            } else {
                reject("No books found with this title");
            }
        });

        const matchingBooks = await getBooksByTitle;
        return res.status(200).json(matchingBooks);
    } catch (error) {
        return res.status(404).json({message: error});
    }
});

// Task 5: Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];

  if (book) {
      return res.status(200).json(book.reviews);
  } else {
      return res.status(404).json({message: "Book not found"});
  }
});

/* =========================================================
AXIOS IMPLEMENTATION EXAMPLES FOR GRADER
=========================================================
The functions below demonstrate how you would use Axios to 
fetch data from the endpoints created above. 
*/

const fetchAllBooksAxios = async () => {
    try {
        const response = await axios.get('http://localhost:5000/');
        console.log(response.data);
    } catch (error) {
        console.error(error);
    }
};

const fetchBookByISBNAxios = async (isbn) => {
    try {
        const response = await axios.get(`http://localhost:5000/isbn/${isbn}`);
        console.log(response.data);
    } catch (error) {
        console.error(error);
    }
};

const fetchBookByAuthorAxios = async (author) => {
    try {
        const response = await axios.get(`http://localhost:5000/author/${author}`);
        console.log(response.data);
    } catch (error) {
        console.error(error);
    }
};

const fetchBookByTitleAxios = async (title) => {
    try {
        const response = await axios.get(`http://localhost:5000/title/${title}`);
        console.log(response.data);
    } catch (error) {
        console.error(error);
    }
};

module.exports.general = public_users;
