import React, { useState, useEffect, useRef } from 'react';
import { X, Edit2, Check, Plus, Trash2, User, Tag, CheckSquare } from 'lucide-react';
import styles from './tasks.module.css';
import { taskService, groupService, listService } from '../../services/api';
import { useI18n } from '../common/I18nContext';

const TaskDetailModal = ({ task, onClose, onUpdate, isGroupOwner, currentUserId }) => {
  const { t } = useI18n();
  const [title, setTitle] = useState(task.title);
  
  // Verificar si el usuario actual está asignado a la tarea
  const isAssignedToTask = task.assignedTo && task.assignedTo.some(
    assignedId => String(assignedId) === String(currentUserId)
  );
  
  // El usuario puede editar si es owner O está asignado a la tarea
  const canEdit = isGroupOwner || isAssignedToTask;
  const [description, setDescription] = useState(task.description || '');
  const [checklists, setChecklists] = useState(task.checklist || []);
  const [tags, setTags] = useState(task.tags || []);
  const [newChecklistTitle, setNewChecklistTitle] = useState('');
  const [showNewChecklist, setShowNewChecklist] = useState(false);
  const [newTagName, setNewTagName] = useState('');
  const [newTagColor, setNewTagColor] = useState('#667eea');
  const [showNewTag, setShowNewTag] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  // Assignment state
  const [groupId, setGroupId] = useState(null);
  const [groupMembers, setGroupMembers] = useState([]);
  const [selectedAssignee, setSelectedAssignee] = useState('');
  const [assignLoading, setAssignLoading] = useState(false);

  // Helpers
  const getInitials = (nameOrEmail) => {
    if (!nameOrEmail) return '?'
    const name = nameOrEmail.includes('@') ? nameOrEmail.split('@')[0] : nameOrEmail
    const parts = name.trim().split(/\s+/)
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
    return (parts[0][0] + parts[1][0]).toUpperCase()
  }

  const tagColors = [
    '#667eea', '#f56565', '#48bb78', '#ed8936', 
    '#0bc5ea', '#9f7aea', '#ed64a6', '#ecc94b'
  ];

  // Detectar cambios sin guardar
  useEffect(() => {
    const titleChanged = title !== task.title;
    const descriptionChanged = description !== (task.description || '');
    const checklistsChanged = JSON.stringify(checklists) !== JSON.stringify(task.checklist || []);
    const tagsChanged = JSON.stringify(tags) !== JSON.stringify(task.tags || []);
    
    setHasUnsavedChanges(titleChanged || descriptionChanged || checklistsChanged || tagsChanged);
  }, [title, description, checklists, tags, task.title, task.description, task.checklist, task.tags]);

  // Manejar cierre con cambios sin guardar
  const handleClose = () => {
    if (hasUnsavedChanges) {
      if (window.confirm(t('tasks.confirmUnsavedChanges') || 'Tenés cambios sin guardar. ¿Querés salir sin guardar?')) {
        onClose();
      }
    } else {
      onClose();
    }
  };

  const handleUnassign = async (userId) => {
    if (!groupId) return;
    try {
      setAssignLoading(true);
      await taskService.unassignTask(task._id, { userId, groupId });
      const allTasks = await taskService.getTasksByList(task.list);
      const updated = allTasks.find(t => t._id === task._id) || task;
      onUpdate(updated);
    } catch (err) {
      console.error('Error al desasignar tarea:', err);
      const msg = err?.response?.data?.message || t('tasks.errorUnassign') || 'No se pudo desasignar la tarea';
      alert(msg);
    } finally {
      setAssignLoading(false);
    }
  };

  // Load group and members if owner
  useEffect(() => {
    const loadGroupMembers = async () => {
      try {
        if (!isGroupOwner) return;
        // Get list info to find groupId
        const list = await listService.getListById(task.list);
        if (!list?.groupId) return;
        setGroupId(list.groupId);
        // Get group details with populated members
        const group = await groupService.getGroupById(list.groupId);
        setGroupMembers(group?.members || []);
      } catch (err) {
        console.error('Error cargando miembros del grupo:', err);
      }
    };
    loadGroupMembers();
  }, [isGroupOwner, task.list]);

  const handleAssign = async () => {
    if (!selectedAssignee || !groupId) return;
    try {
      setAssignLoading(true);
      await taskService.assignTask(task._id, { userId: selectedAssignee, groupId });
      // Refresh task list and local state to reflect server changes
      const allTasks = await taskService.getTasksByList(task.list);
      const updated = allTasks.find(t => t._id === task._id) || task;
      onUpdate(updated);
      alert(t('tasks.taskAssignedSuccess') || 'Tarea asignada correctamente');
    } catch (err) {
      console.error('Error al asignar tarea:', err);
      const msg = err?.response?.data?.message || t('tasks.errorAssign') || 'No se pudo asignar la tarea';
      alert(msg);
    } finally {
      setAssignLoading(false);
    }
  };

  // Guardar cambios manualmente
  const handleSaveChanges = async () => {
    if (!title.trim()) {
      alert(t('lists.titleRequired'));
      return;
    }

    try {
      setIsSaving(true);
      
      // Guardar título y descripción
      let updatedTask = await taskService.updateTask(task._id, { 
        title, 
        description 
      });

      // Sincronizar tags (eliminar las que no están y agregar las nuevas)
      const originalTagIds = (task.tags || []).map(t => t._id);
      const currentTagIds = tags.map(t => t._id).filter(id => id && !id.startsWith('temp-')); // Solo IDs reales
      
      // Tags a eliminar
      for (const tagId of originalTagIds) {
        if (!currentTagIds.includes(tagId)) {
          await taskService.deleteTag(task._id, tagId);
        }
      }
      
      // Tags a agregar (las que tienen ID temporal son nuevas)
      for (const tag of tags) {
        if (!tag._id || tag._id.startsWith('temp-')) {
          await taskService.addTag(task._id, { name: tag.name, color: tag.color });
        }
      }

      // Sincronizar checklists (similar a tags)
      const originalChecklistIds = (task.checklist || []).map(c => c._id);
      const currentChecklistIds = checklists.map(c => c._id).filter(id => id && !id.startsWith('temp-'));
      
      // Checklists a eliminar
      for (const checklistId of originalChecklistIds) {
        if (!currentChecklistIds.includes(checklistId)) {
          await taskService.deleteChecklist(task._id, checklistId);
        }
      }
      
      // Checklists a agregar y actualizar elementos
      for (const checklist of checklists) {
        if (!checklist._id || checklist._id.startsWith('temp-')) {
          // Crear nueva checklist
          await taskService.createChecklist(task._id, { title: checklist.title });
        } else {
          // Actualizar elementos de checklist existente
          const originalChecklist = (task.checklist || []).find(c => c._id === checklist._id);
          if (originalChecklist) {
            const originalElementIds = (originalChecklist.elements || []).map(e => e._id);
            const currentElementIds = (checklist.elements || []).map(e => e._id).filter(id => id && !id.startsWith('temp-'));
            
            // Elementos a eliminar
            for (const elementId of originalElementIds) {
              if (!currentElementIds.includes(elementId)) {
                await taskService.deleteChecklistElement(task._id, checklist._id, elementId);
              }
            }
            
            // Elementos a agregar o actualizar
            for (const element of checklist.elements || []) {
              if (!element._id || element._id.startsWith('temp-')) {
                // Agregar nuevo elemento
                await taskService.addChecklistElement(task._id, checklist._id, { title: element.title });
              } else {
                // Actualizar elemento existente si cambió
                const originalElement = originalChecklist.elements.find(e => e._id === element._id);
                if (originalElement && (originalElement.completed !== element.completed || originalElement.title !== element.title)) {
                  await taskService.updateChecklistElement(task._id, checklist._id, element._id, {
                    title: element.title,
                    completed: element.completed
                  });
                }
              }
            }
          }
        }
      }

      // Esperar un momento para que el servidor procese todos los cambios
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Obtener la tarea completa actualizada del servidor
      // Necesitamos obtener todas las tareas de la lista para tener los datos frescos
      const allTasks = await taskService.getTasksByList(task.list);
      const finalUpdatedTask = allTasks.find(t => t._id === task._id);
      
      if (!finalUpdatedTask) {
        throw new Error('No se pudo obtener la tarea actualizada');
      }
      
      // Actualizar el estado local con los datos del servidor
      setTitle(finalUpdatedTask.title);
      setDescription(finalUpdatedTask.description || '');
      setChecklists(finalUpdatedTask.checklist || []);
      setTags(finalUpdatedTask.tags || []);
      
      // Actualizar la tarea original para que el useEffect no detecte cambios
      task.title = finalUpdatedTask.title;
      task.description = finalUpdatedTask.description;
      task.checklist = finalUpdatedTask.checklist;
      task.tags = finalUpdatedTask.tags;
      
      // Notificar al componente padre para que actualice la lista
      onUpdate(finalUpdatedTask);
      
      // Resetear el estado de cambios sin guardar
      setHasUnsavedChanges(false);
      setIsSaving(false);
      
      alert(t('tasks.changesSavedSuccess') || 'Cambios guardados exitosamente');
    } catch (error) {
      console.error('Error al guardar cambios:', error);
      alert(t('tasks.errorSavingChanges') || 'Error al guardar los cambios');
      setIsSaving(false);
    }
  };

  // Crear checklist (solo local, se guarda al hacer click en "Guardar cambios")
  const handleCreateChecklist = () => {
    if (!newChecklistTitle.trim()) return;
    const newChecklist = { 
      title: newChecklistTitle,
      elements: [],
      _id: `temp-${Date.now()}` // ID temporal para el map
    };
    setChecklists([...checklists, newChecklist]);
    setNewChecklistTitle('');
    setShowNewChecklist(false);
  };

  // Agregar elemento a checklist (solo local)
  const handleAddChecklistElement = (checklistId, elementTitle) => {
    if (!elementTitle.trim()) return;
    
    const newElement = {
      title: elementTitle,
      completed: false,
      _id: `temp-${Date.now()}-${Math.random()}` // ID temporal para el map
    };
    
    const updatedChecklists = checklists.map(cl => 
      cl._id === checklistId 
        ? { ...cl, elements: [...(cl.elements || []), newElement] }
        : cl
    );
    
    setChecklists(updatedChecklists);
  };

  // Toggle elemento de checklist (solo local)
  const handleToggleChecklistElement = (checklistId, elementId, completed) => {
    setChecklists(checklists.map(cl => 
      cl._id === checklistId
        ? {
            ...cl,
            elements: cl.elements.map(el =>
              el._id === elementId ? { ...el, completed: !completed } : el
            )
          }
        : cl
    ));
  };

  // Eliminar checklist (solo local)
  const handleDeleteChecklist = (checklistId) => {
    if (!window.confirm(t('tasks.confirmDeleteChecklist') || '¿Eliminar esta checklist?')) return;
    const newChecklists = checklists.filter(cl => cl._id !== checklistId);
    setChecklists(newChecklists);
  };

  // Eliminar elemento de checklist (solo local)
  const handleDeleteChecklistElement = (checklistId, elementId) => {
    setChecklists(checklists.map(cl => 
      cl._id === checklistId
        ? { ...cl, elements: cl.elements.filter(el => el._id !== elementId) }
        : cl
    ));
  };

  // Crear tag (solo local)
  const handleCreateTag = () => {
    if (!newTagName.trim()) return;
    const newTag = {
      name: newTagName,
      color: newTagColor,
      _id: `temp-${Date.now()}` // ID temporal para el map
    };
    setTags([...tags, newTag]);
    setNewTagName('');
    setShowNewTag(false);
  };

  // Eliminar tag (solo local)
  const handleDeleteTag = (tagId) => {
    const newTags = tags.filter(t => t._id !== tagId);
    setTags(newTags);
  };

  return (
    <div className={styles['modal-overlay']} onClick={handleClose}>
      <div className={styles['task-detail-modal']} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles['modal-header']}>
          <div className={styles['modal-title-section']}>
            {canEdit ? (
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={styles['title-input-auto']}
                placeholder={t('tasks.taskTitle').replace(' *', '')}
              />
            ) : (
              <h2>{title}</h2>
            )}
            {hasUnsavedChanges && (
              <span className={styles['unsaved-indicator']}>● {t('tasks.unsavedChanges') || 'Cambios sin guardar'}</span>
            )}
          </div>
          <div className={styles['header-actions']}>
            {canEdit && hasUnsavedChanges && (
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  handleSaveChanges();
                }} 
                className={styles['save-changes-btn']}
                disabled={isSaving}
              >
                {isSaving ? t('tasks.saving') : t('tasks.save')}
              </button>
            )}
            <button 
              onClick={(e) => {
                e.stopPropagation();
                handleClose();
              }} 
              className={styles['close-modal-btn']}
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className={styles['modal-body']}>
          {/* Asignación */}
          <div className={styles['detail-section']}>
            <div className={styles['section-header']}>
              <h3><User size={18} /> {t('tasks.assignment') || 'Asignación'}</h3>
            </div>
            
            {/* Formulario de asignación (solo para owners) */}
            {isGroupOwner && (
              <div className={styles['assign-row']}>
                <select
                  className={styles['assign-select']}
                  value={selectedAssignee}
                  onChange={(e) => setSelectedAssignee(e.target.value)}
                >
                  <option value="">{t('tasks.selectGroupUser') || 'Seleccionar usuario del grupo'}</option>
                  {groupMembers.map(u => (
                    <option key={u._id} value={u._id}>
                      {u.userName || u.email}
                    </option>
                  ))}
                </select>
                <button
                  className={styles['assign-button']}
                  disabled={!selectedAssignee || assignLoading}
                  onClick={handleAssign}
                >
                  {assignLoading ? t('tasks.assigning') || 'Asignando...' : t('tasks.assign') || 'Asignar'}
                </button>
              </div>
            )}

            {/* Lista de asignados (visible para todos) */}
            <div>
              <h4 className={styles['subsection-title']}>{t('tasks.assigned') || 'Asignados'}</h4>
              <div className={styles['assignees-list']}>
                {/* Mostrar usuarios asignados desde task.assignedTo si está poblado */}
                {task.assignedTo && task.assignedTo.length > 0 && task.assignedTo[0]?.userName ? (
                  task.assignedTo.map(u => (
                    <div key={u._id} className={styles['assignee-chip']} title={u.email}>
                      <div className={styles['assignee-avatar']}>
                        {getInitials(u.userName || u.email)}
                      </div>
                      <span className={styles['assignee-name']}>{u.userName || u.email}</span>
                      {isGroupOwner && (
                        <button
                          className={styles['assignee-remove']}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleUnassign(u._id);
                          }}
                          title={t('tasks.removeAssignment') || 'Quitar asignación'}
                        >
                          <X size={12} />
                        </button>
                      )}
                    </div>
                  ))
                ) : (
                  /* Fallback: buscar en groupMembers si assignedTo tiene solo IDs */
                  groupMembers
                    .filter(u => (task.assignedTo || []).map(id => String(id._id || id)).includes(String(u._id)))
                    .map(u => (
                      <div key={u._id} className={styles['assignee-chip']} title={u.email}>
                        <div className={styles['assignee-avatar']}>
                          {getInitials(u.userName || u.email)}
                        </div>
                        <span className={styles['assignee-name']}>{u.userName || u.email}</span>
                        {isGroupOwner && (
                          <button
                            className={styles['assignee-remove']}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleUnassign(u._id);
                            }}
                            title={t('tasks.removeAssignment') || 'Quitar asignación'}
                          >
                            <X size={12} />
                          </button>
                        )}
                      </div>
                    ))
                )}
                {(!task.assignedTo || task.assignedTo.length === 0) && (
                  <span className={styles['muted-text']}>{t('tasks.notAssigned')}</span>
                )}
              </div>
            </div>
          </div>
          {/* Descripción */}
          <div className={styles['detail-section']}>
            <h3>{t('tasks.description')}</h3>
            {canEdit ? (
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className={styles['description-textarea-auto']}
                rows="4"
                placeholder={t('tasks.descriptionPlaceholder')}
              />
            ) : (
              <div className={styles['description-display']}>
                {description || t('tasks.noDescription')}
              </div>
            )}
          </div>

          {/* Tags */}
          <div className={styles['detail-section']}>
            <div className={styles['section-header']}>
              <h3><Tag size={18} /> {t('tasks.tags') || 'Etiquetas'}</h3>
              {canEdit && (
                <button onClick={() => setShowNewTag(!showNewTag)} className={styles['icon-btn']}>
                  <Plus size={18} />
                </button>
              )}
            </div>
            
            {showNewTag && (
              <div className={styles['new-tag-form']}>
                <input
                  type="text"
                  value={newTagName}
                  onChange={(e) => setNewTagName(e.target.value)}
                  placeholder={t('tasks.tagNamePlaceholder') || 'Nombre de la etiqueta (Enter para crear)'}
                  className={styles['tag-input']}
                  autoFocus
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleCreateTag();
                    }
                  }}
                  onBlur={() => {
                    if (newTagName.trim()) {
                      handleCreateTag();
                    } else {
                      setShowNewTag(false);
                    }
                  }}
                />
                <div className={styles['color-picker']}>
                  {tagColors.map(color => (
                    <button
                      key={color}
                      className={`${styles['color-option']} ${newTagColor === color ? styles.selected : ''}`}
                      style={{ backgroundColor: color }}
                      onMouseDown={(e) => {
                        e.preventDefault(); // Evitar que se dispare el onBlur del input
                        setNewTagColor(color);
                      }}
                    />
                  ))}
                </div>
              </div>
            )}

            <div className={styles['tags-list']}>
              {tags.map(tag => (
                <div key={tag._id} className={styles['tag-item']} style={{ backgroundColor: tag.color }}>
                  <span>{tag.name}</span>
                  {canEdit && (
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteTag(tag._id);
                      }}
                      className={styles['tag-delete']}
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Checklists */}
          <div className={styles['detail-section']}>
            <div className={styles['section-header']}>
              <h3><CheckSquare size={18} /> Checklists</h3>
              {canEdit && (
                <button onClick={() => setShowNewChecklist(!showNewChecklist)} className={styles['icon-btn']}>
                  <Plus size={18} />
                </button>
              )}
            </div>

            {showNewChecklist && (
              <div className={styles['new-checklist-form']}>
                <input
                  type="text"
                  value={newChecklistTitle}
                  onChange={(e) => setNewChecklistTitle(e.target.value)}
                  placeholder={t('tasks.checklistTitlePlaceholder') || 'Título de la checklist (Enter para crear)'}
                  className={styles['checklist-input']}
                  autoFocus
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleCreateChecklist();
                    }
                  }}
                  onBlur={() => {
                    if (newChecklistTitle.trim()) {
                      handleCreateChecklist();
                    } else {
                      setShowNewChecklist(false);
                    }
                  }}
                />
              </div>
            )}

            {checklists.map(checklist => (
              <ChecklistComponent
                key={checklist._id}
                checklist={checklist}
                onAddElement={handleAddChecklistElement}
                onToggleElement={handleToggleChecklistElement}
                onDeleteElement={handleDeleteChecklistElement}
                onDelete={handleDeleteChecklist}
                canEdit={canEdit}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Componente de Checklist
const ChecklistComponent = ({ 
  checklist, 
  onAddElement, 
  onToggleElement, 
  onDeleteElement,
  onDelete,
  canEdit 
}) => {
  const { t } = useI18n();
  const [newElementTitle, setNewElementTitle] = useState('');
  const [showAddElement, setShowAddElement] = useState(false);

  const completedCount = checklist.elements.filter(el => el.completed).length;
  const totalCount = checklist.elements.length;
  const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  const handleAdd = async () => {
    if (newElementTitle.trim()) {
      await onAddElement(checklist._id, newElementTitle);
      setNewElementTitle('');
      setShowAddElement(false);
    }
  };

  return (
    <div className={styles['checklist-container']}>
      <div className={styles['checklist-header']}>
        <h4>{checklist.title}</h4>
        <div className={styles['checklist-actions']}>
          <span className={styles['checklist-progress']}>
            {completedCount}/{totalCount}
          </span>
          {canEdit && (
            <button onClick={() => onDelete(checklist._id)} className={styles['icon-btn-danger']}>
              <Trash2 size={16} />
            </button>
          )}
        </div>
      </div>

      {totalCount > 0 && (
        <div className={styles['progress-bar']}>
          <div className={styles['progress-fill']} style={{ width: `${progress}%` }} />
        </div>
      )}

      <div className={styles['checklist-items']}>
        {checklist.elements.map(element => (
          <div key={element._id} className={`${styles['checklist-item']} ${element.completed ? styles['item-completed'] : ''}`}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleElement(checklist._id, element._id, element.completed);
              }}
              className={styles['checklist-checkbox-btn']}
            >
              {element.completed ? (
                <div className={styles['checkbox-checked']}>
                  <Check size={14} />
                </div>
              ) : (
                <div className={styles['checkbox-unchecked']} />
              )}
            </button>
            <span className={element.completed ? styles['element-completed'] : styles['element-text']}>
              {element.title}
            </span>
            {canEdit && (
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteElement(checklist._id, element._id);
                }}
                className={styles['delete-element-btn']}
              >
                <X size={14} />
              </button>
            )}
          </div>
        ))}
      </div>

      {canEdit && (
        <>
          {showAddElement ? (
            <div className={styles['add-element-form']}>
              <input
                type="text"
                value={newElementTitle}
                onChange={(e) => setNewElementTitle(e.target.value)}
                placeholder={t('tasks.newElementPlaceholder')}
                className={styles['element-input']}
                autoFocus
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleAdd();
                  }
                }}
                onBlur={() => {
                  if (newElementTitle.trim()) {
                    handleAdd();
                  } else {
                    setShowAddElement(false);
                  }
                }}
              />
            </div>
          ) : (
            <button onClick={() => setShowAddElement(true)} className={styles['add-element-btn']}>
              <Plus size={16} /> {t('tasks.addElement')}
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default TaskDetailModal;
