const express = require('express');
const router = express.Router();
const {
  getIssues,
  issueBook,
  returnBook
} = require('../controllers/issueController');

// GET /api/issues - Get all issues
router.get('/', getIssues);

// POST /api/issues - Issue a book
router.post('/', issueBook);

// PUT /api/issues/:id/return - Return a book
router.put('/:id/return', returnBook);

module.exports = router;
