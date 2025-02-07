import React, { useState, useEffect } from "react";
import Navbar from "../components/navbar/Navbar";

const Header: React.FC = () => {
  const [bgColor, setBgColor] = useState("#fff"); // Default background color

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setBgColor("rgba(255, 255, 255, 0.8)"); // Very light transparent white
      } else {
        setBgColor("#fff"); // Full white when at top
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header style={{ ...styles.header, backgroundColor: bgColor }}>
      <div style={styles.container}>
        <Navbar />
      </div>
    </header>
  );
};

const styles = {
  header: {
    width: "100%",
    boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.05)", // Lighter shadow
    position: "fixed",
    top: 0,
    left: 0,
    zIndex: 1000,
    transition: "background-color 0.3s ease-in-out", // Smooth transition effect
    backdropFilter: "blur(10px)", // Soft blur effect for glassmorphism
  } as React.CSSProperties,

  container: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "10px 20px",
  } as React.CSSProperties,
};

export default Header;
