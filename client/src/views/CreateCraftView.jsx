import React from 'react';
import CreateCraftViewModel from '../viewModels/CreateCraftViewModel';
import Button from '../components/Button';
import Input from '../components/Input';
import Card from '../components/Card';
import Alert from '../components/Alert';

export default function CreateCraftView() {
  const vm = CreateCraftViewModel();
  const { form, setForm, loading, error, success, submit } = vm;

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await submit();
    } catch (err) {
      // error handled in vm
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8 px-3 sm:px-4">
      <Card padding="lg" shadow="md">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-900">Create a New Product</h1>
        {error && <Alert type="error" onClose={() => {}}>{error}</Alert>}
        {success && <Alert type="success" onClose={() => {}} dismissible={false}>✓ Product created successfully! ID: {success.id}</Alert>}
        <form onSubmit={onSubmit} className="flex flex-col gap-5">
          <Input
            label="Product Title"
            type="text"
            placeholder="e.g., Handmade Ceramic Mug"
            value={form.title}
            onChange={e => setForm({...form, title: e.target.value})}
            required
          />
          <Input
            label="Description"
            placeholder="Describe your product in detail..."
            value={form.description}
            onChange={e => setForm({...form, description: e.target.value})}
            multiline
            rows={4}
          />
          <Input
            label="Price (USD)"
            type="number"
            placeholder="0.00"
            step="0.01"
            min="0"
            value={form.price}
            onChange={e => setForm({...form, price: e.target.value})}
            required
          />
          <Button type="submit" variant="success" size="md" loading={loading} fullWidth>
            Create Product
          </Button>
        </form>
      </Card>
    </div>
  );
}
