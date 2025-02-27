import { useState, useEffect } from "react";
import Modal from "../Modal/ModalVaccine"; // Import modal component

interface Vaccine {
  id: number;
  name: string;
  description: string;
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

  // Gọi API GetAll() để lấy danh sách vaccine
  useEffect(() => {
    const fetchVaccines = async () => {
      try {
        const response = await fetch("https://localhost:7090/api/Vaccine"); 
        if (!response.ok) {
          throw new Error("Lỗi khi lấy dữ liệu từ server!");
        }
        const data: Vaccine[] = await response.json();
        setVaccines(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchVaccines();
  }, []);


   // Get By name
  const fetchVaccineByName = async (name: string) => {
    try {
      const response = await fetch(`http://localhost:7090/api/vaccine/${name}`);
      if (!response.ok) throw new Error("Không tìm thấy vaccine");
  
      const data = await response.json();
      console.log("Dữ liệu vaccine:", data);
    } catch (error) {
      console.error("Lỗi:", error);
    }
  };
  

  // Lọc & sắp xếp vaccine
  const filteredVaccines = vaccines
    .filter((vaccine) => vaccine.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => (sortOrder === "asc" ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)));

  // Phân trang
  const totalPages = Math.ceil(filteredVaccines.length / ITEMS_PER_PAGE);
  const paginatedVaccines = filteredVaccines.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div style={styles.container}>
      {/* Sidebar */}
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
      </div>

      {/* Vaccine List */}
      <div style={styles.content}>
        <h1 style={styles.pageTitle}>💉 Danh sách Vaccine</h1>

        {/* Hiển thị loading / lỗi */}
        {loading && <p style={styles.loadingText}>⏳ Đang tải dữ liệu...</p>}
        {error && <p style={styles.errorText}>{error}</p>}

        {!loading && !error && (
          <div style={styles.listContainer}>
            {paginatedVaccines.length > 0 ? (
              paginatedVaccines.map((vaccine) => (
                <div
                  key={vaccine.id}
                  style={styles.card}
                  onClick={() => setSelectedVaccine(vaccine)}
                >
                  <h3 style={styles.cardTitle}>{vaccine.name}</h3>
                  <p style={styles.cardDescription}>{vaccine.description}</p>
                </div>
              ))
            ) : (
              <p style={styles.noDataText}>Không tìm thấy vaccine phù hợp 😢</p>
            )}
          </div>
        )}

        {/* Phân trang */}
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

      {/* Modal */}
      {selectedVaccine && (
        <Modal onClose={() => setSelectedVaccine(null)}>
          <h2>{selectedVaccine.name}</h2>
          <p>{selectedVaccine.description}</p>
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
  sortButton: {
    width: "100%",
    padding: "10px",
    marginBottom: "10px",
    backgroundColor: "#6A5ACD",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "16px",
    cursor: "pointer",
    transition: "background 0.3s",
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
    gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", // Đảm bảo tự động căn theo chiều rộng màn hình
    gap: "15px",
    width: "100%", // Đảm bảo container không bị giới hạn
    padding: "20px",
  },
  card: {
    background: "#fff",
    padding: "15px",
    borderRadius: "10px",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
    transition: "transform 0.2s",
    cursor: "pointer",
    maxWidth: "300px", // Thay vì width cố định, dùng max-width để linh hoạt hơn
    minHeight: "150px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  cardTitle: {
    fontSize: "18px",
    fontWeight: "bold",
    color: "#6A5ACD",
    marginBottom: "10px",
    whiteSpace: "normal",  // Allow text wrapping
  },
  cardDescription: {
    fontSize: "14px",
    color: "#555",
    whiteSpace: "normal",  // Allow text wrapping
    wordBreak: "break-word", // Prevent overflow issues
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
};

export default VaccineComponent;
