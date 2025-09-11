import React from 'react';
import './modal.css';

const Modal = ({ show, onClose }) => {
  if (!show) {
    return null;
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Notice</h2>
        <p>The functionality does not work as intended. You need to create an account/sign in for it to work. </p>
        <p>We are working on a solution for this issue.</p>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default Modal;