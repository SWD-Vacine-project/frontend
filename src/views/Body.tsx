import React, { useState, useRef, useEffect } from 'react';
import { useSpring, animated } from '@react-spring/web';
import Modal from '../components/Modal/VaccineModal';
import ImageSlider from '../components/body/bodySlider';




const Body: React.FC = () => {
  const [activeCard, setActiveCard] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', content: '' });
  const vaccineCardRef = useRef<HTMLDivElement>(null); 
  const heroSectionProps = useSpring({
    opacity: 1,
    from: { opacity: 0 },
    config: { tension: 200, friction: 20 },
  });

  const vaccineCardProps = useSpring({
    opacity: 1,
    transform: 'translateY(0px)',
    from: { opacity: 0, transform: 'translateY(20px)' },
    delay: 200,
    config: { tension: 180, friction: 15 },
  });



  const handleClickOutside = (event: MouseEvent) => {
    if (vaccineCardRef.current && !vaccineCardRef.current.contains(event.target as Node)) {
      setActiveCard(null); // Reset the active card when clicking outside
    }
  };


  const locationCardProps = useSpring({
    opacity: 1,
    transform: 'translateY(0px)',
    from: { opacity: 0, transform: 'translateY(20px)' },
    delay: 400,
    config: { tension: 180, friction: 15 },
  });


  const testimonialCardProps = useSpring({
    opacity: 1,
    transform: 'translateY(0px)',
    from: { opacity: 0, transform: 'translateY(20px)' },
    delay: 600,
    config: { tension: 180, friction: 15 },
  });

  const handleCardClick = (vaccine: string) => {
    console.log("Clicked on:", vaccine); // Debugging log
  
    let details = ""; 
    let imageUrl="";
  
    switch (vaccine) {
      case "Moderna":
        details = `The Moderna COVID-19 vaccine (mRNA-1273) is an mRNA vaccine developed 
                   by Moderna and approved for emergency use. It has a 94% efficacy rate 
                   in preventing COVID-19 and requires two doses, administered 28 days apart.`;
       imageUrl = "./images/moderna.png";
        break;
      case "Sinovac":
        details = `Sinovac's CoronaVac is an inactivated virus vaccine. It was developed 
                   to reduce the severity of COVID-19 cases. It has an efficacy rate 
                   varying between 50% to 83% depending on clinical trials in different regions.`;
        imageUrl = "/Users/cozy/swd-frontend/frontend/src/components/images/sinovac.png";
        break;

      case "Pfizer":
        details = `The Pfizer-BioNTech COVID-19 vaccine (BNT162b2) is an mRNA vaccine with 
                   a 90% efficacy rate. It requires two doses, given 21 days apart, 
                   and has been authorized for use in multiple countries worldwide.`;
         imageUrl = "./images/pfizer.png";
        break;
      default:
        details = "No information available.";
    }
  
    setActiveCard(vaccine);
    setIsModalOpen(true);
    setModalContent({ title: vaccine, content: details });
  };
  



  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <body style={styles.body}>
      {/* Hero Section Outside Container to Ensure Full Width */}
      <animated.section style={{ ...styles.heroSection, ...heroSectionProps }}>
        <h1 style={styles.heroTitle}>Get Vaccinated Now Easily With Vaccining</h1>
        <p style={styles.heroDescription}>
          Vaccining will help you to know your vaccine and find the nearest
          vaccination place from your house fast and easily to help you.
        </p>
        <button style={styles.heroButton}>Get Your Vaccine</button>
      </animated.section>
  
      <div style={styles.Container}>
        {/* Vaccine Variant Section */}
        <section style={styles.vaccineSection}>
          <h2 style={styles.sectionTitle}>Vaccine Variant</h2>
          <div
            style={styles.vaccineCardContainer}
            ref={vaccineCardRef} // Assign ref to the vaccine card container
          >
            {["Moderna", "Sinovac", "Pfizer"].map((vaccine) => (
              <animated.div
                key={vaccine}
                style={{
                  ...styles.vaccineCard,
                  ...vaccineCardProps,
                  backgroundColor: activeCard === vaccine ? '#e0f7fa' : '#f9f9f9',
                }}
                onClick={() => handleCardClick(vaccine)}
                onMouseEnter={(e) => (e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)')}
                onMouseLeave={(e) => (e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)')}
              >
                <h3 style={styles.vaccineTitle}>{vaccine}</h3>
                <p style={styles.vaccineDescription}>
                  {vaccine === "Moderna"
                    ? "Final trial results confirm this vaccine has a 94% efficacy, and the data has been reviewed."
                    : vaccine === "Sinovac"
                    ? "Sinovac COVID-19 vaccine is an inactivated virus vaccine developed to reduce the risk of severe disease."
                    : "Developed by the University of Oxford, Pfizer has a vaccine efficacy of up to 90%."}
                </p>
              </animated.div>
            ))}
          </div>
          <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={modalContent.title} content={modalContent.content} />
          
          <div style={{ marginTop: '40px' }}>
            <ImageSlider />
          </div>

        </section>

        {/* Recent Locations Section with Animation */}
        <section style={styles.locationsSection}>
        <h2 style={styles.sectionTitle}>Get Vaccine Location</h2>
        <div style={styles.locationCardContainer}>
          <animated.div style={{ ...styles.locationCard, ...locationCardProps }}>
            <h3 style={styles.locationName}>White Square</h3>
            <p style={styles.locationAddress}>Jalan Setiabudi Santoso</p>
            <button style={styles.locationButton}>Get Your Vaccine</button>
          </animated.div>
          <animated.div style={{ ...styles.locationCard, ...locationCardProps }}>
            <h3 style={styles.locationName}>White Town</h3>
            <p style={styles.locationAddress}>Jalan Jenderal Sudirman</p>
            <button style={styles.locationButton}>Get Your Vaccine</button>
          </animated.div>
        </div>
      </section>



      {/* Testimonials Section with Animation */}
      <section style={styles.testimonialsSection}>
        <h2 style={styles.sectionTitle}>What People Say About Us</h2>
        <animated.div style={{ ...styles.testimonialCard, ...testimonialCardProps }}>
          <p style={styles.testimonialText}>
            "I am very grateful to Vaccining. With the Vaccining application, it
            is really easier for me to find vaccination sites, and it also makes
            it easier for me."
          </p>
          <p style={styles.testimonialAuthor}>- Arya Wijaya, 25 Years Old</p>
        </animated.div>
      </section>

      


      </div>
    </body>
  );
};

const styles = {
  body: {} as React.CSSProperties,
  Container: {
    padding: '20px',
    paddingTop: '100px',
    maxWidth: '1200px',
    margin: '0 auto',
  } as React.CSSProperties,
  heroSection: {
    marginTop: '120px',
    textAlign: 'center',
    marginBottom: '40px',
    color: '#fff',
    backgroundColor: '#1a1a2e',
    padding: '40px',
    borderRadius: '10px',
  } as React.CSSProperties,
  heroTitle: {
    fontSize: '36px',
    fontWeight: 'bold',
    marginBottom: '20px',
  } as React.CSSProperties,
  heroDescription: {
    fontSize: '18px',
    marginBottom: '20px',
  } as React.CSSProperties,
  heroButton: {
    backgroundColor: '#007bff',
    color: '#fff',
    padding: '10px 20px',
    fontSize: '16px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  } as React.CSSProperties,
  vaccineSection: {
    marginTop:'-100px',
    marginBottom: '40px',
    textAlign: 'center',
  } as React.CSSProperties,
  sectionTitle: {
    fontSize: '28px',
    fontWeight: 'bold',
    marginBottom: '20px',
  } as React.CSSProperties,
  vaccineCardContainer: {
    display: 'flex',
    gap: '20px',
    justifyContent: 'center',
  } as React.CSSProperties,
  vaccineCard: {
    flex: '1',
    padding: '20px',
    backgroundColor: '#f9f9f9',
    borderRadius: '10px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  } as React.CSSProperties,
  vaccineTitle: {
    fontSize: '20px',
    fontWeight: 'bold',
    marginBottom: '10px',
  } as React.CSSProperties,
  vaccineDescription: {
    fontSize: '16px',
  } as React.CSSProperties,
  locationsSection: {
    marginBottom: '40px',
  } as React.CSSProperties,
  locationCardContainer: {
    display: 'flex',
    gap: '20px',
    justifyContent: 'center',
  } as React.CSSProperties,
  locationCard: {
    flex: '1',
    padding: '20px',
    backgroundColor: '#f9f9f9',
    borderRadius: '10px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
  } as React.CSSProperties,
  locationName: {
    fontSize: '20px',
    fontWeight: 'bold',
    marginBottom: '10px',
  } as React.CSSProperties,
  locationAddress: {
    fontSize: '16px',
    marginBottom: '10px',
  } as React.CSSProperties,
  locationButton: {
    backgroundColor: '#007bff',
    color: '#fff',
    padding: '10px 20px',
    fontSize: '16px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  } as React.CSSProperties,
  testimonialsSection: {
    textAlign: 'center',
  } as React.CSSProperties,
  testimonialCard: {
    padding: '20px',
    backgroundColor: '#f9f9f9',
    borderRadius: '10px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    maxWidth: '600px',
    margin: '0 auto',
  } as React.CSSProperties,
  testimonialText: {
    fontSize: '18px',
    marginBottom: '10px',
  } as React.CSSProperties,
  testimonialAuthor: {
    fontSize: '16px',
    fontStyle: 'italic',
  } as React.CSSProperties,
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    visibility: 'visible', // Ensures it's visible
  } as React.CSSProperties,
};

export default Body;
