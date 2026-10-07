import { useContext } from 'react';
import { WishlistContext } from '../context/WishlistContext';
import { CartContext } from '../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';

const Wishlist = () => {
  const { wishlist, removeFromWishlist } = useContext(WishlistContext);
  const { addToCart } = useContext(CartContext);
  const navigate = useNavigate();

  const validProducts = wishlist?.products?.filter(p => p) || [];

  if (validProducts.length === 0) {
    return (
      <div className="empty-cart">
        <h2>Your Wishlist is Empty</h2>
        <Link to="/">Explore Products</Link>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <button className="back-btn" onClick={() => navigate(-1)}>
        ← Back
      </button>
      <h2>My Wishlist</h2>
      <div className="products-grid">
        {validProducts.map(product => (
          <div key={product._id} className="product-card">
            <Link to={`/products/${product._id}`} className="product-image-container">
              <img src={product.image} alt={product.name} className="product-image" />
            </Link>
            <div className="product-info">
              <Link to={`/products/${product._id}`}>
                <h3>{product.name}</h3>
              </Link>
              <p className="price">₹{product.price.toLocaleString()}</p>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button 
                  onClick={() => addToCart(product._id)}
                  className="btn btn-primary"
                  style={{ flex: 1 }}
                >
                  To Cart
                </button>
                <button 
                  onClick={() => removeFromWishlist(product._id)}
                  className="remove-btn"
                  style={{ flex: 1, textAlign: 'center' }}
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Wishlist;
