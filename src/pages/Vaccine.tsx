import { useState, useEffect, useRef } from "react";
import Modal from "../Modal/ModalVaccine"; // Import modal component
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";

// Interface for single vaccine
interface Vaccine {
  vaccineId: number;
  name: string;
  maxLateDate: number;
  price: number;
  description: string;
  internalDurationDoses: number;
}

// Interface for combo vaccine (matches the provided response)
interface ComboVaccine {
  comboId: number;
  comboName: string;
  price: number;
  description: string;
  vaccines: {
    vaccineId: number;
    vaccineName: string;
    description: string;
  }[];
}

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
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  role: string;
  children: Child[];
}

// Our cart can contain either a single vaccine or a combo vaccine.
interface CartItem {
  vaccine: Vaccine | ComboVaccine;
  selectedChildren: Child[];
}

const ITEMS_PER_PAGE = 9;

const VaccineComponent = () => {
  // Toggle between single and combo modes.
  const [vaccineType, setVaccineType] = useState<"single" | "combo">("single");
  
  // Data lists for each mode.
  const [vaccines, setVaccines] = useState<Vaccine[]>([]);
  const [comboVaccines, setComboVaccines] = useState<ComboVaccine[]>([]);
  
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);
  // selectedVaccine can be either a single or a combo vaccine.
  const [selectedVaccine, setSelectedVaccine] = useState<Vaccine | ComboVaccine | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const cartRef = useRef<HTMLDivElement | null>(null);
  const [childrenList, setChildrenList] = useState<Child[]>([]);
  const [showChildrenModal, setShowChildrenModal] = useState(false);
  // Only one child can be selected at a time.
  const [tempSelectedChildren, setTempSelectedChildren] = useState<Child[]>([]);
  const [currentAction, setCurrentAction] = useState<"addToCart" | "buyNow">("addToCart");
  // Lock the selected child until the current purchase is complete.
  const [lockedChildId, setLockedChildId] = useState<number | null>(null);
  
  const userData = sessionStorage.getItem("user");
  const user: User | null = userData ? JSON.parse(userData) : null;
  const customerId: number | undefined = user?.id;
  const [cart, setCart] = useState<CartItem[]>([]);
  const navigate = useNavigate(); 
  const location = useLocation();

  // Fetch single vaccines.
  const fetchSingleVaccines = async () => {
    try {
      setLoading(true);
      const response = await fetch("https://vaccine-system1.azurewebsites.net/api/Vaccine", {
        method: "GET",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          "Accept-Encoding": "gzip, deflate, br"
        },
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }
      const text = await response.text();
      const data: Vaccine[] = JSON.parse(text);
      setVaccines(data);
    } catch (err) {
      console.error("Fetch error:", err);
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch combo vaccines from the provided API.
  const fetchComboVaccines = async () => {
    try {
      setLoading(true);
      const response = await fetch("https://vaccine-system1.azurewebsites.net/api/Vaccine/get-vaccine-combo", {
        method: "GET",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          "Accept-Encoding": "gzip, deflate, br"
        },
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }
      const text = await response.text();
      const data: ComboVaccine[] = JSON.parse(text);
      setComboVaccines(data);
    } catch (err) {
      console.error("Fetch error:", err);
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  // When vaccineType changes, fetch the appropriate data.
  useEffect(() => {
    if (vaccineType === "single") {
      fetchSingleVaccines();
    } else {
      fetchComboVaccines();
    }
  }, [vaccineType]);

  // Use the current list based on the selected type.
  const currentVaccines: (Vaccine | ComboVaccine)[] = vaccineType === "single" ? vaccines : comboVaccines;

  // Filtering and sorting (using `name` for single, and `comboName` for combo).
  const filteredVaccines = currentVaccines
    .filter((item: Vaccine | ComboVaccine) => {
      const searchLower = searchQuery.toLowerCase();
      if (vaccineType === "single") {
        return (item as Vaccine).name?.toLowerCase().includes(searchLower);
      } else {
        return (item as ComboVaccine).comboName?.toLowerCase().includes(searchLower);
      }
    })
    .sort((a: Vaccine | ComboVaccine, b: Vaccine | ComboVaccine) => {
      const aName = vaccineType === "single" 
        ? ((a as Vaccine).name?.toLowerCase() || "") 
        : ((a as ComboVaccine).comboName?.toLowerCase() || "");
      const bName = vaccineType === "single" 
        ? ((b as Vaccine).name?.toLowerCase() || "") 
        : ((b as ComboVaccine).comboName?.toLowerCase() || "");
      return sortOrder === "asc" ? aName.localeCompare(bName) : bName.localeCompare(aName);
    });

  const totalPages = Math.ceil(filteredVaccines.length / ITEMS_PER_PAGE);
  const paginatedVaccines = filteredVaccines.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Function to search vaccines by name.
  const fetchVaccineByName = async (name: string) => {
    try {
      const endpoint =
        vaccineType === "single"
          ? `https://vaccine-system-hxczh3e5apdjdbfe.southeastasia-01.azurewebsites.net/api/Vaccine/?name=${encodeURIComponent(name)}`
          : `https://vaccine-system-hxczh3e5apdjdbfe.southeastasia-01.azurewebsites.net/api/Vaccine/get-vaccine-combo?name=${encodeURIComponent(name)}`;
      const response = await fetch(endpoint);
      if (!response.ok) throw new Error("Không tìm thấy vaccine");
      const data = await response.json();
      if (vaccineType === "single") {
        setVaccines(data);
      } else {
        setComboVaccines(data);
      }
    } catch (error) {
      console.error("Lỗi:", error);
    }
  };

  // Optionally, implement sorting fetch (only for single vaccines here).
  const fetchSortedVaccines = async () => {
    setLoading(true);
    try {
      if (vaccineType === "single") {
        const response = await fetch("https://vaccine-system-hxczh3e5apdjdbfe.southeastasia-01.azurewebsites.net/api/Vaccine/sort-by-price");
        const sortedData = await response.json();
        setVaccines(sortedData);
      }
      // For combo vaccines, add similar logic if the API is available.
    } catch (error) {
      console.error("Error fetching sorted vaccines:", error);
    }
    setLoading(false);
  };

  const handleBuyClick = () => {
    if (!selectedVaccine) {
      alert("Vui lòng chọn vaccine trước!");
      return;
    }
    if (!user) {
      setShowLoginPopup(true);
      return;
    }
    openChildrenSelection("buyNow");
  };

  const addToCart = () => {
    if (!selectedVaccine) {
      alert("Vui lòng chọn vaccine trước!");
      return;
    }
    if (!user) {
      setShowLoginPopup(true);
      return;
    }
    openChildrenSelection("addToCart");
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

  const calculateTotal = () =>
    cart.reduce((sum, item) => {
      // Cả vaccine đơn và combo đều có price
      return sum + item.vaccine.price * item.selectedChildren.length;
    }, 0);

  async function fetchLatestChildren(customerId: number): Promise<Child[]> {
    try {
      const response = await fetch(
        `https://vaccine-system1.azurewebsites.net/Child/get-child/${customerId}`,
        { method: "GET", headers: { "Content-Type": "application/json" } }
      );
      if (!response.ok) throw new Error(`Failed to fetch children: ${response.statusText}`);
      return await response.json();
    } catch (error) {
      console.error("Error fetching children:", error);
      return [];
    }
  }

  useEffect(() => {
    if (customerId) {
      fetchLatestChildren(customerId)
        .then(children => setChildrenList(children))
        .catch(error => console.error("Error fetching children:", error));
    }
  }, [customerId]);

  const openChildrenSelection = (action: "addToCart" | "buyNow") => {
    if (customerId) {
      fetchLatestChildren(customerId)
        .then(children => setChildrenList(children))
        .catch(error => console.error("Error fetching children:", error));
    }
    setCurrentAction(action);
    setShowChildrenModal(true);
    if (lockedChildId === null) {
      setTempSelectedChildren([]);
    }
  };

  const handleChildSelect = (child: Child) => {
    if (lockedChildId !== null && lockedChildId !== child.childId) {
      alert("Bạn đã chọn trẻ khác. Vui lòng thanh toán xong để chọn trẻ khác!");
      return;
    }
    setTempSelectedChildren(prev =>
      prev.some(c => c.childId === child.childId) ? [] : [child]
    );
  };

  const confirmChildrenSelection = () => {
    console.log(selectedVaccine);
    if (!selectedVaccine) {
      alert("Vui lòng chọn vaccine trước!");
      return;
    }
    if (tempSelectedChildren.length === 0) {
      alert("Vui lòng chọn một trẻ!");
      return;
    }
    const selectedChild = tempSelectedChildren[0];
    if (lockedChildId === null) {
      setLockedChildId(selectedChild.childId);
    }
    if (lockedChildId !== null && lockedChildId !== selectedChild.childId) {
      alert("Bạn đã chọn trẻ khác. Vui lòng thanh toán xong để chọn trẻ khác!");
      return;
    }
    if (currentAction === "addToCart") {
      setCart(prev => {
        const exists = prev.find(item => {
          const idA =
            "vaccineId" in selectedVaccine
              ? (selectedVaccine as Vaccine).vaccineId
              : (selectedVaccine as ComboVaccine).comboId;
          const idB =
            "vaccineId" in item.vaccine
              ? (item.vaccine as Vaccine).vaccineId
              : (item.vaccine as ComboVaccine).comboId;
          return idA === idB && item.selectedChildren[0].childId === selectedChild.childId;
        });
        if (exists) {
          alert("Vaccine đã được thêm cho trẻ này rồi!");
          return prev;
        }
        return [...prev, { vaccine: selectedVaccine, selectedChildren: [selectedChild] }];
      });
    } else {
      navigate("/book/select-datetime", {
        state: {
          cartItems: [{ vaccine: selectedVaccine, selectedChildren: [selectedChild] }]
        }
      });
      alert(`Mua ngay ${
        vaccineType === "single" 
          ? (selectedVaccine as Vaccine).name 
          : (selectedVaccine as ComboVaccine).comboName
      } cho 1 trẻ`);
    }
    setShowChildrenModal(false);
    setTempSelectedChildren([]);
  };

  const calculateAge = (dob: string) => {
    const birthDate = new Date(dob);
    const diff = Date.now() - birthDate.getTime();
    const ageDate = new Date(diff);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };

  return (
    <div style={styles.container}>
      <div style={styles.sidebar}>
        {/* Vaccine type toggle */}
        <div style={styles.toggleContainer}>
          <button
            onClick={() => {
              setVaccineType("single");
              setError(null);
              setSearchQuery("");
              setCurrentPage(1);
            }}
            style={vaccineType === "single" ? styles.activeToggle : styles.inactiveToggle}
          >
            Single Vaccine
          </button>
          <button
            onClick={() => {
              setVaccineType("combo");
              setError(null);
              setSearchQuery("");
              setCurrentPage(1);
            }}
            style={vaccineType === "combo" ? styles.activeToggle : styles.inactiveToggle}
          >
            Combo Vaccine
          </button>
        </div>
        <h2 style={styles.heading}>🔍 Tìm kiếm</h2>
        <input
          type="text"
          placeholder="Nhập tên vaccine..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => { if(e.key === "Enter") fetchVaccineByName(searchQuery); }}
          style={styles.searchBar}
        />
        <h2 style={styles.heading}>🔄 Sắp xếp</h2>
        <button onClick={() => setSortOrder("asc")} style={styles.sortButton}>A - Z</button>
        <button onClick={() => setSortOrder("desc")} style={styles.sortButton}>Z - A</button>
        <button onClick={fetchSortedVaccines} style={styles.sortButton}>Sort By Price</button>
        <button onClick={() => setShowCart(true)} style={styles.sortButton}>
          🛒 Giỏ hàng ({cart.length})
        </button>
      </div>

      <div style={styles.content}>
        <h1 style={styles.pageTitle}>💉 Danh sách Vaccine</h1>
        {loading && <p style={styles.loadingText}>⏳ Đang tải dữ liệu...</p>}
        {error && <p style={styles.errorText}>{error}</p>}
        {!loading && !error && (
          <div style={styles.listContainer}>
            {paginatedVaccines.length > 0 ? (
              paginatedVaccines.map(item => (
                <div
                  key={vaccineType === "single" ? (item as Vaccine).vaccineId : (item as ComboVaccine).comboId}
                  style={vaccineType === "combo" ? styles.comboCard : styles.card}
                  onClick={() => setSelectedVaccine(item)}
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
                    <h3 style={styles.cardTitle}>
                      {vaccineType === "single" 
                        ? (item as Vaccine).name 
                        : (item as ComboVaccine).comboName}
                    </h3>
                    {vaccineType === "combo" && <span style={styles.comboBadge}>{(item as ComboVaccine).comboId}</span>}
                    
                  </div>
                  
                  <p style={styles.cardDescription}>{item.description}</p>
                  
                  <div style={styles.cardFooter}>
                    <div style={styles.cardFooter}>{}</div>
                    <span style={styles.priceBadge}>
                      {(vaccineType === "single" 
                        ? (item as Vaccine).price 
                        : (item as ComboVaccine).price).toLocaleString()} VND
                    </span>
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
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            style={currentPage === 1 ? { ...styles.pageButton, backgroundColor: "#ddd", cursor: "not-allowed" } : styles.pageButton}
            disabled={currentPage === 1}
          >
            ◀ Trước
          </button>
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
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
          padding: "15px",
          zIndex: 1000,
        }}>
          <h3 style={{ marginBottom: "15px" }}>🛒 Giỏ hàng</h3>
          {cart.length > 0 ? (
            <>
              <ul style={{
                listStyle: "none",
                padding: 0,
                maxHeight: "300px",
                overflowY: "auto",
                marginBottom: "15px",
              }}>
                {cart.map((item, index) => (
                  <li key={index} style={{
                    padding: "10px",
                    borderBottom: "1px solid #ddd",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}>
                    <div>
                      <strong>
                        {"vaccineId" in item.vaccine 
                          ? (item.vaccine as Vaccine).name 
                          : (item.vaccine as ComboVaccine).comboName}
                      </strong>
                      <div style={{ fontSize: "0.9em", color: "#666" }}>
                        {/* Additional info nếu cần */}
                      </div>
                    </div>
                    <button onClick={() =>
                      setCart(cart.filter(cartItem => {
                        const idA = "vaccineId" in cartItem.vaccine
                          ? (cartItem.vaccine as Vaccine).vaccineId
                          : (cartItem.vaccine as ComboVaccine).comboId;
                        const idB = "vaccineId" in item.vaccine
                          ? (item.vaccine as Vaccine).vaccineId
                          : (item.vaccine as ComboVaccine).comboId;
                        return idA !== idB;
                      }))
                    } style={{
                      background: "none",
                      border: "none",
                      color: "#ff4444",
                      cursor: "pointer",
                      padding: "5px",
                    }}>
                      ×
                    </button>
                  </li>
                ))}
              </ul>
              <div style={{
                borderTop: "2px solid #eee",
                paddingTop: "15px",
                marginBottom: "15px",
              }}>
                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontWeight: "bold",
                  marginBottom: "10px",
                }}>
                  <span>Tổng cộng:</span>
                  <span>{calculateTotal().toLocaleString()} VND</span>
                </div>
                <button onClick={() => {
                  const user = sessionStorage.getItem("user");
                  if (!user) {
                    setShowLoginPopup(true);
                    setShowCart(false);
                  } else {
                    navigate("/book/select-datetime", { state: { cartItems: cart } });
                    alert("Chuyển hướng đến trang thanh toán...");
                    setCart([]);
                    setLockedChildId(null);
                    setShowCart(false);
                  }
                }} style={{
                  width: "100%",
                  padding: "12px",
                  backgroundColor: "#4CAF50",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                  fontSize: "16px",
                  fontWeight: "bold",
                  transition: "background 0.3s",
                }}>
                  💳 Thanh toán
                </button>
              </div>
            </>
          ) : (
            <p style={{ textAlign: "center" }}>Giỏ hàng trống 😢</p>
          )}
          {cart.length > 0 && (
            <button onClick={() => setCart([])} style={{
              width: "100%",
              padding: "10px",
              backgroundColor: "#ff4444",
              color: "#fff",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              marginTop: "10px",
            }}>
              🗑 Xóa giỏ hàng
            </button>
          )}
        </div>
      )}

      {selectedVaccine && (
        <Modal onClose={() => setSelectedVaccine(null)}>
          {vaccineType === "combo" && <div style={styles.comboLabel}>Combo Vaccine</div>}
          <motion.h2 style={styles.modalTitle}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}>
            {vaccineType === "single" 
              ? (selectedVaccine as Vaccine).name 
              : (selectedVaccine as ComboVaccine).comboName}
          </motion.h2>
          {selectedVaccine && (
            <Modal onClose={() => setSelectedVaccine(null)}>
              {/* ... các phần khác ... */}
              
              {vaccineType === "combo" && (
                <div>
                  <h3>Included Vaccines:</h3>
                  <ul>
                  {(selectedVaccine as ComboVaccine).vaccines.map(v => (
  <li key={v.vaccineId}>
    <strong>ID: {v.vaccineId}</strong> - {v.vaccineName}: {v.description}
  </li>
))}
                  </ul>

                  {/* Hiển thị giá cho combo vaccine */}
                  <motion.div 
                    key="price" 
                    style={styles.detailItem}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8, duration: 0.5 }}
                  >
                    <span style={styles.detailLabel}>💰 Giá:</span>
                    <span style={styles.detailValue}>
                      {(selectedVaccine as ComboVaccine).price.toLocaleString()} VND
                    </span>
                  </motion.div>
                </div>
              )}

              {/* Phần dành cho single vaccine */}
              {vaccineType === "single" && (
                <div style={styles.modalDetails}>
                  {[
                    { label: "💰 Giá:", value: `${(selectedVaccine as Vaccine).price.toLocaleString()} VND` },
                    { label: "💉 Liều lượng:", value: `${(selectedVaccine as Vaccine).internalDurationDoses} ngày` },
                    { label: "📆 Hạn sử dụng:", value: `${(selectedVaccine as Vaccine).maxLateDate} ngày` },
                  ].map((item, index) => (
                    <motion.div key={index} style={styles.detailItem}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 + index * 0.2, duration: 0.5 }}>
                      <span style={styles.detailLabel}>{item.label}</span>
                      <span style={styles.detailValue}>{item.value}</span>
                    </motion.div>
                  ))}
                </div>
              )}
            </Modal>
          )}
          <motion.div style={styles.modalContent}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}>
            <motion.p style={styles.modalDescription}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}>
              {selectedVaccine.description}
            </motion.p>
            {vaccineType === "combo" && (selectedVaccine as ComboVaccine).vaccines.length > 0 && (
              <div>
                <h3>Included Vaccines:</h3>
                <ul>
                  {(selectedVaccine as ComboVaccine).vaccines.map(v => (
                    <li key={v.vaccineId}>
                      {v.vaccineName}: {v.description}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </motion.div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>
            <motion.button style={{
              ...styles.buyButton,
              ...(isHovered ? styles.buyButtonHover : {}),
              width: "180px",
              textAlign: "center",
            }}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              onClick={() => addToCart()}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.2, duration: 0.5 }}>
              🛒 Add to cart
            </motion.button>
            <motion.button style={{
              ...styles.buyButton,
              ...(isHovered ? styles.buyButtonHover : {}),
              width: "180px",
              textAlign: "center",
            }}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              onClick={handleBuyClick}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.2, duration: 0.5 }}>
              Buy Now
            </motion.button>
          </div>
        </Modal>
      )}

      {showLoginPopup && (
        <Modal onClose={() => setShowLoginPopup(false)}>
          <h1 style={{ textAlign: "center" }}>Bạn cần đăng nhập</h1>
          <h2 style={{ textAlign: "center" }}>Vui lòng đăng nhập để mua vaccine.</h2>
          <div style={{ textAlign: "center", marginTop: "20px" }}>
            <button style={{
              padding: "10px 20px",
              backgroundColor: "#4B0082",
              color: "#fff",
              borderRadius: "5px",
              cursor: "pointer",
            }}
              onClick={() => {
                setShowLoginPopup(false);
                window.location.href = "/signIn";
              }}>
              Đăng nhập
            </button>
          </div>
        </Modal>
      )}

      {showChildrenModal && (
        <Modal onClose={() => setShowChildrenModal(false)}>
          <div style={styles.childrenModal}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>👪 Chọn trẻ tiêm chủng</h2>
              <input type="text" placeholder="Tìm kiếm theo tên..." style={styles.searchInput}
                onChange={(e) => setSearchQuery(e.target.value)} />
              <div style={styles.selectedCounter}>🎯 Đã chọn: {tempSelectedChildren.length}</div>
            </div>
            <div style={styles.childrenGrid}>
              {childrenList
                .filter(child => child.name.toLowerCase().includes(searchQuery.toLowerCase()))
                .map(child => {
                  const age = calculateAge(child.dob);
                  const isSelected = tempSelectedChildren.some(c => c.childId === child.childId);
                  return (
                    <motion.div key={child.childId}
                      style={{ ...styles.childCard, ...(isSelected ? styles.selectedChildCard : {}) }}
                      onClick={() => handleChildSelect(child)}
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.2 }}>
                      <div style={styles.childAvatar}>
                        {child.gender === "Male" ? "👦" : "👧"}
                      </div>
                      <div style={styles.childInfo}>
                        <h3 style={styles.childName}>{child.name}</h3>
                        <div style={styles.childDetails}>
                          <span>🏷️ {age} tuổi</span>
                          <span>🩸 {child.bloodType}</span>
                        </div>
                      </div>
                      <div style={styles.checkboxContainer}>
                        <div style={{ ...styles.customCheckbox, ...(isSelected ? styles.checked : {}) }}>
                          {isSelected && "✓"}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
            </div>
            <div style={styles.modalFooter}>
              <button onClick={() => {
                setShowChildrenModal(false);
                setTempSelectedChildren([]);
              }} style={styles.cancelButton}>
                ✖️ Hủy
              </button>
              <button onClick={confirmChildrenSelection}
                disabled={tempSelectedChildren.length === 0}
                style={{ ...styles.confirmButton, ...(tempSelectedChildren.length === 0 ? styles.disabledButton : {}) }}>
                ✅ Xác nhận cho 1 trẻ
              </button>
            </div>
            {childrenList.length === 0 && (
              <div style={styles.emptyState}>
                <div style={styles.emptyIllustration}>📄</div>
                <p>Bạn chưa có hồ sơ trẻ nào!</p>
                <button style={styles.addChildButton} onClick={() => window.location.href = "/profile"}>
                  ＋ Thêm trẻ mới
                </button>
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
};


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
  toggleContainer: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "20px",
  },
  activeToggle: {
    flex: 1,
    padding: "10px",
    marginRight: "5px",
    backgroundColor: "#4B0082",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  inactiveToggle: {
    flex: 1,
    padding: "10px",
    marginLeft: "5px",
    backgroundColor: "#ddd",
    color: "#333",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
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
  comboCard: {
    background: "linear-gradient(145deg, #ffecd2, #fcb69f)",
    padding: "20px",
    borderRadius: "15px",
    border: "2px solid #ff8c00",
    boxShadow: "0 4px 20px rgba(143, 146, 161, 0.25)",
    transition: "all 0.3s ease",
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
  cardIcon: {},
  cardTitle: {
    fontSize: "2.5rem",
    fontWeight: 600,
    background: "linear-gradient(135deg, #4f46e5, #8b5cf6)",
    WebkitBackgroundClip: "text",
    backgroundClip: "text",
    color: "transparent",
    margin: "0",
  },
  comboBadge: {
    marginLeft: "auto",
    backgroundColor: "#ff8c00",
    color: "#fff",
    padding: "4px 8px",
    borderRadius: "5px",
    fontSize: "0.8rem",
    fontWeight: "bold",
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
  comboLabel: {
    textAlign: "center",
    color: "#ff8c00",
    fontWeight: "bold",
    marginBottom: "10px",
    fontSize: "1.2rem",
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
    background: "rgba(255, 255, 255, 0.3)",
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
    color: "#6D597A",
    fontWeight: "500",
  },
  detailValue: {
    fontSize: "1.4rem",
    color: "#3D405B",
    fontWeight: "600",
  },
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
  childrenModal: {
    maxWidth: "800px",
    padding: "20px",
    backgroundColor: "#f8f9fa",
  },
  modalHeader: {
    marginBottom: "20px",
    paddingBottom: "15px",
    borderBottom: "1px solid #eee",
  },
  searchInput: {
    width: "100%",
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    margin: "10px 0",
  },
  selectedCounter: {
    color: "#4CAF50",
    fontWeight: "bold",
    fontSize: "0.9rem",
  },
  childrenGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
    gap: "15px",
    maxHeight: "60vh",
    overflowY: "auto",
    padding: "10px",
  },
  childCard: {
    backgroundColor: "white",
    borderRadius: "12px",
    padding: "15px",
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
    transition: "all 0.3s",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    position: "relative",
  },
  selectedChildCard: {
    backgroundColor: "#e3f2fd",
    border: "2px solid #2196f3",
  },
  childAvatar: {
    fontSize: "2rem",
    marginRight: "15px",
  },
  childInfo: {
    flexGrow: 1,
  },
  childName: {
    margin: "0 0 5px 0",
    color: "#2c3e50",
  },
  childDetails: {
    display: "flex",
    gap: "10px",
    fontSize: "0.9rem",
    color: "#7f8c8d",
  },
  checkboxContainer: {
    marginLeft: "10px",
  },
  customCheckbox: {
    width: "20px",
    height: "20px",
    border: "2px solid #ddd",
    borderRadius: "4px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  checked: {
    backgroundColor: "#2196f3",
    color: "white",
    borderColor: "#2196f3",
  },
  modalFooter: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "10px",
    marginTop: "20px",
    paddingTop: "15px",
    borderTop: "1px solid #eee",
  },
  confirmButton: {
    padding: "12px 25px",
    backgroundColor: "#4CAF50",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "all 0.3s",
  },
  cancelButton: {
    padding: "12px 25px",
    backgroundColor: "#ff4444",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  },
  emptyState: {
    textAlign: "center",
    padding: "40px 0",
  },
  emptyIllustration: {
    fontSize: "4rem",
    marginBottom: "20px",
  },
  addChildButton: {
    padding: "12px 30px",
    backgroundColor: "#2196f3",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    marginTop: "15px",
  },
};

export default VaccineComponent;
