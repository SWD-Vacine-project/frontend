import React from 'react';
import Logo from './Logo';
import logoImage from '../images/logo.png';
import Search from './Search';
import Menu from './Menu';

const Navbar: React.FC = () => {
  return (
    <div style={styles.navbar}>
      <Logo
        onClick={() => console.log('Logo clicked!')}
        src={logoImage}
        altText="Site Logo"
      />
     <Search/>
     <Menu/>
      
    </div>
  );
};

const styles = {
  navbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start', // Align items closer together
    gap: '350px', // Control spacing between items
    padding: '10px 20px',
    maxWidth: '1200px', // Limit the width for better alignment
    marginLeft: '40px',
    
  } as React.CSSProperties,
  button: {
    fontSize: '16px',
    padding: '10px 20px',
  } as React.CSSProperties,
};

export default Navbar;
