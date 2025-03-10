import { useState, useEffect,useRef } from "react";
import Modal from "../Modal/ModalVaccine"; // Import modal component
import { motion } from "framer-motion";
import { navigate } from "@reach/router";

interface Vaccine {
  vaccineId: number;  // Đổi 'id' thành 'vaccineId'
  name: string;
  maxLateDate: number;
  price: number;
  description: string;
  internalDurationDoses: number;
}

const ITEMS_PER_PAGE = 9; // Hiển thị 9 vaccine mỗi trang

const VaccineComponent = () => {
  const [vaccines, setVaccines] = useState<Vaccine[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedVaccine, setSelectedVaccine] = useState<Vaccine | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [cart, setCart] = useState<Vaccine[]>([]);
  const [showCart, setShowCart] = useState(false);
  const cartRef = useRef<HTMLDivElement | null>(null);



  useEffect(() => {
    const fetchVaccines = async () => {
      try {
        setLoading(true);
        const response = await fetch("https://vaccine-system-hxczh3e5apdjdbfe.southeastasia-01.azurewebsites.net/api/Vaccine", {
          method: "GET",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
            "Accept-Encoding": "gzip, deflate, br"
          },
        });
        if (!response.ok) {
          throw new Error(`Lỗi: ${response.status} ${response.statusText}`);
        }
        const text = await response.text();
        try {
          const data: Vaccine[] = JSON.parse(text);
          setVaccines(data);
        } catch {
          throw new Error("API không trả về JSON hợp lệ!");
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };
    fetchVaccines();
  }, []);

  const fetchVaccineByName = async (name: string) => {
    try {
      const response = await fetch(`https://vaccine-system-hxczh3e5apdjdbfe.southeastasia-01.azurewebsites.net/api/Vaccine?name=${encodeURIComponent(name)}`);
      if (!response.ok) throw new Error("Không tìm thấy vaccine");
      const data: Vaccine[] = await response.json();
      setVaccines(data);
    } catch (error) {
      console.error("Lỗi:", error);
    }
  };

  const filteredVaccines = vaccines
    .filter((vaccine) => vaccine.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => (sortOrder === "asc" ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)));

  const totalPages = Math.ceil(filteredVaccines.length / ITEMS_PER_PAGE);
  const paginatedVaccines = filteredVaccines.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );
  const fetchSortedVaccines = async () => {
    setLoading(true);
    try {
      const response = await fetch("https://vaccine-system-hxczh3e5apdjdbfe.southeastasia-01.azurewebsites.net/api/Vaccine/sort-by-price");
      const sortedData = await response.json();
      setVaccines(sortedData);
    } catch (error) {
      console.error("Error fetching sorted vaccines:", error);
    }
    setLoading(false);
  };



  const handleBuyClick = () => {
    const storedUser = localStorage.getItem("user");
    const user = storedUser ? JSON.parse(storedUser) : null;
  
    if (user) {
      console.log("Proceed to buy vaccine...");
      navigate("/book/booking-confirm");
    } else {
      setShowLoginPopup(true);
    }
  };
  
  const addToCart = (vaccine: Vaccine) => {
    setCart((prevCart) => {
      if (prevCart.some((item) => item.vaccineId === vaccine.vaccineId)) {
        return prevCart; // Không thêm nếu đã có
      }
      return [...prevCart, vaccine];
    });
  };



  
    
  
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (cartRef.current && !cartRef.current.contains(event.target as Node)) {
          setShowCart(false);
        }
      };
  
      if (showCart) {
        document.addEventListener("mousedown", handleClickOutside);
      }
  
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [showCart]);
  
  
  


  return (
    <div style={styles.container}>
      <div style={styles.sidebar}>
        <h2 style={styles.heading}>🔍 Tìm kiếm</h2>
        <input
          type="text"
          placeholder="Nhập tên vaccine..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              fetchVaccineByName(searchQuery);
            }
          }}
          style={styles.searchBar}
        />
        <h2 style={styles.heading}>🔄 Sắp xếp</h2>
        <button onClick={() => setSortOrder("asc")} style={styles.sortButton}>A - Z</button>
        <button onClick={() => setSortOrder("desc")} style={styles.sortButton}>Z - A</button>
        <button onClick={() => fetchSortedVaccines} style={styles.sortButton}>Sort By Price</button>
        <button onClick={() => setShowCart(true)} style={styles.sortButton}>🛒 Giỏ hàng ({cart.length})</button>   
      
      </div>



      <div style={styles.content}>
        <h1 style={styles.pageTitle}>💉 Danh sách Vaccine</h1>
        {loading && <p style={styles.loadingText}>⏳ Đang tải dữ liệu...</p>}
        {error && <p style={styles.errorText}>{error}</p>}
        {!loading && !error && (
          <div style={styles.listContainer}>
            {paginatedVaccines.length > 0 ? (
              paginatedVaccines.map((vaccine) => (
                <div
                  key={vaccine.vaccineId}
                  style={styles.card}
                  onClick={() => setSelectedVaccine(vaccine)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-5px)";
                    e.currentTarget.style.boxShadow = "0 12px 24px rgba(143, 146, 161, 0.2)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 4px 20px rgba(143, 146, 161, 0.15)";
                  }}
                >
                  <div style={styles.cardHeader}>
                    <div style={styles.cardIcon}>💉</div>
                    <h3 style={styles.cardTitle}>{vaccine.name}</h3>
                  </div>
                  <p style={styles.cardDescription}>{vaccine.description}</p>
                  <div style={styles.cardFooter}>
                    <span style={styles.priceBadge}>${vaccine.price.toLocaleString()}</span>
                  </div>
                  <div style={styles.cardHoverEffect}></div>
                </div>
              ))
            ) : (
              <p style={styles.noDataText}>Không tìm thấy vaccine phù hợp 😢</p>
            )}
          </div>
        )}
       
        <div style={styles.pagination}>
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            style={currentPage === 1 ? { ...styles.pageButton, backgroundColor: "#ddd", cursor: "not-allowed" } : styles.pageButton}
            disabled={currentPage === 1}
          >
            ◀ Trước
          </button>
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            style={currentPage === totalPages ? { ...styles.pageButton, backgroundColor: "#ddd", cursor: "not-allowed" } : styles.pageButton}
            disabled={currentPage === totalPages}
          >
            Sau ▶
          </button>
        </div>
      </div>
   

{showCart && (
  <div ref={cartRef} style={{
    position: "fixed",
    top: "130px",
    right: "20px",
    width: "300px",
    backgroundColor: "#fff",
    boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
    borderRadius: "8px",
    padding: "15px"
  }}>
    <h3>🛒 Giỏ hàng</h3>
    
    {cart.length > 0 ? (
      <ul style={{ listStyle: "none", padding: 0 }}>
        {cart.map((vaccine, index) => (
          <li key={index} style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>
            <strong>{vaccine.name}</strong> - {vaccine.price.toLocaleString()} VND
          </li>
        ))}
      </ul>
    ) : (
      <p>Giỏ hàng trống 😢</p>
    )}

    <button 
      onClick={() => setCart([])} // Xóa giỏ hàng
      style={{
        width: "100%",
        padding: "10px",
        backgroundColor: "#9147d1",
        color: "#fff",
        borderRadius: "5px",
        cursor: "pointer",
        marginTop: "10px"
      }}
    >
      🗑 Xóa giỏ hàng
    </button>
  </div>
)}


      {selectedVaccine && (
  <Modal onClose={() => setSelectedVaccine(null)}>
    <motion.h2 
      style={styles.modalTitle} 
      initial={{ opacity: 0, y: -20 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.5 }}
    >
      {selectedVaccine.name}
    </motion.h2>

    <motion.div 
      style={styles.modalContent}
      initial={{ opacity: 0, y: -10 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ delay: 0.3, duration: 0.5 }}
    >
      <motion.p 
        style={styles.modalDescription}
        initial={{ opacity: 0, x: -10 }} 
        animate={{ opacity: 1, x: 0 }} 
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        {selectedVaccine.description}
      </motion.p>

      <div style={styles.modalDetails}>
        {[
          { label: "💰 Giá:", value: `${selectedVaccine.price.toLocaleString()} VND` },
          { label: "💉 Liều lượng:", value: `${selectedVaccine.internalDurationDoses} ngày` },
          { label: "📆 Hạn sử dụng:", value: `${selectedVaccine.maxLateDate} ngày` }
        ].map((item, index) => (
          <motion.div 
            key={index} 
            style={styles.detailItem}
            initial={{ opacity: 0, x: -20 }} 
            animate={{ opacity: 1, x: 0 }} 
            transition={{ delay: 0.6 + index * 0.2, duration: 0.5 }}
          >
            <span style={styles.detailLabel}>{item.label}</span>
            <span style={styles.detailValue}>{item.value}</span>
          </motion.div>
        ))}
      </div>
    </motion.div>



    <motion.button 
  style={{
    ...styles.buyButton,
    ...(isHovered ? styles.buyButtonHover : {}),
  }}
  onMouseEnter={() => setIsHovered(true)}
  onMouseLeave={() => setIsHovered(false)}
  onClick={() => addToCart(selectedVaccine)} // Thêm vaccine vào giỏ
  initial={{ opacity: 0, scale: 0.9 }} 
  animate={{ opacity: 1, scale: 1 }} 
  transition={{ delay: 1.2, duration: 0.5 }}
>
  🛒 Thêm vào giỏ hàng
</motion.button>



    <motion.button 
  style={{
    ...styles.buyButton,
    ...(isHovered ? styles.buyButtonHover : {}),
  }}
  onMouseEnter={() => setIsHovered(true)}
  onMouseLeave={() => setIsHovered(false)}
  onClick={handleBuyClick} // Gọi hàm kiểm tra đăng nhập
  initial={{ opacity: 0, scale: 0.9 }} 
  animate={{ opacity: 1, scale: 1 }} 
  transition={{ delay: 1.2, duration: 0.5 }}
>
  Buy Now
</motion.button>


  </Modal>
)}
{/* Modal đăng nhập */}
{showLoginPopup && (
  <Modal onClose={() => setShowLoginPopup(false)}>
    <h2 style={{ textAlign: "center" }}>Bạn cần đăng nhập</h2>
    <p style={{ textAlign: "center" }}>Vui lòng đăng nhập để mua vaccine.</p>
    <div style={{ textAlign: "center", marginTop: "20px" }}>
      <button 
        style={{ padding: "10px 20px", backgroundColor: "#4B0082", color: "#fff", borderRadius: "5px", cursor: "pointer" }} 
        onClick={() => {
          setShowLoginPopup(false);
          window.location.href = "/signIn"; // Chuyển hướng đến trang đăng nhập
        }}
      >
        Đăng nhập
      </button>
    </div>
  </Modal>
)}

    </div>
  );
};

// 🌟 Styles
const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: "flex",
    gap: "15px",
    justifyContent: "center",
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "20px",
  },
  sidebar: {
    width: "250px",
    height: "fit-content",
    background: "#fff",
    padding: "20px",
    borderRadius: "15px",
    boxShadow: "0 6px 15px rgba(0, 0, 0, 0.1)",
    position: "sticky",
    top: "20px",
  },
  heading: {
    fontSize: "18px",
    fontWeight: "bold",
    marginBottom: "10px",
    color: "#8B008B",
  },
  searchBar: {
    width: "100%",
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "8px",
    fontSize: "16px",
    marginBottom: "15px",
  },
  content: {
    flex: 1,
  },
  pageTitle: {
    fontSize: "24px",
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: "20px",
    color: "#4B0082",
  },
  listContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
    gap: "20px",
    padding: "15px",
  },
  card: {
    background: "linear-gradient(145deg, #ffffff, #f8f9ff)",
    padding: "20px",
    borderRadius: "15px",
    boxShadow: "0 4px 20px rgba(143, 146, 161, 0.15)",
    transition: "all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
    cursor: "pointer",
    position: "relative",
    overflow: "hidden",
    minHeight: "200px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  cardHeader: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "15px",
  },
  cardTitle: {
    fontSize: "2.5rem",
    fontWeight: 600,
    background: "linear-gradient(135deg, #4f46e5, #8b5cf6)",
    WebkitBackgroundClip: "text",
    backgroundClip: "text",
    color: "transparent",
    margin: "0",
  },
  cardDescription: {
    fontSize: "0.9rem",
    lineHeight: 1.5,
    color: "#64748b",
    flexGrow: 1,
    marginBottom: "15px",
  },
  cardFooter: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  priceBadge: {
    background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
    color: "#fff",
    padding: "6px 12px",
    borderRadius: "20px",
    fontSize: "0.9rem",
    fontWeight: 500,
    boxShadow: "0 2px 6px rgba(16, 185, 129, 0.2)",
  },
  // Hiệu ứng hover cho card
  cardHover: {
    transform: "scale(1.05)",
    boxShadow: "0 10px 20px rgba(0, 0, 0, 0.2)",
  },

  cardHoverEffect: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "linear-gradient(135deg, rgba(99, 102, 241, 0.03) 0%, rgba(139, 92, 246, 0.03) 100%)",
    pointerEvents: "none",
  },

  modalTitle: {
    fontSize: "2.5rem",
    fontWeight: "700",
    color: "#8E75FF",
    textAlign: "center",
    marginBottom: "20px",
    textShadow: "1px 1px 8px rgba(142, 117, 255, 0.4)", 
  },
  modalContent: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
    alignItems: "center",
    textAlign: "center",
    padding: "10px",
  },
  modalDescription: {
    fontSize: "1.6rem",
    lineHeight: 1.6,
    color: "#4A4E69",
    fontWeight: "400",
  },
  modalDetails: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    marginTop: "20px",
    padding: "15px",
    background: "rgba(255, 255, 255, 0.3)", // Soft frosted effect
    borderRadius: "14px",
    boxShadow: "0 3px 10px rgba(0, 0, 0, 0.1)",
  },
  detailItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 0",
  },
  detailLabel: {
    fontSize: "1.4rem",
    color: "#6D597A", // Soft purple-gray
    fontWeight: "500",
  },
  detailValue: {
    fontSize: "1.4rem",
    color: "#3D405B", // Darker muted blue-gray
    fontWeight: "600",
  },

  // Sort button với gradient



  sortButton: {
    width: "100%",
    padding: "10px",
    marginBottom: "10px",
    background: "linear-gradient(135deg, #6A5ACD, #8A2BE2)",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "16px",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "transform 0.2s, box-shadow 0.2s",
  },
  sortButtonHover: {
    transform: "scale(1.05)",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
  },
  noDataText: {
    fontSize: "16px",
    fontWeight: "bold",
    textAlign: "center",
    color: "#d9534f",
  },

  pagination: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginTop: "20px",
    gap: "10px",
  },
  pageButton: {
    padding: "10px 15px",
    backgroundColor: "#6A5ACD",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "16px",
    cursor: "pointer",
    transition: "background 0.3s",
  },
  disabledButton: {
    backgroundColor: "#ddd",
    cursor: "not-allowed",
  },
  pageInfo: {
    fontSize: "16px",
    fontWeight: "bold",
  },
  buyButton: {
    background: "linear-gradient(135deg, #4f46e5, #8b5cf6)",
    color: "#fff",
    padding: "12px 24px",
    borderRadius: "10px",
    fontSize: "1.2rem",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "all 0.3s ease-in-out",
    border: "none",
    boxShadow: "0 4px 10px rgba(143, 92, 246, 0.3)",
  },
  buyButtonHover: {
    background: "linear-gradient(135deg, #8b5cf6, #4f46e5)",
    transform: "scale(1.05)",
    boxShadow: "0 6px 15px rgba(143, 92, 246, 0.5)",
  },
};

export default VaccineComponent;
