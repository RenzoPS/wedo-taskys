import React, { useState, useEffect, useCallback } from 'react';
import { Users, Edit3, Trash2, Plus, Calendar, User, Settings, X, Activity, BarChart3, Clock, Mail, Phone, MapPin, Star, Crown, Shield } from 'lucide-react';
import AddUserModal from './AddUserModal';
import { groupService } from '../../services/api';
import styles from './groups.module.css';
import { useAuth } from '../common/UserContext';
import { useI18n } from '../common/I18nContext';

const GroupManagementModal = ({ group, onClose, onUpdate, onDelete, onUserAdded }) => {
  const { user } = useAuth();
  const { t } = useI18n();
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editFormData, setEditFormData] = useState({
    name: group.name,
    description: group.description || ''
  });
  const [loading, setLoading] = useState(false);
  const [removingUser, setRemovingUser] = useState(null);
  const [togglingAdmin, setTogglingAdmin] = useState(null);
  const [error, setError] = useState('');

  // Verificar si el usuario es el propietario del grupo
  const isOwner = user && group.owner && (
    user.id === group.owner._id || 
    user.id === group.owner.id || 
    user._id === group.owner._id || 
    user._id === group.owner.id
  );

  // Permitir cerrar con ESC
  const escListener = useCallback((e) => {
    if (e.key === 'Escape') onClose();
  }, [onClose]);

  useEffect(() => {
    document.addEventListener('keydown', escListener);
    return () => document.removeEventListener('keydown', escListener);
  }, [escListener]);

  // Verificar permisos al montar el componente
  useEffect(() => {
    if (!isOwner) {
      console.warn('Usuario no autorizado para gestionar este grupo');
      onClose();
    }
  }, [isOwner, onClose]);

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Llamar a la API para actualizar el grupo
      const updatedGroup = await groupService.updateGroup(group._id, editFormData);
      // Actualizar el grupo en el modal y en la lista
      onUserAdded(updatedGroup); // reutilizamos onUserAdded para refrescar el grupo en el dashboard
      setShowEditForm(false);
    } catch (err) {
      setError(err.response?.data?.message || t('groups.errorUpdate'));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm(t('groups.confirmDelete'))) {
      await onDelete();
      onClose();
    }
  };

  const handleRemoveUser = async (userId, userName) => {
    if (window.confirm(t('groups.confirmRemoveUser').replace('{{name}}', userName))) {
      setRemovingUser(userId);
      try {
        const result = await groupService.removeUserFromGroup(group._id, userId);
        onUserAdded(result.group);
      } catch (err) {
        setError(err.response?.data?.message);
      } finally {
        setRemovingUser(null);
      }
    }
  };

  const handleToggleAdmin = async (userId, userName, isCurrentlyAdmin) => {
    setTogglingAdmin(userId);
    setError('');
    try {
      if (isCurrentlyAdmin) {
        await groupService.removeAdmin(group._id, userId);
      } else {
        const result = await groupService.addAdmin(group._id, userId);
        onUserAdded(result.group);
      }
      // Refrescar el grupo
      const updatedGroup = await groupService.getGroupById(group._id);
      onUserAdded(updatedGroup);
    } catch (err) {
      setError(err.response?.data?.message || `Error al ${isCurrentlyAdmin ? 'remover' : 'agregar'} administrador`);
    } finally {
      setTogglingAdmin(null);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Simular estadísticas (en un proyecto real vendrían del backend)
  const groupStats = {
    totalMembers: group.members?.length || 0,
    activeMembers: Math.floor((group.members?.length || 0) * 0.8),
    tasksCompleted: Math.floor(Math.random() * 50) + 10,
    totalTasks: Math.floor(Math.random() * 100) + 20
  };

  // Si el usuario no es el propietario, no mostrar el modal
  if (!isOwner) {
    return null;
  }

  return (
    <div className={styles['panel-overlay']}>
      <div className={styles['management-panel']}>
        {/* Header del Panel */}
        <div className={styles['panel-header']}>
          <div className={styles['panel-header-content']}>
            <div className={styles['group-avatar']}>
              <Users size={32} />
            </div>
            <div className={styles['group-info-header']}>
              <h1>{group.name}</h1>
              <p>{t('groups.fullManagementPanel')}</p>
            </div>
          </div>
          <button onClick={onClose} className={styles['panel-close-btn']} aria-label={t('groups.closePanel')}>
            <X size={24} />
          </button>
        </div>

        {error && <div className={styles['error-banner']}>{error}</div>}

        <div className={styles['panel-content']}>
          {/* Información del Grupo */}
          <div className={styles['info-section']}>
            <div className={styles['section-header']}>
              <h2><Settings size={24} /> {t('groups.groupInfo')}</h2>
              <button 
                onClick={() => setShowEditForm(!showEditForm)}
                className={styles['edit-info-btn']}
              >
                <Edit3 size={16} />
                {showEditForm ? t('groups.cancel') : t('groups.edit')}
              </button>
            </div>

            {showEditForm ? (
              <form onSubmit={handleEditSubmit} className={styles['edit-form']}>
                <div className={styles['form-group']}>
                  <label>{t('groups.name').replace(':','')}</label>
                  <input
                    type="text"
                    value={editFormData.name}
                    onChange={(e) => setEditFormData({...editFormData, name: e.target.value})}
                    className={styles['form-input']}
                    required
                  />
                </div>
                <div className={styles['form-group']}>
                  <label>{t('groups.description')}</label>
                  <textarea
                    value={editFormData.description}
                    onChange={(e) => setEditFormData({...editFormData, description: e.target.value})}
                    className={styles['form-textarea']}
                    rows="4"
                  />
                </div>
                <div className={styles['form-actions']}>
                  <button
                    type="button"
                    onClick={() => setShowEditForm(false)}
                    className={`${styles.btn} ${styles['btn-secondary']}`}
                  >
                    {t('groups.cancel')}
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className={`${styles.btn} ${styles['btn-primary']}`}
                  >
                    {loading ? t('groups.saving') : t('groups.save')}
                  </button>
                </div>
              </form>
            ) : (
              <div className={styles['group-details']}>
                <div className={styles['detail-row']}>
                  <span className={styles['detail-label']}>{t('groups.name')}</span>
                  <span className={styles['detail-value']}>{group.name}</span>
                </div>
                <div className={styles['detail-row']}>
                  <span className={styles['detail-label']}>{t('groups.description')}</span>
                  <span className={styles['detail-value']}>
                    {group.description || t('groups.noDescription')}
                  </span>
                </div>
                <div className={styles['detail-row']}>
                  <span className={styles['detail-label']}>{t('groups.owner')}</span>
                                     <span className={styles['detail-value']}>
                     {group.owner?.userName || 'Usuario'}
                   </span>
                </div>
                <div className={styles['detail-row']}>
                  <span className={styles['detail-label']}>{t('groups.created')}</span>
                  <span className={styles['detail-value']}>
                    {formatDate(group.createdAt)}
                  </span>
                </div>
                <div className={styles['detail-row']}>
                  <span className={styles['detail-label']}>{t('groups.lastUpdate')}</span>
                  <span className={styles['detail-value']}>
                    {formatDate(group.updatedAt)}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Gestión de Miembros */}
          <div className={styles['members-section']}>
            <div className={styles['section-header']} style={{display:'flex', alignItems:'center', gap:'1.5rem'}}>
              <h2 style={{margin:0}}><Users size={24} /> {t('groups.membersManagement')}</h2>
              <span style={{fontWeight:600, color:'#667eea', fontSize:'1rem', marginLeft:'auto', marginRight:'1rem'}}>{t('groups.total')} {group.members?.length || 0}</span>
              <button 
                onClick={() => setShowAddUserModal(true)}
                className={styles['add-member-btn']}
                style={{minWidth:'auto', padding:'0.5rem 1rem', fontSize:'0.95rem'}}
              >
                <Plus size={16} />
                {t('groups.add')}
              </button>
            </div>

            <div className={styles['members-grid']}>
              {group.members && group.members.length > 0 ? (
                group.members.map((member) => (
                  <div key={member._id} className={styles['member-card-large']}>
                                         <div className={styles['member-avatar-large']}>
                       {member.userName ? member.userName.charAt(0).toUpperCase() : (member.email ? member.email.charAt(0).toUpperCase() : 'U')}
                     </div>
                     <div className={styles['member-info-large']}>
                       <div className={styles['member-name-large']}>
                         {member.userName && member.userName !== 'Usuario' ? member.userName : (member.email || 'Usuario')}
                       </div>
                      <div className={styles['member-role-large']}>
                        {group.owner?._id === member._id ? (
                          <span className={styles['owner-badge-large']}>
                            <Crown size={12} />
                            {t('groups.owner').replace(':','')}
                          </span>
                        ) : group.admins?.some(admin => admin._id === member._id || admin === member._id) ? (
                          <span className={styles['admin-badge']}>
                            <Shield size={12} />
                            {t('groups.admin')}
                          </span>
                        ) : (
                          <span className={styles['member-badge']}>
                            <User size={12} />
                            {t('groups.member')}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className={styles['member-actions-large']}>
                      {group.owner?._id !== member._id && (
                        <>
                          <button
                            onClick={() => handleToggleAdmin(
                              member._id, 
                              member.userName,
                              group.admins?.some(admin => admin._id === member._id || admin === member._id)
                            )}
                            disabled={togglingAdmin === member._id}
                            className={styles['toggle-admin-btn']}
                            title={group.admins?.some(admin => admin._id === member._id || admin === member._id) ? t('groups.removeAdmin') : t('groups.makeAdmin')}
                          >
                            <Shield size={16} />
                          </button>
                          <button
                            onClick={() => handleRemoveUser(member._id, member.userName)}
                            disabled={removingUser === member._id}
                            className={styles['remove-user-btn-large']}
                            title={t('groups.removeFromGroup')}
                          >
                            <Trash2 size={16} />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className={styles['empty-members']}>
                  <p>{t('groups.noMembers')}</p>
                </div>
              )}
            </div>
          </div>

          {/* Zona de Peligro */}
          <div className={styles['danger-card']}>
            <h3>{t('groups.dangerZone')}</h3>
            <p>{t('groups.dangerDesc')}</p>
            <button
              onClick={handleDelete}
              className={`${styles.btn} ${styles['btn-danger']}`}
            >
              <Trash2 size={16} />
              {t('groups.deleteGroup')}
            </button>
          </div>
        </div>
      </div>

      {/* Modal para agregar usuarios */}
      {showAddUserModal && (
        <AddUserModal
          group={group}
          onClose={() => setShowAddUserModal(false)}
          onUserAdded={onUserAdded}
        />
      )}
    </div>
  );
};

export default GroupManagementModal; 