import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Trash2 } from 'lucide-react'

export default function StudentList() {
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState({ text: '', type: '' })

  const fetchStudents = async () => {
    try {
      const response = await fetch('/api/students')
      if (response.ok) {
        const data = await response.json()
        setStudents(data)
      }
    } catch (error) {
      console.error('Error fetching students:', error)
      showMessage('Error loading students', 'danger')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStudents()
  }, [])

  const showMessage = (text, type = 'success') => {
    setMessage({ text, type })
    setTimeout(() => setMessage({ text: '', type: '' }), 3000)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this student?')) return
    
    try {
      const response = await fetch(`/api/students/${id}`, { method: 'DELETE' })
      if (response.ok) {
        showMessage('Student deleted successfully')
        fetchStudents()
      } else {
        showMessage('Failed to delete student', 'danger')
      }
    } catch (error) {
      showMessage('Error deleting student', 'danger')
    }
  }

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 className="text-gradient" style={{ fontSize: '2.5rem', margin: 0 }}>Student List</h1>
        <Link to="/add-student" className="btn btn-primary">
          <Plus size={20} />
          Add New
        </Link>
      </div>

      {message.text && (
        <div className={`badge badge-${message.type}`} style={{ display: 'block', padding: '1rem', marginBottom: '1.5rem', fontSize: '1rem' }}>
          {message.text}
        </div>
      )}

      <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Roll Number</th>
                <th>Name</th>
                <th>Department</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="5" style={{ textAlign: 'center', padding: '2rem' }}>Loading students...</td></tr>
              ) : students.length === 0 ? (
                <tr><td colSpan="5" style={{ textAlign: 'center', padding: '2rem' }}>No students found.</td></tr>
              ) : (
                students.map(s => (
                  <tr key={s.id}>
                    <td>{s.id}</td>
                    <td><span className="badge badge-warning">{s.rollNumber}</span></td>
                    <td style={{ fontWeight: 500 }}>{s.name}</td>
                    <td>{s.department}</td>
                    <td>
                      <button 
                        onClick={() => handleDelete(s.id)} 
                        className="btn btn-danger" 
                        style={{ padding: '0.5rem', gap: 0 }}
                        title="Delete Student"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
