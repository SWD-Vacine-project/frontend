import React, { useState, useEffect } from 'react';
import Image1 from '../images/bodyImage1.png';
import Image2 from '../images/bodyImage2.png';
import Image3 from '../images/bodyImage3.png';


const images = [
  Image1,Image2,Image3
];

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
      <img
        src={images[currentIndex]}
        alt={`Slide ${currentIndex + 1}`}
        style={styles.image}
      />
    </div>
  );
};

const styles = {
  slider: {
    width: '100%',
    height: '600px', // Set the height of the slider
    overflow: 'hidden',
    position: 'relative',
  } as React.CSSProperties,
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover', 
    transition: 'opacity 1s ease-in-out', 
  } as React.CSSProperties,
};

export default ImageSlider;
