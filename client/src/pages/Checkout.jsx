import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useCart } from '../context/CartContext';
import Spinner from '../components/ui/Spinner';
import Button from '../components/ui/Button';

export default function Checkout() {
  const { items } = useCart();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  useEffect(() => {
    if (items.length === 0) {
      navigate('/cart', { replace: true });
      return;
    }

    api.post('/payments/checkout-session')
      .then(({ data }) => {
        window.location.href = data.url;
      })
      .catch((err) => {
        setError(err.response?.data?.error || 'Failed to start checkout. Please try again.');
      });
  }, []);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <p className="text-red-500 text-sm">{error}</p>
        <Button variant="secondary" onClick={() => navigate('/cart')}>
          Back to Cart
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-64 gap-3">
      <Spinner className="w-10 h-10" />
      <p className="text-gray-500 text-sm">Redirecting to secure checkout...</p>
    </div>
  );
}
