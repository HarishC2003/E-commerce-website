import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { CartContext } from '../context/CartContext';
import { WishlistContext } from '../context/WishlistContext';
import './ProductDetails.css';

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart } = useContext(CartContext);
  const { addToWishlist } = useContext(WishlistContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.get(`/products/${id}`);
        setProduct(res.data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || 'Error fetching product');
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!product) return <div>Product not found</div>;

  const handleBuyNow = () => {
    if (product.stock === 0) return;
    navigate('/checkout', { 
      state: { 
        buyNowItem: {
          product,
          quantity: 1,
          price: product.price
        } 
      } 
    });
  };

  return (
    <div className="product-details-container">
      <button className="back-btn" onClick={() => navigate(-1)}>
        ← Back
      </button>
      <div className="product-details">
        <div className="product-details-image">
          <img src={product.image} alt={product.name} />
        </div>
      <div className="product-details-info">
        <h2>{product.name}</h2>
        <p className="category">{product.category}</p>
        <p className="price">₹{product.price.toLocaleString()}</p>
        <p className="description">{product.description}</p>
        <p className={`stock ${product.stock > 0 ? 'stock-in' : 'stock-out'}`}>
          Status: {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
        </p>
        
        <div className="actions">
          <button 
            disabled={product.stock === 0} 
            className="add-to-cart-btn"
            onClick={() => addToCart(product._id)}
          >
            Add to Cart
          </button>
          <button 
            disabled={product.stock === 0} 
            className="buy-now-btn"
            onClick={handleBuyNow}
          >
            Buy Now
          </button>
          <button 
            className="wishlist-btn"
            onClick={() => addToWishlist(product._id)}
          >
            Add to Wishlist
          </button>
        </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
