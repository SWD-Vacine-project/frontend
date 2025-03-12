import { useState, useEffect } from "react";
import { FaUser, FaSyringe, FaUserMd } from "react-icons/fa";
import "./Navbar.css";

const NavbarForStaff = () => {
  const [active, setActive] = useState("Patient & Children");
  const [scrolling, setScrolling] = useState(false);

  // Bắt sự kiện khi cuộn để thay đổi màu navbar
  useEffect(() => {
    const handleScroll = () => {
      setScrolling(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { name: "Patient & Children", icon: <FaUser /> },
    { name: "Vaccine", icon: <FaSyringe /> },
    { name: "Nurse & Doctor", icon: <FaUserMd /> },
  ];

  return (
    <nav className={`navbar ${scrolling ? "scrolled" : ""}`}>
      <h1 className="logo">Smile System</h1>
      <ul className="nav-links">
        {navItems.map((item) => (
          <li
            key={item.name}
            className={active === item.name ? "active" : ""}
            onClick={() => setActive(item.name)}
          >
            {item.icon} <span>{item.name}</span>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default NavbarForStaff;
