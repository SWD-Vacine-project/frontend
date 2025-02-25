import { useState, useEffect } from "react";

interface Vaccine {
  id: number;
  name: string;
  description: string;
}

const Vaccine = () => {
  const [vaccines, setVaccines] = useState<Vaccine[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  // Fetch vaccine data (Replace with API call if needed)
  useEffect(() => {
    const data: Vaccine[] = [
      { id: 1, name: "Pfizer", description: "COVID-19 vaccine by Pfizer-BioNTech" },
      { id: 2, name: "Moderna", description: "COVID-19 vaccine by Moderna" },
      { id: 3, name: "Sinopharm", description: "COVID-19 vaccine by China National Pharmaceutical Group" },
      { id: 4, name: "AstraZeneca", description: "COVID-19 vaccine by AstraZeneca" },
      { id: 5, name: "Johnson & Johnson", description: "Single-dose COVID-19 vaccine" },
      { id: 6, name: "Covaxin", description: "Indian COVID-19 vaccine by Bharat Biotech" },
      { id: 7, name: "Sputnik V", description: "COVID-19 vaccine by Russia's Gamaleya Institute" },
      { id: 8, name: "Novavax", description: "Protein-based COVID-19 vaccine by Novavax" },
    ];
    setVaccines(data);
  }, []);

  // Filter & sort vaccines
  const filteredVaccines = vaccines
    .filter((vaccine) => vaccine.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => (sortOrder === "asc" ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)));

  return (
    <div style={styles.container}>
      {/* Left Panel - Search & Sort */}
      <div style={styles.sidebar}>
        <h2 style={styles.heading}>🔍 Search</h2>
        <input
          type="text"
          placeholder="Search vaccine..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={styles.searchBar}
        />
        <h2 style={styles.heading}>🔄 Sort By</h2>
        <button onClick={() => setSortOrder("asc")} style={styles.sortButton}>A - Z</button>
        <button onClick={() => setSortOrder("desc")} style={styles.sortButton}>Z - A</button>
      </div>

      {/* Right Panel - Vaccine List */}
      <div style={styles.content}>
        <h1 style={styles.pageTitle}>💉 Available Vaccines</h1>
        <div style={styles.listContainer}>
          {filteredVaccines.map((vaccine) => (
            <div key={vaccine.id} style={styles.card}>
              <h3 style={styles.cardTitle}>{vaccine.name}</h3>
              <p style={styles.cardDescription}>{vaccine.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// 🌟 Styles
const styles = {
  container: {
    display: "flex",
    maxWidth: "1000px",
    margin: "40px auto",
    padding: "20px",
    gap: "20px",
  } as React.CSSProperties,
  sidebar: {
    width: "250px",
    background: "#fff",
    padding: "20px",
    borderRadius: "15px",
    boxShadow: "0 6px 15px rgba(0, 0, 0, 0.1)",
  } as React.CSSProperties,
  heading: {
    fontSize: "18px",
    fontWeight: "bold",
    marginBottom: "10px",
    color: "#8B008B",
  } as React.CSSProperties,
  searchBar: {
    width: "100%",
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "8px",
    fontSize: "16px",
    marginBottom: "15px",
  } as React.CSSProperties,
  sortButton: {
    width: "100%",
    padding: "10px",
    marginBottom: "10px",
    backgroundColor: "#C3AED6",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "16px",
    cursor: "pointer",
    transition: "background 0.3s",
  } as React.CSSProperties,
  content: {
    flex: 1,
  } as React.CSSProperties,
  pageTitle: {
    fontSize: "24px",
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: "20px",
    color: "#4B0082",
  } as React.CSSProperties,
  listContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "15px",
  } as React.CSSProperties,
  card: {
    background: "#fff",
    padding: "15px",
    borderRadius: "10px",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
    transition: "transform 0.2s",
  } as React.CSSProperties,
  cardTitle: {
    fontSize: "18px",
    fontWeight: "bold",
    color: "#6A5ACD",
    marginBottom: "10px",
  } as React.CSSProperties,
  cardDescription: {
    fontSize: "14px",
    color: "#555",
  } as React.CSSProperties,
};

export default Vaccine;
