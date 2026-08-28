const Book = require('../models/Book');

// Get all books
const getBooks = async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get a single book by ID
const getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    res.json(book);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Add a new book
const addBook = async (req, res) => {
  try {
    const { title, author, category, isbn, quantity } = req.body;

    // Check required fields
    if (!title || !author || !category || !isbn || quantity === undefined) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    // Check quantity is not negative
    if (quantity < 0) {
      return res.status(400).json({ message: 'Quantity cannot be negative' });
    }

    // Set availableQuantity equal to quantity
    const book = new Book({
      title,
      author,
      category,
      isbn,
      quantity,
      availableQuantity: quantity
    });

    const savedBook = await book.save();
    res.status(201).json(savedBook);
  } catch (error) {
    res.status(500).json({ message: 'Book could not be added' });
  }
};

// Update a book
const updateBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    // If quantity is being updated, validate it
    if (req.body.quantity !== undefined && req.body.quantity < 0) {
      return res.status(400).json({ message: 'Quantity cannot be negative' });
    }

    // If availableQuantity is being updated, validate it
    if (req.body.availableQuantity !== undefined && req.body.availableQuantity < 0) {
      return res.status(400).json({ message: 'Available quantity cannot be negative' });
    }

    const updatedBook = await Book.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.json(updatedBook);
  } catch (error) {
    res.status(500).json({ message: 'Book could not be updated' });
  }
};

// Delete a book
const deleteBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    await Book.findByIdAndDelete(req.params.id);
    res.json({ message: 'Book deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Book could not be deleted' });
  }
};

module.exports = { getBooks, getBookById, addBook, updateBook, deleteBook };
