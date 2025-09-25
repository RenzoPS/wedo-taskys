"use client"

import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import "./App.css"
import MainPage from "./components/mainPage/MainPage"
import AuthPage from "./components/auth/AuthPage"
import GroupsDashboard from "./components/groups/GroupsDashboard"
import ListsView from "./components/lists/ListsView"
import { useAuth } from "./components/common/UserContext"

// Componente para proteger rutas
const ProtectedRoute = ({ children }) => {
  const { user } = useAuth ? useAuth() : { user: null }
  
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
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  )
}

export default App
