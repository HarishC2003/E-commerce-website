import { Link, useNavigate } from 'react-router-dom';
import { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
    navigate('/login');
  };

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <>
      {isMenuOpen && <div className="nav-overlay" onClick={closeMenu}></div>}
      <nav className="navbar">
        <div className="navbar-brand">
          <Link to="/" onClick={closeMenu}>E-Commerce</Link>
        </div>
        
        <button className="hamburger-btn" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? '✕' : '☰'}
        </button>

        <ul className={`navbar-nav ${isMenuOpen ? 'open' : ''}`}>
          <li>
            <Link to="/" onClick={closeMenu}>Home</Link>
          </li>
          {user ? (
            <>
              <li>
                <Link to="/cart" onClick={closeMenu}>Cart</Link>
              </li>
              <li>
                <Link to="/wishlist" onClick={closeMenu}>Wishlist</Link>
              </li>
              <li>
                <Link to="/orders" onClick={closeMenu}>Orders</Link>
              </li>
              <li>
                <button onClick={handleLogout} className="nav-btn">Logout</button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/login" onClick={closeMenu}>Login</Link>
              </li>
              <li>
                <Link to="/register" onClick={closeMenu}>Register</Link>
              </li>
            </>
          )}
        </ul>
      </nav>
    </>
  );
};

export default Navbar;
