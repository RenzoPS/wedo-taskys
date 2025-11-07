import React, { useState, useRef, useEffect } from 'react';
import { FaEllipsisV, FaTrash, FaEdit, FaTasks, FaPlus, FaCheckCircle, FaCircle } from 'react-icons/fa';
import styles from './lists.module.css';
import TaskDetailModal from '../tasks/TaskDetailModal';
import { useI18n } from '../common/I18nContext';

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
  draggedList,
  currentUserId,
  groupMembers = []
}) => {
  const { t } = useI18n();
  const [showDropdown, setShowDropdown] = useState(false);
  
  // Helper para obtener iniciales
  const getInitials = (nameOrEmail) => {
    if (!nameOrEmail) return '?';
    const name = nameOrEmail.includes('@') ? nameOrEmail.split('@')[0] : nameOrEmail;
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
  };
  
  // Helper para obtener usuarios asignados de una tarea
  const getAssignedUsers = (task) => {
    if (!task.assignedTo || task.assignedTo.length === 0) return [];
    
    // Si assignedTo ya viene poblado con objetos de usuario, devolverlos directamente
    if (task.assignedTo[0]?.userName || task.assignedTo[0]?.email) {
      return task.assignedTo;
    }
    
    // Si no, buscar en los miembros del grupo
    if (!groupMembers.length) return [];
    return groupMembers.filter(member => 
      task.assignedTo.some(assignedId => 
        String(assignedId._id || assignedId) === String(member._id)
      )
    );
  };
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

    // Registrar y limpiar el listener
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleDragStart = (e) => {
    if (!draggable || selectedTask) return;
    
    // Añadir datos para el drag and drop
    e.dataTransfer.setData('application/json', JSON.stringify({
      id: list._id,
      type: 'list'
    }));
    
    if (onDragStart) onDragStart(list);
  };

  const handleDragEnd = (e) => {
    if (!draggable || selectedTask) return;
    
    if (onDragEnd) onDragEnd();
  };

  const handleDragOver = (e) => {
    if (selectedTask) return;
    e.preventDefault();
    e.stopPropagation();
  };


  // Handlers para drag and drop de tareas (reordenar dentro de la lista)
  const handleTaskDragStart = (e, task) => {
    e.stopPropagation();
    if (selectedTask) return;
    setDraggedTask(task);
  };

  const handleTaskDragEnd = (e) => {
    e.stopPropagation();
    setDraggedTask(null);
  };

  const handleTaskDragOver = (e, targetTask) => {
    e.preventDefault();
    e.stopPropagation();
    if (selectedTask) return;
    
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

  const tasks = list.tasks || [];

  return (
    <div 
      className={`${styles['list-column']} ${!draggable ? styles['view-only'] : ''} ${draggedList && draggedList._id === list._id ? styles.dragging : ''}`} 
      draggable={draggable && !selectedTask}
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
                  onClick={() => {
                    setShowDropdown(false);
                    onEdit && onEdit(list);
                  }} 
                  className={styles['dropdown-item']}
                >
                  <FaEdit className="mr-2" /> {t('tasks.editList')}
                </button>
                <button 
                  onClick={() => {
                    setShowDropdown(false);
                    const hasTasks = tasks.length > 0;
                    const confirmMsg = hasTasks
                      ? t('lists.confirmDeleteListWithTasks')
                          .replace('{{title}}', list.title)
                          .replace('{{count}}', tasks.length)
                      : t('lists.confirmDeleteList').replace('{{title}}', list.title);
                    
                    if (window.confirm(confirmMsg)) {
                      onDelete && onDelete(list);
                    }
                  }} 
                  className={`${styles['dropdown-item']} ${styles.danger}`}
                >
                  <FaTrash className="mr-2" /> {t('tasks.deleteList')}
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
          <FaPlus className="mr-1" /> {t('tasks.addTask')}
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
                draggable={isGroupOwner && !selectedTask}
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
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'space-between' }}>
                    <p className={`${styles['task-title']} ${task.completed ? styles['task-completed'] : ''}`} style={{ margin: 0, flex: 1 }}>
                      {task.title}
                    </p>
                    {/* Mostrar avatares de usuarios asignados */}
                    {getAssignedUsers(task).length > 0 && (
                      <div className={styles['assigned-avatars-small']}>
                        {getAssignedUsers(task).slice(0, 2).map((user, index) => (
                          <div 
                            key={user._id || index} 
                            className={styles['avatar-small']}
                            title={user.userName || user.email}
                            style={{ zIndex: getAssignedUsers(task).length - index }}
                          >
                            {getInitials(user.userName || user.email)}
                          </div>
                        ))}
                        {getAssignedUsers(task).length > 2 && (
                          <div className={styles['avatar-more-small']} title={`+${getAssignedUsers(task).length - 2} más`}>
                            +{getAssignedUsers(task).length - 2}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
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
                      if (window.confirm(t('tasks.confirmDelete'))) {
                        onDeleteTask(task);
                      }
                    }} 
                    className={styles['dropdown-toggle-small']}
                    title={t('tasks.delete')}
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
            <p>{t('tasks.noTasks')}</p>
          </div>
        )}
      </div>

      {/* Modal de detalle de tarea */}
      {selectedTask && (
        <TaskDetailModal
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
          onUpdate={(updatedTask) => {
            // Actualizar la tarea seleccionada en el modal
            setSelectedTask(updatedTask);
            // Notificar al padre (ListsView) para que actualice la lista
            onEditTask && onEditTask(updatedTask);
          }}
          isGroupOwner={isGroupOwner}
          currentUserId={currentUserId}
        />
      )}
    </div>
  );
};

export default ListCard;