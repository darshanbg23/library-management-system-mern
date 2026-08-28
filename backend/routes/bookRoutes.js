const express = require('express');
const router = express.Router();
const {
  getBooks,
  getBookById,
  addBook,
  updateBook,
  deleteBook
} = require('../controllers/bookController');

// GET /api/books - Get all books
router.get('/', getBooks);

// GET /api/books/:id - Get a single book
router.get('/:id', getBookById);

// POST /api/books - Add a new book
router.post('/', addBook);

// PUT /api/books/:id - Update a book
router.put('/:id', updateBook);

// DELETE /api/books/:id - Delete a book
router.delete('/:id', deleteBook);

module.exports = router;
