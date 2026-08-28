const express = require('express');
const router = express.Router();
const {
  getStudents,
  getStudentById,
  addStudent,
  updateStudent,
  deleteStudent
} = require('../controllers/studentController');

// GET /api/students - Get all students
router.get('/', getStudents);

// GET /api/students/:id - Get a single student
router.get('/:id', getStudentById);

// POST /api/students - Add a new student
router.post('/', addStudent);

// PUT /api/students/:id - Update a student
router.put('/:id', updateStudent);

// DELETE /api/students/:id - Delete a student
router.delete('/:id', deleteStudent);

module.exports = router;
