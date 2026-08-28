import { useState, useEffect } from 'react'

const API_URL = 'http://localhost:5000/api/students'

function Students() {
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [search, setSearch] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingStudent, setEditingStudent] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    course: ''
  })

  // Fetch all students
  const fetchStudents = async () => {
    try {
      setLoading(true)
      const res = await fetch(API_URL)
      const data = await res.json()
      setStudents(data)
      setError('')
    } catch (err) {
      setError('Unable to load students.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStudents()
  }, [])

  // Filter students by search
  const filteredStudents = students.filter((student) =>
    student.name.toLowerCase().includes(search.toLowerCase()) ||
    student.email.toLowerCase().includes(search.toLowerCase()) ||
    student.phone.toLowerCase().includes(search.toLowerCase()) ||
    student.course.toLowerCase().includes(search.toLowerCase())
  )

  // Handle form input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  // Open add form
  const handleAddClick = () => {
    setEditingStudent(null)
    setFormData({ name: '', email: '', phone: '', course: '' })
    setShowForm(true)
    setSuccess('')
    setError('')
  }

  // Open edit form
  const handleEditClick = (student) => {
    setEditingStudent(student)
    setFormData({
      name: student.name,
      email: student.email,
      phone: student.phone,
      course: student.course
    })
    setShowForm(true)
    setSuccess('')
    setError('')
  }

  // Cancel form
  const handleCancel = () => {
    setShowForm(false)
    setEditingStudent(null)
    setFormData({ name: '', email: '', phone: '', course: '' })
  }

  // Submit form (add or edit)
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    // Basic validation
    if (!formData.name || !formData.email || !formData.phone || !formData.course) {
      setError('Please provide all required fields.')
      return
    }

    try {
      if (editingStudent) {
        // Update student
        const res = await fetch(`${API_URL}/${editingStudent._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        })
        if (!res.ok) {
          const data = await res.json()
          setError(data.message || 'Student could not be updated.')
          return
        }
        setSuccess('Student updated successfully.')
      } else {
        // Add student
        const res = await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        })
        if (!res.ok) {
          const data = await res.json()
          setError(data.message || 'Student could not be added.')
          return
        }
        setSuccess('Student added successfully.')
      }

      setShowForm(false)
      setEditingStudent(null)
      setFormData({ name: '', email: '', phone: '', course: '' })
      fetchStudents()
    } catch (err) {
      setError('Something went wrong.')
    }
  }

  // Delete student
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this student?')) return

    try {
      setError('')
      setSuccess('')
      const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' })
      if (!res.ok) {
        const data = await res.json()
        setError(data.message || 'Student could not be deleted.')
        return
      }
      setSuccess('Student deleted successfully.')
      fetchStudents()
    } catch (err) {
      setError('Something went wrong.')
    }
  }

  return (
    <div>
      <div className="page-header">
        <h2>Students</h2>
        <div className="page-actions">
          <input
            type="text"
            placeholder="Search students..."
            className="search-input"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button className="btn btn-primary" onClick={handleAddClick}>Add Student</button>
        </div>
      </div>

      {error && <p className="message error-message">{error}</p>}
      {success && <p className="message success-message">{success}</p>}

      {showForm && (
        <div className="form-container">
          <h3>{editingStudent ? 'Edit Student' : 'Add Student'}</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Name</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Phone</label>
              <input type="text" name="phone" value={formData.phone} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Course</label>
              <input type="text" name="course" value={formData.course} onChange={handleChange} />
            </div>
            <div className="form-buttons">
              <button type="submit" className="btn btn-primary">
                {editingStudent ? 'Update Student' : 'Add Student'}
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
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Course</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center' }}>No students found.</td>
              </tr>
            ) : (
              filteredStudents.map((student) => (
                <tr key={student._id}>
                  <td>{student.name}</td>
                  <td>{student.email}</td>
                  <td>{student.phone}</td>
                  <td>{student.course}</td>
                  <td>
                    <button className="btn btn-primary btn-sm" onClick={() => handleEditClick(student)}>Edit</button>
                    {' '}
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(student._id)}>Delete</button>
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

export default Students
