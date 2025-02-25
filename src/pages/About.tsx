import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import doctor1 from '../components/images/doctor1.png';
import doctor2 from '../components/images/doctor2.png';
import { FaShieldVirus, FaUserMd, FaSyringe } from "react-icons/fa";
import { useEffect, useState } from "react";
import LoadingAnimation from "../animation/loading-animation";
import { useLocation } from "react-router-dom";

const styles = { 
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    minHeight: '90vh',
    width: '150vh',
    background: 'linear-gradient(to right, #d3aef2, #b084d3)',
    padding: '20px',
  } as React.CSSProperties,
  
  mainCard: {
    backgroundColor: '#ffffff',
    boxShadow: '0px 10px 20px rgba(0, 0, 0, 0.2)',
    borderRadius: '15px',
    padding: '40px',
    maxWidth: '900px',
    textAlign: 'center',
  } as React.CSSProperties,
  
  sectionCard: {
    padding: '20px',
    borderRadius: '15px',
    boxShadow: '0px 8px 20px rgba(0, 0, 0, 0.15)',
    marginBottom: '20px',
    transition: 'all 0.3s ease',
  } as React.CSSProperties,
  
  subtitle: {
    fontSize: '22px',
    fontWeight: 'bold',
    color: '#444',
    marginTop: '20px',
  } as React.CSSProperties,
  
  description: {
    fontSize: '16px',
    color: '#555',
    lineHeight: '1.6',
    marginBottom: '15px',
    whiteSpace: 'pre-line'
  } as React.CSSProperties,
  
  button: {
    background: '#4facfe',
    color: '#fff',
    padding: '12px 24px',
    fontSize: '16px',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    transition: 'background 0.3s ease',
  } as React.CSSProperties,
  
  interactiveCards: {
    display: 'flex',
    justifyContent: 'center',
    gap: '20px',
    marginTop: '30px',
  } as React.CSSProperties,
  
  card: {
    padding: '20px',
    borderRadius: '15px',
    boxShadow: '0px 5px 15px rgba(0, 0, 0, 0.2)',
    textAlign: 'center',
    background: '#ffffff',
    cursor: 'pointer',
    transition: 'transform 0.3s ease, background 0.3s ease',
    width: '200px',
  } as React.CSSProperties,
  teamContainer: {
    display: 'flex',
    justifyContent: 'center',
    gap: '20px',
    marginTop: '20px',
  } as React.CSSProperties,

  teamMember: {
    textAlign: 'center',
    maxWidth: '150px',
  } as React.CSSProperties,

  teamImage: {
    width: '100px',
    height: '100px',
    borderRadius: '50%',
    objectFit: 'cover',
  } as React.CSSProperties,

  teamName: {
    fontWeight: 'bold',
    marginTop: '10px',
  } as React.CSSProperties,

  teamRole: {
    color: '#666',
    fontSize: '14px',
  } as React.CSSProperties,
};

const sections = [
  {
    title: "About Our Vaccine Platform",
    content: "Our platform provides accurate and up-to-date vaccine information, helping people make informed health decisions.",
    color: "#D4A5A5"
  },
  {
    title: "Our Mission",
    content: "We aim to increase vaccine awareness, provide easy access to vaccination schedules, and help individuals find nearby vaccination centers.",
    color: "#C3AED6"
  },
  {
    title: "Vaccine Awareness & Safety",
    content: "Vaccines are safe and effective. They help prevent serious illnesses and protect communities from outbreaks.",
    color: "#FFC8A2",
    icon: <FaShieldVirus size={30} color="#fff" />
  },
  {
    title: "Meet Our Medical Experts",
    content: "",
    color: "#A3C4BC",
    extraContent: (
      <div style={styles.teamContainer}>
        <div style={styles.teamMember}>
          <img src={doctor1} alt="Dr. John Doe" style={styles.teamImage} />
          <p style={styles.teamName}>Dr. John Doe</p>
          <p style={styles.teamRole}>Immunologist</p>
        </div>
        <div style={styles.teamMember}>
          <img src={doctor2} alt="Dr. Jane Smith" style={styles.teamImage} />
          <p style={styles.teamName}>Dr. Jane Smith</p>
          <p style={styles.teamRole}>Pediatrician</p>
        </div>
      </div>
    )
  },
  {
    title: "Frequently Asked Questions",
    content: "💉 Are vaccines safe? Yes! Vaccines go through rigorous testing before approval.\n📅 Where can I find my vaccination schedule? Check our database.\n📍 Where can I get vaccinated? Use our location tool.",
    color: "#FFD6A5"
  },
  {
    title: "Get in Touch",
    content: "📧 Email: support@vaccineplatform.com\n📞 Hotline: 1800-VACCINE",
    color: "#FFB6C1",
    icon: <FaSyringe size={30} color="#fff" />
  }
];

const About: React.FC = () => {
 const location = useLocation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);



  useEffect(() => {
    if (location.pathname === "/" || location.pathname === "/vaccine") {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
      }, 2000);
    }
  }, [location.pathname]); 

  // Function to handle navigation with loading effect
  const handleNavigation = (path: string) => {
    setIsLoading(true);
    setTimeout(() => {
      navigate(path);
      setIsLoading(false);
    }, 2000);
  };


  return (
    <div style={styles.container}>
      <motion.div 
        style={styles.mainCard}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
      >
        {sections.map((section, index) => (
          <motion.div 
            key={index} 
            style={{ ...styles.sectionCard, background: section.color }}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.2 }}
          >
            <h3 style={styles.subtitle}>{section.title}</h3>
            <p style={styles.description}>{section.content}</p>
            {section.extraContent}
          </motion.div>
        ))}
        
        <div style={styles.interactiveCards}>
          {isLoading ? (
            <LoadingAnimation /> // ✅ Show animation before navigating
          ) : (
            <>
              <motion.div 
                style={styles.card} 
                whileHover={{ scale: 1.1 }} 
                onClick={() => handleNavigation("/")}
              >
                <h4>Home Page</h4>
              </motion.div>
              <motion.div 
                style={styles.card} 
                whileHover={{ scale: 1.1 }} 
                onClick={() => handleNavigation("/vaccine")}
              >
                <h4>Get Vaccine</h4>
              </motion.div>
              <motion.div 
                style={styles.card} 
                whileHover={{ scale: 1.1 }} 
                onClick={() => handleNavigation("/contact")}
              >
                <h4>Contact Us</h4>
              </motion.div>
              <motion.div 
                style={styles.card} 
                whileHover={{ scale: 1.1 }} 
                onClick={() => handleNavigation("/services")}
              >
                <h4>Our Services</h4>
              </motion.div>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default About;
