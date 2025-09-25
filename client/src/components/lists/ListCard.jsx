import React, { useState, useRef, useEffect } from 'react';
import { FaEllipsisV, FaTrash, FaEdit, FaTasks } from 'react-icons/fa';
import styles from './lists.module.css';
import { useNavigate } from 'react-router-dom';

const ListCard = ({ list, onEdit, onDelete, onDragStart, onDragEnd, draggable = true, isGroupOwner = false }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownToggleRef = useRef(null);
  const dropdownMenuRef = useRef(null);
  const navigate = useNavigate();

  // Cerrar dropdown cuando se hace clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Solo cerrar si el click no es en el dropdown o sus elementos
      if (dropdownToggleRef.current && !dropdownToggleRef.current.contains(event.target) &&
          dropdownMenuRef.current && !dropdownMenuRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleDragStart = (e) => {
    if (!draggable) return;
    
    // Añadir datos para el drag and drop
    e.dataTransfer.setData('application/json', JSON.stringify({
      id: list._id,
      type: 'list'
    }));
    
    // Añadir clase para estilo durante el arrastre
    e.currentTarget.classList.add(styles.dragging);
    
    if (onDragStart) onDragStart();
  };

  const handleDragEnd = (e) => {
    if (!draggable) return;
    
    // Remover clase de estilo
    e.currentTarget.classList.remove(styles.dragging);
    
    if (onDragEnd) onDragEnd();
  };

  const handleEdit = (list) => {
    setShowDropdown(false);
    if (onEdit) {
      onEdit(list);
    }
  };

  const handleDelete = (list) => {
    setShowDropdown(false);
    if (onDelete) {
      onDelete(list);
    }
  };

  // Calcular la fecha de creación formateada
  const formattedDate = new Date(list.createdAt).toLocaleDateString();

  return (
    <div 
      className={`${styles['list-card']} ${!draggable ? styles['view-only'] : ''}`} 
      draggable={draggable}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className={styles['card-content']}>
        <div className={styles['card-header']}>
          <h3 className={styles['list-name']}>{list.title}</h3>
        </div>
        
        <div className="mt-2 text-sm text-gray-500">
          Creada el {formattedDate}
        </div>
        
        <div className={styles['list-card-actions']}>
          <button 
            onClick={() => navigate(`/lists/${list._id}`)}
            className={`${styles.btn} ${styles['btn-outline']}`}
          >
            <FaTasks className="mr-1" /> Ver tareas
          </button>
          

          
          {isGroupOwner && onEdit && onDelete && (
            <div className={styles.dropdown}>
              <button 
                onClick={() => setShowDropdown(!showDropdown)} 
                className={`${styles['dropdown-toggle']} ${showDropdown ? styles.active : ''}`}
                ref={dropdownToggleRef}
              >
                <FaEllipsisV />
              </button>
              
              {showDropdown && (
                <div className={styles['dropdown-menu']} ref={dropdownMenuRef}>
                  <button 
                    onClick={() => handleEdit(list)} 
                    className={styles['dropdown-item']}
                  >
                    <FaEdit className="mr-2" /> Editar
                  </button>
                  <button 
                    onClick={() => handleDelete(list)} 
                    className={`${styles['dropdown-item']} ${styles.danger}`}
                  >
                    <FaTrash className="mr-2" /> Eliminar
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ListCard;