import React from 'react';
import '../css/Navbar.css';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <h1 className="navbar-title">        
          <EmojiEventsIcon sx={{fontSize:'30px'}} /> CCNA IPv4 Learning Portal</h1>
        <div className="navbar-links">
          <a href="/login" className="navbar-login">Log in</a>
          <a href="/register" className="navbar-register">Register</a>
          <a href="/admindashboard" className="navbar-admin">Admin</a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;