import React, { useState, useEffect, useRef } from 'react';
import Logo from './Logo';
import logoImage from '../images/logo.png';
import Search from './Search';
import Menu from './Menu';
import { useNavigate } from 'react-router-dom';
const Navbar: React.FC = () => {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        if (parsedUser?.name) {
          setUserName(parsedUser.name);
        }
      } catch (error) {
        console.error("Error parsing localStorage data:", error);
      }
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  const handleLogoClick = () => {
    window.location.href = '/';
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUserName(null);
    window.location.href = "/";
  };


  

  const menuItems = userName 
    ? ['Schedule', 'Register for Vaccination', 'Children', 'Vaccine']
    : ['About', 'Vaccine', 'Contact', 'Services'];

  return (
    <div style={styles.navbar}>
      <Logo onClick={handleLogoClick} src={logoImage} altText="Site Logo" />
      <div style={styles.navItemsContainer}>
        {menuItems.map((item, index) => (
          <a
            key={index}
            href={`/${item.toLowerCase().replace(/\s+/g, "-")}`}
            style={{
              ...styles.navItem,
              color: hoveredItem === item ? "blue" : "#333",
            }}
            onMouseEnter={() => setHoveredItem(item)}
            onMouseLeave={() => setHoveredItem(null)}
          >
            {hoveredItem === item ? `- ${item} -` : item}
          </a>
        ))}
      </div>
      <div style={styles.searchMenuContainer}>
        <Search />
        {userName ? (
          <div 
            ref={dropdownRef}
            style={styles.userDropdown} 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <div style={styles.userNameCard}>{` ${userName}`}</div>
            {isDropdownOpen && (
              <div style={styles.dropdownContent}>
              <button style={styles.userButton} onClick={() => navigate('/user')}>User</button>
              <div style={styles.divider}></div>
              <button style={styles.childButton} onClick={() => navigate('/child')}>Child</button>
              <div style={styles.divider}></div>
              <button onClick={handleLogout} style={styles.logoutButton}>Logout</button>
            </div>
            )}
          </div>
        ) : (
          <Menu />
        )}
      </div>
    </div>
  );
};

const styles = {
  navbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: '250px',
    padding: '10px 20px',
    maxWidth: '1200px',
    marginLeft: '40px',
  } as React.CSSProperties,
  navItemsContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '30px',
  } as React.CSSProperties,
  navItem: {
    textDecoration: 'none',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'color 0.3s ease',
    position: 'relative',
    paddingBottom: '5px',
    whiteSpace: 'nowrap',
  } as React.CSSProperties,
  searchMenuContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
  } as React.CSSProperties,
  userDropdown: {
    position: 'relative',
    display: 'inline-block',
    cursor: 'pointer',
  } as React.CSSProperties,
  userNameCard: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '10px 16px',
    borderRadius: '10px',
    backgroundColor: '#D8BFD8',
    fontSize: '14px',
    fontWeight: '500',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
    cursor: 'pointer',
    transition: 'background 0.3s ease',
  } as React.CSSProperties,
  dropdownContent: {
    position: 'absolute',
    top: '100%',
    left: '50%',
    transform: 'translateX(-50%)',
    backgroundColor: '#fff',
    border: '1px solid #ddd',
    borderRadius: '8px',
    boxShadow: '0px 4px 6px rgba(0,0,0,0.1)',
    padding: '10px',
    display: 'flex',
    flexDirection: 'column',
    minWidth: '100px',
    marginTop: '5px',
    zIndex: 1000,
  } as React.CSSProperties,
  divider: {
    height: '0.5px',
    backgroundColor: '#ddd',
    margin: '3px 0',
  } as React.CSSProperties,
  logoutButton: {
    backgroundColor: '#D8BFD8',
    color: 'white',
    border: 'none',
    padding: '10px 11px',
    cursor: 'pointer',
    borderRadius: '8px',
    fontSize: '11px',
    fontWeight: 'bold',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  } as React.CSSProperties,  
  childButton: {
    backgroundColor: '#D8BFD8',
    color: 'white',
    border: 'none',
    padding: '10px 11px',
    cursor: 'pointer',
    borderRadius: '8px',
    fontSize: '11px',
    fontWeight: 'bold',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  } as React.CSSProperties,
  userButton: {
    backgroundColor: '#D8BFD8',
    color: 'white',
    border: 'none',
    padding: '10px 11px',
    cursor: 'pointer',
    borderRadius: '8px',
    fontSize: '11px',
    fontWeight: 'bold',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  } as React.CSSProperties,
};

export default Navbar;
