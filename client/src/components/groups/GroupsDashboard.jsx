import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { groupService } from '../../services/api';
import CreateGroupForm from './CreateGroupForm';
import GroupCard from './GroupCard';
import GroupsNav from './GroupsNav';
import GroupManagementModal from './GroupManagementModal';
import styles from './groups.module.css';
import { useI18n } from '../common/I18nContext';

const GroupsDashboard = () => {
  const navigate = useNavigate();
  const { t, lang } = useI18n();
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingGroup, setEditingGroup] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [showManagementModal, setShowManagementModal] = useState(false);
  const [expandedGroupId, setExpandedGroupId] = useState(null);

  useEffect(() => {
    loadGroups();
  }, []);

  const loadGroups = async () => {
    try {
      setLoading(true);
      const groupsData = await groupService.getAllGroups();
      setGroups(groupsData);
      setError('');
    } catch (err) {
      setError(lang === 'en' ? 'Error loading groups' : 'Error al cargar los grupos');
      console.error('Error loading groups:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSuccess = (newGroup) => {
    setGroups(prev => [newGroup, ...prev]);
    setShowCreateForm(false);
  };

  const handleUpdateGroup = (group) => {
    setEditingGroup(group);
    setShowCreateForm(true);
  };

  const handleDeleteGroup = (groupId) => {
    setGroups(prev => prev.filter(group => group._id !== groupId));
    setShowManagementModal(false);
    setSelectedGroup(null);
  };

  const handleUserAdded = (updatedGroup) => {
    if (updatedGroup && updatedGroup._id) {
      setGroups(prev => prev.map(group => 
        group._id === updatedGroup._id ? updatedGroup : group
      ));
      setSelectedGroup(updatedGroup);
    } else {
      loadGroups();
    }
  };

  const handleEditSuccess = (updatedGroup) => {
    setGroups(prev => prev.map(group => 
      group._id === updatedGroup._id ? updatedGroup : group
    ));
    setShowCreateForm(false);
    setEditingGroup(null);
  };

  const openManagementModal = (group) => {
    setSelectedGroup(group);
    setShowManagementModal(true);
  };

  const closeManagementModal = () => {
    setShowManagementModal(false);
    setSelectedGroup(null);
  };

  if (loading) {
    return (
      <div className={styles['groups-dashboard']}>
          <div className={styles['loading-container']}>
          <div className={styles['loading-spinner']}></div>
          <p>{lang === 'en' ? 'Loading groups...' : 'Cargando grupos...'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles['groups-dashboard']}>
      <GroupsNav onBack={() => navigate('/')} />
      <div className={styles['dashboard-header']}>
        <div className={styles['header-content']}>
          <h1>{t('groups.myGroups')}</h1>
          <p>{lang === 'en' ? 'Manage your work and collaboration groups' : 'Gestiona tus grupos de trabajo y colaboración'}</p>
        </div>
        <button
          className={`${styles.btn} ${styles['btn-primary']} ${styles['create-btn']}`}
          onClick={() => setShowCreateForm(true)}
        >
          {lang === 'en' ? '+ Create Group' : '+ Crear Grupo'}
        </button>
      </div>

      {error && (
        <div className={styles['error-banner']}>
          <p>{error}</p>
          <button onClick={loadGroups} className={styles['retry-btn']}>
            {lang === 'en' ? 'Retry' : 'Reintentar'}
          </button>
        </div>
      )}

      {showCreateForm && (
        <div className={styles['modal-overlay']}>
          <div className={styles['modal-content']}>
            <CreateGroupForm
              onSuccess={editingGroup ? handleEditSuccess : handleCreateSuccess}
              onCancel={() => {
                setShowCreateForm(false);
                setEditingGroup(null);
              }}
              editingGroup={editingGroup}
            />
          </div>
        </div>
      )}

      <div className={styles['groups-content']}>
        {groups.length === 0 ? (
          <div className={styles['empty-state']}>
            <div className={styles['empty-icon']}>👥</div>
            <h3>{lang === 'en' ? "You don't have groups yet" : 'No tienes grupos aún'}</h3>
            <p>{lang === 'en' ? 'Create your first group to start collaborating with your team' : 'Crea tu primer grupo para empezar a colaborar con tu equipo'}</p>
            <button
              className={`${styles.btn} ${styles['btn-primary']}`}
              onClick={() => setShowCreateForm(true)}
            >
              {lang === 'en' ? 'Create my first group' : 'Crear mi primer grupo'}
            </button>
          </div>
        ) : (
          <div className={styles['groups-grid']}>
            {groups.map(group => (
              <GroupCard
                key={group._id}
                group={group}
                onUpdate={handleUpdateGroup}
                onDelete={handleDeleteGroup}
                onUserAdded={handleUserAdded}
                onManage={() => openManagementModal(group)}
                isExpanded={expandedGroupId === group._id}
                onToggleExpand={() => setExpandedGroupId(expandedGroupId === group._id ? null : group._id)}
              />
            ))}
          </div>
        )}
      </div>

      {showManagementModal && selectedGroup && (
        <GroupManagementModal
          group={selectedGroup}
          onClose={closeManagementModal}
          onUpdate={handleUpdateGroup}
          onDelete={() => handleDeleteGroup(selectedGroup._id)}
          onUserAdded={handleUserAdded}
        />
      )}
    </div>
  );
};

export default GroupsDashboard;