import { useState } from 'react';
import authService from '../services/auth';

export default function LoginViewModel() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const submit = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await authService.login(form.email, form.password);
      if (res && res.token) {
        return res;
      }
      setError('Invalid credentials');
      return null;
    } catch (err) {
      setError(err.message || 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { form, setForm, loading, error, submit };
}
