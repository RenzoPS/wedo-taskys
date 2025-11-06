"use client"

import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import "./App.css"
import MainPage from "./components/mainPage/MainPage"
import AuthPage from "./components/auth/AuthPage"
import GroupsDashboard from "./components/groups/GroupsDashboard"
import ListsView from "./components/lists/ListsView"
import TasksView from "./components/tasks/TasksView"
import SettingsPage from "./components/settings/SettingsPage"
import { useAuth } from "./components/common/UserContext"

// Componente para proteger rutas
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth ? useAuth() : { user: null, loading: true }
  
  // Mostrar loading mientras se verifica la sesión
  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        flexDirection: 'column',
        gap: '1rem'
      }}>
        <div style={{
          width: '50px',
          height: '50px',
          border: '4px solid #f3f3f3',
          borderTop: '4px solid #667eea',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
        <p style={{ color: '#667eea', fontSize: '1.1rem' }}>Cargando...</p>
      </div>
    )
  }
  
  if (!user) {
    return <Navigate to="/login" replace />
  }
  
  return children
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/login" element={<AuthPage isLogin={true} />} />
        <Route path="/register" element={<AuthPage isLogin={false} />} />
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <GroupsDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/groups/:groupId/lists" 
          element={
            <ProtectedRoute>
              <ListsView />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/lists/:listId" 
          element={
            <ProtectedRoute>
              <TasksView />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/settings" 
          element={
            <ProtectedRoute>
              <SettingsPage />
            </ProtectedRoute>
          } 
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  )
}

export default App
