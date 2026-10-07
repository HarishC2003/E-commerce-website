import { useContext, useState } from 'react';
import { CartContext } from '../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';
import './Cart.css';

const Cart = () => {
  const { cart, updateQuantity, removeFromCart } = useContext(CartContext);
  const navigate = useNavigate();
  const [loadingItemId, setLoadingItemId] = useState(null);

  const total = cart.items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handleUpdateQuantity = async (productId, quantity) => {
    setLoadingItemId(productId);
    await updateQuantity(productId, quantity);
    setLoadingItemId(null);
  };

  const handleRemove = async (productId) => {
    setLoadingItemId(productId);
    await removeFromCart(productId);
    setLoadingItemId(null);
  };

  if (cart.items.length === 0) {
    return (
      <div className="empty-cart">
        <h2>Your Cart is Empty</h2>
        <Link to="/">Go Shopping</Link>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <button className="back-btn" onClick={() => navigate(-1)}>
        ← Back
      </button>
      <h2>Shopping Cart</h2>
      <div className="cart-items">
        {cart.items.map((item) => (
          <div key={item.product._id} className="cart-item">
            <img src={item.product.image} alt={item.product.name} />
            <div className="item-details">
              <Link to={`/products/${item.product._id}`}>
                <h3>{item.product.name}</h3>
              </Link>
              <p>₹{item.price.toLocaleString()}</p>
            </div>
            <div className="item-actions">
              <div className="quantity-controls" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <button 
                  onClick={() => handleUpdateQuantity(item.product._id, Math.max(1, item.quantity - 1))}
                  disabled={item.quantity <= 1 || loadingItemId === item.product._id}
                  className="qty-btn"
                >
                  -
                </button>
                <span className="qty-value">
                  {loadingItemId === item.product._id ? <span className="spinner"></span> : item.quantity}
                </span>
                <button 
                  onClick={() => handleUpdateQuantity(item.product._id, Math.min(item.product.stock, item.quantity + 1))}
                  disabled={item.quantity >= item.product.stock || loadingItemId === item.product._id}
                  className="qty-btn"
                >
                  +
                </button>
              </div>
              <button 
                onClick={() => handleRemove(item.product._id)} 
                disabled={loadingItemId === item.product._id}
                className="remove-btn"
              >
                {loadingItemId === item.product._id ? 'Removing...' : 'Remove'}
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="cart-summary">
        <h3>Total: ₹{total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h3>
        <button className="checkout-btn" onClick={() => navigate('/checkout')}>
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
};

export default Cart;
