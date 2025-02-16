
import React, { ReactNode } from 'react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    content: string;
    image?: string;
    children?: React.ReactNode,
  }
  const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, content, image, children }) => {
    if (!isOpen) return null;
  
    return (
      <div style={styles.overlay}>
        <div style={styles.modal}>
          <h2 style={styles.title}>{title}</h2>
          {image && <img src={image} alt={title} style={styles.image} />}
          <p style={styles.content}>{content}</p>
          {children && <div>{children}</div>} {/* Hiển thị các children nếu có */}
          <button style={styles.closeButton} onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    );
  };

  const styles = {
    overlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
    } as React.CSSProperties,
    modal: {
      backgroundColor: '#fff',
      padding: '20px',
      borderRadius: '8px',
      maxWidth: '500px',
      width: '100%',
      textAlign: 'center',
     
    } as React.CSSProperties,
    title: {
      fontSize: '24px',
      marginBottom: '10px',
    } as React.CSSProperties,
    content: {
      fontSize: '16px',
      marginBottom: '20px',
    } as React.CSSProperties,
    closeButton: {
      padding: '10px 20px',
      fontSize: '16px',
      backgroundColor: '#007bff',
      color: '#fff',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
    } as React.CSSProperties,
    image: {
       width: '100%', height: 'auto', borderRadius: '8px', marginBottom: '10px',
    }
  };
  
  export default Modal;