import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

const AuthPage = ({ isLogin = true }) => {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const navigate = useNavigate();
  
  const toggleForm = useCallback(() => {
    setIsTransitioning(true);

    setTimeout(() => {
      navigate(isLogin ? '/register' : '/login');
      
      setTimeout(() => {
        setIsTransitioning(false);
      }, 100);
    }, 200);
  }, [isLogin, navigate]);
  
  const handleSuccess = () => navigate('/');
  
  return (
    <div className="app">
      <div className="container">
        <div
          className={`form-container ${isLogin ? "login-mode" : "register-mode"} ${isTransitioning ? "transitioning" : ""}`}
        >
          <div className="form-wrapper">
            <div className="form-content">
              {isLogin ? 
                <LoginForm onToggle={toggleForm} onSuccess={handleSuccess} /> : 
                <RegisterForm onToggle={toggleForm} onSuccess={handleSuccess} />
              }
            </div>
          </div>

          <div className="illustration-panel">
            <div className="illustration-content">
              <div className="task-card">
                <div className="task-item completed"></div>
                <div className="task-item active"></div>
                <div className="task-item active"></div>
                <div className="task-letters">A M T</div>
              </div>
              <h2>Colabora sin límites</h2>
              <p>
                Organiza, asigna y completa tareas en equipo. WeDo Taskys hace que el trabajo colaborativo sea simple y
                efectivo.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;