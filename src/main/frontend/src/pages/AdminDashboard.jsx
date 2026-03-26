import { useState, useEffect } from 'react'
import { Shield, Plus } from 'lucide-react'

export default function AdminDashboard() {
  const [teachers, setTeachers] = useState([])
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({ name: '', subject: '', username: '', password: '' })
  const [msg, setMsg] = useState({ text: '', type: '' })

  const fetchTeachers = async () => {
    try {
      const response = await fetch('/api/teachers')
      if (response.ok) {
        setTeachers(await response.json())
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchTeachers() }, [])

  const handleAddTeacher = async (e) => {
    e.preventDefault()
    setMsg({ text: 'Adding...', type: 'info' })
    try {
      const res = await fetch('/api/teachers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      if (res.ok) {
        setMsg({ text: 'Teacher added successfully!', type: 'success' })
        setFormData({ name: '', subject: '', username: '', password: '' })
        fetchTeachers()
      } else {
        setMsg({ text: 'Failed to add teacher.', type: 'danger' })
      }
    } catch (err) {
      setMsg({ text: 'Network error.', type: 'danger' })
    }
  }

  return (
    <div className="animate-fade-in">
      <h1 className="text-gradient" style={{ fontSize: '2.5rem', marginBottom: '2rem' }}>
        <Shield style={{ display: 'inline', marginRight: '10px' }} size={36}/>
        Admin Control Panel
      </h1>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        <div className="glass-card">
          <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Plus size={20}/> Register New Teacher
          </h2>
          
          {msg.text && (
            <div className={`badge badge-${msg.type}`} style={{ display: 'block', padding: '10px', marginBottom: '1rem' }}>
              {msg.text}
            </div>
          )}

          <form onSubmit={handleAddTeacher}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input type="text" className="form-input" required 
                value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
            </div>
            <div className="form-group">
              <label className="form-label">Department/Subject</label>
              <input type="text" className="form-input" required 
                value={formData.subject} onChange={e => setFormData({...formData, subject: e.target.value})} />
            </div>
            <div className="form-group">
              <label className="form-label">Login Username</label>
              <input type="text" className="form-input" required 
                value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})} />
            </div>
            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
              <label className="form-label">Initial Password</label>
              <input type="password" className="form-input" required 
                value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Create Teacher Account</button>
          </form>
        </div>

        <div className="glass-card">
          <h2 style={{ marginBottom: '1.5rem' }}>Registered Teachers</h2>
          {loading ? <p>Loading...</p> : (
            <div className="table-container" style={{ maxHeight: '400px', overflowY: 'auto' }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Subject</th>
                    <th>Username</th>
                  </tr>
                </thead>
                <tbody>
                  {teachers.map(t => (
                    <tr key={t.id}>
                      <td>{t.name}</td>
                      <td>{t.subject}</td>
                      <td><code>{t.username}</code></td>
                    </tr>
                  ))}
                  {teachers.length === 0 && (
                    <tr><td colSpan="3" style={{ textAlign: 'center' }}>No teachers registered yet.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
