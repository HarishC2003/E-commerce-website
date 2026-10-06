import { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from './AuthContext';
import { useToast } from './ToastContext';

export const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState({ products: [] });
  const { user } = useContext(AuthContext);
  const { showToast } = useToast();

  useEffect(() => {
    if (user) {
      fetchWishlist();
    } else {
      setWishlist({ products: [] });
    }
  }, [user]);

  const fetchWishlist = async () => {
    try {
      const res = await api.get('/wishlist');
      setWishlist(res.data);
    } catch (error) {
      console.error("Error fetching wishlist", error);
    }
  };

  const addToWishlist = async (productId) => {
    if (!user) {
      showToast("Please login to use wishlist", "error");
      return;
    }

    const isAlreadyInWishlist = wishlist.products?.some(p => p._id === productId);
    if (isAlreadyInWishlist) {
      showToast("Already in wishlist", "error");
      return;
    }

    try {
      const res = await api.post(`/wishlist/${productId}`);
      setWishlist(res.data);
      showToast("Added to wishlist", "success");
    } catch (error) {
      console.error("Error adding to wishlist", error);
      showToast("Error adding to wishlist", "error");
    }
  };

  const removeFromWishlist = async (productId) => {
    try {
      const res = await api.delete(`/wishlist/${productId}`);
      setWishlist(res.data);
      showToast("Removed from wishlist", "success");
    } catch (error) {
      console.error("Error removing from wishlist", error);
      showToast("Error removing from wishlist", "error");
    }
  };

  return (
    <WishlistContext.Provider value={{ wishlist, addToWishlist, removeFromWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};
