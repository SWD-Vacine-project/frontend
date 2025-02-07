import React, { useState } from 'react';
import { BiSearch } from 'react-icons/bi';

const Search: React.FC = () => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        padding: '6px 20px',
        border: '1px solid #D8BFD8',
        borderRadius: '30px',
        transition: 'width 0.3s ease',
        width: isHovered ? '250px' : '150px', // Expands when hovered
      }}
      onMouseEnter={() => setIsHovered(true)} // Mouse hover in
      onMouseLeave={() => setIsHovered(false)} // Mouse hover out
    >
      <input
        type="text"
        placeholder="Search..."
        style={{
          border: 'none',
          outline: 'none',
          flex: 1,
          fontSize: '16px',
          color: '#D8BFD8',
          background: 'transparent',
        }}
      />
      <BiSearch size={24} style={{ color: '#D8BFD8' }} />
    </div>
  );
};

export default Search;
