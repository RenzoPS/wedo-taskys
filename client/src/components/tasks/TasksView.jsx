import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaPlus, FaArrowLeft, FaTasks, FaLock } from 'react-icons/fa';
import styles from './tasks.module.css';
import TaskCard from './TaskCard';
import CreateTaskForm from './CreateTaskForm';
import TaskDetailModal from './TaskDetailModal';
import { useAuth } from '../common/UserContext';
import { taskService, listService, groupService } from '../../services/api';
import { useI18n } from '../common/I18nContext';

const TasksView = () => {
  const { listId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useI18n();
  
  const [list, setList] = useState(null);
  const [group, setGroup] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [isGroupOwner, setIsGroupOwner] = useState(false);
  
  // Helper para obtener usuarios asignados de una tarea
  const getAssignedUsers = (task) => {
    if (!task.assignedTo || task.assignedTo.length === 0) return [];
    
    // Si assignedTo ya viene poblado con objetos de usuario, devolverlos directamente
    if (task.assignedTo[0]?.userName || task.assignedTo[0]?.email) {
      return task.assignedTo;
    }
    
    // Si no, buscar en los miembros del grupo
    if (!group?.members) return [];
    return group.members.filter(member => 
      task.assignedTo.some(assignedId => 
        String(assignedId._id || assignedId) === String(member._id)
      )
    );
  };

  // Cargar la lista, grupo y tareas
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Obtener información de la lista
        const listData = await listService.getListById(listId);
        setList(listData);
        
        // Obtener información del grupo
        const groupData = await groupService.getGroupById(listData.groupId);
        setGroup(groupData);
        
        // Verificar si el usuario actual es el propietario o admin del grupo
        const ownerId = groupData.owner._id ? groupData.owner._id : groupData.owner;
        const isAdmin = groupData.admins?.some(admin => {
          const adminId = admin._id || admin;
          return adminId === user.id || adminId === user._id;
        });
        const hasPermissions = user && (ownerId === user.id || isAdmin);
        setIsGroupOwner(hasPermissions);
        
        // Obtener tareas de la lista
        const tasksData = await taskService.getTasksByList(listId);
        setTasks(tasksData);
      } catch (err) {
        console.error('Error al cargar datos:', err);
        setError(t('tasks.errorLoadInfo'));
      } finally {
        setLoading(false);
      }
    };

    if (listId) {
      fetchData();
    }
  }, [listId, user]);

  // Manejar la creación de una nueva tarea
  const handleCreateTask = async (taskData) => {
    try {
      const newTask = await taskService.createTask({
        ...taskData,
        listId
      });
      
      setTasks([...tasks, newTask]);
      setShowCreateForm(false);
    } catch (err) {
      console.error('Error al crear tarea:', err);
      if (err.response?.status === 403) {
        setError(t('tasks.errorNoPermissionCreate'));
      } else if (err.response?.status === 400 && err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError(t('tasks.errorCreateTask'));
      }
    }
  };

  // Manejar la edición de una tarea
  const handleEditTask = async (taskData) => {
    try {
      const updatedTask = await taskService.updateTask(editingTask._id, taskData);
      
      setTasks(tasks.map(task => 
        task._id === updatedTask._id ? updatedTask : task
      ));
      
      setEditingTask(null);
      setShowCreateForm(false);
    } catch (err) {
      console.error('Error al actualizar tarea:', err);
      if (err.response?.status === 403) {
        setError(t('tasks.errorNoPermissionEdit'));
      } else if (err.response?.status === 400 && err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError(t('tasks.errorUpdateTask'));
      }
    }
  };

  // Manejar la eliminación de una tarea (la confirmación ya se hace en TaskCard)
  const handleDeleteTask = async (task) => {
    try {
      await taskService.deleteTask(task._id);
      setTasks(tasks.filter(t => t._id !== task._id));
    } catch (err) {
      console.error('Error al eliminar tarea:', err);
      if (err.response?.status === 403) {
        setError(t('tasks.errorNoPermissionDelete'));
      } else {
        setError(t('tasks.errorDeleteTask'));
      }
    }
  };

  // Manejar el toggle de completado
  const handleToggleComplete = async (task) => {
    try {
      const updatedTask = await taskService.updateTask(task._id, {
        completed: !task.completed
      });
      
      setTasks(tasks.map(t => 
        t._id === updatedTask._id ? updatedTask : t
      ));
    } catch (err) {
      console.error('Error al actualizar estado de tarea:', err);
      setError(t('tasks.errorUpdateStatus'));
    }
  };

  // Manejar la apertura del modal de detalles para editar
  const [selectedTask, setSelectedTask] = useState(null);
  
  const handleOpenEditForm = (task) => {
    // Abrir el modal de detalles en lugar del formulario
    setSelectedTask(task);
  };

  // Manejar el cierre del formulario
  const handleCloseForm = () => {
    setShowCreateForm(false);
    setEditingTask(null);
  };

  // Renderizar estado de carga
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  // Renderizar estado de error
  if (error) {
    return (
      <div className={styles['error-container']}>
        <div className={styles['error-content']}>
          <div className={styles['error-icon']}>⚠️</div>
          <div className={styles['error-text']}>
            <h3 className={styles['error-title']}>{t('tasks.error')}</h3>
            <p className={styles['error-message']}>{error}</p>
          </div>
          <button 
            onClick={() => setError(null)} 
            className={styles['error-close']}
            aria-label={t('tasks.closeError')}
          >
            ✕
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles['tasks-container']}>
      <div className={styles['tasks-header']}>
        <div className={styles['tasks-header-content']}>
          <button 
            onClick={() => navigate(`/groups/${group?._id}/lists`)} 
            className={`${styles.btn} ${styles['btn-outline']} mb-4`}
          >
            <FaArrowLeft className="mr-2" /> {t('tasks.backToLists')}
          </button>
          
          <div className="flex items-center">
            <h1>{list?.title}</h1>
            {!isGroupOwner && (
              <div className="ml-2 text-amber-500 flex items-center bg-amber-50 px-2 py-1 rounded-md" title="Modo visualización - Solo lectura">
                <FaLock size={14} />
                <span className="ml-1 text-sm font-medium">{t('tasks.readOnly')}</span>
              </div>
            )}
          </div>
          {group?.name && <p className="text-gray-600">{t('tasks.group')} {group.name}</p>}
        </div>
        
        {isGroupOwner && (
          <button 
            onClick={() => setShowCreateForm(true)} 
            className={`${styles.btn} ${styles['btn-primary']}`}
          >
            <FaPlus className="mr-1" /> {t('tasks.createNewTask')}
          </button>
        )}
      </div>

      {/* Mostrar formulario de creación */}
      {showCreateForm && !editingTask && (
        <div className={styles['modal-overlay']}>
          <div className={styles['modal-content']}>
            <CreateTaskForm 
              onSubmit={handleCreateTask} 
              onCancel={handleCloseForm}
              isEditing={false}
            />
          </div>
        </div>
      )}

      {/* Modal de detalle de tarea para edición */}
      {selectedTask && (
        <TaskDetailModal
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
          onUpdate={(updatedTask) => {
            // Actualizar la lista de tareas
            setTasks(tasks.map(t => 
              t._id === updatedTask._id ? updatedTask : t
            ));
            // Actualizar la tarea seleccionada para que el modal muestre los datos actualizados
            setSelectedTask(updatedTask);
          }}
          isGroupOwner={isGroupOwner}
          currentUserId={user?.id || user?._id}
        />
      )}

      {/* Mostrar tareas o estado vacío */}
      {tasks.length > 0 ? (
        <div className={styles['tasks-grid']}>
          {tasks.map(task => (
            <TaskCard 
              key={task._id}
              task={task} 
              onEdit={isGroupOwner ? handleOpenEditForm : null}
              onDelete={isGroupOwner ? handleDeleteTask : null}
              onToggleComplete={handleToggleComplete}
              onClick={() => setSelectedTask(task)}
              isGroupOwner={isGroupOwner}
              assignedUsers={getAssignedUsers(task)}
            />
          ))}
        </div>
      ) : (
        <div className={styles['empty-state']}>
          <div className={styles['empty-icon']}>
            <FaTasks />
          </div>
          <h3>{t('tasks.noTasks')}</h3>
          {isGroupOwner ? (
            <>
              <p>{t('tasks.createTaskToStart')}</p>
              <button 
                onClick={() => setShowCreateForm(true)} 
                className={`${styles.btn} ${styles['btn-primary']}`}
              >
                <FaPlus className="mr-1" /> {t('tasks.createNewTask')}
              </button>
            </>
          ) : (
            <>
              <p>{t('tasks.noTasksYet')}</p>
              <p className="text-sm text-gray-500 mt-2">{t('tasks.onlyOwnerCanManage')}</p>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default TasksView;
