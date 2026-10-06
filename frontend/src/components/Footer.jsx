import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section brand-section">
          <h2>E-Commerce</h2>
          <p>Your one-stop destination for the best premium products at unbeatable prices. Experience shopping like never before.</p>
        </div>
        
        <div className="footer-section">
          <h3>Quick Links</h3>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/cart">Shopping Cart</Link></li>
            <li><Link to="/wishlist">My Wishlist</Link></li>
            <li><Link to="/orders">My Orders</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Customer Service</h3>
          <ul>
            <li><a href="#">Help Center</a></li>
            <li><a href="#">Returns & Refunds</a></li>
            <li><a href="#">Track Order</a></li>
            <li><a href="#">Terms & Conditions</a></li>
          </ul>
        </div>

        <div className="footer-section contact-section">
          <h3>Contact Us</h3>
          <p><strong>Email:</strong> support@ecommerce.com</p>
          <p><strong>Phone:</strong> +91 12345 67890</p>
          <p><strong>Address:</strong> 123 Tech Street, Vellore, TN</p>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} E-Commerce. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
