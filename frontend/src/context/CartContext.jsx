/* eslint-disable react-refresh/only-export-components, react-hooks/set-state-in-effect */
import { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from './AuthContext';
import { useToast } from './ToastContext';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ items: [] });
  const { user } = useContext(AuthContext);
  const { showToast } = useToast();

  const fetchCart = async () => {
    try {
      const res = await api.get('/cart');
      setCart(res.data);
    } catch (error) {
      console.error("Error fetching cart", error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchCart();
    } else {
      setTimeout(() => setCart({ items: [] }), 0);
    }
  }, [user]);

  const addToCart = async (productId, quantity = 1) => {
    if (!user) {
      showToast("Please login to add items to cart", "error");
      return;
    }
    try {
      const res = await api.post('/cart', { productId, quantity });
      setCart(res.data);
      showToast("Item added to cart", "success");
    } catch (error) {
      console.error("Error adding to cart", error);
      showToast(error.response?.data?.message || "Error adding to cart", "error");
    }
  };

  const updateQuantity = async (productId, quantity) => {
    try {
      const res = await api.put(`/cart/${productId}`, { quantity });
      setCart(res.data);
    } catch (error) {
      console.error("Error updating cart", error);
    }
  };

  const removeFromCart = async (productId) => {
    try {
      const res = await api.delete(`/cart/${productId}`);
      setCart(res.data);
      showToast("Item removed from cart", "success");
    } catch (error) {
      console.error("Error removing from cart", error);
      showToast("Error removing item", "error");
    }
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, updateQuantity, removeFromCart, fetchCart }}>
      {children}
    </CartContext.Provider>
  );
};
