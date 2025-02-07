import React from "react";
import Header from "./views/Header";
import Body from "./views/Body";
import Footer from "./views/Footer";

const App: React.FC = () => {
  return (
    <div style={styles.appContainer}>
      <Header />
      <main style={styles.mainContent}>
        <Body />
      </main>
      <Footer />
    </div>
  );
};

const styles = {
  appContainer: {
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh",
  } as React.CSSProperties,
  mainContent: {
    flex: 1,
    paddingTop: "60px", // Prevents body from overlapping with fixed header
    padding: "20px",
  } as React.CSSProperties,
};

export default App;