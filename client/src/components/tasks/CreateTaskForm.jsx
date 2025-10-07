import React, { useState, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';
import styles from './tasks.module.css';

const CreateTaskForm = ({ onSubmit, onCancel, initialData = null, isEditing = false }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: ''
  });
  const [errors, setErrors] = useState({});

  // Cargar datos iniciales si estamos editando
  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        description: initialData.description || ''
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Limpiar error del campo cuando el usuario empieza a escribir
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'El título es obligatorio';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <div className={styles['form-container']}>
      <div className={styles['form-header']}>
        <h2>{isEditing ? 'Editar Tarea' : 'Crear Nueva Tarea'}</h2>
        <button 
          onClick={onCancel} 
          className={styles['close-btn']}
          aria-label="Cerrar"
        >
          <FaTimes />
        </button>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles['form-group']}>
          <label htmlFor="title" className={styles.label}>
            Título <span className={styles.required}>*</span>
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className={`${styles.input} ${errors.title ? styles['input-error'] : ''}`}
            placeholder="Ej: Completar informe mensual"
            autoFocus
          />
          {errors.title && (
            <span className={styles['error-message']}>{errors.title}</span>
          )}
        </div>

        <div className={styles['form-group']}>
          <label htmlFor="description" className={styles.label}>
            Descripción
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className={styles.textarea}
            placeholder="Describe los detalles de la tarea..."
            rows="4"
          />
        </div>

        <div className={styles['form-actions']}>
          <button 
            type="button" 
            onClick={onCancel} 
            className={`${styles.btn} ${styles['btn-outline']}`}
          >
            Cancelar
          </button>
          <button 
            type="submit" 
            className={`${styles.btn} ${styles['btn-primary']}`}
          >
            {isEditing ? 'Actualizar' : 'Crear Tarea'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateTaskForm;
