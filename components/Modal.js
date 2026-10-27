'use client';

// TOPIC: Props and rendering patterns - Modal component with composition pattern
import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import styles from '@/styles/Modal.module.css';

export function Modal({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  size = 'medium',
  footer 
}) {
  const modalRef = useRef(null);

  // TOPIC: Side effects (useEffect) - Handle ESC key press and cleanup
  useEffect(() => {
    const handleEscape = (e) => {
      // TOPIC: Event handling - Keyboard events
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    // Cleanup function
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // TOPIC: Side effects (useRef) - Focus management
  useEffect(() => {
    if (isOpen && modalRef.current) {
      modalRef.current.focus();
    }
  }, [isOpen]);

  // TOPIC: Props and rendering patterns - Conditional rendering
  if (!isOpen) return null;

  // TOPIC: Event handling - Event delegation (overlay click)
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const modalContent = (
    <div className={styles.overlay} onClick={handleOverlayClick}>
      <div 
        className={`${styles.modal} ${styles[size]}`} 
        ref={modalRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className={styles.header}>
          <h2 id="modal-title" className={styles.title}>{title}</h2>
          <button
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Close modal"
          >
            ×
          </button>
        </div>
        <div className={styles.body}>
          {children}
        </div>
        {footer && (
          <div className={styles.footer}>
            {footer}
          </div>
        )}
      </div>
    </div>
  );

  // Render modal using portal for proper z-index stacking
  return typeof document !== 'undefined' 
    ? createPortal(modalContent, document.body)
    : null;
}

// TOPIC: Props and rendering patterns - Compound component pattern
Modal.Header = function ModalHeader({ children }) {
  return <div className={styles.header}>{children}</div>;
};

Modal.Body = function ModalBody({ children }) {
  return <div className={styles.body}>{children}</div>;
};

Modal.Footer = function ModalFooter({ children }) {
  return <div className={styles.footer}>{children}</div>;
};
