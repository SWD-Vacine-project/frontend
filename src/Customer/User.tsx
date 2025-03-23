import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { FaUser, FaEnvelope, FaPhone, FaMapMarker, FaSave, FaHome, FaShieldAlt } from "react-icons/fa";
import { ImSpinner8 } from "react-icons/im";
import { FaChild, FaBirthdayCake, FaVenusMars } from "react-icons/fa";



interface Child {
    childId: number;
    customerId: number;
    name: string;
    dob: string;
    gender: string;
    bloodType: string;
    appointments: any[];
    
  }
  
  interface User {
    customerId: number;
    name: string;
    email: string;
    phone: string;
    address: string;
    role: string;
    children: Child[];
  }

const UserProfile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User>({
    customerId: 0,
    name: "",
    email: "",
    phone: "",
    address: "",
    role: "",
    children: [],
  });
  
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const storedUser = sessionStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      console.log("User từ sessionStorage:", JSON.parse(storedUser));
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        "https://vaccine-system1.azurewebsites.net/Customer/update-customer/",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(user),
        }
      );

      const data = await response.json();
      if (response.ok) {
        setUser(data); // Cập nhật UI với dữ liệu mới từ server
        sessionStorage.setItem("user", JSON.stringify(data)); // Lưu lại vào sessionStorage
        toast.success("Profile updated successfully!");
      }
       else {
        toast.error(data.message || "Update failed.");
      }
    } catch (error) {
      console.error("Update error:", error);
      toast.error("Failed to connect to server.");
    } finally {
      setLoading(false);
    }
  };




  
  return (
    <motion.div 
      style={styles.container} 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      transition={{ duration: 0.5 }}
    >
      <div style={styles.wrapper}>
        <motion.button 
          onClick={() => navigate("/")} 
          style={styles.backButton}
          whileHover={{ scale: 1.1, backgroundColor: "#2563eb", color: "#fff" }}
          whileTap={{ scale: 0.9 }}
        >
          <FaHome style={styles.icon} /> Back to Home
        </motion.button>

        <div style={styles.card}>
          <div style={styles.profileContainer}>
            <div style={styles.avatar}>
              <FaUser style={styles.avatarIcon} />
            </div>
            <h1 style={styles.userName}>{user.name}</h1>
            <div style={styles.roleBadge}>
              <FaShieldAlt style={styles.roleIcon} /> {user.role}
            </div>
          </div>

          <div style={styles.form}>
            <div style={styles.formGroup}>
              <label style={styles.formLabel}>Full Name</label>
              <div style={styles.inputGroup}>
                <FaUser style={styles.inputIcon} />
                <input
                  type="text"
                  name="name"
                  value={user.name}
                  onChange={handleChange}
                  style={styles.input}
                  placeholder="John Doe"
                />
              </div>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.formLabel}>Email Address</label>
              <div style={styles.inputGroup}>
                <FaEnvelope style={styles.inputIcon} />
                <input
                  type="email"
                  name="email"
                  value={user.email}
                  readOnly
                  style={{ ...styles.input, backgroundColor: "#f3f3f3", cursor: "not-allowed" }}
                />
              </div>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.formLabel}>Phone Number</label>
              <div style={styles.inputGroup}>
                <FaPhone style={styles.inputIcon} />
                <input
                  type="tel"
                  name="phone"
                  value={user.phone}
                  onChange={handleChange}
                  style={styles.input}
                  placeholder="+1 234 567 890"
                />
              </div>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.formLabel}>Address</label>
              <div style={styles.inputGroup}>
                <FaMapMarker style={styles.inputIcon} />
                <input
                  type="text"
                  name="address"
                  value={user.address}
                  onChange={handleChange}
                  style={styles.input}
                  placeholder="123 Main Street"
                />
              </div>
            </div>

            <motion.button
  onClick={handleUpdate}
  disabled={loading}
  style={{ ...styles.updateButton, opacity: loading ? 0.6 : 1, cursor: loading ? "not-allowed" : "pointer" }}
  whileHover={!loading ? { scale: 1.05 } : {}}
  whileTap={!loading ? { scale: 0.95 } : {}}
>
  {loading ? (
    <>
      <ImSpinner8 style={styles.spinner} className="animate-spin" />
      Đang cập nhật...
    </>
  ) : (
    <>
      <FaSave style={styles.icon} />
      Cập nhật hồ sơ
    </>
  )}
</motion.button>



            {/* Hiển thị danh sách trẻ em */}
<div style={styles.childrenContainer}>
  <h3 style={styles.childrenTitle}>
    <FaChild style={{ marginRight: 8 }} /> Danh sách trẻ em ({user.children?.length || 0})
  </h3>
  {user.children && user.children.length > 0 ? (
    <div style={styles.childrenGrid}>
      {user.children.map((child) => (
        <motion.div 
          key={child.childId}
          style={styles.childCard}
          whileHover={{ y: -5 }}
          transition={{ duration: 0.2 }}
        >
          <div style={styles.childHeader}>
            <span style={styles.childName}>{child.name}</span>
            <span style={{
              ...styles.bloodType,
              backgroundColor: child.bloodType ? '#f0fdf4' : '#fef2f2',
              color: child.bloodType ? '#166534' : '#dc2626'
            }}>
              {child.bloodType || 'Chưa có'}
            </span>
          </div>
          
          <div style={styles.childDetail}>
            <FaBirthdayCake style={styles.childIcon} />
            <span>
              {new Date(child.dob).toLocaleDateString('vi-VN', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
              })}
            </span>
          </div>
          
          <div style={styles.childDetail}>
            <FaVenusMars style={styles.childIcon} />
            <span style={{
              color: child.gender === 'M' ? '#2563eb' : '#db2777',
              fontWeight: 500
            }}>
              {child.gender === 'M' ? 'Nam' : 'Nữ'}
            </span>
          </div>

          {child.appointments?.length > 0 && (
            <div style={styles.appointmentBadge}>
              {child.appointments.length} lịch hẹn
            </div>
          )}
        </motion.div>
      ))}
    </div>
  ) : (
    <div style={styles.emptyState}>
      <FaChild style={styles.emptyIcon} />
      <p style={styles.emptyText}>Chưa có thông tin trẻ em nào được đăng ký</p>
    </div>
  )}
</div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const styles = {
  container: {
    minHeight: "100vh",
    background: "linear-gradient(to bottom right, #ebf4ff, #f3e8ff)",
    padding: "20px",
  } as React.CSSProperties,
  wrapper: {
    maxWidth: "600px",
    margin: "0 auto",
  }as React.CSSProperties,
  backButton: {
    display: "flex",
    alignItems: "center",
    color: "#2563eb",
    fontWeight: "600",
    marginBottom: "20px",
    cursor: "pointer",
    background: "#fff",
    border: "1px solid #2563eb",
    borderRadius: "8px",
    padding: "10px 15px",
    fontSize: "16px",
    transition: "all 0.3s ease",
  }as React.CSSProperties,
  icon: {
    marginRight: "8px",
  }as React.CSSProperties,
  card: {
    background: "#fff",
    borderRadius: "15px",
    boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
    padding: "20px",
  }as React.CSSProperties,
  profileContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginBottom: "20px",
  }as React.CSSProperties,
  avatar: {
    width: "80px",
    height: "80px",
    borderRadius: "50%",
    backgroundColor: "#2563eb",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: "10px",
  }as React.CSSProperties,
  avatarIcon: {
    color: "#fff",
    fontSize: "40px",
  }as React.CSSProperties,
  userName: {
    fontSize: "22px",
    fontWeight: "bold",
    color: "#333",
  }as React.CSSProperties,
  roleBadge: {
    display: "flex",
    alignItems: "center",
    backgroundColor: "#2563eb",
    color: "#fff",
    padding: "5px 10px",
    borderRadius: "5px",
    fontSize: "14px",
    marginTop: "5px",
  }as React.CSSProperties,
  roleIcon: {
    marginRight: "5px",
  }as React.CSSProperties,
  form: {
    marginTop: "20px",
  }as React.CSSProperties,
  formGroup: {
    marginBottom: "15px",
  }as React.CSSProperties,
  formLabel: {
    display: "block",
    fontSize: "14px",
    fontWeight: "600",
    marginBottom: "5px",
  }as React.CSSProperties,
  inputGroup: {
    display: "flex",
    alignItems: "center",
    background: "#f9fafb",
    borderRadius: "8px",
    padding: "10px",
  }as React.CSSProperties,
  inputIcon: {
    marginRight: "8px",
    color: "#6b7280",
  }as React.CSSProperties,
  input: {
    flex: 1,
    border: "none",
    outline: "none",
    background: "transparent",
    fontSize: "16px",
  }as React.CSSProperties,
  updateButton: {
    width: "100%",
    background: "linear-gradient(to right, #2563eb, #9333ea)",
    color: "#fff",
    padding: "12px",
    borderRadius: "8px",
    fontSize: "16px",
    fontWeight: "bold",
    cursor: "pointer",
  }as React.CSSProperties,
  spinner: {
    marginRight: "8px",
  }as React.CSSProperties,
  childrenContainer: {
    marginTop: "30px",
    padding: "20px",
    background: "#f8fafc",
    borderRadius: "12px",
    boxShadow: "0px 2px 8px rgba(0,0,0,0.05)",
  } as React.CSSProperties,

  childrenTitle: {
    display: "flex",
    alignItems: "center",
    fontSize: "20px",
    fontWeight: "600",
    color: "#1e293b",
    marginBottom: "20px",
    paddingBottom: "10px",
    borderBottom: "2px solid #e2e8f0",
  } as React.CSSProperties,

  childrenGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
    gap: "16px",
  } as React.CSSProperties,

  childCard: {
    position: "relative",
    background: "#fff",
    borderRadius: "10px",
    padding: "16px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.08)",
    border: "1px solid #f1f5f9",
  } as React.CSSProperties,

  childHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "12px",
  } as React.CSSProperties,

  childName: {
    fontSize: "16px",
    fontWeight: "600",
    color: "#1e293b",
  } as React.CSSProperties,

  bloodType: {
    fontSize: "12px",
    fontWeight: "700",
    padding: "4px 8px",
    borderRadius: "20px",
    textTransform: "uppercase",
  } as React.CSSProperties,

  childDetail: {
    display: "flex",
    alignItems: "center",
    margin: "8px 0",
    fontSize: "14px",
    color: "#64748b",
  } as React.CSSProperties,

  childIcon: {
    marginRight: "8px",
    color: "#94a3b8",
    fontSize: "14px",
  } as React.CSSProperties,

  appointmentBadge: {
    position: "absolute",
    top: "-8px",
    right: "-8px",
    background: "#3b82f6",
    color: "white",
    fontSize: "12px",
    padding: "4px 10px",
    borderRadius: "20px",
    boxShadow: "0 2px 4px rgba(59,130,246,0.2)",
  } as React.CSSProperties,

  emptyState: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "30px 20px",
    textAlign: "center",
  } as React.CSSProperties,

  emptyIcon: {
    fontSize: "48px",
    color: "#cbd5e1",
    marginBottom: "16px",
  } as React.CSSProperties,

  emptyText: {
    color: "#64748b",
    fontSize: "14px",
    margin: 0,
  } as React.CSSProperties,

  
};


export default UserProfile;
