import React, { useState } from 'react';
import Logo from './Logo';
import logoImage from '../images/logo.png';
import Search from './Search';
import Menu from './Menu';

const Navbar: React.FC = () => {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);


  const handleLogoClick = () => {
    window.location.href = '/';
  }

  return (
    <div style={styles.navbar}>
      <Logo
        onClick= {handleLogoClick}
        src={logoImage}
        altText="Site Logo"
      />
      <div style={styles.navItemsContainer}>
        {['About', 'Vaccine', 'Contact', 'Services'].map((item, index) => (
          <a
            key={index}
            href={`/${item.toLowerCase()}`}
            style={{
              ...styles.navItem,
              color: hoveredItem === item ? 'blue' : '#333',
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
        <Menu />
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
    whiteSpace: 'nowrap', // Ensure text stays on one line
  } as React.CSSProperties,
  searchMenuContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
  } as React.CSSProperties,
};

export default Navbar;