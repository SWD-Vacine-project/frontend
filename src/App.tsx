import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import SignIn from "./pages/signIn";
import Header from "./views/Header";
import Body from "./views/Body";
import Footer from "./views/Footer";
import About from "./pages/About";
import Vaccine from "./pages/Vaccine";
import Contact from "./pages/Contact";
import LoadingAnimation from "./animation/loading-animation";
import Services from "./pages/Services";
import StickyContactBar from "./pages/StickyContactBar";


import { ToastContainer, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const App: React.FC = () => {
  return (
    <Router>
      <MainLayout />
      <ToastContainer
                transition={Slide}
                autoClose={1500}
                newestOnTop={true}
                pauseOnHover={true}
                pauseOnFocusLoss={false}
                limit={5}
              />
    </Router>
  );
};

const MainLayout: React.FC = () => {
  const location = useLocation();
  const isFullPage = ["/signIn","/about"].includes(location.pathname);
  const [currentPath, setCurrentPath] = useState("");

  useEffect(() => {
    setCurrentPath(location.pathname);
  }, [location.pathname]);

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (location.pathname === "/about" || location.pathname === "/signIn" || location.pathname === "/contact" || location.pathname === "services" ) {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
      }, 1000); // Show animation for 2 seconds
    }
  }, [location.pathname]);



  return (
    <div style={styles.appContainer}>
      {!isFullPage && <Header />}
      <main style={isFullPage ? styles.fullPage : styles.mainContent}>
        {isLoading ? (
          <LoadingAnimation /> // ✅ Show animation before loading About
        ) : (
          <Routes>
            <Route path="/" element={<Body />} />
            <Route path="/signIn" element={<SignIn />} />
            <Route path="/about" element={<About />} />
            <Route path="/vaccine" element={<Vaccine />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/services" element={<Services />} />
          </Routes>
        )}
        <StickyContactBar currentPath={currentPath} />
      </main>
      {!isFullPage && <Footer />}
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
    paddingTop: "60px",
    padding: "20px",
  } as React.CSSProperties,
  fullPage: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #D8BFD8, #C3AED6)", // Soft gradient background
    minHeight: "100vh",
    padding: "20px",
  } as React.CSSProperties,
};

export default App;