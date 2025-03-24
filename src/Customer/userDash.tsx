import React, { useEffect, useState } from "react";
import ModalReview from "../pages/feedback/feedback";

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
  cardContainer: {
    backgroundColor: "#fff",
    padding: "35px",
    borderRadius: "15px",
    boxShadow: "0 6px 15px rgba(0, 0, 0, 0.1)",
    width: "100%",
    maxWidth: "450px",
    textAlign: "center",
    animation: "fadeIn 0.8s ease-in-out",
  } as React.CSSProperties,
  avatar: {
    width: "80px",
    height: "80px",
    borderRadius: "50%",
    backgroundColor: "#C3AED6", // Soft purple
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "28px",
    fontWeight: "bold",
    color: "#fff",
    margin: "0 auto 15px",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
  } as React.CSSProperties,
  heading: {
    color: "#8B008B", // Deep magenta
    fontSize: "24px",
    marginBottom: "10px",
  } as React.CSSProperties,
  subtitle: {
    color: "#555",
    fontSize: "16px",
    fontStyle: "italic",
  } as React.CSSProperties,
  userInfo: {
    marginTop: "15px",
    padding: "15px",
    backgroundColor: "#f9f9f9",
    borderRadius: "10px",
    boxShadow: "0 3px 10px rgba(0, 0, 0, 0.05)",
    textAlign: "left",
  } as React.CSSProperties,
  userInfoItem: {
    fontSize: "14px",
    color: "#555",
    marginBottom: "5px",
  } as React.CSSProperties,
};

// Inject CSS animations
const styleSheet = document.styleSheets[0];
styleSheet.insertRule(`
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(-20px); }
    to { opacity: 1; transform: translateY(0); }
  }
`, styleSheet.cssRules.length);

const UserDashboard = () => {
  const [user, setUser] = useState<{ name?: string; email?: string; joinDate?: string } | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser && Object.keys(parsedUser).length > 0) {
          setUser(parsedUser);
        }
      } catch (error) {
        console.error("Error parsing localStorage data:", error);
      }
    }
  }, []);

  const userName = user?.name || "bạn";
  const userEmail = user?.email || "Chưa có email";
  const joinDate = user?.joinDate || "Không xác định";
  const initials = userName.charAt(0).toUpperCase();

  return (
    
    <div style={styles.fullPage}>
      <ModalReview /> 
      <div style={styles.cardContainer}>
        {/* Avatar */}
        <div style={styles.avatar}>{initials}</div>

        {/* Greeting */}
        <h1 style={styles.heading}>Chào mừng <span style={{ color: "#C71585", fontWeight: "bold" }}>{userName}</span>! 🎉</h1>
        <p style={styles.subtitle}>Hãy khám phá những tính năng thú vị của trang web! 🚀</p>

        {/* User Info */}
        <div style={styles.userInfo}>
          <p style={styles.userInfoItem}><strong>📧 Email:</strong> {userEmail}</p>
          <p style={styles.userInfoItem}><strong>📅 Ngày tham gia:</strong> {joinDate}</p>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
