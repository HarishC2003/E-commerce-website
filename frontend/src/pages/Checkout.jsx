import { useState, useContext, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import api from '../services/api';
import './Checkout.css';

const Checkout = () => {
  const { cart, fetchCart } = useContext(CartContext);
  const { user, loading } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();
  const { showToast } = useToast();

  useEffect(() => {
    if (!loading && !user) {
      showToast("Please login to proceed to checkout", "error");
      navigate('/login');
    }
  }, [user, loading, navigate, showToast]);
  
  // Check if we are doing a "Buy Now" for a single item, or full cart checkout
  const buyNowItem = location.state?.buyNowItem;
  const itemsToBuy = buyNowItem ? [buyNowItem] : cart.items;
  const totalAmount = itemsToBuy.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  const [address, setAddress] = useState({
    name: '',
    phone: '',
    address: '',
    city: '',
    pincode: ''
  });
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Form Validation
    const phoneRegex = /^[0-9]{10}$/; // Example: exactly 10 digits or just digits
    if (!/^\d+$/.test(address.phone)) {
      const msg = "Phone number must contain only numbers.";
      setError(msg);
      showToast(msg, "error");
      return;
    }

    if (!/^\d+$/.test(address.pincode)) {
      const msg = "Pincode must contain only numbers.";
      setError(msg);
      showToast(msg, "error");
      return;
    }

    try {
      const orderData = {
        items: itemsToBuy.map(i => ({
          product: i.product._id,
          quantity: i.quantity,
          price: i.price
        })),
        shippingAddress: address,
        paymentMethod: "Cash on Delivery",
        totalAmount,
        isCartCheckout: !buyNowItem
      };

      const res = await api.post('/orders', orderData);
      
      // if it was cart checkout, update cart context since backend cleared it
      if (!buyNowItem) {
        await fetchCart();
      }

      showToast("Order placed successfully!", "success");
      navigate(`/order-success/${res.data._id}`);
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Error placing order';
      setError(errorMsg);
      showToast(errorMsg, "error");
    }
  };

  if (loading || !user) {
    return <div className="checkout-page">Loading...</div>;
  }

  if (itemsToBuy.length === 0) {
    return <div className="checkout-page">No items to checkout.</div>;
  }

  return (
    <div className="checkout-page">
      <button className="back-btn" onClick={() => navigate(-1)}>
        ← Back
      </button>
      <h2>Checkout</h2>
      <div className="checkout-container">
        <div className="order-summary-box">
          <h3>Order Summary</h3>
          {itemsToBuy.map(item => (
            <div key={item.product._id} className="checkout-item">
              <span>{item.product.name} (x{item.quantity})</span>
              <span>₹{(item.price * item.quantity).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
          ))}
          <h3 className="total">Total: ₹{totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h3>
        </div>

        <form onSubmit={handleSubmit} className="checkout-form">
          <h3>Shipping Address</h3>
          {error && <p className="error">{error}</p>}
          <input type="text" name="name" placeholder="Full Name" required onChange={handleChange} />
          <input type="text" name="phone" placeholder="Phone Number" required onChange={handleChange} />
          <input type="text" name="address" placeholder="Address" required onChange={handleChange} />
          <input type="text" name="city" placeholder="City" required onChange={handleChange} />
          <input type="text" name="pincode" placeholder="Pincode" required onChange={handleChange} />
          
          <button type="submit" className="place-order-btn">Place Order (Cash on Delivery)</button>
        </form>
      </div>
    </div>
  );
};

export default Checkout;
