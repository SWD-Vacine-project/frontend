import { useState, useEffect } from "react";
import { BeatLoader } from "react-spinners";
import { FiRefreshCw, FiCheckCircle, FiAlertCircle } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { useSwipeable } from "react-swipeable";
import { FiCalendar, FiFileText } from "react-icons/fi";
import { format } from 'date-fns';
import { FaUserCircle, FaSignOutAlt } from "react-icons/fa";
import { FiSettings, FiUser } from "react-icons/fi";
import { User } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Appointment {
  appointmentId: number;
  vaccineType: string;
  appointmentDate: string;
  status: string;
  notes: string;
}
interface User {
  customerId: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  role: string;

}

const AdminCheckinPage = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        "https://vaccine-system-hxczh3e5apdjdbfe.southeastasia-01.azurewebsites.net/Appointment/get-appointment-checkin"
      );
      if (!response.ok) throw new Error("Lỗi tải dữ liệu");
      const data = await response.json();
      setAppointments(data);
    } catch (err) {
      setError("Không thể tải danh sách lịch hẹn");
    } finally {
      setIsLoading(false);
    }
  };

  const handlers = useSwipeable({
    onSwipedLeft: () => setSwiped(true),
    onSwipedRight: () => setSwiped(false),
    trackMouse: true
  });

  const [swiped, setSwiped] = useState(false);
  const [checkedInIds, setCheckedInIds] = useState<number[]>([]);

  const handleCheckIn = async (id: number) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      setCheckedInIds([...checkedInIds, id]);
    } catch (err) {
      setError("Check-in failed. Please try again.");
    }
  };


  const StatusPill = ({ status }: { status: string }) => {
    const colorMap: Record<string, string> = {
      pending: '#ffd70033',
      completed: '#00ff0033',
      late: '#ff634733',
      approved: '#2ecc7133',
    };
  
    const normalizedStatus = status.toLowerCase().trim();
  
    return (
      <div style={{
        ...styles.statusPill,
        background: colorMap[normalizedStatus] || "#e0e0e0",
        textTransform: 'capitalize'
      }}>
        {normalizedStatus}
      </div>
    );
  };


  const UserMenu = () => (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      style={styles.userMenu}
    >
      <div style={styles.menuHeader}>
        <FaUserCircle size={32} />
        <div>
          <h4 style={{ margin: 0 }}>{user?.name || "Receptionist"}</h4>
          <p style={{ margin: 0, fontSize: "0.8em", color: "#666" }}>
            {user?.email}
          </p>
        </div>
      </div>
      
      <div style={styles.menuItem} onClick={() => navigate("/profile")}>
        <FiUser size={18} />
        <span>Profile</span>
      </div>
      
      <div style={styles.menuItem} onClick={handleLogout}>
        <FaSignOutAlt size={18} />
        <span>Logout</span>
      </div>
    </motion.div>
  );
  const GlassNavbar = () => (
    <motion.nav 
      style={styles.glassNavbar}
      initial={{ y: -50 }}
      animate={{ y: 0 }}
    >
      <div style={{ display: "flex", gap: "20px" }}>
        <motion.button
          whileHover={{ scale: 1.05 }}
          style={styles.navButton}
          onClick={() => navigate("/checkIn")}
        >
          🔖 Check-in
        </motion.button>
        
        <motion.button 
          whileHover={{ scale: 1.05 }}
          style={styles.navButton}
          onClick={() => navigate("/accept-appointments")}
        >
          ✅ Appointments
        </motion.button>
      </div>
  
      <div style={{ position: "relative" }}>
        <motion.div
          style={styles.avatarContainer}
          whileHover={{ scale: 1.05 }}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {user?.name ? (
            <div style={styles.avatarText}>
              {user.name.charAt(0).toUpperCase()}
            </div>
          ) : (
            <FaUserCircle size={32} />
          )}
        </motion.div>
  
        <AnimatePresence>
          {isMenuOpen && <UserMenu />}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div style={styles.container}>
      <GlassNavbar />
      
      <motion.h1 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        style={styles.header}
      >
        🚀 Vaccine Check-In Dashboard
      </motion.h1>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            style={styles.error}
          >
            <FiAlertCircle /> {error}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button 
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        style={styles.refreshButton}
        onClick={fetchAppointments}
        disabled={isLoading}
      >
        <FiRefreshCw 
          size={20} 
          style={{ 
            transform: isLoading ? "rotate(360deg)" : "none",
            transition: "transform 0.6s linear" 
          }} 
        />
        {isLoading ? "Updating..." : "Refresh List"}
      </motion.button>

      {isLoading ? (
        <div style={styles.skeletonGrid}>
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0.5 }}
              animate={{ opacity: 1 }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              style={styles.skeletonCard}
            />
          ))}
        </div>
      ) : (
        <div {...handlers} style={styles.cardContainer}>
        {appointments.map((apt) => (
          <motion.div
            key={apt.appointmentId}
            style={{
              ...styles.card,
              opacity: checkedInIds.includes(apt.appointmentId) ? 1 : 1 // ✅ Checked-in: 1, chưa check-in: 0.8
            }}
          
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div style={styles.cardHeader}>
            <span style={styles.vaccineTag}>
  💉 {apt.vaccineType?.trim() || 'Unknown Vaccine'}
</span>
<span style={styles.appointmentId}>ID: {apt.appointmentId}</span>
              <StatusPill status={apt.status} />
            </div>

            <div style={styles.cardBody}>
              <div style={styles.infoGroup}>
                <div style={styles.infoItem}>
                  <FiCalendar size={18} />
                  <span style={styles.infoText}>
                  {format(new Date(apt.appointmentDate), "dd MMM yyyy, HH:mm")}
                  </span>
                </div>
       
                <div style={styles.infoItem}>
                  <FiFileText size={18} />
                  <span style={styles.infoText}>
                    {apt.notes?.trim() || "No additional notes"}
                  </span>
                </div>
              </div>

              {!checkedInIds.includes(apt.appointmentId) ? (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  style={styles.checkInButton}
                  onClick={() => handleCheckIn(apt.appointmentId)}
                >
                  <FiCheckCircle size={18} />
                  <span>Confirm</span>
                </motion.button>
              ) : (
                <div style={styles.confirmedBadge}>
                  <FiCheckCircle size={18} />
                  <span>Checked</span>
                </div>
              )}
            </div>
          </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};





const styles: { [key: string]: React.CSSProperties } = {
  container: {
    maxWidth: "1200px",
    margin: "20px auto",
    padding: "40px",
    background: "rgba(248, 247, 255, 0.95)",
    backdropFilter: "blur(10px)",
    borderRadius: "25px",
    boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
    fontFamily: "'Inter', sans-serif",
  },
  glassNavbar: {
    display: "flex",
    justifyContent: "center",
    gap: "30px",
    padding: "20px",
    background: "rgba(74, 58, 255, 0.85)",
    backdropFilter: "blur(10px)",
    borderRadius: "15px",
    marginBottom: "40px",
    boxShadow: "0 4px 30px rgba(0,0,0,0.1)",
  },
  cardContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
    gap: "25px",
    marginTop: "30px",
  },
  card: {
    background: "white",
    borderRadius: "16px",
    padding: "20px",
    boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    minHeight: "200px" // Thêm chiều cao tối thiểu
  },
  vaccineTag: {
    background: "linear-gradient(135deg, #4a3aff, #6c5ce7)",
    color: "white",
    padding: "8px 15px",
    borderRadius: "10px",
    fontWeight: "600",
    maxWidth: "200px" // Giới hạn chiều rộng
  },
  cardBody: {
    display: "flex",
    alignItems: "flex-start",
    gap: "20px",
    width: "100%",
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },

  statusPill: {
    padding: "6px 12px",
    borderRadius: "20px",
    fontSize: "14px",
    fontWeight: "600",
  },
  checkInButton: {
    background: "linear-gradient(135deg, #4a3aff, #6c5ce7)",
    color: "white",
    border: "none",
    padding: "10px 18px",
    borderRadius: "10px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "14px",
    fontWeight: 500,
    transition: "all 0.2s ease",
    flexShrink: 0,
  },

  confirmedBadge: {
    background: "#e8f5e9",
    color: "#2ecc71",
    padding: "10px 16px",
    borderRadius: "10px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "14px",
    fontWeight: 500,
    flexShrink: 0,
  },

  skeletonGrid: {
    display: "grid",
    gap: "20px",
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
  },
  skeletonCard: {
    background: "rgba(0,0,0,0.05)",
    borderRadius: "20px",
    height: "200px",
  },
  header: {
    color: "#4a3aff",
    fontSize: "2.5rem",
    fontWeight: "700",
    marginBottom: "20px",
  },
  navbar: {
    display: "flex",
    justifyContent: "center",
    gap: "20px",
    padding: "15px 0",
    backgroundColor: "#4a3aff",
    borderRadius: "12px",
  },
  navLink: {
    color: "white",
    fontSize: "18px",
    fontWeight: "600",
    textDecoration: "none",
    padding: "12px 24px",
    borderRadius: "8px",
    transition: "background 0.3s",
  },
  tableContainer: {
    marginTop: "20px",
    overflowX: "auto",
  },
  table: {
    width: "100%",
    borderCollapse: "separate",
    borderSpacing: "0 10px",
    backgroundColor: "white",
    borderRadius: "10px",
    overflow: "hidden",
    textAlign: "left",
  },
  tableRow: {
    fontSize: "18px",
    height: "50px",
  },
  tableCell: {
    padding: "15px",
    fontSize: "18px",
  },
  error: {
    color: "#ff4757",
    padding: "10px",
    backgroundColor: "#ffecee",
    borderRadius: "8px",
  },
  loading: {
    display: "flex",
    justifyContent: "center",
    padding: "20px",
  },
  refreshButton: {
    backgroundColor: "#4a3aff",
    color: "white",
    padding: "12px 20px",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "18px",
    marginBottom: "20px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  updateButton: {
    backgroundColor: "#34c759",
    color: "white",
    padding: "10px 16px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "16px",
  }, // <-- Thêm dấu phẩy ở đây
  infoItem: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    fontSize: "15px",
    color: "#555",
  },
  infoGroup: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },infoText: {
    flex: 1,
    lineHeight: 1.4,
  },

  navButton: { // Đảm bảo có dấu phẩy phân cách
    background: "linear-gradient(135deg, #4a3aff, #6c5ce7)",
    color: "white",
    border: "none",
    padding: "12px 24px",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "600",
    textDecoration: "none",
  },
  appointmentId: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#4a3aff",
    background: "#f0f0ff",
    padding: "6px 10px",
    borderRadius: "8px",
  },avatarContainer: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    background: "#4a3aff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    color: "white",
    fontWeight: "bold",
  },
  userMenu: {
    position: "absolute",
    right: 0,
    top: "50px",
    background: "white",
    borderRadius: "12px",
    padding: "15px",
    boxShadow: "0 8px 30px rgba(0,0,0,0.1)",
    width: "250px",
    zIndex: 100,
  },
  menuHeader: {
    display: "flex",
    gap: "15px",
    alignItems: "center",
    paddingBottom: "15px",
    borderBottom: "1px solid #eee",
    marginBottom: "10px",
  },
  menuItem: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "10px",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "background 0.2s",
    
  },
  
};

export default AdminCheckinPage; 