import React, { useState, useEffect } from 'react';
import { X, UserPlus, Loader } from 'lucide-react';
import { groupService, invitationService } from '../../services/api';
import styles from './groups.module.css';
import { useI18n } from '../common/I18nContext';

const AddUserModal = ({ group, onClose, onUserAdded }) => {
  const { t } = useI18n();
  const [availableUsers, setAvailableUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addingUser, setAddingUser] = useState(null); // Ahora guarda el userId que se está agregando
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadAvailableUsers();
  }, [group._id]);

  const loadAvailableUsers = async () => {
    try {
      setLoading(true);
      const users = await groupService.getAvailableUsers(group._id);
      setAvailableUsers(users);
      setError('');
    } catch (err) {
      setError(t('groups.errorLoadingUsers'));
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = async (userId) => {
    try {
      setAddingUser(userId);
      setError('');
      setSuccess('');
      
      if (!group._id) {
        throw new Error('ID del grupo no disponible');
      }
      
      if (!userId) {
        throw new Error('ID del usuario no disponible');
      }
      
      // Enviar invitación en lugar de agregar directamente
      await invitationService.sendInvitation(group._id, userId);
      
      setSuccess('¡Invitación enviada exitosamente!');
      
      // Cerrar el modal después de 1.5 segundos
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al enviar invitación';
      setError(errorMessage);
    } finally {
      setAddingUser(null);
    }
  };

  return (
    <div className={styles['modal-overlay']}>
      <div className={styles['modal-content']}>
        <div className={styles['add-user-modal']}>
          <div className={styles['modal-header']}>
            <h2>{t('groups.addUserTo').replace('{{group}}', group.name)}</h2>
            <button onClick={onClose} className={styles['close-button']}>
              ×
            </button>
          </div>

          {error && <div className={styles['error-message']}>{error}</div>}
          {success && <div className={styles['success-message']}>{success}</div>}

          {loading ? (
            <div className={styles['loading-container']}>
              <div className={styles['loading-spinner']}></div>
              <p>{t('groups.loadingUsers')}</p>
            </div>
          ) : availableUsers.length === 0 ? (
            <div className={styles['empty-state']}>
              <p>{t('groups.noUsersAvailable')}</p>
            </div>
          ) : (
            <div className={styles['users-list']}>
              {availableUsers.map(user => (
                <div key={user._id} className={styles['user-item']}>
                  <div className={styles['user-info']}>
                    <span className={styles['user-name']}>{user.name}</span>
                    <span className={styles['user-email']}>{user.email}</span>
                  </div>
                  <button
                    onClick={() => handleAddUser(user._id)}
                    disabled={addingUser === user._id}
                    className={`${styles.btn} ${styles['btn-primary']} ${styles['add-button']}`}
                  >
                    {addingUser === user._id ? t('groups.adding') : t('groups.add')}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddUserModal; 