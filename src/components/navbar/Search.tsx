import React, { useState, useEffect, useRef } from 'react';
import { BiSearch } from 'react-icons/bi';

const Search: React.FC = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setIsDropdownOpen(false); // Close the dropdown if clicking outside
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <div style={styles.container}>
      <span style={styles.text} className="menu-item">
        Home
      </span>
      <div style={styles.divider}></div> {/* Vertical line */}
      <div ref={dropdownRef}>
        <span
          style={styles.text}
          className="menu-item"
          onClick={toggleDropdown}
        >
          Vaccine
        </span>
        {isDropdownOpen && (
          <div style={styles.dropdown}>
            <div style={styles.dropdownItem}>Vaccine 1</div>
            <div style={styles.dividerPopup}></div>
            <div style={styles.dropdownItem}>Vaccine 2</div>
            <div style={styles.dividerPopup}></div>
            <div style={styles.dropdownItem}>Vaccine 3</div>
          </div>
        )}
      </div>
      <div style={styles.divider}></div> {/* Vertical line */}
      <div style={styles.search} className="menu-item">
        <span style={styles.text}>Search</span>
        <BiSearch size={24} style={styles.icon} />
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    padding: '6px 20px',
    border: '1px solid #D8BFD8',
    borderRadius: '30px',
    position: 'relative',
  } as React.CSSProperties,
  text: {
    fontSize: '18px',
    fontWeight: 'bold',
    cursor: 'pointer',
    color: '#D8BFD8',
  } as React.CSSProperties,
  divider: {
    width: '2px',
    height: '20px',
    backgroundColor: '#D8BFD8',
  } as React.CSSProperties,
  dividerPopup: {
    width: '2px',
    height: '30px',
    backgroundColor: '#D8BFD8',
  } as React.CSSProperties,
  search: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  } as React.CSSProperties,
  icon: {
    color: '#D8BFD8',
  } as React.CSSProperties,
  dropdown: {
    position: 'absolute',
    top: '40px',
    left: '50%',
    transform: 'translateX(-50%)',
    backgroundColor: '#fff',
    border: '1px solid #D8BFD8',
    borderRadius: '20px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    zIndex: 10,
    display: 'flex',
    flexDirection: 'row',
    gap: '10px',
    padding: '9px',
  } as React.CSSProperties,
  dropdownItem: {
    padding: '8px 12px',
    fontSize: '16px',
   color: '#D8BFD8',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  } as React.CSSProperties,
};

export default Search;
