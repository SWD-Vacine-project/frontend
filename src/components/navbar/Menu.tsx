import React, { useState } from 'react';
import { AiOutlineMenu } from "react-icons/ai";
import logoImage from '../images/placeholder.png';





const Menu: React.FC = () => {
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownVisible(!isDropdownVisible);
  };

  return (
    <div style={styles.menuContainer}>
      <button style={styles.menuButton} onClick={toggleDropdown}>
      <AiOutlineMenu/>
      <img src={logoImage} alt="Placeholder" style={styles.logoImage} />
      </button>
      {isDropdownVisible && (
        <div style={styles.dropdown}>
          <a href="/login" style={styles.dropdownItem}>
            Login
          </a>
          <a href="/signup" style={styles.dropdownItem}>
            Signup
          </a>
        </div>
      )}
    </div>
  );
};
const styles = {
    menuContainer: {
      position: 'relative',
      display: 'inline-block',
      
    } as React.CSSProperties,
    menuButton: {
      fontSize: '16px',
      padding: '10px 20px',
      cursor: 'pointer',
      border: 'none',
      backgroundColor: 'white',
      borderRadius: '20px',
      boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.2)',
      display: 'flex',
      alignItems: 'center',
      gap: '10px', 
    } as React.CSSProperties,
    menuIcon: {
      fontSize: '20px',
      color: '#333',
    } as React.CSSProperties,
    logoImage: {
      width: 'auto',
      height: '25px',
      borderRadius: '20px', 
    } as React.CSSProperties,
    dropdown: {
      position: 'absolute',
      top: '100%',
      left: 0,
      backgroundColor: '#ffffff',
      boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
      borderRadius: '4px',
      zIndex: 1,
      minWidth: '150px',
    } as React.CSSProperties,
    dropdownItem: {
      display: 'block',
      padding: '10px 15px',
      textDecoration: 'none',
      color: '#333',
      fontSize: '14px',
      borderBottom: '1px solid #f0f0f0',
      cursor: 'pointer',
    } as React.CSSProperties,
  };
  
  export default Menu;