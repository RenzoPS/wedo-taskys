import React, { useState, useRef, useEffect } from 'react';
import { FaEllipsisV, FaTrash, FaEdit, FaTasks, FaPlus, FaCheckCircle, FaCircle } from 'react-icons/fa';
import styles from './lists.module.css';
import TaskDetailModal from '../tasks/TaskDetailModal';

const ListCard = ({ 
  list, 
  onEdit, 
  onDelete, 
  onDragStart, 
  onDragEnd, 
  onDragEnter,
  draggable = true, 
  isGroupOwner = false,
  onCreateTask,
  onToggleTask,
  onEditTask,
  onDeleteTask,
  onTaskDragStart, // Para reordenar tareas
  draggedList
}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showTaskDropdown, setShowTaskDropdown] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [draggedTask, setDraggedTask] = useState(null);
  const dropdownToggleRef = useRef(null);
  const dropdownMenuRef = useRef(null);
  const taskDropdownRefs = useRef({});

  // Cerrar dropdown cuando se hace clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Solo cerrar si el click no es en el dropdown o sus elementos
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

  const handleDragStart = (e) => {
    if (!draggable) return;
    
    // Añadir datos para el drag and drop
    e.dataTransfer.setData('application/json', JSON.stringify({
      id: list._id,
      type: 'list'
    }));
    
    if (onDragStart) onDragStart(list);
  };

  const handleDragEnd = (e) => {
    if (!draggable) return;
    
    if (onDragEnd) onDragEnd();
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  // Handlers para drag and drop de tareas (reordenar dentro de la lista)
  const handleTaskDragStart = (e, task) => {
    e.stopPropagation();
    setDraggedTask(task);
  };

  const handleTaskDragEnd = (e) => {
    e.stopPropagation();
    setDraggedTask(null);
  };

  const handleTaskDragOver = (e, targetTask) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!draggedTask || draggedTask._id === targetTask._id) {
      return;
    }

    // Reordenar las tareas localmente
    const draggedIndex = tasks.findIndex(t => t._id === draggedTask._id);
    const targetIndex = tasks.findIndex(t => t._id === targetTask._id);
    
    if (draggedIndex === -1 || targetIndex === -1) return;

    const newTasks = [...tasks];
    newTasks.splice(draggedIndex, 1);
    newTasks.splice(targetIndex, 0, draggedTask);

    // Notificar al padre para actualizar el estado
    if (onTaskDragStart) {
      onTaskDragStart(list._id, newTasks);
    }
  };

  const handleEdit = (list) => {
    setShowDropdown(false);
    if (onEdit) {
      onEdit(list);
    }
  };

  const handleDelete = (list) => {
    setShowDropdown(false);
    if (onDelete) {
      onDelete(list);
    }
  };

  const tasks = list.tasks || [];

  return (
    <div 
      className={`${styles['list-column']} ${!draggable ? styles['view-only'] : ''} ${draggedList && draggedList._id === list._id ? styles.dragging : ''}`} 
      draggable={draggable}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
      onDragEnter={() => onDragEnter && onDragEnter(list)}
    >
      {/* Header de la lista */}
      <div className={styles['list-header']}>
        <div className={styles['list-header-content']}>
          <h3 className={styles['list-title']}>{list.title}</h3>
          <span className={styles['task-count']}>{tasks.length}</span>
        </div>
        
        {isGroupOwner && onEdit && onDelete && (
          <div className={styles.dropdown}>
            <button 
              onClick={() => setShowDropdown(!showDropdown)} 
              className={`${styles['dropdown-toggle']} ${showDropdown ? styles.active : ''}`}
              ref={dropdownToggleRef}
            >
              <FaEllipsisV />
            </button>
            
            {showDropdown && (
              <div className={styles['dropdown-menu']} ref={dropdownMenuRef}>
                <button 
                  onClick={() => handleEdit(list)} 
                  className={styles['dropdown-item']}
                >
                  <FaEdit className="mr-2" /> Editar lista
                </button>
                <button 
                  onClick={() => handleDelete(list)} 
                  className={`${styles['dropdown-item']} ${styles.danger}`}
                >
                  <FaTrash className="mr-2" /> Eliminar lista
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Botón para crear tarea */}
      {isGroupOwner && onCreateTask && (
        <button 
          onClick={() => onCreateTask(list._id)}
          className={styles['add-task-btn']}
        >
          <FaPlus className="mr-1" /> Agregar tarea
        </button>
      )}

      {/* Lista de tareas */}
      <div className={styles['tasks-list']}>
        {tasks.length > 0 ? (
          tasks.map((task) => {
            return (
              <div 
                key={task._id} 
                className={`${styles['task-item']} ${task.completed ? styles.completed : ''} ${draggedTask && draggedTask._id === task._id ? styles.dragging : ''}`}
                draggable={isGroupOwner}
                onDragStart={(e) => handleTaskDragStart(e, task)}
                onDragEnd={handleTaskDragEnd}
                onDragOver={(e) => isGroupOwner && handleTaskDragOver(e, task)}
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
                
                <div 
                  className={styles['task-content']}
                  onClick={() => setSelectedTask(task)}
                  style={{ cursor: 'pointer' }}
                >
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleTask && onToggleTask(task);
                  }}
                  className={styles['task-checkbox']}
                >
                  {task.completed ? (
                    <FaCheckCircle className={styles['checkbox-checked']} />
                  ) : (
                    <div className={styles['checkbox-unchecked']} />
                  )}
                </button>
                
                <div className={styles['task-info']}>
                  <p className={`${styles['task-title']} ${task.completed ? styles['task-completed'] : ''}`}>
                    {task.title}
                  </p>
                  {task.description && (
                    <p className={styles['task-description']}>
                      {task.description}
                    </p>
                  )}
                  {/* Mostrar tags debajo del título */}
                  {task.tags && task.tags.length > 0 && (
                    <div className={styles['task-tags-list']}>
                      {task.tags.map((tag, index) => (
                        <span 
                          key={tag._id || index}
                          className={styles['task-tag-badge']}
                          style={{ backgroundColor: tag.color }}
                          title={tag.name}
                        >
                          {tag.name}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                
                {isGroupOwner && onDeleteTask && (
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      if (window.confirm(`¿Eliminar la tarea "${task.title}"?`)) {
                        onDeleteTask(task);
                      }
                    }} 
                    className={styles['dropdown-toggle-small']}
                    title="Eliminar tarea"
                  >
                    <FaTrash />
                  </button>
                )}
              </div>
            </div>
            );
          })
        ) : (
          <div className={styles['empty-tasks']}>
            <p>No hay tareas</p>
          </div>
        )}
      </div>

      {/* Modal de detalle de tarea */}
      {selectedTask && (
        <TaskDetailModal
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
          onUpdate={(updatedTask) => {
            setSelectedTask(updatedTask);
            onEditTask && onEditTask(updatedTask);
          }}
          isGroupOwner={isGroupOwner}
        />
      )}
    </div>
  );
};

export default ListCard;