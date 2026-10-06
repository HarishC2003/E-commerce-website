import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import './Orders.css';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get('/orders');
        setOrders(res.data);
      } catch (err) {
        console.error("Error fetching orders", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) return <div>Loading orders...</div>;

  if (orders.length === 0) {
    return (
      <div className="orders-page" style={{textAlign: 'center', padding: '4rem'}}>
        <h2>You have no orders yet.</h2>
        <Link to="/">Go Shopping</Link>
      </div>
    );
  }

  return (
    <div className="orders-page">
      <button className="back-btn" onClick={() => navigate(-1)}>
        ← Back
      </button>
      <h2>My Orders</h2>
      <div className="orders-list">
        {orders.map(order => (
          <div key={order._id} className="order-card">
            <div className="order-header">
              <span><strong>Order ID:</strong> {order._id}</span>
              <span><strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</span>
              <span><strong>Total:</strong> ₹{order.totalAmount.toFixed(2)}</span>
              <span><strong style={{color: '#007bff'}}>{order.status}</strong></span>
            </div>
            <div className="order-body">
              <Link to={`/order-success/${order._id}`} className="view-details-btn">View Details</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
