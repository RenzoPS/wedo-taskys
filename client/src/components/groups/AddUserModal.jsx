import React, { useState, useEffect } from 'react';
import { groupService } from '../../services/api';
import styles from './groups.module.css';

const AddUserModal = ({ group, onClose, onUserAdded }) => {
  const [availableUsers, setAvailableUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addingUser, setAddingUser] = useState(null); // Ahora guarda el userId que se está agregando
  const [error, setError] = useState('');

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
      setError('Error al cargar usuarios disponibles');
      console.error('Error loading available users:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = async (userId) => {
    try {
      setAddingUser(userId);
      setError(''); // Limpiar errores previos
      
      const result = await groupService.addUserToGroup(group._id, userId);
      
      // Verificar que el resultado contiene el grupo actualizado
      if (result && result.group) {
        onUserAdded(result.group);
        // Pequeño delay para asegurar que la actualización se complete
        setTimeout(() => {
          onClose();
        }, 100);
      } else {
        throw new Error('Respuesta inválida del servidor');
      }
    } catch (err) {
      console.error('Error adding user:', err);
      setError(err.response?.data?.message || err.message || 'Error al agregar usuario');
    } finally {
      setAddingUser(null);
    }
  };

  return (
    <div className={styles['modal-overlay']}>
      <div className={styles['modal-content']}>
        <div className={styles['add-user-modal']}>
          <div className={styles['modal-header']}>
            <h2>Agregar Usuario a "{group.name}"</h2>
            <button onClick={onClose} className={styles['close-button']}>
              ×
            </button>
          </div>

          {error && <div className={styles['error-message']}>{error}</div>}

          {loading ? (
            <div className={styles['loading-container']}>
              <div className={styles['loading-spinner']}></div>
              <p>Cargando usuarios disponibles...</p>
            </div>
          ) : availableUsers.length === 0 ? (
            <div className={styles['empty-state']}>
              <p>No hay usuarios disponibles para agregar</p>
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
                    {addingUser === user._id ? 'Agregando...' : 'Agregar'}
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