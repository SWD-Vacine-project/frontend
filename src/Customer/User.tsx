import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { FaUser, FaEnvelope, FaPhone, FaMapMarker, FaSave, FaHome, FaShieldAlt } from "react-icons/fa";
import { ImSpinner8 } from "react-icons/im";

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
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      console.log("User từ LocalStorage:", JSON.parse(storedUser));
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        "https://vaccinesystem.azurewebsites.net/api/user/update",
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
        localStorage.setItem("user", JSON.stringify(data)); // Lưu lại vào localStorage
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
  <h3 style={styles.childrenTitle}>Children</h3>
  {user.children && user.children.length > 0 ? (
   <ul style={styles.childrenList}>
   {user.children.map((child, index) => (
  <li key={index} style={styles.childItem}>
    Tên Trẻ {child.name} - Ngày Sinh {child.dob} ({child.gender === "M" ? "Nam" : "Nữ"}) - Nhóm máu : {child.bloodType}
  </li>
))}
 </ul>
 
  ) : (
    <p style={styles.noChildrenText}>Không có dữ liệu trẻ em</p>
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
    marginTop: "20px",
    padding: "15px",
    background: "#f9fafb",
    borderRadius: "10px",
    boxShadow: "0px 2px 5px rgba(0,0,0,0.1)",
  } as React.CSSProperties,
  
  childrenTitle: {
    fontSize: "18px",
    fontWeight: "bold",
    marginBottom: "10px",
    color: "#333",
  } as React.CSSProperties,
  
  childrenList: {
    listStyle: "none",
    padding: "0",
    margin: "0",
  } as React.CSSProperties,
  
  childItem: {
    background: "#e0f2fe",
    padding: "8px 12px",
    borderRadius: "6px",
    marginBottom: "5px",
    fontSize: "16px",
    color: "#0369a1",
  } as React.CSSProperties,
  
  noChildrenText: {
    fontSize: "16px",
    color: "#6b7280",
  } as React.CSSProperties,
  
};


export default UserProfile;
