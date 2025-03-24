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
import ChildList from "./pages/child-info/childInfo";
import DataEntry from "./staff/dataEntry/dataEntry";
import Vaccine from "./staff/dataEntry/Vaccine/vaccineTable"
import DoctorNurseForm from "./staff/dataEntry/Doctor&Nurse/Doctor_Nurse";
import VaccineBatch from "./staff/dataEntry/VaccineBatch/vaccineBatch";
import VaccineCombo from "./staff/dataEntry/VaccineCombo/vaccineCombo";
import CustomerTable from "./staff/dataEntry/Customer&Child/customerTable";
import ViewFeedback from "./admin/feedback";
import ModalReview from "./pages/feedback/feedback";
import ProvideFeedback from "./pages/feedback/provideFeedback";


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
  const [isLoading, setIsLoading] = useState(false);
  const [currentPath, setCurrentPath] = useState(location.pathname);

  // Danh sách trang full-page (không có header và footer)
  const fullPageRoutes = ["/signIn","/checkIn","/accept-appointments","/dataEntry","/vaccineStaff","/vaccine-batch","/vaccine-combo", "/doctor&Nurse" ,"/customer-children", "/doctor&nurse", "/admin-feedback", "/provideFeedback" ];
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
  // padding: "20px",
  paddingTop: isFullPage ? "0px" : "110px",
  transition: "padding-top 0.3s ease-in-out",
    } as React.CSSProperties,
    fullPage: {
      display: "flex",
      flexDirection: "column",
      // alignItems: "center",
      justifyContent: "flex-start", // Đảm bảo nội dung bắt đầu từ trên xuống
      background: "linear-gradient(135deg, #D8BFD8, #C3AED6)",
      minHeight: "100vh",
      width: "100%",
      // padding: "40px 20px", // Điều chỉnh padding để không bị tràn lề
      boxSizing: "border-box",
      overflowY: "auto", // Cho phép cuộn nếu nội dung quá dài
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
            <Route path="/children" element={<ChildList />} />
            <Route path="/dataEntry" element={<DataEntry />} />
            <Route path="/vaccineStaff" element={<Vaccine />} />
            <Route path="/doctor&nurse" element={<DoctorNurseForm />} />
            <Route path="/vaccine-batch" element={<VaccineBatch />} />
            <Route path="/vaccine-combo" element={<VaccineCombo />} />
            <Route path="/customer-children" element={<CustomerTable />} />
            <Route path="/admin-feedback" element={<ViewFeedback />} />
            <Route path="/customer-feedback" element={<ModalReview />} />
            <Route path="/provideFeedback" element={<ProvideFeedback />} />

          </Routes>
        )}
        {!isFullPage && <StickyContactBar currentPath={currentPath} />}
      </main>
      {!isFullPage && <Footer />}
    </div>
  );
};

export default App;