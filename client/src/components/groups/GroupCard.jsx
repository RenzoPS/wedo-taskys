import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { groupService } from '../../services/api';
import AddUserModal from './AddUserModal';
import { Users, Calendar, Settings, ChevronDown, ChevronUp, Edit3, Trash2, Plus, Eye, User, List } from 'lucide-react';
import styles from './groups.module.css';
import { useAuth } from '../common/UserContext';
import { useI18n } from '../common/I18nContext';

const GroupCard = ({ group, onUpdate, onDelete, onUserAdded, onManage, isExpanded, onToggleExpand }) => {
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { t } = useI18n();

  // Cerrar dropdown al hacer click fuera
  useEffect(() => {
    if (!isExpanded) return;

    const handleClickOutside = (event) => {
      // No cerrar si se hace click en el botón o en el dropdown
      if (
        (dropdownRef.current && dropdownRef.current.contains(event.target)) ||
        (buttonRef.current && buttonRef.current.contains(event.target))
      ) {
        return;
      }
      onToggleExpand();
    };

    // Usar un pequeño delay para evitar que se cierre inmediatamente
    const timeoutId = setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside);
    }, 0);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isExpanded, onToggleExpand]);

  const handleDelete = async () => {
    setLoading(true);
    try {
      await groupService.deleteGroup(group._id);
      onDelete(group._id);
    } catch (error) {
      console.error('Error al eliminar grupo:', error);
      alert(t('groups.errorCreate'));
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className={styles['group-card']}>
      {/* Tarjeta Simple */}
      <div className={styles['card-content']}>
        <div className={styles['card-header']}>
          <h3 className={styles['group-name']}>{group.name}</h3>
        </div>

        {group.description && (
          <p className={styles['group-description']}>{group.description}</p>
        )}

        {/* Botones de Acción */}
        <div className={styles['card-actions']}>
          <button 
            ref={buttonRef}
            className={`${styles.btn} ${styles['btn-outline']} ${styles['details-btn']}`}
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              onToggleExpand();
            }}
            title={t('groups.viewDetails')}
          >
            <Eye size={16} />
            <span>{t('groups.viewDetails')}</span>
            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
          <button 
            className={`${styles.btn} ${styles['btn-primary']} ${styles['lists-btn']}`}
            onClick={() => navigate(`/groups/${group._id}/lists`)}
            title={t('groups.viewLists')}
          >
            <List size={16} />
            <span>{t('groups.viewLists')}</span>
          </button>
          {user && group.owner && user.id === group.owner._id && (
            <button 
              className={`${styles.btn} ${styles['btn-primary']} ${styles['manage-btn']}`}
              onClick={onManage}
              title={t('groups.manage')}
            >
              <Settings size={16} />
              <span>{t('groups.manage')}</span>
            </button>
          )}
        </div>

        {/* Menú Desplegable de Detalles */}
        {isExpanded && (
          <div className={styles['details-dropdown']} ref={dropdownRef}>
            <div className={styles['details-section']}>
              <h4 className={styles['details-title']}>
                <Users size={16} />
                {t('groups.groupInfo')}
              </h4>
              
              <div className={styles['details-grid']}>
                <div className={styles['detail-item']}>
                  <span className={styles['detail-label']}>{t('groups.members')}</span>
                  <span className={styles['detail-value']}>{group.members?.length || 0}</span>
                </div>
                
                <div className={styles['detail-item']}>
                  <span className={styles['detail-label']}>{t('groups.created')}</span>
                  <span className={styles['detail-value']}>{formatDate(group.createdAt)}</span>
                </div>
                
                {group.owner && (
                  <div className={styles['detail-item']}>
                    <span className={styles['detail-label']}>{t('groups.owner')}</span>
                    <span className={styles['detail-value']}>
                      {group.owner.userName || group.owner.email}
                    </span>
                  </div>
                )}
              </div>

              {group.members && group.members.length > 0 && (
                <div className={styles['members-preview']}>
                  <span className={styles['detail-label']}>{t('groups.members')}</span>
                  <div className={styles['members-list']}>
                    {group.members.slice(0, 3).map(member => (
                      <span key={member._id} className={styles['member-tag']}>
                        <User size={12} />
                        {member.userName || member.email}
                      </span>
                    ))}
                    {group.members.length > 3 && (
                      <span className={styles['member-more']}>
                        {t('groups.moreMembers').replace('{{count}}', (group.members.length - 3).toString())}
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GroupCard;