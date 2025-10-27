import React, { useState, useRef, useEffect } from 'react';
import { FaEllipsisV, FaTrash, FaEdit, FaCheck, FaCheckCircle, FaCircle, FaUser } from 'react-icons/fa';
import styles from './tasks.module.css';
import { useI18n } from '../common/I18nContext';

const TaskCard = ({ task, onEdit, onDelete, onToggleComplete, onClick, isGroupOwner = false, assignedUsers = [] }) => {
  const { t } = useI18n();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownToggleRef = useRef(null);
  const dropdownMenuRef = useRef(null);
  
  // Helper para obtener iniciales
  const getInitials = (nameOrEmail) => {
    if (!nameOrEmail) return '?';
    const name = nameOrEmail.includes('@') ? nameOrEmail.split('@')[0] : nameOrEmail;
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
  };

  // Cerrar dropdown cuando se hace clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownToggleRef.current && !dropdownToggleRef.current.contains(event.target) &&
          dropdownMenuRef.current && !dropdownMenuRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleEdit = (task) => {
    setShowDropdown(false);
    if (onEdit) {
      onEdit(task);
    }
  };

  const handleDelete = (task) => {
    setShowDropdown(false);
    if (onDelete) {
      onDelete(task);
    }
  };

  const handleToggle = () => {
    if (onToggleComplete) {
      onToggleComplete(task);
    }
  };

  // Calcular la fecha de creación formateada
  const formattedDate = new Date(task.createdAt).toLocaleDateString();

  return (
    <div 
      className={`${styles['task-card']} ${task.completed ? styles.completed : ''}`}
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      {/* Indicadores de tags en la esquina */}
      {task.tags && task.tags.length > 0 && (
        <div className={styles['task-tags-corner']}>
          {task.tags.map((tag, index) => (
            <div 
              key={tag._id || index}
              className={styles['tag-corner-indicator']}
              style={{ backgroundColor: tag.color }}
              title={tag.name}
            />
          ))}
        </div>
      )}
      
      <div className={styles['card-content']}>
        <div className={styles['card-header']}>
          <div className={styles['task-title-row']}>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                handleToggle();
              }}
              className={styles['checkbox-btn']}
              aria-label={task.completed ? t('tasks.markIncomplete') : t('tasks.markComplete')}
            >
              {task.completed ? (
                <FaCheckCircle className={styles['checkbox-icon-checked']} />
              ) : (
                <FaCircle className={styles['checkbox-icon']} />
              )}
            </button>
            <h3 className={`${styles['task-name']} ${task.completed ? styles['task-completed'] : ''}`}>
              {task.title}
            </h3>
            
            {/* Mostrar avatares de usuarios asignados */}
            {assignedUsers && assignedUsers.length > 0 && (
              <div className={styles['assigned-avatars']}>
                {assignedUsers.slice(0, 3).map((user, index) => (
                  <div 
                    key={user._id || index} 
                    className={styles['avatar']}
                    title={user.userName || user.email}
                    style={{ zIndex: assignedUsers.length - index }}
                  >
                    {getInitials(user.userName || user.email)}
                  </div>
                ))}
                {assignedUsers.length > 3 && (
                  <div className={styles['avatar-more']} title={`+${assignedUsers.length - 3} más`}>
                    +{assignedUsers.length - 3}
                  </div>
                )}
              </div>
            )}
          </div>
          
          {isGroupOwner && onEdit && onDelete && (
            <div className={styles.dropdown}>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setShowDropdown(!showDropdown);
                }} 
                className={`${styles['dropdown-toggle']} ${showDropdown ? styles.active : ''}`}
                ref={dropdownToggleRef}
              >
                <FaEllipsisV />
              </button>
              
              {showDropdown && (
                <div className={styles['dropdown-menu']} ref={dropdownMenuRef}>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEdit(task);
                    }} 
                    className={styles['dropdown-item']}
                  >
                    <FaEdit className="mr-2" /> {t('tasks.edit')}
                  </button>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      if (window.confirm(t('tasks.confirmDelete'))) {
                        handleDelete(task);
                      }
                    }} 
                    className={`${styles['dropdown-item']} ${styles.danger}`}
                  >
                    <FaTrash className="mr-2" /> {t('tasks.delete')}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
        
        {task.description && (
          <p className={styles['task-description']}>{task.description}</p>
        )}
        
        <div className="mt-2 text-sm text-gray-500">
          {t('tasks.createdAt').replace(':', '')} {formattedDate}
        </div>
        
        {task.tags && task.tags.length > 0 && (
          <div className={styles['tags-container']}>
            {task.tags.map((tag, index) => (
              <span 
                key={tag._id || index} 
                className={styles.tag}
                style={{ backgroundColor: tag.color }}
              >
                {tag.name}
              </span>
            ))}
          </div>
        )}
        
        {task.checklist && task.checklist.length > 0 && (
          <div className={styles['checklist-summary']}>
            <FaCheck className="mr-1" />
            <span>
              {task.checklist.reduce((acc, cl) => 
                acc + cl.elements.filter(el => el.completed).length, 0
              )} / {task.checklist.reduce((acc, cl) => acc + cl.elements.length, 0)} {t('tasks.completed').toLowerCase()}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskCard;
