import React from "react";
import Chatbot from '../Chatbot/Chat';
const Footer: React.FC = () => {
  return (
    <footer style={styles.footer}>
      <div style={styles.container}>
        {/* Regions Section */}
        <div style={styles.section}>
          <h4 style={styles.heading}>Regions</h4>
          <ul style={styles.list}>
            <li>Africa</li>
            <li>Americas</li>
            <li>Eastern Mediterranean</li>
            <li>Europe</li>
            <li>South-East Asia</li>
            <li>Western Pacific</li>
          </ul>
        </div>
        {/* Policies Section */}
        <div style={styles.section}>
          <h4 style={styles.heading}>Policies</h4>
          <ul style={styles.list}>
            <li>Cybersecurity</li>
            <li>Ethics</li>
            <li>Information disclosure</li>
            <li>Permissions & licensing</li>
            <li>Terms of use</li>
          </ul>
        </div>
        {/* About Us Section */}
        <div style={styles.section}>
          <h4 style={styles.heading}>About us</h4>
          <ul style={styles.list}>
            <li>Careers</li>
            <li>FAQs</li>
            <li>Library</li>
            <li>Newsletters</li>
          </ul>
        </div>
        {/* Contact Us Section */}
        <div style={styles.section}>
          <h4 style={styles.heading}>Contact us</h4>
          <button style={styles.button}>Report issue</button>
        </div>
      </div>
      {/* Bottom Section */}
      <div style={styles.bottom}>
        <p>&copy; 2025 YourCompany. All Rights Reserved.</p>
      </div>
     

    </footer>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  footer: {
    backgroundColor: "#D8BFD8",
    color: "#333",
    padding: "20px 15px",
    textAlign: "center",
    fontSize: "14px",
  },
  container: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
    gap: "15px",
    maxWidth: "900px",
    margin: "0 auto",
    textAlign: "left",
  },
  section: {
    padding: "5px",
  },
  heading: {
    fontSize: "16px",
    fontWeight: "bold",
    marginBottom: "8px",
  },
  list: {
    listStyleType: "none",
    padding: 0,
    margin: 0,
    fontSize: "13px",
    lineHeight: 1.5,
  },
  button: {
    backgroundColor: "#fff",
    color: "#D8BFD8",
    border: "1px solid #D8BFD8",
    borderRadius: "20px",
    padding: "8px 12px",
    cursor: "pointer",
    transition: "all 0.3s ease-in-out",
    fontSize: "12px",
  },
  bottom: {
    marginTop: "20px",
    borderTop: "1px solid #999",
    paddingTop: "8px",
    fontSize: "12px",
  },
};

export default Footer;