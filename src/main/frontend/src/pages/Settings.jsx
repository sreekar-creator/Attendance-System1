import { useState } from 'react'
import { Key } from 'lucide-react'

export default function Settings() {
  const [newPassword, setNewPassword] = useState('')
  const [msg, setMsg] = useState({ text: '', type: '' })

  const teacherId = localStorage.getItem('teacherId');

  const handleChangePassword = async (e) => {
    e.preventDefault()
    setMsg({ text: 'Updating...', type: 'info' })

    try {
      const res = await fetch(`/api/teacher/password?teacherId=${teacherId}&newPassword=${encodeURIComponent(newPassword)}`, {
        method: 'PUT'
      })
      
      const data = await res.json()
      if (res.ok && data.success) {
        setMsg({ text: 'Password successfully updated!', type: 'success' })
        setNewPassword('')
      } else {
        setMsg({ text: data.message || 'Failed to update password.', type: 'danger' })
      }
    } catch (err) {
      setMsg({ text: 'Network error.', type: 'danger' })
    }
  }

  return (
    <div className="animate-fade-in" style={{ maxWidth: '600px', margin: '0 auto' }}>
      <h1 className="text-gradient" style={{ fontSize: '2.5rem', marginBottom: '2rem' }}>Account Settings</h1>

      <div className="glass-card">
        <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Key size={20}/> Change Password
        </h2>
        
        {msg.text && (
          <div className={`badge badge-${msg.type}`} style={{ display: 'block', padding: '10px', marginBottom: '1rem' }}>
            {msg.text}
          </div>
        )}

        <form onSubmit={handleChangePassword}>
          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label className="form-label">New Password</label>
            <input 
              type="password" 
              className="form-input" 
              required 
              minLength={6}
              value={newPassword} 
              onChange={e => setNewPassword(e.target.value)} 
              placeholder="Enter at least 6 characters"
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Update Password</button>
        </form>
      </div>
    </div>
  )
}
