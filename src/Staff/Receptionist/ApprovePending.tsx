import { useState, useEffect } from "react";
import { BeatLoader } from "react-spinners";
import { FiRefreshCw, FiCheckCircle, FiAlertCircle, FiCalendar, FiFileText, FiUser } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { FaUserCircle, FaSignOutAlt } from "react-icons/fa";

interface Appointment {
  appointmentId: number;
  customerId: number;
  childId: number;
  vaccineType: string;
  vaccineId: number;
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

const ApprovePendingPage = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  
  // State for modal and batch data
  const [modalOpen, setModalOpen] = useState(false);
  const [batchData, setBatchData] = useState<any>(null);
  const [isLoadingBatch, setIsLoadingBatch] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

  useEffect(() => {
    fetchPendingAppointments();
  }, []);

  useEffect(() => {
    const storedUser = sessionStorage.getItem("user");
    if (!storedUser) {
      navigate("/signIn");
      return;
    }
    try {
      const parsedUser: User = JSON.parse(storedUser);
      if (parsedUser.role !== "Staff") {
        navigate("/signIn");
      } else {
        setUser(parsedUser);
      }
    } catch (error) {
      console.error("Error parsing user data:", error);
      sessionStorage.removeItem("user");
      navigate("/signIn");
    }
  }, [navigate]);

  const fetchPendingAppointments = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        "https://vaccine-system1.azurewebsites.net/Appointment/get-appointment-pending"
      );
      if (!response.ok) throw new Error("Failed to load pending appointments");
      const data = await response.json();
      setAppointments(data);
    } catch (err) {
      setError("Could not load pending appointments");
    } finally {
      setIsLoading(false);
    }
  };

  // When clicking Confirm, open the modal (centered) and call API to get batch data
  const handleConfirmClick = async (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setModalOpen(true);
    setIsLoadingBatch(true);
    try {
      const url = `https://vaccine-system1.azurewebsites.net/VaccineBatch/get-batch-by-vaccineID/${appointment.vaccineId}/${appointment.appointmentDate}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to load vaccine batch data");
      const data = await response.json();
      setBatchData(data);
    } catch (err) {
      setBatchData(null);
    } finally {
      setIsLoadingBatch(false);
    }
  };

  // Approve the appointment
  const handleApproval = async (id: number, batchNumber: number) => {
    try {
      const response = await fetch(
        `https://vaccine-system1.azurewebsites.net/Appointment/Approved-status-appointment/${id}/${batchNumber}`,
        { method: "PUT" }
      );
      if (!response.ok) throw new Error("Failed to approve appointment");
      setAppointments(appointments.filter((apt) => apt.appointmentId !== id));
      setModalOpen(false);
    } catch (err) {
      setError("Approval failed. Please try again.");
    }
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setBatchData(null);
    setSelectedAppointment(null);
  };

  const GlassNavbar = () => (
    <motion.nav style={styles.glassNavbar} initial={{ y: -50 }} animate={{ y: 0 }}>
      <div style={{ display: "flex", gap: "20px" }}>
        <motion.button whileHover={{ scale: 1.05 }} style={styles.navButton} onClick={() => navigate("/checkIn")}>
          🔖 Check-in
        </motion.button>
        <motion.button whileHover={{ scale: 1.05 }} style={styles.navButton} onClick={() => navigate("/accept-appointments")}>
          ✅ Appointments
        </motion.button>
      </div>
      <div style={{ position: "relative" }}>
        <motion.div style={styles.avatarContainer} whileHover={{ scale: 1.05 }} onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {user?.name ? (
            <div style={styles.avatarText}>{user.name.charAt(0).toUpperCase()}</div>
          ) : (
            <FaUserCircle size={32} />
          )}
        </motion.div>
        <AnimatePresence>{isMenuOpen && <UserMenu />}</AnimatePresence>
      </div>
    </motion.nav>
  );

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
          <p style={{ margin: 0, fontSize: "0.8em", color: "#666" }}>{user?.email}</p>
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

  const handleLogout = () => {
    sessionStorage.removeItem("user");
    navigate("/signIn");
  };

  const StatusPill = ({ status }: { status: string }) => {
    const colorMap: Record<string, string> = {
      pending: "#ffd70033",
      completed: "#00ff0033",
      late: "#ff634733",
      approved: "#2ecc7133",
    };
    const normalizedStatus = status.toLowerCase().trim();
    return (
      <div
        style={{
          ...styles.statusPill,
          background: colorMap[normalizedStatus] || "#e0e0e0",
          textTransform: "capitalize",
        }}
      >
        {normalizedStatus}
      </div>
    );
  };

  return (
    <div style={styles.container}>
      <GlassNavbar />
      <motion.h1 initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} style={styles.header}>
        🚀 Pending Approvals
      </motion.h1>
      <AnimatePresence>
        {error && (
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }} style={styles.error}>
            <FiAlertCircle /> {error}
          </motion.div>
        )}
      </AnimatePresence>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        style={styles.refreshButton}
        onClick={fetchPendingAppointments}
        disabled={isLoading}
      >
        <FiRefreshCw
          size={20}
          style={{ transform: isLoading ? "rotate(360deg)" : "none", transition: "transform 0.6s linear" }}
        />
        {isLoading ? "Updating..." : "Refresh List"}
      </motion.button>
      {isLoading ? (
        <div style={styles.skeletonGrid}>
          {[...Array(5)].map((_, i) => (
            <motion.div key={i} initial={{ opacity: 0.5 }} animate={{ opacity: 1 }} transition={{ repeat: Infinity, duration: 1.5 }} style={styles.skeletonCard} />
          ))}
        </div>
      ) : (
        <div style={styles.cardContainer}>
          {appointments.map((apt) => (
            <motion.div key={apt.appointmentId} style={styles.card} whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 300 }}>
              <div style={styles.cardHeader}>
                <span style={styles.vaccineTag}>💉 {apt.vaccineType?.trim() || "Unknown Vaccine"}</span>
                <span style={styles.appointmentId}>ID: {apt.appointmentId}</span>
                <StatusPill status={apt.status} />
              </div>
              <div style={styles.cardBody}>
                <div style={styles.infoGroup}>
                  <div style={styles.infoItem}>
                    <FiCalendar size={18} />
                    <span style={styles.infoText}>{format(new Date(apt.appointmentDate), "dd/MM/yyyy HH:mm")}</span>
                  </div>
                  <div style={styles.infoItem}>
                    <span style={styles.infoText}>Customer ID: {apt.customerId}</span>
                  </div>
                  <div style={styles.infoItem}>
                    <span style={styles.infoText}>Child ID: {apt.childId}</span>
                  </div>
                  <div style={styles.infoItem}>
                    <FiFileText size={18} />
                    <span style={styles.infoText}>{apt.notes?.trim() || "No additional notes"}</span>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  style={styles.checkInButton}
                  onClick={() => handleConfirmClick(apt)}
                >
                  <FiCheckCircle size={18} />
                  <span>Confirm</span>
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
      {/* Modal with dark overlay and centered modal */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={styles.modalOverlay}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
              style={styles.modalContent}
            >
              <div style={styles.modalHeaderContainer}>
                <h2 style={styles.modalHeader}>Vaccine Batch Information</h2>
                <button style={styles.modalCloseButton} onClick={handleModalClose}>
                  &times;
                </button>
              </div>
              <div style={styles.modalBody}>
                {isLoadingBatch ? (
                  <div style={styles.loaderContainer}>
                    <BeatLoader color="#4a3aff" />
                  </div>
                ) : batchData && batchData.length > 0 ? (
                  <div style={styles.detailsContainer}>
                    {batchData.map((batch: any, index: number) => (
                      <div key={index} style={styles.detailCard}>
                        <div style={styles.detailRow}>
                          <span style={styles.detailLabel}>Batch Number:</span>
                          <span style={styles.detailValue}>{batch.batchNumber}</span>
                        </div>
                        <div style={styles.detailRow}>
                          <span style={styles.detailLabel}>Vaccine Name:</span>
                          <span style={styles.detailValue}>{batch.vaccineName}</span>
                        </div>
                        <div style={styles.detailRow}>
                          <span style={styles.detailLabel}>Description:</span>
                          <span style={styles.detailValue}>{batch.description}</span>
                        </div>
                        <div style={styles.detailRow}>
                          <span style={styles.detailLabel}>Price:</span>
                          <span style={styles.detailValue}>{batch.price}</span>
                        </div>
                        <div style={styles.detailRow}>
                          <span style={styles.detailLabel}>Quantity:</span>
                          <span style={styles.detailValue}>{batch.quantity}</span>
                        </div>
                        <div style={styles.detailRow}>
                          <span style={styles.detailLabel}>Pre-order Quantity:</span>
                          <span style={styles.detailValue}>{batch.preOrderQuantity}</span>
                        </div>
                        <div style={styles.detailRow}>
                          <span style={styles.detailLabel}>Expiry Date:</span>
                          <span style={styles.detailValue}>{batch.expiryDate}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p style={styles.modalText}>No data available.</p>
                )}
              </div>
              <div style={styles.modalActions}>
                <button style={styles.cancelButton} onClick={handleModalClose}>
                  Cancel
                </button>
                {selectedAppointment && batchData && batchData.length > 0 && (
                  <button
                    style={styles.approveButton}
                    onClick={() =>
                      handleApproval(selectedAppointment.appointmentId, batchData[0].batchNumber)
                    }
                  >
                    Approve
                  </button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
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
    minHeight: "200px",
  },
  vaccineTag: {
    background: "linear-gradient(135deg, #4a3aff, #6c5ce7)",
    color: "white",
    padding: "8px 15px",
    borderRadius: "10px",
    fontWeight: "600",
    maxWidth: "200px",
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
  error: {
    color: "#ff4757",
    padding: "10px",
    backgroundColor: "#ffecee",
    borderRadius: "8px",
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
  },
  infoText: {
    flex: 1,
    lineHeight: 1.4,
  },
  navButton: {
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
  appointmentId: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#4a3aff",
    background: "#f0f0ff",
    padding: "6px 10px",
    borderRadius: "8px",
  },
  avatarContainer: {
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
  avatarText: {
    fontSize: "20px",
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
  // Modal overlay darkens the background
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.7)",
    zIndex: 200,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
  },
  modalContent: {
    background: "#fff",
    borderRadius: "12px",
    width: "90%",
    maxWidth: "600px",
    padding: "30px",
    boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
  },
  modalHeaderContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottom: "1px solid #ddd",
    paddingBottom: "15px",
    marginBottom: "20px",
  },
  modalHeader: {
    margin: 0,
    fontSize: "24px",
    color: "#4a3aff",
  },
  modalCloseButton: {
    background: "transparent",
    border: "none",
    fontSize: "28px",
    lineHeight: "1",
    cursor: "pointer",
    color: "#999",
  },
  modalBody: {
    marginBottom: "20px",
  },
  loaderContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100px",
  },
  detailsContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  detailCard: {
    background: "#f9f9f9",
    padding: "15px",
    borderRadius: "8px",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
  },
  detailRow: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "8px",
  },
  detailLabel: {
    fontWeight: "bold",
    color: "#555",
  },
  detailValue: {
    color: "#333",
  },
  modalText: {
    fontSize: "16px",
    color: "#555",
    textAlign: "center",
  },
  modalActions: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "15px",
  },
  cancelButton: {
    backgroundColor: "#ccc",
    color: "#333",
    border: "none",
    padding: "10px 20px",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "16px",
    transition: "background 0.3s",
  },
  approveButton: {
    backgroundColor: "#4a3aff",
    color: "#fff",
    border: "none",
    padding: "10px 20px",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "16px",
    transition: "background 0.3s",
  },
};

export default ApprovePendingPage;
