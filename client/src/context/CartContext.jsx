import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import api from '../services/api';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [items, setItems] = useState([]);

  useEffect(() => {
    if (user) {
      api.get('/cart').then(({ data }) => setItems(data)).catch(() => {});
    } else {
      setItems([]);
    }
  }, [user]);

  const addItem = async (productId, quantity = 1) => {
    const { data } = await api.post('/cart', { productId, quantity });
    setItems(data);
  };

  const removeItem = async (productId) => {
    const { data } = await api.delete(`/cart/${productId}`);
    setItems(data);
  };

  const updateQuantity = async (productId, quantity) => {
    const { data } = await api.put(`/cart/${productId}`, { quantity });
    setItems(data);
  };

  const clearCart = () => setItems([]);

  const refreshCart = async () => {
    if (user) {
      const { data } = await api.get('/cart');
      setItems(data);
    }
  };

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const count = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{ items, total, count, addItem, removeItem, updateQuantity, clearCart, refreshCart }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
