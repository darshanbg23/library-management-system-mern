const Issue = require('../models/Issue');
const Book = require('../models/Book');
const Student = require('../models/Student');

// Get all issues
const getIssues = async (req, res) => {
  try {
    const issues = await Issue.find()
      .populate('book', 'title author')
      .populate('student', 'name email');

    const validIssues = issues.filter(issue => issue.student !== null && issue.book !== null);

    const orphanedIds = issues
      .filter(issue => issue.student === null || issue.book === null)
      .map(issue => issue._id);
    if (orphanedIds.length > 0) {
      Issue.deleteMany({ _id: { $in: orphanedIds } }).catch(err =>
        console.error('Failed to clean up orphaned issue records:', err)
      );
    }

    res.json(validIssues);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Issue a book
const issueBook = async (req, res) => {
  try {
    const { student, book } = req.body;

    if (!student || !book) {
      return res.status(400).json({ message: 'Please provide student and book' });
    }

    // Check that the student exists
    const studentExists = await Student.findById(student);
    if (!studentExists) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Check that the book exists
    const bookExists = await Book.findById(book);
    if (!bookExists) {
      return res.status(404).json({ message: 'Book not found' });
    }

    // Check that the book has available copies
    if (bookExists.availableQuantity <= 0) {
      return res.status(400).json({ message: 'Book is not available' });
    }

    // Create the issue record
    const issue = new Issue({
      student,
      book,
      issueDate: Date.now(),
      status: 'Issued'
    });

    const savedIssue = await issue.save();

    // Decrease availableQuantity by 1
    bookExists.availableQuantity -= 1;
    await bookExists.save();

    res.status(201).json(savedIssue);
  } catch (error) {
    res.status(500).json({ message: 'Book could not be issued' });
  }
};

// Return a book
const returnBook = async (req, res) => {
  try {
    // Find the issue record
    const issue = await Issue.findById(req.params.id);
    if (!issue) {
      return res.status(404).json({ message: 'Issue record not found' });
    }

    // Check that it has not already been returned
    if (issue.status === 'Returned') {
      return res.status(400).json({ message: 'Book has already been returned' });
    }

    // Set return date and change status
    issue.returnDate = Date.now();
    issue.status = 'Returned';
    await issue.save();

    // Increase the book's availableQuantity by 1
    const book = await Book.findById(issue.book);
    if (book) {
      book.availableQuantity += 1;
      await book.save();
    }

    res.json(issue);
  } catch (error) {
    res.status(500).json({ message: 'Book could not be returned' });
  }
};

module.exports = { getIssues, issueBook, returnBook };
