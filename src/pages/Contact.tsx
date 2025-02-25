import { useState } from "react";

const styles = {
  fullPage: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #FFD3E0, #C3AED6)", // Soft pink & lavender gradient
    minHeight: "100vh",
    padding: "20px",
  } as React.CSSProperties,
  formContainer: {
    backgroundColor: "#fff",
    padding: "35px",
    borderRadius: "15px",
    boxShadow: "0 6px 15px rgba(0, 0, 0, 0.1)",
    width: "100%",
    maxWidth: "500px",
    textAlign: "center",
    animation: "fadeIn 0.8s ease-in-out",
  } as React.CSSProperties,
  heading: {
    color: "#8B008B", // Deep magenta for elegance
    fontSize: "28px",
    marginBottom: "10px",
  } as React.CSSProperties,
  subtitle: {
    color: "#555",
    fontSize: "16px",
    marginBottom: "20px",
    fontStyle: "italic",
  } as React.CSSProperties,
  inputField: {
    width: "100%",
    padding: "12px",
    marginBottom: "15px",
    border: "1px solid #ccc",
    borderRadius: "10px",
    fontSize: "16px",
    transition: "all 0.3s ease-in-out",
  } as React.CSSProperties,
  textArea: {
    width: "100%",
    padding: "12px",
    marginBottom: "20px",
    border: "1px solid #ccc",
    borderRadius: "10px",
    fontSize: "16px",
    height: "120px",
    transition: "all 0.3s ease-in-out",
  } as React.CSSProperties,
  button: {
    width: "100%",
    padding: "12px",
    backgroundColor: "#C3AED6", 
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    fontSize: "16px",
    cursor: "pointer",
    transition: "background 0.3s, transform 0.2s",
  } as React.CSSProperties,
  buttonHover: {
    backgroundColor: "#E75480",
    transform: "scale(1.05)",
  },
  inputFocus: {
    borderColor: "#FF69B4",
    boxShadow: "0 0 8px rgba(255, 105, 180, 0.5)",
    animation: "shake 0.2s ease-in-out", // Shake effect when focused
  },
};

// Inject CSS animations into the document
const styleSheet = document.styleSheets[0];
styleSheet.insertRule(`
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(-20px); }
    to { opacity: 1; transform: translateY(0); }
  }
`, styleSheet.cssRules.length);

styleSheet.insertRule(`
  @keyframes shake {
    0% { transform: translateX(0); }
    25% { transform: translateX(-4px); }
    50% { transform: translateX(4px); }
    75% { transform: translateX(-4px); }
    100% { transform: translateX(0); }
  }
`, styleSheet.cssRules.length);

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("💕 Your message has been sent! ");
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <div style={styles.fullPage}>
      <div style={styles.formContainer}>
        <h1 style={styles.heading}> Get in Touch </h1>
        <p style={styles.subtitle}>We'd love to hear from you! Drop us a message and we'll reply with a warm smile 😊</p>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Your Name 💕"
            value={formData.name}
            onChange={handleChange}
            style={styles.inputField}
            onFocus={(e) => Object.assign(e.target.style, styles.inputFocus)}
            onBlur={(e) => (e.target.style.boxShadow = "none")}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Your Email 📧"
            value={formData.email}
            onChange={handleChange}
            style={styles.inputField}
            onFocus={(e) => Object.assign(e.target.style, styles.inputFocus)}
            onBlur={(e) => (e.target.style.boxShadow = "none")}
            required
          />
          <textarea
            name="message"
            placeholder="Your Message ✍️"
            value={formData.message}
            onChange={handleChange}
            style={styles.textArea}
            onFocus={(e) => Object.assign(e.target.style, styles.inputFocus)}
            onBlur={(e) => (e.target.style.boxShadow = "none")}
            required
          />
          <button
            type="submit"
            style={styles.button}
            onMouseOver={(e) => Object.assign(e.currentTarget.style, styles.buttonHover)}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = styles.button.backgroundColor ?? "#C3AED6"; // Light purple fallback
              e.currentTarget.style.transform = "scale(1)";
            }}
          >
            Send it
          </button>
        </form>
      </div>
    </div>
  );
};

export default Contact;
