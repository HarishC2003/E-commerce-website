import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import './OrderSuccess.css';

const OrderSuccess = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await api.get(`/orders/${id}`);
        setOrder(res.data);
      } catch (err) {
        console.error("Error fetching order", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (!order) return <div>Order not found.</div>;

  return (
    <div className="order-success-page">
      <div className="success-banner">
        <h2>Order Placed Successfully!</h2>
        <p>Thank you for your purchase.</p>
      </div>

      <div className="order-details-card">
        <h3>Order Summary</h3>
        <p><strong>Order ID:</strong> {order._id}</p>
        <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleString()}</p>
        <p><strong>Status:</strong> {order.status}</p>
        <p><strong>Payment Method:</strong> {order.paymentMethod}</p>

        <h4>Shipping Address</h4>
        <p>{order.shippingAddress.name}</p>
        <p>{order.shippingAddress.address}, {order.shippingAddress.city} - {order.shippingAddress.pincode}</p>
        <p>Phone: {order.shippingAddress.phone}</p>

        <h4>Items</h4>
        <ul className="order-items-list">
          {order.items.map(item => (
            <li key={item.product._id}>
              {item.product.name} (x{item.quantity}) - ₹{(item.price * item.quantity).toFixed(2)}
            </li>
          ))}
        </ul>
        <h3>Total Amount: ₹{order.totalAmount.toFixed(2)}</h3>
        <Link to="/" className="continue-shopping">Continue Shopping</Link>
      </div>
    </div>
  );
};

export default OrderSuccess;
