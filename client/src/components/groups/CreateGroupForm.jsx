import React, { useState } from 'react';
import { groupService } from '../../services/api';
import styles from './groups.module.css';
import { useI18n } from '../common/I18nContext';

const CreateGroupForm = ({ onSuccess, onCancel, editingGroup }) => {
  const { t } = useI18n();
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
      setError(err.response?.data?.message || (editingGroup ? t('groups.errorUpdate') : t('groups.errorCreate')));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles['create-group-form']}>
      <div className={styles['form-header']}>
        <h2>{editingGroup ? t('groups.editGroup') : t('groups.createNewGroup')}</h2>
        <p>{editingGroup ? t('groups.modifyInfo') : t('groups.organizeWork')}</p>
      </div>

      <form onSubmit={handleSubmit} className={styles['group-form']}>
        {error && <div className={styles['error-message']}>{error}</div>}
        
        <div className={styles['form-group']}>
          <label htmlFor="name">{t('groups.groupName')}</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder={t('groups.groupNamePlaceholder')}
            required
            className={styles['form-input']}
          />
        </div>

        <div className={styles['form-group']}>
          <label htmlFor="description">{t('groups.description')}</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder={t('groups.descriptionPlaceholder')}
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
            {t('groups.cancel')}
          </button>
          <button
            type="submit"
            className={`${styles.btn} ${styles['btn-primary']}`}
            disabled={loading || !formData.name.trim()}
          >
            {loading ? (editingGroup ? t('groups.updating') : t('groups.creating')) : (editingGroup ? t('groups.updateGroup') : t('groups.createGroup'))}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateGroupForm; 