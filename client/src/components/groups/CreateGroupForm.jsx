import React, { useState } from 'react';
import { groupService } from '../../services/api';
import styles from './groups.module.css';

const CreateGroupForm = ({ onSuccess, onCancel, editingGroup }) => {
  const [formData, setFormData] = useState({
    name: editingGroup?.name || '',
    description: editingGroup?.description || ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (editingGroup) {
        const updatedGroup = await groupService.updateGroup(editingGroup._id, formData);
        onSuccess(updatedGroup);
      } else {
        const newGroup = await groupService.createGroup(formData);
        onSuccess(newGroup);
      }
    } catch (err) {
      setError(err.response?.data?.message || `Error al ${editingGroup ? 'actualizar' : 'crear'} el grupo`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles['create-group-form']}>
      <div className={styles['form-header']}>
        <h2>{editingGroup ? 'Editar Grupo' : 'Crear Nuevo Grupo'}</h2>
        <p>{editingGroup ? 'Modifica la información del grupo' : 'Organiza tu trabajo en equipo de manera eficiente'}</p>
      </div>

      <form onSubmit={handleSubmit} className={styles['group-form']}>
        {error && <div className={styles['error-message']}>{error}</div>}
        
        <div className={styles['form-group']}>
          <label htmlFor="name">Nombre del Grupo *</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Ej: Proyecto Marketing 2024"
            required
            className={styles['form-input']}
          />
        </div>

        <div className={styles['form-group']}>
          <label htmlFor="description">Descripción</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe el propósito del grupo..."
            rows="3"
            className={styles['form-textarea']}
          />
        </div>



        <div className={styles['form-actions']}>
          <button
            type="button"
            onClick={onCancel}
            className={`${styles.btn} ${styles['btn-secondary']}`}
            disabled={loading}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className={`${styles.btn} ${styles['btn-primary']}`}
            disabled={loading || !formData.name.trim()}
          >
            {loading ? (editingGroup ? 'Actualizando...' : 'Creando...') : (editingGroup ? 'Actualizar Grupo' : 'Crear Grupo')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateGroupForm; 