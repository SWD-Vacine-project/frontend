import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom"; 
import Header from "./views/Header";
import Body from "./views/Body";
import Footer from "./views/Footer";
import Login from "./pages/loginPage";
import SignIn from "./pages/signIn";
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
  const isLoginPage = location.pathname === "/Login";

  return (
    <div style={styles.appContainer}>
      {!isLoginPage && <Header />}
      <main style={isLoginPage ? styles.fullPage : styles.mainContent}>
        <Routes>
          <Route path="/" element={<Body />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/signIn" element={<SignIn />} />
        </Routes>
        
      </main>
      {!isLoginPage && <Footer />}
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