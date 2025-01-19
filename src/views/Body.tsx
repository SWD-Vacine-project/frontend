import React from 'react';
import ImageSlider from '../components/body/bodySlider';

const Body: React.FC = () => {
  return (
    <main style={styles.bodyContainer}>
        {/* Image Slider Section */}
      <section style={styles.sliderSection}>
        <ImageSlider />
      </section>
      <section style={styles.section}>
        <h1 style={styles.heading}>Vaccines and immunization</h1>
        <p style={styles.paragraph}>
        Immunization is a global health success story, saving millions of lives every year. Vaccines reduce risks of getting a disease by working with your body’s natural defenses to build protection. When you get a vaccine, your immune system responds.

We now have vaccines to prevent more than 20 life-threatening diseases, helping people of all ages live longer, healthier lives. Immunization currently prevents 3.5 million to 5 million deaths every year from diseases like diphtheria, tetanus, pertussis, influenza and measles.

Immunization is key to primary health care, an indisputable human right, and one of the best health investments money can buy. Vaccines are also critical to the prevention and control of infectious disease outbreaks. They underpin global health security and are a vital tool in the battle against antimicrobial resistance.

The COVID-19 pandemic strained health systems, resulting in dramatic setbacks.  The most recent data for diphtheria-pertussis-tetanus (DTP) immunization coverage underscores the need for ongoing catch-up, recovery and system-strengthening.

Measles, because of its high transmissibility, acts as a “canary in the coalmine”, quickly exposing immunity. In 2023, the routine first dose of measles vaccine was missed by 22 million children – far from the 2019 level of 19.3 million children.
        </p>
      </section>
      <section style={styles.featureSection}>
        <div style={styles.featureCard}>
          <h2 style={styles.featureTitle}>Feature 1</h2>
          <p style={styles.featureDescription}>
            Explore this amazing feature that simplifies your work.
          </p>
        </div>
        <div style={styles.featureCard}>
          <h2 style={styles.featureTitle}>Feature 2</h2>
          <p style={styles.featureDescription}>
            Learn about our latest advancements and tools.
          </p>
        </div>
        <div style={styles.featureCard}>
          <h2 style={styles.featureTitle}>Feature 3</h2>
          <p style={styles.featureDescription}>
            Get in touch with our support for any assistance.
          </p>
        </div>
      </section>
    </main>
  );
};

const styles = {
    bodyContainer: {
        padding: '20px',
        paddingTop: '150px', 
        maxWidth: '1200px',
        margin: '0 auto',
      } as React.CSSProperties,
      sliderSection: {
        marginBottom: '40px',
        textAlign: 'center',
      } as React.CSSProperties,
  section: {
    marginBottom: '40px',
    textAlign: 'center',
  } as React.CSSProperties,
  heading: {
    fontSize: '32px',
    fontWeight: 'bold',
    color: '#D8BFD8',
    marginBottom: '20px',
  } as React.CSSProperties,
  paragraph: {
    fontSize: '18px',
    lineHeight: '1.6',
    color: '#555',
  } as React.CSSProperties,
  featureSection: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '20px',
    flexWrap: 'wrap',
  } as React.CSSProperties,
  featureCard: {
    flex: '1 1 calc(33.333% - 20px)',
    backgroundColor: '#f9f9f9',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
  } as React.CSSProperties,
  featureTitle: {
    fontSize: '20px',
    fontWeight: 'bold',
    marginBottom: '10px',
  } as React.CSSProperties,
  featureDescription: {
    fontSize: '16px',
    color: '#666',
  } as React.CSSProperties,
};

export default Body;
