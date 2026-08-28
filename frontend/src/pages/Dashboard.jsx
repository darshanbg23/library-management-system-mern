import { useState, useEffect } from 'react'

const API_URL = 'http://localhost:5000/api/dashboard'

function Dashboard() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchDashboard = async () => {
    try {
      setLoading(true)
      const res = await fetch(API_URL)
      const result = await res.json()
      setData(result)
      setError('')
    } catch (err) {
      setError('Unable to load dashboard data.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDashboard()
  }, [])

  if (loading) return <p>Loading...</p>
  if (error) return <p className="message error-message">{error}</p>

  return (
    <div>
      <h2>Dashboard</h2>
      <p className="page-subtitle">Overview of your library</p>
      <div className="dashboard-cards">
        <div className="card">
          <h3>Total Books</h3>
          <p className="card-number">{data.totalBooks}</p>
          <p className="card-desc">All books in library</p>
        </div>
        <div className="card">
          <h3>Total Students</h3>
          <p className="card-number">{data.totalStudents}</p>
          <p className="card-desc">Registered students</p>
        </div>
        <div className="card">
          <h3>Available Books</h3>
          <p className="card-number">{data.availableBooks}</p>
          <p className="card-desc">Copies available to issue</p>
        </div>
        <div className="card">
          <h3>Issued Books</h3>
          <p className="card-number">{data.issuedBooks}</p>
          <p className="card-desc">Currently issued</p>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
