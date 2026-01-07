import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Card from '../components/Card';
import Button from '../components/Button';
import HomeViewModel from '../viewModels/HomeViewModel';

export default function ProductDetailsView() {
  const { id } = useParams();
  const vm = HomeViewModel();
  const product = vm.crafts.find(c => String(c.id) === String(id));
  const navigate = useNavigate();

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4">
        <Card padding="lg" shadow="md">
          <div className="text-center py-12">
            <p className="text-xl font-medium text-gray-700">Product not found</p>
            <p className="text-sm text-gray-500 mt-2">It may have been removed or the URL is incorrect.</p>
            <div className="mt-6">
              <Button variant="outline" onClick={() => navigate('/')}>Back to marketplace</Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <Card padding="lg" shadow="md">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
              <div role="img" aria-label={`Image for ${product.title}`} className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">Image</div>
          </div>
          <div className="lg:col-span-2">
            <h1 className="text-2xl font-bold text-gray-900">{product.title}</h1>
            <p className="text-sm text-gray-600 mt-2 mb-4">{product.description || 'No description provided.'}</p>
            <div className="flex items-center gap-4">
              <div className="text-indigo-600 font-bold text-2xl">${Number(product.price || 0).toFixed(2)}</div>
              <div className="text-sm text-gray-600">Seller: <span className="font-medium text-gray-900">{product.seller || 'Unknown'}</span></div>
            </div>

            <div className="mt-6">
              <div className="flex items-center gap-3">
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => { if (vm.isAuthenticated()) { vm.createOrder(product.id, product.price); navigate('/my-orders'); } else { navigate('/login'); } }}
                  disabled={!vm.isAuthenticated()}
                >
                  {vm.isAuthenticated() ? 'Buy Now' : 'Sign in to buy'}
                </Button>
                <Button variant="outline" size="md" onClick={() => navigate(-1)}>Back</Button>
              </div>

              {!vm.isAuthenticated() && (
                <p className="mt-3 text-sm text-gray-600">Please sign in to complete a purchase. <a href="/login" className="text-indigo-600 font-medium hover:underline">Sign in</a> or <a href="/register" className="text-indigo-600 font-medium hover:underline">create an account</a>.</p>
              )}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
