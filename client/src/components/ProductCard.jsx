import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import Button from './ui/Button';

export default function ProductCard({ product }) {
  const { addItem } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!user) return navigate('/login');
    setAdding(true);
    try {
      await addItem(product.id, 1);
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow flex flex-col">
      <Link to={`/products/${product.id}`} className="block overflow-hidden">
        <img
          src={product.image_url || 'https://placehold.co/400x300?text=No+Image'}
          alt={product.name}
          className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
        />
      </Link>

      <div className="p-4 flex flex-col gap-3 flex-1">
        <div className="flex-1">
          <Link
            to={`/products/${product.id}`}
            className="font-semibold text-gray-900 hover:text-primary-600 transition-colors line-clamp-1 block"
          >
            {product.name}
          </Link>
          <p className="text-sm text-gray-500 mt-1 line-clamp-2">{product.description}</p>
        </div>

        <div className="flex items-center justify-between">
          <span className="font-bold text-lg text-primary-600">
            ${Number(product.price).toFixed(2)}
          </span>
          <span className={`text-xs font-medium ${product.stock > 0 ? 'text-green-600' : 'text-red-500'}`}>
            {product.stock > 0 ? `${product.stock} left` : 'Out of stock'}
          </span>
        </div>

        <Button
          onClick={handleAdd}
          disabled={product.stock === 0 || adding}
          className="w-full"
        >
          {adding ? 'Adding...' : added ? '✓ Added' : !user ? 'Login to buy' : 'Add to Cart'}
        </Button>
      </div>
    </div>
  );
}
