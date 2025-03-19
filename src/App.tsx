import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import SignIn from "./pages/signIn";
import Header from "./views/Header";
import Body from "./views/Body";
import Footer from "./views/Footer";
import About from "./pages/About";
import VaccineComponent from "./pages/Vaccine";
import Contact from "./pages/Contact";
import LoadingAnimation from "./animation/loading-animation";
import Services from "./pages/Services";
import StickyContactBar from "./pages/StickyContactBar";
import UserDashboard from "./Customer/userDash";
import { ToastContainer, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SchedulePage from "./Customer/Schedule";
import UserProfile from "./Customer/User";
import Book from "./pages/booking/book";
import { BookingProvider } from "./components/context/BookingContext";
import ManageBookings from "./pages/booking/ManageBooking";
import VaccinationProgress from "./pages/Staff/Nurse/VaccinationProgress";
import VaccinationReactions  from "./pages/Staff/Nurse/VaccinationReactions";

const App: React.FC = () => {
  return (
    <Router>
      <BookingProvider>
      <MainLayout />
      <ToastContainer
        transition={Slide}
        autoClose={1500}
        newestOnTop={true}
        pauseOnHover={true}
        pauseOnFocusLoss={false}
        limit={5}
      />
      </BookingProvider>
    </Router>
  );
};

const MainLayout: React.FC = () => {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [currentPath, setCurrentPath] = useState(location.pathname);

  // Danh sách trang full-page (không có header và footer)
  const fullPageRoutes = ["/signIn"];
  const isFullPage = fullPageRoutes.includes(location.pathname);

  useEffect(() => {
    setCurrentPath(location.pathname);
  }, [location.pathname]);

  useEffect(() => {
    const loadingPaths = ["/about", "/signIn", "/contact", "/services","/vaccine"];
    if (loadingPaths.includes(location.pathname)) {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    }
  }, [location.pathname]);

  // 📌 Đặt styles trước JSX để tránh lỗi sử dụng trước khai báo
  const styles = {
    appContainer: {
      display: "flex",
      flexDirection: "column",
      minHeight: "100vh",
    } as React.CSSProperties,
    mainContent: {
      flex: 1,
  display: "block",  // ❌ Không dùng flex để tránh lỗi căn giữa toàn bộ
  height: "calc(100vh - 110px)", 
  padding: "20px",
  paddingTop: isFullPage ? "0px" : "110px",
  transition: "padding-top 0.3s ease-in-out",
    } as React.CSSProperties,
    fullPage: {
      flex: 1,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      background: "linear-gradient(135deg, #D8BFD8, #C3AED6)",
      minHeight: "100vh",
      padding: "20px",
    } as React.CSSProperties,
  };

  return (
    <div style={isFullPage ? styles.fullPage : styles.appContainer}>
      {!isFullPage && <Header />}
      
      <main style={styles.mainContent}>
        {isLoading ? (
          <LoadingAnimation />
        ) : (
          <Routes>
            <Route path="/" element={<Body />} />
            <Route path="/signIn" element={<SignIn />} />
            <Route path="/about" element={<About />} />
            <Route path="/vaccine" element={<VaccineComponent />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/services" element={<Services />} />
            <Route path="/userDashboard" element={<UserDashboard />} />
            <Route path="/schedule" element={<SchedulePage />} />
            <Route path="/user" element={<UserProfile />} />
            <Route path="/book/*" element={<Book />} />
            <Route path="/manage-booking" element={<ManageBookings />} />
            <Route path="/nurse/vaccination-progress" element={<VaccinationProgress />} />
            <Route path="/nurse/vaccination-reactions" element={<VaccinationReactions />} />
          </Routes>
        )}
        {!isFullPage && <StickyContactBar currentPath={currentPath} />}
      </main>
      {!isFullPage && <Footer />}
    </div>
  );
};

export default App;
