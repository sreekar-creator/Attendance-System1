import { useState, useEffect } from 'react'

export default function MarkAttendance() {
  const [students, setStudents] = useState([])
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [statusMap, setStatusMap] = useState({})
  const [message, setMessage] = useState({ text: '', type: '' })
  
  useEffect(() => {
    fetchStudents()
  }, [])

  const fetchStudents = async () => {
    try {
      const response = await fetch('/api/students')
      if (response.ok) {
        const data = await response.json()
        setStudents(data)
        const initialStatus = {}
        data.forEach(s => initialStatus[s.id] = 'PRESENT')
        setStatusMap(initialStatus)
      }
    } catch {
      showMessage('Error loading students', 'danger')
    }
  }

  const showMessage = (text, type = 'success') => {
    setMessage({ text, type })
    setTimeout(() => setMessage({ text: '', type: '' }), 3000)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    let successCount = 0
    let failureCount = 0
    
    for (let student of students) {
      const status = statusMap[student.id]
      try {
        const response = await fetch(`/api/attendance/mark?studentId=${student.id}&date=${date}&status=${status}`, {
          method: 'POST'
        })
        if (response.ok) successCount++
        else failureCount++
      } catch (err) {
        failureCount++
      }
    }
    
    if (failureCount === 0 && successCount > 0) {
      showMessage('Attendance marked successfully for all students')
    } else {
      showMessage(`Marked: ${successCount}. Failed: ${failureCount}`, 'warning')
    }
  }

  return (
    <div className="animate-fade-in">
      <h1 className="text-gradient" style={{ fontSize: '2.5rem', marginBottom: '2rem' }}>Mark Attendance</h1>
      
      {message.text && (
        <div className={`badge badge-${message.type}`} style={{ display: 'block', padding: '1rem', marginBottom: '1.5rem', fontSize: '1rem' }}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="glass-card" style={{ marginBottom: '2rem' }}>
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label" htmlFor="date">Date</label>
            <input 
              type="date" 
              className="form-input" 
              id="date" 
              style={{ maxWidth: '300px' }}
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>
        </div>
        
        <div className="glass-card" style={{ padding: 0, overflow: 'hidden', marginBottom: '2rem' }}>
          <div className="table-responsive">
            <table>
              <thead>
                <tr>
                  <th>Roll No</th>
                  <th>Name</th>
                  <th>Department</th>
                  <th>Attendance Status</th>
                </tr>
              </thead>
              <tbody>
                {students.map(s => (
                  <tr key={s.id}>
                    <td><span className="badge badge-warning">{s.rollNumber}</span></td>
                    <td style={{ fontWeight: 500 }}>{s.name}</td>
                    <td>{s.department}</td>
                    <td>
                      <select 
                        className="form-input" 
                        style={{ padding: '0.4rem', border: 'none', background: 'rgba(255,255,255,0.05)', maxWidth: '150px' }}
                        value={statusMap[s.id]}
                        onChange={(e) => setStatusMap({...statusMap, [s.id]: e.target.value})}
                      >
                        <option value="PRESENT" style={{ color: 'black' }}>Present</option>
                        <option value="ABSENT" style={{ color: 'black' }}>Absent</option>
                      </select>
                    </td>
                  </tr>
                ))}
                {students.length === 0 && (
                  <tr><td colSpan="4" style={{ textAlign: 'center', padding: '2rem' }}>No students registerd to mark.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        
        {students.length > 0 && (
          <button type="submit" className="btn btn-primary" style={{ padding: '1rem 3rem', fontSize: '1.2rem' }}>
            Submit Attendance
          </button>
        )}
      </form>
    </div>
  )
}
