import React from 'react';
import './Navbar.css';
import { useLocation, Link } from 'react-router-dom';


const Navbar = ({searchTerm, setSearchTerm}) => {
  const location = useLocation();
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <h2 style={{ margin: 0, fontWeight: 600, fontSize: '1.5rem', color: '#ffffff' }}>
          🏢 RR Consultancy
        </h2>
        
      </div>

      <div className="navbar-right">
        {location.pathname === '/' && (
          <Link to="/login">
            <button className="nav-btn">Login</button>
          </Link>
        )}
        {location.pathname === '/dashboard' && (
         <div className="navbar-center">
      <h1>Welcome to Real-Estate Consultency</h1>
    </div>
        )}
        
        
      </div>
    </nav>
  );
};

export default Navbar;
