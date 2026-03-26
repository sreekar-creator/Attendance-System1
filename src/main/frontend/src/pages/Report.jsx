import { useState, useEffect } from 'react'
import { Calendar } from 'lucide-react'

export default function Report() {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [report, setReport] = useState([])
  const [loading, setLoading] = useState(false)

  const fetchReport = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/attendance?date=${date}`)
      if (response.ok) {
        const data = await response.json()
        setReport(data)
      } else {
        setReport([])
      }
    } catch {
      setReport([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (date) fetchReport()
  }, [date])

  return (
    <div className="animate-fade-in">
      <h1 className="text-gradient" style={{ fontSize: '2.5rem', marginBottom: '2rem' }}>Attendance Report</h1>
      
      <div className="glass-card" style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '2rem' }}>
        <div className="form-group" style={{ margin: 0, flex: 1, maxWidth: '300px' }}>
          <label className="form-label" htmlFor="date">Filter by Date</label>
          <div style={{ position: 'relative' }}>
            <Calendar size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type="date" 
              className="form-input" 
              id="date"
              style={{ paddingLeft: '3rem' }}
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>
        </div>
      </div>
      
      <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="table-responsive">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Student ID</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="3" style={{ textAlign: 'center', padding: '2rem' }}>Loading report...</td></tr>
              ) : report.length === 0 ? (
                <tr><td colSpan="3" style={{ textAlign: 'center', padding: '2rem' }}>No attendance records found for this date.</td></tr>
              ) : (
                report.map(r => (
                  <tr key={r.id}>
                    <td>{r.date}</td>
                    <td style={{ fontWeight: 500 }}>{r.student.name} ({r.student.rollNumber})</td>
                    <td>
                      <span className={`badge badge-${r.status === 'PRESENT' ? 'success' : 'danger'}`}>
                        {r.status}
                      </span>
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
