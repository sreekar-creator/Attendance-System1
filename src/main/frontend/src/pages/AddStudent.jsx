import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Save } from 'lucide-react'

export default function AddStudent() {
  const [formData, setFormData] = useState({ rollNumber: '', name: '', department: '' })
  const [message, setMessage] = useState({ text: '', type: '' })
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const showMessage = (text, type = 'success') => {
    setMessage({ text, type })
    setTimeout(() => setMessage({ text: '', type: '' }), 3000)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const response = await fetch('/api/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      if (response.ok) {
        showMessage('Student added successfully!')
        setTimeout(() => navigate('/students'), 1500)
      } else {
        showMessage('Failed to add student', 'danger')
      }
    } catch {
      showMessage('Network Error while saving', 'danger')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '2rem' }}>
      <h1 className="text-gradient" style={{ fontSize: '2.5rem', marginBottom: '1.5rem' }}>Register New Student</h1>
      
      <div className="glass-card" style={{ maxWidth: '500px', width: '100%', padding: '2.5rem' }}>
        {message.text && (
          <div className={`badge badge-${message.type}`} style={{ display: 'block', padding: '1rem', marginBottom: '1.5rem', fontSize: '1rem' }}>
            {message.text}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label className="form-label" htmlFor="rollNumber">Roll Number</label>
            <input 
              type="text" 
              className="form-input" 
              id="rollNumber"
              value={formData.rollNumber}
              onChange={(e) => setFormData({...formData, rollNumber: e.target.value})}
              required
            />
          </div>
          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label className="form-label" htmlFor="name">Name</label>
            <input 
              type="text" 
              className="form-input" 
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
            />
          </div>
          <div className="form-group" style={{ marginBottom: '2.5rem' }}>
            <label className="form-label" htmlFor="department">Department</label>
            <input 
              type="text" 
              className="form-input" 
              id="department"
              value={formData.department}
              onChange={(e) => setFormData({...formData, department: e.target.value})}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
            {loading ? 'Processing...' : (
              <>
                <Save size={20} /> Save Student
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  )
}
