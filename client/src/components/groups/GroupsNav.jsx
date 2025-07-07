import React from 'react';
import { ArrowLeft, Users } from 'lucide-react';
import styles from './groups.module.css';

const GroupsNav = ({ onBack }) => {
  return (
    <nav className={styles['groups-nav']}>
      <div className={styles['nav-container']}>
        <button onClick={onBack} className={styles['back-button']}>
          <ArrowLeft size={20} />
          <span>Volver al Inicio</span>
        </button>
        
        <div className={styles['nav-brand']}>
          <Users size={24} />
          <span>WeDo Taskys - Grupos</span>
        </div>
      </div>
    </nav>
  );
};

export default GroupsNav; 