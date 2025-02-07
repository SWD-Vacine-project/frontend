import React, { useState, useEffect } from 'react';
import Image1 from '../images/pfizer.png';
import Image2 from '../images/bodyImage2.png';
import Image3 from '../images/bodyImage3.png';

const images = [Image1, Image2, Image3];

const ImageSlider: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, 3000); // Change image every 3 seconds

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, []);

  return (
    <div style={styles.slider}>
      {images.map((image, index) => (
        <img
          key={index}
          src={image}
          alt={`Slide ${index + 1}`}
          style={{
            ...styles.image,
            opacity: index === currentIndex ? 1 : 0, // Show only the current image
            transition: 'opacity 1s ease-in-out', // Smooth fade transition
          }}
        />
      ))}
    </div>
  );
};

const styles = {
  slider: {
    width: '100%',
    height: '400px', // Adjusted height to fit better with the body
    overflow: 'hidden',
    position: 'relative',
    marginBottom: '40px', // Add margin to separate from the next section
  } as React.CSSProperties,
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    position: 'absolute', // Position images absolutely for stacking
    top: 0,
    left: 0,
  } as React.CSSProperties,
};

export default ImageSlider;