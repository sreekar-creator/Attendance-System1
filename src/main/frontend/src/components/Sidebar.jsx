import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, Users, UserPlus, CheckSquare, FileText, LogOut } from 'lucide-react'

export default function Sidebar() {
  const location = useLocation()
  const userRole = localStorage.getItem('userRole') || 'teacher'
  
  let navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Student List', path: '/students', icon: Users },
    { name: 'Add Student', path: '/add-student', icon: UserPlus },
    { name: 'Mark Attendance', path: '/mark-attendance', icon: CheckSquare },
    { name: 'Report', path: '/report', icon: FileText },
    { name: 'Settings', path: '/settings', icon: UserPlus } // Re-using UserPlus icon as generic settings/profile 
  ]

  if (userRole === 'student') {
    navItems = [
        { name: 'My Dashboard', path: '/student-dashboard', icon: LayoutDashboard }
    ]
  } else if (userRole === 'admin') {
    navItems = [
        { name: 'Admin Control', path: '/admin-dashboard', icon: LayoutDashboard }
    ]
  }

  const handleLogout = () => {
    localStorage.removeItem('teacherName')
    localStorage.removeItem('userRole')
    localStorage.removeItem('studentId')
    window.location.href = '/'
  }

  return (
    <aside className="sidebar">
      <div className="sidebar-header" style={{ padding: '1.5rem', borderBottom: '1px solid var(--border)' }}>
        <h2 className="text-gradient" style={{ margin: 0 }}>📊 Attendance App</h2>
      </div>
      <nav style={{ padding: '1.5rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = location.pathname === item.path
          return (
            <Link
              key={item.path}
              to={item.path}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                color: isActive ? '#fff' : 'var(--text-muted)',
                background: isActive ? 'var(--primary)' : 'transparent',
                textDecoration: 'none',
                fontWeight: isActive ? 600 : 500,
                transition: 'all 0.2s',
              }}
              className="nav-link hover-bg"
            >
              <Icon size={20} />
              {item.name}
            </Link>
          )
        })}
        
        <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
          <button 
            onClick={handleLogout}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.75rem 1rem',
              borderRadius: '8px',
              color: 'var(--danger)',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 500,
              fontSize: '1rem',
              transition: 'all 0.2s',
            }}
          >
            <LogOut size={20} />
            Log Out
          </button>
        </div>
      </nav>
    </aside>
  )
}
