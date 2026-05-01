import { useState, useEffect } from 'react';
import api from '../../services/api';
import Button from '../ui/Button';
import Spinner from '../ui/Spinner';
import ProductForm from './ProductForm';

export default function ProductsTab() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);   // product object or 'new'
  const [deleting, setDeleting] = useState(null); // product id
  const [deleteError, setDeleteError] = useState('');

  const load = () => {
    setLoading(true);
    api.get('/products?limit=100')
      .then(({ data }) => setProducts(data.products))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product? This cannot be undone.')) return;
    setDeleting(id);
    setDeleteError('');
    try {
      await api.delete(`/products/${id}`);
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      setDeleteError(err.response?.data?.error || 'Failed to delete product.');
    } finally {
      setDeleting(null);
    }
  };

  const handleSaved = () => {
    setEditing(null);
    load();
  };

  if (editing) {
    return (
      <ProductForm
        product={editing === 'new' ? null : editing}
        onSaved={handleSaved}
        onCancel={() => setEditing(null)}
      />
    );
  }

  return (
    <div>
      {deleteError && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3 mb-5 flex justify-between items-start">
          <span>{deleteError}</span>
          <button onClick={() => setDeleteError('')} className="ml-4 text-red-400 hover:text-red-600 font-bold">✕</button>
        </div>
      )}

      <div className="flex justify-between items-center mb-6">
        <p className="text-sm text-gray-500">{products.length} products</p>
        <Button onClick={() => setEditing('new')}>+ Add Product</Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><Spinner className="w-8 h-8" /></div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-5 py-3 font-medium text-gray-600">Product</th>
                <th className="text-left px-5 py-3 font-medium text-gray-600">Price</th>
                <th className="text-left px-5 py-3 font-medium text-gray-600">Stock</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {products.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={p.image_url || 'https://placehold.co/40'}
                        alt={p.name}
                        className="w-10 h-10 rounded-lg object-cover shrink-0"
                      />
                      <div>
                        <p className="font-medium text-gray-900 line-clamp-1">{p.name}</p>
                        <p className="text-xs text-gray-400 line-clamp-1 mt-0.5">{p.description}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 font-medium text-gray-900">
                    ${Number(p.price).toFixed(2)}
                  </td>
                  <td className="px-5 py-4">
                    <span className={`font-medium ${p.stock > 0 ? 'text-green-600' : 'text-red-500'}`}>
                      {p.stock}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3 justify-end">
                      <button
                        onClick={() => setEditing(p)}
                        className="text-primary-600 hover:text-primary-800 font-medium transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(p.id)}
                        disabled={deleting === p.id}
                        className="text-red-500 hover:text-red-700 font-medium transition-colors disabled:opacity-40"
                      >
                        {deleting === p.id ? 'Deleting...' : 'Delete'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
