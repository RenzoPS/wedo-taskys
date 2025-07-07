import React, { useState, useEffect, useRef } from 'react';
import { groupService } from '../../services/api';
import AddUserModal from './AddUserModal';
import { Users, Calendar, Settings, ChevronDown, ChevronUp, Edit3, Trash2, Plus, Eye, User } from 'lucide-react';
import styles from './groups.module.css';

const GroupCard = ({ group, onUpdate, onDelete, onUserAdded, onManage }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);

  // Cerrar dropdown al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDetails(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleDelete = async () => {
    setLoading(true);
    try {
      await groupService.deleteGroup(group._id);
      onDelete(group._id);
    } catch (error) {
      console.error('Error al eliminar grupo:', error);
      alert('Error al eliminar el grupo');
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
            className={`${styles.btn} ${styles['btn-outline']} ${styles['details-btn']}`}
            onClick={() => setShowDetails(!showDetails)}
            title="Ver detalles"
          >
            <Eye size={16} />
            <span>Ver detalles</span>
            {showDetails ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
          
          <button 
            className={`${styles.btn} ${styles['btn-primary']} ${styles['manage-btn']}`}
            onClick={onManage}
            title="Gestionar grupo"
          >
            <Settings size={16} />
            <span>Gestionar</span>
          </button>
        </div>

        {/* Menú Desplegable de Detalles */}
        {showDetails && (
          <div className={styles['details-dropdown']} ref={dropdownRef}>
            <div className={styles['details-section']}>
              <h4 className={styles['details-title']}>
                <Users size={16} />
                Información del Grupo
              </h4>
              
              <div className={styles['details-grid']}>
                <div className={styles['detail-item']}>
                  <span className={styles['detail-label']}>Miembros:</span>
                  <span className={styles['detail-value']}>{group.members?.length || 0}</span>
                </div>
                
                <div className={styles['detail-item']}>
                  <span className={styles['detail-label']}>Creado:</span>
                  <span className={styles['detail-value']}>{formatDate(group.createdAt)}</span>
                </div>
                
                {group.owner && (
                  <div className={styles['detail-item']}>
                    <span className={styles['detail-label']}>Propietario:</span>
                    <span className={styles['detail-value']}>
                      {group.owner.name || group.owner.email}
                    </span>
                  </div>
                )}
              </div>

              {group.members && group.members.length > 0 && (
                <div className={styles['members-preview']}>
                  <span className={styles['detail-label']}>Miembros:</span>
                  <div className={styles['members-list']}>
                    {group.members.slice(0, 3).map(member => (
                      <span key={member._id} className={styles['member-tag']}>
                        <User size={12} />
                        {member.name || member.email}
                      </span>
                    ))}
                    {group.members.length > 3 && (
                      <span className={styles['member-more']}>
                        +{group.members.length - 3} más
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