import React, { useState, useRef, useEffect } from 'react';
import { FaEllipsisV, FaTrash, FaEdit, FaCheck, FaCheckCircle, FaCircle } from 'react-icons/fa';
import styles from './tasks.module.css';

const TaskCard = ({ task, onEdit, onDelete, onToggleComplete, onClick, isGroupOwner = false }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownToggleRef = useRef(null);
  const dropdownMenuRef = useRef(null);

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
              aria-label={task.completed ? 'Marcar como pendiente' : 'Marcar como completada'}
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
                    <FaEdit className="mr-2" /> Editar
                  </button>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      if (window.confirm(`¿Eliminar la tarea "${task.title}"?`)) {
                        handleDelete(task);
                      }
                    }} 
                    className={`${styles['dropdown-item']} ${styles.danger}`}
                  >
                    <FaTrash className="mr-2" /> Eliminar
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
          Creada el {formattedDate}
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
              )} / {task.checklist.reduce((acc, cl) => acc + cl.elements.length, 0)} tareas completadas
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskCard;
