import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaPlus, FaArrowLeft, FaTasks, FaLock } from 'react-icons/fa';
import styles from './tasks.module.css';
import TaskCard from './TaskCard';
import CreateTaskForm from './CreateTaskForm';
import TaskDetailModal from './TaskDetailModal';
import { useAuth } from '../common/UserContext';
import { taskService, listService, groupService } from '../../services/api';

const TasksView = () => {
  const { listId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [list, setList] = useState(null);
  const [group, setGroup] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [isGroupOwner, setIsGroupOwner] = useState(false);

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
        setError('No se pudo cargar la información. Por favor, intenta de nuevo.');
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
        setError('No tienes permisos para crear tareas.');
      } else if (err.response?.status === 400 && err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('No se pudo crear la tarea. Por favor, intenta de nuevo.');
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
        setError('No tienes permisos para editar tareas.');
      } else if (err.response?.status === 400 && err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('No se pudo actualizar la tarea. Por favor, intenta de nuevo.');
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
        setError('No tienes permisos para eliminar tareas.');
      } else {
        setError('No se pudo eliminar la tarea. Por favor, intenta de nuevo.');
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
      setError('No se pudo actualizar el estado de la tarea.');
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
            <h3 className={styles['error-title']}>Error</h3>
            <p className={styles['error-message']}>{error}</p>
          </div>
          <button 
            onClick={() => setError(null)} 
            className={styles['error-close']}
            aria-label="Cerrar error"
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
            <FaArrowLeft className="mr-2" /> Volver a listas
          </button>
          
          <div className="flex items-center">
            <h1>{list?.title}</h1>
            {!isGroupOwner && (
              <div className="ml-2 text-amber-500 flex items-center bg-amber-50 px-2 py-1 rounded-md" title="Modo visualización - Solo lectura">
                <FaLock size={14} />
                <span className="ml-1 text-sm font-medium">Solo lectura</span>
              </div>
            )}
          </div>
          {group?.name && <p className="text-gray-600">Grupo: {group.name}</p>}
        </div>
        
        {isGroupOwner && (
          <button 
            onClick={() => setShowCreateForm(true)} 
            className={`${styles.btn} ${styles['btn-primary']}`}
          >
            <FaPlus className="mr-1" /> Crear nueva tarea
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
            setTasks(tasks.map(t => 
              t._id === updatedTask._id ? updatedTask : t
            ));
            setSelectedTask(updatedTask);
          }}
          isGroupOwner={isGroupOwner}
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
            />
          ))}
        </div>
      ) : (
        <div className={styles['empty-state']}>
          <div className={styles['empty-icon']}>
            <FaTasks />
          </div>
          <h3>No hay tareas en esta lista</h3>
          {isGroupOwner ? (
            <>
              <p>Crea una nueva tarea para comenzar a organizar tu trabajo.</p>
              <button 
                onClick={() => setShowCreateForm(true)} 
                className={`${styles.btn} ${styles['btn-primary']}`}
              >
                <FaPlus className="mr-1" /> Crear nueva tarea
              </button>
            </>
          ) : (
            <>
              <p>Aún no hay tareas en esta lista.</p>
              <p className="text-sm text-gray-500 mt-2">Solo el propietario y administradores pueden crear y gestionar tareas.</p>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default TasksView;
