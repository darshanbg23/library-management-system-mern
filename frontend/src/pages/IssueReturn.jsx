import { useState, useEffect } from 'react'

const API_URL = 'http://localhost:5000/api'

function IssueReturn() {
  const [students, setStudents] = useState([])
  const [books, setBooks] = useState([])
  const [issues, setIssues] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [selectedStudent, setSelectedStudent] = useState('')
  const [selectedBook, setSelectedBook] = useState('')

  // Fetch all data
  const fetchData = async () => {
    try {
      setLoading(true)
      const [studentsRes, booksRes, issuesRes] = await Promise.all([
        fetch(`${API_URL}/students`),
        fetch(`${API_URL}/books`),
        fetch(`${API_URL}/issues`)
      ])
      const studentsData = await studentsRes.json()
      const booksData = await booksRes.json()
      const issuesData = await issuesRes.json()
      setStudents(studentsData)
      setBooks(booksData)
      setIssues(issuesData)
      setError('')
    } catch (err) {
      setError('Unable to load data.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  // Issue a book
  const handleIssue = async () => {
    setError('')
    setSuccess('')

    if (!selectedStudent || !selectedBook) {
      setError('Please select a student and a book.')
      return
    }

    try {
      const res = await fetch(`${API_URL}/issues`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ student: selectedStudent, book: selectedBook })
      })

      if (!res.ok) {
        const data = await res.json()
        setError(data.message || 'Book could not be issued.')
        return
      }

      setSuccess('Book issued successfully.')
      setSelectedStudent('')
      setSelectedBook('')
      fetchData()
    } catch (err) {
      setError('Something went wrong.')
    }
  }

  // Return a book
  const handleReturn = async (issueId) => {
    setError('')
    setSuccess('')

    try {
      const res = await fetch(`${API_URL}/issues/${issueId}/return`, {
        method: 'PUT'
      })

      if (!res.ok) {
        const data = await res.json()
        setError(data.message || 'Book could not be returned.')
        return
      }

      setSuccess('Book returned successfully.')
      fetchData()
    } catch (err) {
      setError('Something went wrong.')
    }
  }

  // Format date
  const formatDate = (dateStr) => {
    if (!dateStr) return '-'
    return new Date(dateStr).toLocaleDateString()
  }

  // Available books (availableQuantity > 0)
  const availableBooks = books.filter((book) => book.availableQuantity > 0)

  if (loading) return <p>Loading...</p>

  return (
    <div>
      <h2>Issue / Return</h2>
      <p className="page-subtitle">Issue and return books</p>

      {error && <p className="message error-message">{error}</p>}
      {success && <p className="message success-message">{success}</p>}

      <div className="issue-form">
        <h3>Issue a Book</h3>
        <div className="form-group">
          <label>Student</label>
          <select
            className="form-select"
            value={selectedStudent}
            onChange={(e) => setSelectedStudent(e.target.value)}
          >
            <option value="">Select Student</option>
            {students.map((student) => (
              <option key={student._id} value={student._id}>{student.name}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Book</label>
          <select
            className="form-select"
            value={selectedBook}
            onChange={(e) => setSelectedBook(e.target.value)}
          >
            <option value="">Select Book</option>
            {availableBooks.map((book) => (
              <option key={book._id} value={book._id}>
                {book.title} ({book.availableQuantity} available)
              </option>
            ))}
          </select>
        </div>
        <button className="btn btn-primary" onClick={handleIssue}>Issue Book</button>
      </div>

      <h3 className="section-heading">Issue Records</h3>
      <table className="data-table">
        <thead>
          <tr>
            <th>Student</th>
            <th>Book</th>
            <th>Issue Date</th>
            <th>Return Date</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {issues.length === 0 ? (
            <tr>
              <td colSpan="6" style={{ textAlign: 'center' }}>No issue records found.</td>
            </tr>
          ) : (
            issues.map((issue) => (
              <tr key={issue._id}>
                <td>{issue.student?.name || 'Unknown'}</td>
                <td>{issue.book?.title || 'Unknown'}</td>
                <td>{formatDate(issue.issueDate)}</td>
                <td>{formatDate(issue.returnDate)}</td>
                <td><span className={`badge ${issue.status === 'Issued' ? 'badge-issued' : 'badge-returned'}`}>{issue.status}</span></td>
                <td>
                  {issue.status === 'Issued' ? (
                    <button className="btn btn-success btn-sm" onClick={() => handleReturn(issue._id)}>Return</button>
                  ) : (
                    'Returned'
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}

export default IssueReturn
