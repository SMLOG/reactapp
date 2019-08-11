import React from "react";
import { NavLink } from "react-router-dom";
import "./nav.css";
const NavBar = () => (
  <div>
    <div className="navbar">
      <NavLink exact to="/">
        Stock
      </NavLink>
      <NavLink to="/tools">Tools</NavLink>
    </div>
  </div>
);
export default NavBar;
