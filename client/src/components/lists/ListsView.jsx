import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaPlus, FaArrowLeft, FaClipboardList, FaLock, FaImage } from 'react-icons/fa';
import styles from './lists.module.css';
import ListCard from './ListCard';
import CreateListForm from './CreateListForm';
import CreateTaskForm from '../tasks/CreateTaskForm';
import TaskDetailModal from '../tasks/TaskDetailModal';
import { useAuth } from '../common/UserContext';
import { listService, groupService, taskService } from '../../services/api';

const ListsView = () => {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [group, setGroup] = useState(null);
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingList, setEditingList] = useState(null);
  const [isGroupOwner, setIsGroupOwner] = useState(false);
  const [listsWithTasks, setListsWithTasks] = useState([]);
  const [showCreateTaskForm, setShowCreateTaskForm] = useState(false);
  const [currentListId, setCurrentListId] = useState(null);
  const [editingTask, setEditingTask] = useState(null);

  // Cargar el grupo y sus listas
  useEffect(() => {
    const fetchGroupAndLists = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Obtener información del grupo
        const groupData = await groupService.getGroupById(groupId);
        setGroup(groupData);
        
        // Verificar si el usuario actual es el propietario del grupo
        const ownerId = groupData.owner._id ? groupData.owner._id : groupData.owner;
        if (user && ownerId === user.id) {
          setIsGroupOwner(true);
        } else {
          setIsGroupOwner(false);
        }
        
        // Obtener listas del grupo
        const listsData = await listService.getListsByGroup(groupId);
        setLists(listsData);
        
        // Obtener tareas para cada lista
        const listsWithTasksData = await Promise.all(
          listsData.map(async (list) => {
            try {
              const tasks = await taskService.getTasksByList(list._id);
              return { ...list, tasks };
            } catch (err) {
              console.error(`Error al cargar tareas de lista ${list._id}:`, err);
              return { ...list, tasks: [] };
            }
          })
        );
        setListsWithTasks(listsWithTasksData);
      } catch (err) {
        console.error('Error al cargar grupo y listas:', err);
        setError('No se pudo cargar la información. Por favor, intenta de nuevo.');
      } finally {
        setLoading(false);
      }
    };

    if (groupId) {
      fetchGroupAndLists();
    }
  }, [groupId, user]);

  // Manejar la creación de una nueva lista
  const handleCreateList = async (listData) => {
    try {
      const newList = await listService.createList({
        ...listData,
        groupId
      });
      
      // Agregar la nueva lista con un array vacío de tareas
      const newListWithTasks = { ...newList, tasks: [] };
      setLists([...lists, newList]);
      setListsWithTasks([...listsWithTasks, newListWithTasks]);
      setShowCreateForm(false);
    } catch (err) {
      console.error('Error al crear lista:', err);
      if (err.response?.status === 403) {
        setError('Solo el propietario del grupo puede crear listas.');
      } else if (err.response?.status === 400 && err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('No se pudo crear la lista. Por favor, intenta de nuevo.');
      }
    }
  };

  // Manejar la edición de una lista
  const handleEditList = async (listData) => {
    try {
      const updatedList = await listService.updateList(editingList._id, listData);
      
      setLists(lists.map(list => 
        list._id === updatedList._id ? updatedList : list
      ));
      
      // Actualizar también listsWithTasks manteniendo las tareas
      setListsWithTasks(listsWithTasks.map(list => 
        list._id === updatedList._id ? { ...updatedList, tasks: list.tasks } : list
      ));
      
      setEditingList(null);
      setShowCreateForm(false);
    } catch (err) {
      console.error('Error al actualizar lista:', err);
      if (err.response?.status === 403) {
        setError('Solo el propietario del grupo puede editar el nombre de las listas.');
      } else if (err.response?.status === 400 && err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('No se pudo actualizar la lista. Por favor, intenta de nuevo.');
      }
    }
  };

  // Manejar la eliminación de una lista
  const handleDeleteList = async (list) => {
    if (window.confirm(`¿Estás seguro de que deseas eliminar la lista "${list.title}"?`)) {
      try {
        await listService.deleteList(list._id);
        setLists(lists.filter(l => l._id !== list._id));
        setListsWithTasks(listsWithTasks.filter(l => l._id !== list._id));
      } catch (err) {
        console.error('Error al eliminar lista:', err);
        if (err.response?.status === 403) {
          setError('Solo el propietario del grupo puede eliminar listas.');
        } else {
          setError('No se pudo eliminar la lista. Por favor, intenta de nuevo.');
        }
      }
    }
  };

  // Estado para drag and drop
  const [draggedList, setDraggedList] = useState(null);
  const [dragOverList, setDragOverList] = useState(null);
  const [draggedTask, setDraggedTask] = useState(null);
  const [sourceListId, setSourceListId] = useState(null);
  const listsGridRef = useRef(null);

  // Funciones para drag and drop
  const handleDragStart = (list) => {
    setDraggedList(list);
  };

  const handleDragEnd = () => {
    setDraggedList(null);
    setDragOverList(null);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDragEnter = (list) => {
    if (draggedList && draggedList._id !== list._id) {
      setDragOverList(list);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    
    try {
      if (!draggedList || !dragOverList) return;
      
      // Crear una copia del array de listas con tareas
      const listsWithTasksCopy = [...listsWithTasks];
      
      // Encontrar los índices de las listas arrastrada y destino
      const draggedIndex = listsWithTasksCopy.findIndex(list => list._id === draggedList._id);
      const dropIndex = listsWithTasksCopy.findIndex(list => list._id === dragOverList._id);
      
      if (draggedIndex === -1 || dropIndex === -1) return;
      
      // Reordenar las listas
      const [removedList] = listsWithTasksCopy.splice(draggedIndex, 1);
      listsWithTasksCopy.splice(dropIndex, 0, removedList);
      
      // Actualizar ambos estados
      setListsWithTasks(listsWithTasksCopy);
      setLists(listsWithTasksCopy.map(({ tasks, ...list }) => list));
      
      console.log(`Lista "${draggedList.title}" movida a la posición ${dropIndex + 1}`);
      
      // Limpiar estados
      setDraggedList(null);
      setDragOverList(null);
    } catch (err) {
      console.error('Error en el manejo de drop:', err);
    }
  };

  // Manejar la apertura del formulario para editar
  const handleOpenEditForm = (list) => {
    console.log('📝 handleOpenEditForm llamado con:', list);
    setEditingList(list);
    setShowCreateForm(true);
    console.log('✅ Formulario de edición abierto');
  };

  // Manejar el cierre del formulario
  const handleCloseForm = () => {
    setShowCreateForm(false);
    setEditingList(null);
  };

  // Manejar creación de tarea
  const handleOpenCreateTask = (listId) => {
    setCurrentListId(listId);
    setShowCreateTaskForm(true);
  };

  const handleCreateTask = async (taskData) => {
    try {
      const newTask = await taskService.createTask({
        ...taskData,
        listId: currentListId
      });
      
      // Actualizar la lista con la nueva tarea
      setListsWithTasks(listsWithTasks.map(list => 
        list._id === currentListId 
          ? { ...list, tasks: [...list.tasks, newTask] }
          : list
      ));
      
      setShowCreateTaskForm(false);
      setCurrentListId(null);
    } catch (err) {
      console.error('Error al crear tarea:', err);
      setError('No se pudo crear la tarea. Por favor, intenta de nuevo.');
    }
  };

  // Manejar edición de tarea - ahora NO se usa más
  const handleEditTask = (updatedTask) => {
    // Actualizar la tarea en la lista cuando se edita desde el modal
    setListsWithTasks(listsWithTasks.map(list => ({
      ...list,
      tasks: list.tasks.map(t => 
        t._id === updatedTask._id ? updatedTask : t
      )
    })));
  };

  // Manejar eliminación de tarea (la confirmación ya se hace en ListCard)
  const handleDeleteTask = async (task) => {
    try {
      await taskService.deleteTask(task._id);
      
      // Remover la tarea de la lista
      setListsWithTasks(listsWithTasks.map(list => ({
        ...list,
        tasks: list.tasks.filter(t => t._id !== task._id)
      })));
    } catch (err) {
      console.error('Error al eliminar tarea:', err);
      setError('No se pudo eliminar la tarea.');
    }
  };

  // Manejar toggle de completado
  const handleToggleTask = async (task) => {
    try {
      const updatedTask = await taskService.updateTask(task._id, {
        completed: !task.completed
      });
      
      // Actualizar el estado de la tarea
      setListsWithTasks(listsWithTasks.map(list => ({
        ...list,
        tasks: list.tasks.map(t => 
          t._id === updatedTask._id ? updatedTask : t
        )
      })));
    } catch (err) {
      console.error('Error al actualizar estado de tarea:', err);
      setError('No se pudo actualizar el estado de la tarea.');
    }
  };

  const handleCloseTaskForm = () => {
    setShowCreateTaskForm(false);
    setEditingTask(null);
    setCurrentListId(null);
  };

  // Handlers para drag and drop de tareas (reordenar dentro de la lista)
  const handleTaskReorder = (listId, newTasks) => {
    setListsWithTasks(listsWithTasks.map(list => {
      if (list._id === listId) {
        return {
          ...list,
          tasks: newTasks
        };
      }
      return list;
    }));
  };

  // Handler para cambiar/eliminar imagen de fondo
  const handleChangeBackground = async () => {
    const currentUrl = group?.backgroundImage || '';
    const imageUrl = prompt(
      'Ingresá la URL de la imagen de fondo (dejá vacío para eliminar):', 
      currentUrl
    );
    
    if (imageUrl === null) return; // Usuario canceló
    
    try {
      const updatedGroup = await groupService.updateGroup(groupId, { 
        backgroundImage: imageUrl.trim() || null 
      });
      setGroup(updatedGroup);
    } catch (err) {
      console.error('Error al actualizar imagen:', err);
      setError('No se pudo actualizar la imagen.');
    }
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
    <div 
      className={styles['lists-container']} 
      onDragOver={handleDragOver} 
      onDrop={handleDrop}
      style={group?.backgroundImage ? {
        backgroundImage: `url(${group.backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      } : {}}
    >
      <div className={styles['lists-header']}>
        <div className={styles['lists-header-content']}>
          <button 
            onClick={() => navigate('/dashboard')} 
            className={`${styles.btn} ${styles['btn-outline']} mb-4`}
          >
            <FaArrowLeft className="mr-2" /> Volver a grupos
          </button>
          
          <div className="flex items-center">
            <h1>{group?.name}</h1>
            {!isGroupOwner && (
              <div className="ml-2 text-amber-500 flex items-center bg-amber-50 px-2 py-1 rounded-md" title="Modo visualización">
                <FaLock size={14} />
                <span className="ml-1 text-sm font-medium">Modo visualización</span>
              </div>
            )}
          </div>
          {group?.description && <p>{group.description}</p>}
        </div>
        
        <div className="flex gap-2">
          {isGroupOwner && (
            <>
              <button
                onClick={handleChangeBackground}
                className={`${styles.btn} ${styles['btn-secondary']}`}
                title="Cambiar o eliminar imagen de fondo"
              >
                <FaImage className="mr-1" /> {group?.backgroundImage ? 'Cambiar fondo' : 'Agregar fondo'}
              </button>
              <button 
                onClick={() => setShowCreateForm(true)} 
                className={`${styles.btn} ${styles['btn-primary']}`}
              >
                <FaPlus className="mr-1" /> Crear nueva lista
              </button>
            </>
          )}
        </div>
      </div>

      {/* Mostrar formulario de creación/edición de lista */}
      {showCreateForm && (
        <div className={styles['modal-overlay']}>
          <div className={styles['modal-content']}>
            <CreateListForm 
              onSubmit={editingList ? handleEditList : handleCreateList} 
              onCancel={handleCloseForm}
              initialData={editingList}
              isEditing={!!editingList}
            />
          </div>
        </div>
      )}

      {/* Mostrar formulario de creación de tarea */}
      {showCreateTaskForm && (
        <div className={styles['modal-overlay']}>
          <div className={styles['modal-content']}>
            <CreateTaskForm 
              onSubmit={handleCreateTask} 
              onCancel={handleCloseTaskForm}
              isEditing={false}
            />
          </div>
        </div>
      )}

      {/* Mostrar listas o estado vacío */}
      {listsWithTasks.length > 0 ? (
        <div 
          className={styles['lists-board']}
          onDragOver={isGroupOwner ? handleDragOver : null}
          onDrop={isGroupOwner ? handleDrop : null}
        >
          {listsWithTasks.map(list => (
            <ListCard 
              key={list._id}
              list={list} 
              onEdit={isGroupOwner ? handleOpenEditForm : null}
              onDelete={isGroupOwner ? handleDeleteList : null}
              onCreateTask={isGroupOwner ? handleOpenCreateTask : null}
              onToggleTask={handleToggleTask}
              onEditTask={isGroupOwner ? handleEditTask : null}
              onDeleteTask={isGroupOwner ? handleDeleteTask : null}
              onDragStart={isGroupOwner ? handleDragStart : null}
              onDragEnd={isGroupOwner ? handleDragEnd : null}
              onDragEnter={isGroupOwner ? handleDragEnter : null}
              onTaskDragStart={isGroupOwner ? handleTaskReorder : null}
              draggable={isGroupOwner}
              isGroupOwner={isGroupOwner}
              draggedList={draggedList}
            />
          ))}
        </div>
      ) : (
        <div className={styles['empty-state']}>
          <div className={styles['empty-icon']}>
            <FaClipboardList />
          </div>
          <h3>No hay listas en este grupo</h3>
          {isGroupOwner ? (
            <>
              <p>Crea una nueva lista para comenzar a organizar tus tareas.</p>
              <button 
                onClick={() => setShowCreateForm(true)} 
                className={`${styles.btn} ${styles['btn-primary']}`}
              >
                <FaPlus className="mr-1" /> Crear nueva lista
              </button>
            </>
          ) : (
            <>
              <p>El propietario del grupo aún no ha creado ninguna lista.</p>
              <p className="text-sm text-gray-500 mt-2">Solo el propietario puede crear y gestionar listas.</p>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default ListsView;