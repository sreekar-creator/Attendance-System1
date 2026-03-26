import { useState, useEffect } from 'react'
import { Activity, CalendarCheck, Percent, Send } from 'lucide-react'

export default function StudentDashboard() {
  const [stats, setStats] = useState({
    totalDays: '-',
    presentDays: '-',
    percentage: '-'
  })
  const [loading, setLoading] = useState(true)
  const [reportText, setReportText] = useState('')
  const [reportMsg, setReportMsg] = useState({ text: '', type: '' })

  const studentId = localStorage.getItem('studentId');
  const studentName = localStorage.getItem('teacherName'); // We store student name here too

  useEffect(() => {
    const fetchStats = async () => {
      if (!studentId) return;
      try {
        const response = await fetch(`/api/students/${studentId}/stats`)
        if (response.ok) {
          const data = await response.json()
          setStats(data)
        }
      } catch (error) {
        console.error("Failed to fetch student stats", error)
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [studentId])

  return (
    <div className="animate-fade-in">
      <h1 className="text-gradient" style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Student Portal</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Welcome back, {studentName}. Here is your attendance overview.</p>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
        
        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ padding: '1rem', background: 'rgba(99, 102, 241, 0.15)', borderRadius: '12px', color: 'var(--primary)' }}>
            <Activity size={32} />
          </div>
          <div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem', fontWeight: 500 }}>Total Working Days</div>
            <div style={{ fontSize: '2rem', fontWeight: 700 }}>{loading ? '...' : stats.totalDays}</div>
          </div>
        </div>

        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ padding: '1rem', background: 'rgba(34, 197, 94, 0.15)', borderRadius: '12px', color: 'var(--success)' }}>
            <CalendarCheck size={32} />
          </div>
          <div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem', fontWeight: 500 }}>Days Present</div>
            <div style={{ fontSize: '2rem', fontWeight: 700 }}>{loading ? '...' : stats.presentDays}</div>
          </div>
        </div>

        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ padding: '1rem', background: 'rgba(236, 72, 153, 0.15)', borderRadius: '12px', color: 'var(--secondary)' }}>
            <Percent size={32} />
          </div>
          <div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem', fontWeight: 500 }}>Overall Percentage</div>
            <div style={{ fontSize: '2rem', fontWeight: 700, color: stats.percentage < 75 ? 'var(--danger)' : 'white' }}>
              {loading ? '...' : `${stats.percentage}%`}
            </div>
            {stats.percentage < 75 && !loading && (
              <div style={{ fontSize: '0.75rem', color: 'var(--danger)', marginTop: '4px' }}>Low Attendance</div>
            )}
          </div>
        </div>

      </div>

      <div className="glass-card" style={{ marginTop: '2rem' }}>
        <h2 style={{ marginBottom: '1rem', fontSize: '1.5rem' }}>Report an Issue</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
          If you believe your attendance was marked incorrectly, send a message to the teacher below.
        </p>

        {reportMsg.text && (
          <div className={`badge badge-${reportMsg.type}`} style={{ display: 'block', padding: '10px', marginBottom: '1rem' }}>
            {reportMsg.text}
          </div>
        )}

        <form onSubmit={async (e) => {
          e.preventDefault()
          setReportMsg({ text: 'Sending...', type: 'info' })
          try {
            const res = await fetch('/api/reports', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                studentId: studentId,
                studentName: studentName,
                message: reportText
              })
            })
            if (res.ok) {
              setReportMsg({ text: 'Report sent successfully!', type: 'success' })
              setReportText('')
            } else {
              setReportMsg({ text: 'Failed to send report.', type: 'danger' })
            }
          } catch (err) {
            setReportMsg({ text: 'Network Error', type: 'danger' })
          }
        }}>
          <textarea 
            className="form-input" 
            style={{ minHeight: '100px', resize: 'vertical' }} 
            placeholder="E.g., I was present on Monday the 25th but marked absent..."
            required
            value={reportText}
            onChange={(e) => setReportText(e.target.value)}
          ></textarea>
          <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Send size={18}/> Submit Report
          </button>
        </form>
      </div>

    </div>
  )
}

