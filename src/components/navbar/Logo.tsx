import React from 'react';

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
  return (
    <img
      alt={altText}
      src={src}
      style={{
        cursor: onClick ? 'pointer' : 'default',
        height,
        width,
        display: 'block',
      }}
      onClick={onClick}
    />
  );
};

export default Logo;
