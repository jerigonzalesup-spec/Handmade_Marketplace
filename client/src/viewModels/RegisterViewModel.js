import { useState } from 'react';
import authService from '../services/auth';

export default function RegisterViewModel() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const submit = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await authService.register(form.name, form.email, form.password);
      if (res && res.token) {
        return res;
      }
      setError('Registration failed');
      return null;
    } catch (err) {
      setError(err.message || 'Registration failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { form, setForm, loading, error, submit };
}
