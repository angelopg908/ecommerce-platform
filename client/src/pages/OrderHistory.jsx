import { useState, useEffect } from 'react';
import api from '../services/api';
import Spinner from '../components/ui/Spinner';

const STATUS_STYLES = {
  pending:    'bg-yellow-100 text-yellow-700',
  paid:       'bg-blue-100 text-blue-700',
  processing: 'bg-blue-100 text-blue-700',
  shipped:    'bg-purple-100 text-purple-700',
  delivered:  'bg-green-100 text-green-700',
  cancelled:  'bg-red-100 text-red-700',
};

export default function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);
  const [itemsMap, setItemsMap] = useState({});
  const [itemsLoading, setItemsLoading] = useState(false);

  useEffect(() => {
    api.get('/orders')
      .then(({ data }) => setOrders(data))
      .finally(() => setLoading(false));
  }, []);

  const toggleOrder = async (id) => {
    if (expanded === id) {
      setExpanded(null);
      return;
    }
    setExpanded(id);
    if (!itemsMap[id]) {
      setItemsLoading(true);
      try {
        const { data } = await api.get(`/orders/${id}`);
        setItemsMap((prev) => ({ ...prev, [id]: data.items }));
      } finally {
        setItemsLoading(false);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-24">
        <Spinner className="w-10 h-10" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Order History</h1>

      {orders.length === 0 ? (
        <div className="text-center py-24 text-gray-400">
          <p className="text-lg">No orders yet.</p>
          <p className="text-sm mt-1">Your completed orders will appear here.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden"
            >
              <button
                className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50 transition-colors"
                onClick={() => toggleOrder(order.id)}
              >
                <div>
                  <p className="font-semibold text-gray-900">
                    #{order.id.slice(0, 8).toUpperCase()}
                  </p>
                  <p className="text-sm text-gray-500 mt-0.5">
                    {new Date(order.created_at).toLocaleDateString('en-US', {
                      year: 'numeric', month: 'long', day: 'numeric',
                    })}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-bold text-gray-900">
                    ${Number(order.total).toFixed(2)}
                  </span>
                  <span className={`text-xs font-medium px-3 py-1 rounded-full capitalize ${STATUS_STYLES[order.status] ?? 'bg-gray-100 text-gray-600'}`}>
                    {order.status}
                  </span>
                  <svg
                    className={`w-4 h-4 text-gray-400 transition-transform ${expanded === order.id ? 'rotate-180' : ''}`}
                    fill="none" viewBox="0 0 24 24" stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>

              {expanded === order.id && (
                <div className="border-t border-gray-100 px-5 py-4">
                  {itemsLoading && !itemsMap[order.id] ? (
                    <div className="flex justify-center py-4">
                      <Spinner className="w-6 h-6" />
                    </div>
                  ) : (
                    <div className="flex flex-col gap-3">
                      {(itemsMap[order.id] || []).map((item) => (
                        <div key={item.id} className="flex items-center gap-4">
                          <img
                            src={item.image_url || 'https://placehold.co/48'}
                            alt={item.name}
                            className="w-12 h-12 rounded-lg object-cover shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 line-clamp-1">
                              {item.name}
                            </p>
                            <p className="text-xs text-gray-500 mt-0.5">
                              Qty: {item.quantity} × ${Number(item.price).toFixed(2)}
                            </p>
                          </div>
                          <span className="text-sm font-semibold text-gray-900 shrink-0">
                            ${(Number(item.price) * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
