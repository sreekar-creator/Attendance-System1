import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Users, UserCheck, Activity } from 'lucide-react'

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalStudents: '-',
    totalTeachers: '-',
    todayAttendanceCount: '-'
  })
  const [loading, setLoading] = useState(true)
  const [reports, setReports] = useState([])

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/stats/dashboard')
        if (response.ok) {
          const data = await response.json()
          setStats(data)
        }
      } catch (error) {
        console.error("Failed to fetch dashboard stats", error)
      } finally {
        setLoading(false)
      }
    }
    
    const fetchReports = async () => {
      try {
        const response = await fetch('/api/reports')
        if (response.ok) {
          setReports(await response.json())
        }
      } catch (err) {
        console.error("Failed to fetch reports", err)
      }
    }

    fetchStats()
    fetchReports()
  }, [])

  return (
    <div className="animate-fade-in">
      <h1 className="text-gradient" style={{ fontSize: '2.5rem', marginBottom: '2rem' }}>Dashboard Overview</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ padding: '1rem', background: 'rgba(99, 102, 241, 0.15)', borderRadius: '12px', color: 'var(--primary)' }}>
            <Users size={32} />
          </div>
          <div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem', fontWeight: 500 }}>Total Students</div>
            <div style={{ fontSize: '2rem', fontWeight: 700 }}>{loading ? '...' : stats.totalStudents}</div>
          </div>
        </div>
        
        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ padding: '1rem', background: 'rgba(236, 72, 153, 0.15)', borderRadius: '12px', color: 'var(--secondary)' }}>
            <Activity size={32} />
          </div>
          <div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem', fontWeight: 500 }}>Total Teachers</div>
            <div style={{ fontSize: '2rem', fontWeight: 700 }}>{loading ? '...' : stats.totalTeachers}</div>
          </div>
        </div>

        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ padding: '1rem', background: 'rgba(34, 197, 94, 0.15)', borderRadius: '12px', color: 'var(--success)' }}>
            <UserCheck size={32} />
          </div>
          <div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem', fontWeight: 500 }}>Attendance Today</div>
            <div style={{ fontSize: '2rem', fontWeight: 700 }}>{loading ? '...' : stats.todayAttendanceCount}</div>
          </div>
        </div>
      </div>

      <div className="glass-card">
        <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>Quick Actions</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
          <Link to="/mark-attendance" className="btn btn-primary">
            Mark Today's Attendance
          </Link>
          <Link to="/add-student" className="btn btn-secondary">
            Register New Student
          </Link>
        </div>
      </div>

      <div className="glass-card" style={{ marginTop: '2rem' }}>
        <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>Student Reports Inbox</h2>
        {reports.length === 0 ? (
          <p style={{ color: 'var(--text-muted)' }}>No new reports from students.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {reports.map((r) => (
              <div key={r.id} style={{ 
                padding: '1rem', 
                background: 'rgba(255,255,255,0.05)', 
                borderRadius: '8px',
                borderLeft: r.read ? '4px solid var(--success)' : '4px solid var(--warning)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ fontWeight: 'bold' }}>{r.studentName}</span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{new Date(r.sentAt).toLocaleString()}</span>
                </div>
                <p style={{ margin: 0, color: 'var(--text)' }}>{r.message}</p>
                {!r.read && (
                  <button 
                    style={{ marginTop: '0.75rem', padding: '4px 8px', fontSize: '0.8rem' }} 
                    className="btn btn-secondary"
                    onClick={async () => {
                      await fetch(`/api/reports/${r.id}/read`, { method: 'PUT' });
                      setReports(reports.map(rep => rep.id === r.id ? {...rep, read: true} : rep));
                    }}
                  >
                    Mark as Read
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
