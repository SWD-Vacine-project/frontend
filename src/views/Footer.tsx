import React from "react";

const Footer: React.FC = () => {
  return (
    <footer style={styles.footer}>
      <div style={styles.container}>
        {/* Regions Section */}
        <div style={styles.section}>
          <h3 style={styles.heading}>Regions</h3>
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
          <h3 style={styles.heading}>Policies</h3>
          <ul style={styles.list}>
            <li>Cybersecurity</li>
            <li>Ethics</li>
            <li>Information disclosure</li>
            <li>Permissions and licensing</li>
            <li>Preventing sexual exploitation</li>
            <li>Terms of use</li>
          </ul>
        </div>
        {/* About Us Section */}
        <div style={styles.section}>
          <h3 style={styles.heading}>About us</h3>
          <ul style={styles.list}>
            <li>Careers</li>
            <li>Frequently asked questions</li>
            <li>Library</li>
            <li>Newsletters</li>
            <li>Procurement</li>
            <li>Publications</li>
          </ul>
        </div>
        {/* Contact Us Section */}
        <div style={styles.section}>
          <h3 style={styles.heading}>Contact us</h3>
          <button style={styles.button}>Report misconduct</button>
        </div>
      </div>

    
     
    </footer>
  );
};

const styles = {
  footer: {
    backgroundColor: "#D8BFD8", 
    color: "#FFFFFF",
    padding: "30px",
  },
  container: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "20px",
    marginBottom: "30px",
  },
  section: {},
  heading: {
    fontSize: "16px",
    fontWeight: "bold",
    marginBottom: "10px",
  },
  list: {
    listStyleType: "none",
    padding: 0,
    margin: 0,
  },
  button: {
    backgroundColor: "#D8BFD8",
    color: "#FFFFFF",
    border: '1px solid white',
    borderRadius: '30px',
    padding: "10px 15px",
    cursor: "pointer",
  },
  bottom: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderTop: "1px solid #1A3C71",
    paddingTop: "20px",
  },
  logoContainer: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  logo: {
    width: "50px", // Adjust as needed
    height: "50px",
  },
  logoText: {
    fontSize: "16px",
    fontWeight: "bold",
  },
  social: {
    fontSize: "14px",
  },
};

export default Footer;
