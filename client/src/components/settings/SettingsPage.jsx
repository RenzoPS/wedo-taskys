import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, UserX, Users, Crown, Shield, User as UserIcon, Trash2 } from 'lucide-react';
import { invitationService, groupService } from '../../services/api';
import { useAuth } from '../common/UserContext';
import { useI18n } from '../common/I18nContext';
import styles from './settings.module.css';

const SettingsPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useI18n();
  const [blockedUsers, setBlockedUsers] = useState([]);
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [unblocking, setUnblocking] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [blocked, userGroups] = await Promise.all([
        invitationService.getBlockedUsers(),
        groupService.getAllGroups()
      ]);
      setBlockedUsers(blocked);
      setGroups(userGroups);
    } catch (err) {
      console.error('Error cargando datos:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUnblock = async (userId, userName) => {
    if (window.confirm(`¿Desbloquear a ${userName}?`)) {
      setUnblocking(userId);
      try {
        await invitationService.unblockUser(userId);
        setBlockedUsers(blockedUsers.filter(u => u._id !== userId));
      } catch (err) {
        alert(err.response?.data?.message || 'Error al desbloquear usuario');
      } finally {
        setUnblocking(null);
      }
    }
  };

  const getGroupRole = (group) => {
    if (group.owner._id === user.id || group.owner === user.id) {
      return { label: t('settings.owner'), icon: Crown, color: '#f59e0b' };
    }
    if (group.admins?.some(admin => {
      const adminId = admin._id || admin;
      return adminId === user.id;
    })) {
      return { label: t('settings.admin'), icon: Shield, color: '#8b5cf6' };
    }
    return { label: 'Miembro', icon: UserIcon, color: '#667eea' };
  };

  if (loading) {
    return (
      <div className={styles['loading-container']}>
        <div className={styles['loading-spinner']}></div>
        <p>Cargando configuración...</p>
      </div>
    );
  }

  const ownedGroups = groups.filter(g => g.owner._id === user.id || g.owner === user.id);
  const memberGroups = groups.filter(g => g.owner._id !== user.id && g.owner !== user.id);

  return (
    <div className={styles['settings-container']}>
      <div className={styles['settings-header']}>
        <button onClick={() => navigate(-1)} className={styles['back-btn']}>
          <ArrowLeft size={20} />
          {t('settings.back')}
        </button>
        <h1>{t('settings.title')}</h1>
      </div>

      <div className={styles['settings-content']}>
        {/* Información del Usuario */}
        <section className={styles['settings-section']}>
          <h2>{t('settings.myAccount')}</h2>
          <div className={styles['user-info-card']}>
            <div className={styles['user-avatar']}>
              {user.userName?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className={styles['user-details']}>
              <h3>{user.userName}</h3>
              <p>{user.email}</p>
            </div>
          </div>
        </section>

        {/* Resumen de Grupos */}
        <section className={styles['settings-section']}>
          <h2>
            <Users size={20} />
            {t('settings.myGroups')}
          </h2>
          <div className={styles['groups-summary']}>
            <div className={styles['summary-stat']}>
              <span className={styles['stat-number']}>{ownedGroups.length}</span>
              <span className={styles['stat-label']}>{t('settings.createdGroups')}</span>
            </div>
            <div className={styles['summary-stat']}>
              <span className={styles['stat-number']}>{memberGroups.length}</span>
              <span className={styles['stat-label']}>{t('settings.memberGroups')}</span>
            </div>
            <div className={styles['summary-stat']}>
              <span className={styles['stat-number']}>{groups.length}</span>
              <span className={styles['stat-label']}>{t('settings.total')}</span>
            </div>
          </div>

          <div className={styles['groups-list']}>
            {groups.length === 0 ? (
              <p className={styles['empty-text']}>No perteneces a ningún grupo</p>
            ) : (
              groups.map(group => {
                const role = getGroupRole(group);
                const RoleIcon = role.icon;
                return (
                  <div key={group._id} className={styles['group-item']}>
                    <div className={styles['group-info']}>
                      <h4>{group.name}</h4>
                      <span className={styles['group-role']} style={{ color: role.color }}>
                        <RoleIcon size={14} />
                        {role.label}
                      </span>
                    </div>
                    <span className={styles['group-members']}>
                      {group.members?.length || 0} {t('settings.members')}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </section>

        {/* Usuarios Bloqueados */}
        <section className={styles['settings-section']}>
          <h2>
            <UserX size={20} />
            {t('settings.blockedUsers')}
          </h2>
          {blockedUsers.length === 0 ? (
            <p className={styles['empty-text']}>{t('settings.noBlockedUsers')}</p>
          ) : (
            <div className={styles['blocked-users-list']}>
              {blockedUsers.map(blockedUser => (
                <div key={blockedUser._id} className={styles['blocked-user-item']}>
                  <div className={styles['blocked-user-info']}>
                    <div className={styles['blocked-user-avatar']}>
                      {blockedUser.userName?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div>
                      <h4>{blockedUser.userName || 'Usuario'}</h4>
                      <p>{blockedUser.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleUnblock(blockedUser._id, blockedUser.userName)}
                    disabled={unblocking === blockedUser._id}
                    className={styles['unblock-btn']}
                  >
                    <Trash2 size={16} />
                    Desbloquear
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default SettingsPage;
