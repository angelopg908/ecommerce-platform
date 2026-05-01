import { useState } from 'react';
import api from '../../services/api';
import Button from '../ui/Button';
import Input from '../ui/Input';

const EMPTY = { name: '', description: '', price: '', stock: '', image_url: '' };

export default function ProductForm({ product, onSaved, onCancel }) {
  const [form, setForm] = useState(
    product
      ? { name: product.name, description: product.description ?? '', price: product.price, stock: product.stock, image_url: product.image_url ?? '' }
      : EMPTY
  );
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.name.trim()) return setError('Name is required.');
    if (!form.price || Number(form.price) < 0) return setError('Valid price is required.');
    if (form.stock === '' || Number(form.stock) < 0) return setError('Valid stock quantity is required.');

    setSaving(true);
    try {
      const payload = {
        name: form.name.trim(),
        description: form.description.trim(),
        price: Number(form.price),
        stock: Number(form.stock),
        image_url: form.image_url.trim() || null,
      };

      if (product) {
        await api.put(`/products/${product.id}`, payload);
      } else {
        await api.post('/products', payload);
      }
      onSaved();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save product.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-8 max-w-2xl">
      <h2 className="text-xl font-bold text-gray-900 mb-6">
        {product ? 'Edit Product' : 'Add New Product'}
      </h2>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3 mb-5">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <Input label="Product name" value={form.name} onChange={set('name')} required placeholder="e.g. Wireless Headphones" />

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Description</label>
          <textarea
            value={form.description}
            onChange={set('description')}
            rows={3}
            placeholder="Product description..."
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input label="Price ($)" type="number" min="0" step="0.01" value={form.price} onChange={set('price')} required placeholder="0.00" />
          <Input label="Stock" type="number" min="0" step="1" value={form.stock} onChange={set('stock')} required placeholder="0" />
        </div>

        <Input label="Image URL" type="url" value={form.image_url} onChange={set('image_url')} placeholder="https://images.unsplash.com/..." />

        {form.image_url && (
          <div className="rounded-xl overflow-hidden border border-gray-100 h-40 bg-gray-50">
            <img
              src={form.image_url}
              alt="Preview"
              className="w-full h-full object-cover"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
          </div>
        )}

        <div className="flex gap-3 pt-2">
          <Button type="submit" disabled={saving} className="flex-1 py-2.5">
            {saving ? 'Saving...' : product ? 'Save Changes' : 'Create Product'}
          </Button>
          <Button type="button" variant="secondary" onClick={onCancel} className="flex-1 py-2.5">
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
