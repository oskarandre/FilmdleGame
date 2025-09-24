import React from 'react';
import './ConfirmModal.css';

const ConfirmModal = ({ 
  show, 
  onClose, 
  onConfirm, 
  title = "Confirm Action", 
  message = "Are you sure you want to proceed?", 
  confirmText = "Confirm", 
  cancelText = "Cancel",
  confirmButtonClass = "btn-confirm",
  cancelButtonClass = "btn-cancel"
}) => {
  if (!show) {
    return null;
  }

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <div className="confirm-modal-overlay">
      <div className="confirm-modal-content">
        <h2 className="confirm-modal-title">{title}</h2>
        <p className="confirm-modal-message">{message}</p>
        <div className="confirm-modal-buttons">
          <button 
            className={`confirm-modal-btn ${cancelButtonClass}`}
            onClick={handleCancel}
          >
            {cancelText}
          </button>
          <button 
            className={`confirm-modal-btn ${confirmButtonClass}`}
            onClick={handleConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
