import React from 'react';
import Navbar from '../components/navbar/Navbar';

const Header: React.FC = () => {
  const styles: React.CSSProperties = {
    color: 'black', // Dark text color for contrast
    fontSize: '10px',
    backgroundColor: 'white',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    position: 'fixed',
    width: '100%',
    top: 0,
    zIndex: 10,
    paddingTop: '1rem',
    paddingBottom: '1rem',
    borderBottom: '1px solid #d3d3d3',
  };

  return (
    <header style={styles}>
      <Navbar />
    </header>
  );
};

export default Header;
