import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaUser, FaSyringe, FaUserMd, FaChevronDown } from "react-icons/fa";
import "./Navbar.css";

const NavbarForStaff = () => {
  const navigate = useNavigate();
  const location = useLocation(); // Lấy đường dẫn hiện tại
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleNavigate = (path) => {
    navigate(path);
  };

  return (
    <nav className="navbar">
      <h1 className="logo">Smile System</h1>
      <ul className="nav-links">
        <li
          className={location.pathname === "/customer-children" ? "active" : ""}
          onClick={() => handleNavigate("/customer-children")}
        >
          <FaUser /> <span>Patient & Children</span>
        </li>

        <li className={`dropdown ${dropdownOpen ? "open" : ""}`}>
          <FaSyringe /> <span>Vaccine</span> 
          <FaChevronDown className="dropdown-icon" onClick={() => setDropdownOpen(!dropdownOpen)} />
          <ul className="dropdown-menu">
            <li onClick={() => handleNavigate("/vaccineStaff")}>Vaccine</li>
            <li onClick={() => handleNavigate("/vaccine-batch")}>Batch</li>
            <li onClick={() => handleNavigate("/vaccine-combo")}>Vaccine Combo</li>
          </ul>
        </li>

        <li
          className={location.pathname === "/doctor&nurse" ? "active" : ""}
          onClick={() => handleNavigate("/doctor&nurse")}
        >
          <FaUserMd /> <span>Nurse & Doctor</span>
        </li>
      </ul>
    </nav>
  );
};

export default NavbarForStaff;
