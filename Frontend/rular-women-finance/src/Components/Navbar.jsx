

import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, Globe, LayoutDashboard, UserRound } from "lucide-react";
import "./Navbar.css";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const [isLoggedIn, setIsLoggedIn] = useState(
    Boolean(localStorage.getItem("token"))
  );

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
      setIsLoggedIn(Boolean(localStorage.getItem("token")));
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, [location.pathname]);

  const navLinks = [
    { name: "Choose Language", path: "/", icon: Globe },
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  ];

  const handleLogin = () => {
    setIsMenuOpen(false);
    navigate("/login");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");

    setIsLoggedIn(false);
    setIsMenuOpen(false);

    navigate("/login", { replace: true });
  };

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <nav className={`sakhi-navbar ${isScrolled ? "scrolled" : ""}`}>
      {/* Logo and Project Name */}
      <Link to="/" className="sakhi-brand" onClick={closeMenu}>
        <span className="sakhi-brand-icon">
          <UserRound size={27} strokeWidth={2} />
        </span>
        <span className="sakhi-brand-name">
          Sakhi<span>Vikas</span>
        </span>
      </Link>

      {/* Desktop Navigation */}
      <div className="sakhi-nav-links">
        {navLinks.map((link) => {
          const Icon = link.icon;
          const isActive = location.pathname === link.path;

          return (
            <Link
              key={link.name}
              to={link.path}
              className={`sakhi-nav-link ${isActive ? "active" : ""}`}
            >
              <Icon size={17} />
              <span>{link.name}</span>
            </Link>
          );
        })}
      </div>

      {/* Desktop Login */}
      <div className="sakhi-nav-right">
        <button
          type="button"
          className="sakhi-login-button"
          onClick={isLoggedIn ? handleLogout : handleLogin}
        >
          {isLoggedIn ? "Logout" : "Login"}
        </button>
      </div>

      {/* Mobile Menu Toggle */}
      <button
  type="button"
  className="sakhi-menu-toggle"
  onClick={() => setIsMenuOpen((prev) => !prev)}
  aria-label={isMenuOpen ? "Close menu" : "Open menu"}
  aria-expanded={isMenuOpen}
>
  {isMenuOpen ? <X size={25} /> : <Menu size={25} />}
</button>

      {/* Mobile Navigation */}
      <div className={`sakhi-mobile-menu ${isMenuOpen ? "open" : ""}`}>
        {navLinks.map((link) => {
          const Icon = link.icon;
          const isActive = location.pathname === link.path;

          return (
            <Link
              key={link.name}
              to={link.path}
              className={`sakhi-mobile-link ${isActive ? "active" : ""}`}
              onClick={closeMenu}
            >
              <Icon size={19} />
              <span>{link.name}</span>
            </Link>
          );
        })}

        <div className="sakhi-mobile-divider" />

        <button
          type="button"
          className="sakhi-mobile-login"
          onClick={isLoggedIn ? handleLogout : handleLogin}>
          {isLoggedIn ? "Logout" : "Login"}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
