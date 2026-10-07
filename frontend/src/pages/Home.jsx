import { useState, useEffect } from 'react';
import api from '../services/api';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get('/products');
        setProducts(res.data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || 'Error fetching products');
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (loading) return <div>Loading products...</div>;
  if (error) return <div className="error">{error}</div>;

  const filteredProducts = products.filter(product => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    
    const matchName = product.name?.toLowerCase().includes(query);
    const matchDesc = product.description?.toLowerCase().includes(query);
    const matchCat = product.category?.toLowerCase().includes(query);
    const matchKeyword = product.keywords?.some(kw => kw.toLowerCase().includes(query));

    return matchName || matchDesc || matchCat || matchKeyword;
  });

  return (
    <div className="home">
      <div className="home-header">
        <h1>Latest Products</h1>
        <div className="search-container">
          <input 
            type="text" 
            placeholder="Search..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>
      </div>
      {filteredProducts.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <h2>No products found matching "{searchQuery}".</h2>
        </div>
      ) : (
        <div className="products-grid">
          {filteredProducts.map(product => (
            <div key={product._id} className="product-card">
              <Link to={`/products/${product._id}`} className="product-image-container">
                <img src={product.image} alt={product.name} className="product-image" />
              </Link>
              <div className="product-info">
                <Link to={`/products/${product._id}`}>
                  <h3>{product.name}</h3>
                </Link>
                <p className="category">{product.category}</p>
                <p className="price">₹{product.price.toLocaleString()}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
