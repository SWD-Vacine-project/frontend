import React, { useState, useEffect } from 'react';

interface LogoProps {
  onClick?: () => void;
  height?: string | number;
  width?: string | number;
  src: string;
  altText?: string;
}

const Logo: React.FC<LogoProps> = ({
  onClick,
  height = 50,
  width = 150,
  src,
  altText = 'Site Logo',
}) => {
  const [bgColor, setBgColor] = useState('#fff'); // Default background color

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setBgColor('rgba(255, 255, 255, 0.8)'); // Lighter color when scrolled
      } else {
        setBgColor('#fff'); // Original color when at top
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <img
      alt={altText}
      src={src}
      style={{
        cursor: onClick ? 'pointer' : 'default',
        height,
        width,
        display: 'block',
        marginLeft: '-100px',
        backgroundColor: bgColor, // Syncs with header background
        transition: 'background-color 0.3s ease-in-out', // Smooth transition effect
        padding: '5px', // Optional: Adds slight padding for spacing
        borderRadius: '5px', // Optional: Slightly rounded corners for better aesthetics
      }}
      onClick={onClick}
    />
  );
};

export default Logo;
