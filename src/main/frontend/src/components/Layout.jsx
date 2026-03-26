import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Chatbot from './Chatbot'

export default function Layout() {
  const teacherName = localStorage.getItem('teacherName') || 'Teacher'

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        <header className="topbar" style={{ 
          padding: '1.5rem 2rem', 
          borderBottom: '1px solid var(--border)',
          background: 'rgba(15, 23, 42, 0.4)',
          backdropFilter: 'blur(10px)',
          display: 'flex',
          justifyContent: 'flex-end',
          position: 'sticky',
          top: 0,
          zIndex: 5
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
              {teacherName.charAt(0).toUpperCase()}
            </div>
            <span style={{ fontWeight: 500 }}>{teacherName}</span>
          </div>
        </header>

        <div className="page-content" style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
          <Outlet />
        </div>
        
        <Chatbot />
      </main>
    </div>
  )
}
