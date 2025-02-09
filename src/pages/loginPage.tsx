import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const Login: React.FC = () => {
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/dashboard");
  };

  return (
    <div style={styles.loginPage}>
      <motion.form
        style={styles.loginForm}
        onSubmit={handleLogin}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
      >
        <h2 style={styles.title}>Login</h2>
        <div style={styles.inputGroup}>
          <label style={styles.label}>Email:</label>
          <motion.input
            type="email"
            required
            style={styles.input}
            whileFocus={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          />
        </div>
        <div style={styles.inputGroup}>
          <label style={styles.label}>Password:</label>
          <motion.input
            type="password"
            required
            style={styles.input}
            whileFocus={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          />
        </div>
        <motion.button
          type="submit"
          style={styles.button}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          Login
        </motion.button>
      </motion.form>
    </div>
  );
};
const styles = {
    loginPage: {
      height: "100vh", // Fullscreen height
      width: "100vw",  // Fullscreen width
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      background: "linear-gradient(135deg, #D8BFD8, #C3AED6)", // Better gradient
      padding: "20px",
    } as React.CSSProperties,
  
    loginForm: {
      backgroundColor: "rgba(255, 255, 255, 0.95)", // Slightly more solid white
      padding: "40px",
      borderRadius: "16px",
      boxShadow: "0 10px 30px rgba(0, 0, 0, 0.2)",
      width: "100%",
      maxWidth: "600px", // Increased max-width for a larger form
      textAlign: "center",
    } as React.CSSProperties,
  
    title: {
      marginBottom: "20px",
      fontSize: "36px", // Larger title
      color: "#333",
    } as React.CSSProperties,
  
    inputGroup: {
      marginBottom: "20px",
      textAlign: "left",
    } as React.CSSProperties,
  
    label: {
      display: "block",
      marginBottom: "8px",
      fontSize: "16px",
      color: "#555",
    } as React.CSSProperties,
  
    input: {
      width: "100%",
      padding: "14px",
      borderRadius: "8px",
      border: "1px solid #ddd",
      fontSize: "16px",
    } as React.CSSProperties,
  
    button: {
      width: "100%",
      padding: "16px",
      backgroundColor: "#2575fc",
      color: "#fff",
      border: "none",
      borderRadius: "8px",
      cursor: "pointer",
      fontSize: "18px",
      fontWeight: "bold",
      transition: "background 0.3s ease",
    } as React.CSSProperties,
  };
  

export default Login;