import React, { useState, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';
import styles from './lists.module.css';
import { useI18n } from '../common/I18nContext';

const CreateListForm = ({ onSubmit, onCancel, initialData = null, isEditing = false }) => {
  const { t } = useI18n();
  const [formData, setFormData] = useState({
    title: ''
  });
  const [errors, setErrors] = useState({});

  // Cargar datos iniciales si estamos editando
  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || ''
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Limpiar error cuando el usuario comienza a escribir
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
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
    <div className={styles['create-list-form']}>
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-center">
          {isEditing ? t('lists.editList') : t('lists.createList')}
        </h2>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className={styles['form-group']}>
          <label htmlFor="title">{t('lists.listTitle')}</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className={`${styles['form-input']} ${errors.title ? 'border-red-500' : ''}`}
            placeholder={t('lists.listTitlePlaceholder')}
            autoFocus
          />
          {errors.title && (
            <p className="text-red-500 text-sm mt-1">{errors.title}</p>
          )}
        </div>
        
        <div className={styles['form-actions']}>
          <button 
            type="button" 
            onClick={onCancel}
            className={`${styles.btn} ${styles['btn-outline']}`}
          >
            {t('lists.cancel')}
          </button>
          <button 
            type="submit" 
            className={`${styles.btn} ${styles['btn-primary']}`}
          >
            {isEditing ? t('lists.saveChanges') : t('lists.create')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateListForm;