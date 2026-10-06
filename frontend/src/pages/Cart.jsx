import { useContext } from 'react';
import { CartContext } from '../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';
import './Cart.css';

const Cart = () => {
  const { cart, updateQuantity, removeFromCart } = useContext(CartContext);
  const navigate = useNavigate();

  const total = cart.items.reduce((acc, item) => acc + item.price * item.quantity, 0);

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
                  onClick={() => updateQuantity(item.product._id, Math.max(1, item.quantity - 1))}
                  disabled={item.quantity <= 1}
                  style={{ width: '32px', height: '32px', borderRadius: '4px', border: '1px solid #ccc', background: '#f8f9fa', cursor: 'pointer', fontWeight: 'bold' }}
                >
                  -
                </button>
                <span style={{ fontWeight: 'bold', minWidth: '20px', textAlign: 'center' }}>{item.quantity}</span>
                <button 
                  onClick={() => updateQuantity(item.product._id, Math.min(item.product.stock, item.quantity + 1))}
                  disabled={item.quantity >= item.product.stock}
                  style={{ width: '32px', height: '32px', borderRadius: '4px', border: '1px solid #ccc', background: '#f8f9fa', cursor: 'pointer', fontWeight: 'bold' }}
                >
                  +
                </button>
              </div>
              <button onClick={() => removeFromCart(item.product._id)} className="remove-btn">
                Remove
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
