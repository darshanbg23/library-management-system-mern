const Book = require('../models/Book');
const Student = require('../models/Student');
const Issue = require('../models/Issue');

// Get dashboard data
const getDashboard = async (req, res) => {
  try {
    const totalBooks = await Book.countDocuments();
    const totalStudents = await Student.countDocuments();

    // Sum of all availableQuantity across all books
    const availableResult = await Book.aggregate([
      { $group: { _id: null, total: { $sum: '$availableQuantity' } } }
    ]);
    const availableBooks = availableResult.length > 0 ? availableResult[0].total : 0;

    // Count of currently issued records
    const issuedBooks = await Issue.countDocuments({ status: 'Issued' });

    res.json({
      totalBooks,
      totalStudents,
      availableBooks,
      issuedBooks
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getDashboard };
