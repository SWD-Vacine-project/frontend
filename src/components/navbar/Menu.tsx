import React, { useState } from 'react';
import { AiOutlineMenu } from "react-icons/ai";
import { useNavigate } from 'react-router-dom';

const Menu: React.FC = () => {
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const navigate = useNavigate();

  const login = () => {
    navigate("/signIn");
  }



  return (
    <div
      style={styles.menuContainer}
      onMouseEnter={() => setIsDropdownVisible(true)}
      onMouseLeave={() => setIsDropdownVisible(false)}
    >
      <span style={styles.signUpText}> SIGN UP HERE →</span>
      <AiOutlineMenu style={styles.menuIcon} />
      <div
        style={{
          ...styles.dropdown,
          opacity: isDropdownVisible ? 1 : 0,
          visibility: isDropdownVisible ? 'visible' : 'hidden',
          transform: isDropdownVisible ? 'translateY(0px)' : 'translateY(10px)',
        }}
      >
         <button style={styles.dropdownItem} onClick={login}>Sign Up</button>
        <button style={styles.dropdownItem} onClick={login}>Sign In</button>
      </div>
    </div>
  );
};

const styles = {
  menuContainer: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
  } as React.CSSProperties,

  menuIcon: {
    fontSize: '24px',
    marginLeft: '10px',
  } as React.CSSProperties,

  dropdown: {
    position: 'absolute',
    top: '45px',
    left: '0',
    backgroundColor: '#ffffff',
    boxShadow: '0px 8px 12px rgba(0, 0, 0, 0.15)',
    borderRadius: '10px',
    zIndex: 1000,
    minWidth: '160px',
    padding: '10px 0',
    transition: 'opacity 0.3s ease, transform 0.3s ease, visibility 0.3s',
  } as React.CSSProperties,

  dropdownItem: {
    cursor: 'pointer',
    display: 'block',
    padding: '12px 20px',
    textDecoration: 'none',
    color: '#333',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'background 0.3s ease',
    borderRadius: '8px',
    margin: '5px 10px',
    background: 'linear-gradient(145deg, #f0f0f0, #ffffff)',
  } as React.CSSProperties,

  signUpText: {
    fontSize: '12px',
    marginRight: '10px',
    color: '#808080',
    fontWeight: 'bold',
  } as React.CSSProperties,
};

export default Menu;