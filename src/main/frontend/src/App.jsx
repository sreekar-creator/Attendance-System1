import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import StudentDashboard from './pages/StudentDashboard'
import AdminDashboard from './pages/AdminDashboard'
import Settings from './pages/Settings'
import StudentList from './pages/StudentList'
import MarkAttendance from './pages/MarkAttendance'
import AddStudent from './pages/AddStudent'
import Report from './pages/Report'

// Simple Route Guard for Teachers vs Students
const ProtectedRoute = ({ children, allowedRoles }) => {
  const role = localStorage.getItem('userRole') || 'teacher'
  if (!allowedRoles.includes(role)) {
    return <Navigate to={role === 'student' ? '/student-dashboard' : '/dashboard'} replace />
  }
  return children
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        
        <Route element={<Layout />}>
          {/* Teacher Routes */}
          <Route path="/dashboard" element={<ProtectedRoute allowedRoles={['teacher']}><Dashboard /></ProtectedRoute>} />
          <Route path="/students" element={<ProtectedRoute allowedRoles={['teacher']}><StudentList /></ProtectedRoute>} />
          <Route path="/add-student" element={<ProtectedRoute allowedRoles={['teacher']}><AddStudent /></ProtectedRoute>} />
          <Route path="/mark-attendance" element={<ProtectedRoute allowedRoles={['teacher']}><MarkAttendance /></ProtectedRoute>} />
          <Route path="/report" element={<ProtectedRoute allowedRoles={['teacher']}><Report /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute allowedRoles={['teacher']}><Settings /></ProtectedRoute>} />
          
          {/* Admin Routes */}
          <Route path="/admin-dashboard" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />

          {/* Student Routes */}
          <Route path="/student-dashboard" element={<ProtectedRoute allowedRoles={['student']}><StudentDashboard /></ProtectedRoute>} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
