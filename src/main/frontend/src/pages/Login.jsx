import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { LogIn, UserCircle, Key } from 'lucide-react'

export default function Login() {
  const [loginRole, setLoginRole] = useState('teacher') // 'teacher', 'student', 'admin'
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  
  const [studentName, setStudentName] = useState('')
  const [rollNumber, setRollNumber] = useState('')

  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  
  const navigate = useNavigate()

  const handleTeacherLogin = async () => {
    return await fetch(`/api/login?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`, { method: 'POST' })
  }

  const handleAdminLogin = async () => {
    return await fetch(`/api/admin/login?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`, { method: 'POST' })
  }

  const handleStudentLogin = async () => {
    return await fetch(`/api/student/login?name=${encodeURIComponent(studentName)}&rollNumber=${encodeURIComponent(rollNumber)}`, { method: 'POST' })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    try {
      let response;
      if (loginRole === 'student') response = await handleStudentLogin();
      else if (loginRole === 'admin') response = await handleAdminLogin();
      else response = await handleTeacherLogin();

      const result = await response.json()
      
      if (response.ok && result.success) {
        if (loginRole === 'student') {
            localStorage.setItem('userRole', 'student')
            localStorage.setItem('teacherName', result.studentName)
            localStorage.setItem('studentId', result.studentId)
            navigate('/student-dashboard')
        } else if (loginRole === 'admin') {
            localStorage.setItem('userRole', 'admin')
            localStorage.setItem('teacherName', 'Administrator')
            navigate('/admin-dashboard')
        } else {
            localStorage.setItem('userRole', 'teacher')
            localStorage.setItem('teacherName', result.teacherName)
            localStorage.setItem('teacherId', result.teacherId)
            navigate('/dashboard')
        }
      } else {
        setError(result.message || 'Login failed')
      }
    } catch (err) {
      setError('Network error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '1rem' }}>
      <div className="glass-card animate-fade-in" style={{ maxWidth: '400px', width: '100%' }}>
        
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginBottom: '2rem' }}>
            {['admin', 'teacher', 'student'].map(role => (
              <button 
                  key={role}
                  onClick={() => { setLoginRole(role); setError(''); }}
                  style={{ 
                      padding: '8px 16px', 
                      borderRadius: '20px', 
                      border: '1px solid var(--primary)', 
                      background: loginRole === role ? 'var(--primary)' : 'transparent',
                      color: loginRole === role ? 'white' : 'var(--text)',
                      cursor: 'pointer',
                      fontWeight: 'bold',
                      textTransform: 'capitalize'
                  }}>{role}</button>
            ))}
        </div>

        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h2 className="text-gradient" style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
            {loginRole.charAt(0).toUpperCase() + loginRole.slice(1)} Access
          </h2>
          <p style={{ color: 'var(--text-muted)' }}>
            {loginRole === 'student' ? 'View your attendance records' : 'Sign in to manage system'}
          </p>
          {loginRole === 'admin' && <p style={{ fontSize: '0.8rem', color: 'var(--warning)', marginTop: '0.5rem' }}>Admin default - User: admin, Pass: admin123</p>}
        </div>
        
        {error && (
          <div className="badge badge-danger" style={{ display: 'block', textAlign: 'center', padding: '0.75rem', marginBottom: '1.5rem' }}>
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
            {loginRole !== 'student' ? (
                <>
                <div className="form-group">
                    <label className="form-label" htmlFor="username">Username</label>
                    <input 
                    type="text" 
                    id="username" 
                    className="form-input" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required 
                    placeholder="Enter username"
                    />
                </div>
                <div className="form-group" style={{ marginBottom: '2rem' }}>
                    <label className="form-label" htmlFor="password">Password</label>
                    <input 
                    type="password" 
                    id="password" 
                    className="form-input" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required 
                    placeholder="••••••••"
                    />
                </div>
                </>
            ) : (
                <>
                <div className="form-group">
                    <label className="form-label" htmlFor="studentName">Full Name</label>
                    <input 
                    type="text" 
                    id="studentName" 
                    className="form-input" 
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    required 
                    placeholder="e.g. John Doe"
                    />
                </div>
                <div className="form-group" style={{ marginBottom: '2rem' }}>
                    <label className="form-label" htmlFor="rollNumber">Roll Number</label>
                    <input 
                    type="text" 
                    id="rollNumber" 
                    className="form-input" 
                    value={rollNumber}
                    onChange={(e) => setRollNumber(e.target.value)}
                    required 
                    placeholder="e.g. CS101"
                    />
                </div>
                </>
            )}

          <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
            {loading ? 'Signing in...' : (
              <>
                <LogIn size={20} />
                Sign In
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  )
}
