import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FcGoogle } from "react-icons/fc"; // Import Google icon

const Login: React.FC = () => {
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/dashboard");
  };

  const GOOGLE_AUTH_URL = `https://accounts.google.com/o/oauth2/auth?client_id=1006543489483-mrg7qa1pas18ulb0hvnadiagh8jajghs.apps.googleusercontent.com&response_type=code&approval_prompt=force&access_type=offline&redirect_uri=https://localhost:7090/signin-google&scope=openid email profile`;

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
        <div style={styles.separator}>or</div>
        <motion.button
          style={styles.googleButton}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => window.location.href = GOOGLE_AUTH_URL}
        >
          <FcGoogle size={24} style={{ marginRight: "10px" }} />
          Sign in with Google
        </motion.button>
      </motion.form>
    </div>
  );
};

const styles = {
  loginPage: {
    height: "100vh",
    width: "100vw",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #D8BFD8, #C3AED6)",
    padding: "20px",
  } as React.CSSProperties,

  loginForm: {
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    padding: "40px",
    borderRadius: "16px",
    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.2)",
    width: "100%",
    maxWidth: "500px",
    textAlign: "center",
  } as React.CSSProperties,

  title: {
    marginBottom: "20px",
    fontSize: "36px",
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

  separator: {
    margin: "20px 0",
    fontSize: "16px",
    color: "#888",
  } as React.CSSProperties,

  googleButton: {
    width: "100%",
    padding: "14px",
    backgroundColor: "#fff",
    border: "1px solid #ddd",
    borderRadius: "8px",
    fontSize: "16px",
    fontWeight: "bold",
    color: "#333",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    transition: "all 0.3s ease",
  } as React.CSSProperties,
};

export default Login;
