import React, { useState, useEffect, useRef } from 'react';
import { Bell, Check, X, UserX } from 'lucide-react';
import { invitationService } from '../../services/api';
import { useI18n } from '../common/I18nContext';
import styles from './notifications.module.css';

const NotificationBell = () => {
  const { t } = useI18n();
  const [invitations, setInvitations] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);

  // Cargar invitaciones
  const loadInvitations = async () => {
    try {
      const data = await invitationService.getMyInvitations();
      setInvitations(data);
    } catch (err) {
      console.error('Error cargando invitaciones:', err);
    }
  };

  useEffect(() => {
    loadInvitations();
    // Recargar cada 30 segundos
    const interval = setInterval(loadInvitations, 30000);
    return () => clearInterval(interval);
  }, []);

  // Cerrar dropdown al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDropdown]);

  const handleAccept = async (invitationId) => {
    setLoading(true);
    try {
      await invitationService.acceptInvitation(invitationId);
      await loadInvitations();
    } catch (err) {
      alert(err.response?.data?.message || 'Error al aceptar invitación');
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async (invitationId) => {
    setLoading(true);
    try {
      await invitationService.rejectInvitation(invitationId);
      await loadInvitations();
    } catch (err) {
      alert(err.response?.data?.message || 'Error al rechazar invitación');
    } finally {
      setLoading(false);
    }
  };

  const handleBlock = async (invitationId, senderId) => {
    if (window.confirm('¿Bloquear a este usuario? No podrá enviarte más invitaciones.')) {
      setLoading(true);
      try {
        await invitationService.blockUser(senderId);
        await invitationService.rejectInvitation(invitationId);
        await loadInvitations();
      } catch (err) {
        alert(err.response?.data?.message || 'Error al bloquear usuario');
      } finally {
        setLoading(false);
      }
    }
  };

  const unreadCount = invitations.length;

  return (
    <div className={styles['notification-container']} ref={dropdownRef}>
      <button
        className={styles['bell-button']}
        onClick={() => setShowDropdown(!showDropdown)}
        aria-label="Notificaciones"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className={styles['notification-badge']}>{unreadCount}</span>
        )}
      </button>

      {showDropdown && (
        <div className={styles['notification-dropdown']}>
          <div className={styles['dropdown-header']}>
            <h3>Invitaciones</h3>
            {unreadCount > 0 && (
              <span className={styles['count-badge']}>{unreadCount}</span>
            )}
          </div>

          <div className={styles['dropdown-content']}>
            {invitations.length === 0 ? (
              <div className={styles['empty-state']}>
                <Bell size={32} />
                <p>No tienes invitaciones pendientes</p>
              </div>
            ) : (
              invitations.map((invitation) => (
                <div key={invitation._id} className={styles['invitation-item']}>
                  <div className={styles['invitation-info']}>
                    <div className={styles['invitation-avatar']}>
                      {invitation.sender?.userName?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div className={styles['invitation-text']}>
                      <p className={styles['invitation-title']}>
                        <strong>{invitation.sender?.userName || 'Usuario'}</strong> te invitó a
                      </p>
                      <p className={styles['invitation-group']}>
                        {invitation.group?.name}
                      </p>
                      <p className={styles['invitation-time']}>
                        {new Date(invitation.createdAt).toLocaleDateString('es-AR')}
                      </p>
                    </div>
                  </div>

                  <div className={styles['invitation-actions']}>
                    <button
                      onClick={() => handleAccept(invitation._id)}
                      disabled={loading}
                      className={styles['accept-btn']}
                      title="Aceptar"
                    >
                      <Check size={16} />
                    </button>
                    <button
                      onClick={() => handleReject(invitation._id)}
                      disabled={loading}
                      className={styles['reject-btn']}
                      title="Rechazar"
                    >
                      <X size={16} />
                    </button>
                    <button
                      onClick={() => handleBlock(invitation._id, invitation.sender._id)}
                      disabled={loading}
                      className={styles['block-btn']}
                      title="Rechazar y bloquear usuario"
                    >
                      <UserX size={16} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
