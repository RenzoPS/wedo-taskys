import React, { useState, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';
import styles from './tasks.module.css';
import { useI18n } from '../common/I18nContext';

const CreateTaskForm = ({ onSubmit, onCancel, initialData = null, isEditing = false }) => {
  const { t } = useI18n();
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
      newErrors.title = t('lists.titleRequired');
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
        <h2>{isEditing ? t('tasks.editTask') : t('tasks.createTask')}</h2>
        <button 
          onClick={onCancel} 
          className={styles['close-btn']}
          aria-label={t('tasks.close')}
        >
          <FaTimes />
        </button>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles['form-group']}>
          <label htmlFor="title" className={styles.label}>
            {t('tasks.taskTitle').replace(' *', '')} <span className={styles.required}>*</span>
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className={`${styles.input} ${errors.title ? styles['input-error'] : ''}`}
            placeholder={t('tasks.taskTitlePlaceholder')}
            autoFocus
          />
          {errors.title && (
            <span className={styles['error-message']}>{errors.title}</span>
          )}
        </div>

        <div className={styles['form-group']}>
          <label htmlFor="description" className={styles.label}>
            {t('tasks.description')}
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className={styles.textarea}
            placeholder={t('tasks.descriptionPlaceholder')}
            rows="4"
          />
        </div>

        <div className={styles['form-actions']}>
          <button 
            type="button" 
            onClick={onCancel} 
            className={`${styles.btn} ${styles['btn-outline']}`}
          >
            {t('tasks.cancel')}
          </button>
          <button 
            type="submit" 
            className={`${styles.btn} ${styles['btn-primary']}`}
          >
            {isEditing ? t('tasks.update') : t('tasks.create')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateTaskForm;
