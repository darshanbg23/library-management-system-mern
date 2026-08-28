import { useState, useEffect } from 'react'

const API_URL = 'http://localhost:5000/api/books'

function Books() {
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [search, setSearch] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingBook, setEditingBook] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    category: '',
    isbn: '',
    quantity: ''
  })

  // Fetch all books
  const fetchBooks = async () => {
    try {
      setLoading(true)
      const res = await fetch(API_URL)
      const data = await res.json()
      setBooks(data)
      setError('')
    } catch (err) {
      setError('Unable to load books.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBooks()
  }, [])

  // Filter books by search
  const filteredBooks = books.filter((book) =>
    book.title.toLowerCase().includes(search.toLowerCase()) ||
    book.author.toLowerCase().includes(search.toLowerCase()) ||
    book.category.toLowerCase().includes(search.toLowerCase()) ||
    book.isbn.toLowerCase().includes(search.toLowerCase())
  )

  // Handle form input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  // Open add form
  const handleAddClick = () => {
    setEditingBook(null)
    setFormData({ title: '', author: '', category: '', isbn: '', quantity: '' })
    setShowForm(true)
    setSuccess('')
    setError('')
  }

  // Open edit form
  const handleEditClick = (book) => {
    setEditingBook(book)
    setFormData({
      title: book.title,
      author: book.author,
      category: book.category,
      isbn: book.isbn,
      quantity: book.quantity
    })
    setShowForm(true)
    setSuccess('')
    setError('')
  }

  // Cancel form
  const handleCancel = () => {
    setShowForm(false)
    setEditingBook(null)
    setFormData({ title: '', author: '', category: '', isbn: '', quantity: '' })
  }

  // Submit form (add or edit)
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    // Basic validation
    if (!formData.title || !formData.author || !formData.category || !formData.isbn || formData.quantity === '') {
      setError('Please provide all required fields.')
      return
    }

    if (Number(formData.quantity) < 0) {
      setError('Quantity cannot be negative.')
      return
    }

    try {
      if (editingBook) {
        // Update book
        const res = await fetch(`${API_URL}/${editingBook._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: formData.title,
            author: formData.author,
            category: formData.category,
            isbn: formData.isbn,
            quantity: Number(formData.quantity)
          })
        })
        if (!res.ok) {
          const data = await res.json()
          setError(data.message || 'Book could not be updated.')
          return
        }
        setSuccess('Book updated successfully.')
      } else {
        // Add book
        const res = await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: formData.title,
            author: formData.author,
            category: formData.category,
            isbn: formData.isbn,
            quantity: Number(formData.quantity)
          })
        })
        if (!res.ok) {
          const data = await res.json()
          setError(data.message || 'Book could not be added.')
          return
        }
        setSuccess('Book added successfully.')
      }

      setShowForm(false)
      setEditingBook(null)
      setFormData({ title: '', author: '', category: '', isbn: '', quantity: '' })
      fetchBooks()
    } catch (err) {
      setError('Something went wrong.')
    }
  }

  // Delete book
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this book?')) return

    try {
      setError('')
      setSuccess('')
      const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' })
      if (!res.ok) {
        const data = await res.json()
        setError(data.message || 'Book could not be deleted.')
        return
      }
      setSuccess('Book deleted successfully.')
      fetchBooks()
    } catch (err) {
      setError('Something went wrong.')
    }
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h2>Books</h2>
          <p className="page-subtitle">Manage books in the library</p>
        </div>
        <div className="page-actions">
          <input
            type="text"
            placeholder="Search books..."
            className="search-input"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button className="btn btn-primary" onClick={handleAddClick}>Add Book</button>
        </div>
      </div>

      {error && <p className="message error-message">{error}</p>}
      {success && <p className="message success-message">{success}</p>}

      {showForm && (
        <div className="form-container">
          <h3>{editingBook ? 'Edit Book' : 'Add Book'}</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Title</label>
              <input type="text" name="title" value={formData.title} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Author</label>
              <input type="text" name="author" value={formData.author} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Category</label>
              <input type="text" name="category" value={formData.category} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>ISBN</label>
              <input type="text" name="isbn" value={formData.isbn} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Quantity</label>
              <input type="number" name="quantity" value={formData.quantity} onChange={handleChange} min="0" />
            </div>
            <div className="form-buttons">
              <button type="submit" className="btn btn-primary">
                {editingBook ? 'Update Book' : 'Add Book'}
              </button>
              <button type="button" className="btn btn-secondary" onClick={handleCancel}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Author</th>
              <th>Category</th>
              <th>ISBN</th>
              <th>Quantity</th>
              <th>Available</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredBooks.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center' }}>No books found.</td>
              </tr>
            ) : (
              filteredBooks.map((book) => (
                <tr key={book._id}>
                  <td>{book.title}</td>
                  <td>{book.author}</td>
                  <td>{book.category}</td>
                  <td>{book.isbn}</td>
                  <td>{book.quantity}</td>
                  <td>{book.availableQuantity}</td>
                  <td>
                    <button className="btn btn-primary btn-sm" onClick={() => handleEditClick(book)}>Edit</button>
                    {' '}
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(book._id)}>Delete</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  )
}

export default Books
