// CreateCraft ViewModel
// - Encapsulates form state and submission for creating a craft item.
// - UI components should call `submit()` and observe `loading`, `error`, and `success`.
import { useState } from 'react';
import api from '../services/api';

export default function CreateCraftViewModel() {
  const [form, setForm] = useState({ title: '', description: '', price: '', stock: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const submit = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const payload = {
        title: (form.title || '').trim(),
        description: (form.description || '').trim(),
        price: Number(form.price),
        stock: Number(form.stock || 0)
      };
      const res = await api.createCraft(payload);
      setSuccess(res);
      setForm({ title: '', description: '', price: '' });
      return res;
    } catch (err) {
      setError(err.message || 'Create failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { form, setForm, loading, error, success, submit };
}
