import { Link } from "react-router-dom";
import gametrackerlogo from "../../../public/gametrackerlogo.png"
import ProfileButton from "./ProfileButton";

import "./Navigation.css";

function Navigation() {
  return (
    <nav id="site-banner">
      {/* Logo Section */}
      <div id="logo-banner">
        <Link to="/" className="logo-link">
          <img src={gametrackerlogo} alt="GamesTracker Logo" />
          <p>Game Tracker</p>
        </Link>
        
      </div>

      {/* Search Bar */}
      {/* <div id="search-bar-container">
        <SearchBar />
      </div> */}

      {/* Navigation Actions */}
      <div id="actions-container">
        {/* <Link to="/about" className="nav-link">
          About
        </Link> */}
        {/* <Link to="/Games" className="nav-link">
          Games
        </Link> */}
        <ProfileButton />
      </div>
    </nav>
  );
}

export default Navigation;
