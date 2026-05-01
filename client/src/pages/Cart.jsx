import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import Button from '../components/ui/Button';

export default function Cart() {
  const { items, total, count, removeItem, updateQuantity } = useCart();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <div className="text-6xl mb-6">🛒</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-3">Your cart is empty</h2>
        <p className="text-gray-500 mb-8">Add some products to get started.</p>
        <Button onClick={() => navigate('/')}>Browse Products</Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">
        Shopping Cart <span className="text-gray-400 font-normal text-lg">({count} items)</span>
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Items */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          {items.map((item) => (
            <div
              key={item.product_id}
              className="flex gap-4 bg-white rounded-xl p-4 border border-gray-100 shadow-sm"
            >
              <Link to={`/products/${item.product_id}`} className="shrink-0">
                <img
                  src={item.image_url || 'https://placehold.co/100'}
                  alt={item.name}
                  className="w-24 h-24 object-cover rounded-lg"
                />
              </Link>

              <div className="flex flex-col justify-between flex-1 min-w-0">
                <div>
                  <Link
                    to={`/products/${item.product_id}`}
                    className="font-semibold text-gray-900 hover:text-primary-600 transition-colors line-clamp-1"
                  >
                    {item.name}
                  </Link>
                  <p className="text-primary-600 font-bold mt-1">
                    ${Number(item.price).toFixed(2)}
                  </p>
                </div>

                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                    <button
                      className="px-3 py-1.5 hover:bg-gray-100 text-gray-700 text-sm disabled:opacity-40"
                      onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                    >
                      −
                    </button>
                    <span className="px-3 py-1.5 text-sm font-semibold border-x border-gray-300">
                      {item.quantity}
                    </span>
                    <button
                      className="px-3 py-1.5 hover:bg-gray-100 text-gray-700 text-sm disabled:opacity-40"
                      onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                      disabled={item.quantity >= item.stock}
                    >
                      +
                    </button>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="text-sm font-medium text-gray-900">
                      ${(Number(item.price) * item.quantity).toFixed(2)}
                    </span>
                    <button
                      onClick={() => removeItem(item.product_id)}
                      className="text-sm text-red-500 hover:text-red-700 transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm h-fit">
          <h2 className="font-semibold text-gray-900 mb-5">Order Summary</h2>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal ({count} items)</span>
              <span>${Number(total).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Shipping</span>
              <span className="text-green-600 font-medium">Free</span>
            </div>
          </div>

          <div className="border-t border-gray-100 mt-4 pt-4 flex justify-between font-bold text-gray-900 text-base mb-6">
            <span>Total</span>
            <span>${Number(total).toFixed(2)}</span>
          </div>

          <Button className="w-full py-3" onClick={() => navigate('/checkout')}>
            Proceed to Checkout
          </Button>

          <button
            onClick={() => navigate('/')}
            className="w-full text-center text-sm text-gray-500 hover:text-gray-700 mt-3 transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
}
