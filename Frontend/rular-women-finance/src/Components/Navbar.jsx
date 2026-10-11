
import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  LogOut,
  Menu,
  X,
} from "lucide-react";

import "./Navbar.css";

const Navbar = () => {

  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="navbar">

      {/* Logo Section */}
      <div className="logo-section">

        <Link to="/" className="logo-link">

          {/* Logo Circle */}
          <div className="logo-circle">
            <span>स</span>
          </div>

          {/* Brand Name */}
          <div className="brand-name">
            <div className="en-brand-name">
              <h1>SakhiVikas</h1>
            </div>
            <div className="sakhiVikas">
              <p>सखी विकास</p>
            </div>
          </div>

        </Link>

      </div>


      {/* Three Line Button - Mobile Only */}
      <button
        className="menu-button"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        {menuOpen ? <X size={25} /> : <Menu size={25} />}
      </button>


      {/* Logout Section */}
      <div
        className={`navigation-section ${
          menuOpen ? "mobile-menu-open" : ""
        }`}
      >

        <button
          className="nav-link logout-button"
          onClick={() => {
            setMenuOpen(false);
            console.log("Logout clicked");
          }}
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>

      </div>

    </nav>
  );
};

export default Navbar;

