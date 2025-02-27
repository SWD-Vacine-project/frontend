import React from "react";
import {
  faFacebook,
  faTiktok,
  faYoutube,
} from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

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
        <div className="footer-map">
        <h3>Bản Đồ</h3>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3918.1640561676095!2d106.79814847609639!3d10.875123789279707!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3174d8a6b19d6763%3A0x143c54525028b2e!2zTmjDoCBWxINuIGjDs2EgU2luaCB2acOqbiBUUC5IQ00!5e0!3m2!1svi!2s!4v1715862724373!5m2!1svi!2s"
              width="300"
              height="250"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
        </div>
      </div>
      {/* Bottom Section */}
      <div style={styles.footerSocial}>
              <a href="https://www.facebook.com/phuong.annh.oan" style={styles.socialIcon}>
                <FontAwesomeIcon icon={faFacebook} />
              </a>
              <a href="#" style={styles.socialIcon}>
                <FontAwesomeIcon icon={faTiktok} />
              </a>
              <a href="https://www.youtube.com/watch?v=-8ORh_DuLgE" style={styles.socialIcon}>
                <FontAwesomeIcon icon={faYoutube} />
              </a>
        </div>
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
  footerSocial: {
    marginTop: "20px",
  } as React.CSSProperties,
  socialIcon: {
    fontSize: "24px",
    marginRight: "30px",
    color: "#000",
  } as React.CSSProperties,

};

export default Footer;