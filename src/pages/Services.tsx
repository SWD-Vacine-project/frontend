import React from "react";
import { useNavigate } from "react-router-dom";

const styles = {
  fullPage: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #FFD3E0, #C3AED6)", // Soft pink & lavender
    minHeight: "100vh",
    padding: "20px",
  } as React.CSSProperties,
  container: {
    backgroundColor: "#fff",
    padding: "35px",
    borderRadius: "15px",
    boxShadow: "0 6px 15px rgba(0, 0, 0, 0.1)",
    width: "100%",
    maxWidth: "900px",
    textAlign: "center",
  } as React.CSSProperties,
  heading: {
    color: "#8B008B",
    fontSize: "28px",
    marginBottom: "10px",
  } as React.CSSProperties,
  subtitle: {
    color: "#555",
    fontSize: "16px",
    marginBottom: "20px",
    fontStyle: "italic",
  } as React.CSSProperties,
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "20px",
    marginTop: "20px",
  } as React.CSSProperties,
  card: {
    backgroundColor: "#f9f9f9",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
    transition: "transform 0.3s ease-in-out",
  } as React.CSSProperties,
  bookButton: {
    marginTop: "30px",
    background: "linear-gradient(135deg, #8B008B, #C71585)",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    padding: "12px 24px",
    fontSize: "18px",
    cursor: "pointer",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
    transition: "background 0.3s ease",
  } as React.CSSProperties,
};

const services = [
  {
    title: "Vaccine Booking",
    description: "Schedule and manage your vaccine appointments effortlessly.",
    icon: "💉",
  },
  {
    title: "Health Monitoring",
    description: "Track your health status before and after vaccination.",
    icon: "📊",
  },
  {
    title: "Consultation",
    description: "Get expert advice from certified healthcare professionals.",
    icon: "🩺",
  },
  {
    title: "Vaccination Records",
    description: "Access and manage your vaccination history securely.",
    icon: "📜",
  },
];

const Services = () => {
  const navigate = useNavigate();

  return (
    <div style={styles.fullPage}>
      <div style={styles.container}>
        <h1 style={styles.heading}>Our Services</h1>
        <p style={styles.subtitle}>
          We provide essential vaccine-related services to keep you safe and
          informed.
        </p>

        <div style={styles.grid}>
          {services.map((service, index) => (
            <div key={index} style={styles.card}>
              <div style={{ fontSize: "40px" }}>{service.icon}</div>
              <h3 style={{ fontSize: "20px", fontWeight: "bold", marginTop: "10px" }}>
                {service.title}
              </h3>
              <p style={{ color: "#555", marginTop: "8px" }}>
                {service.description}
              </p>
            </div>
          ))}
        </div>
        <button style={styles.bookButton} onClick={() => navigate("/vaccine")}>
          Book Now
        </button>
      </div>
    </div>
  );
};

export default Services;
