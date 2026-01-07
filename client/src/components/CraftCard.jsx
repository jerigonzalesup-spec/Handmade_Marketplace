import React, { useState } from 'react';
import Card from './Card';
import Button from './Button';
import Input from './Input';

export default function CraftCard({
  id,
  title,
  description,
  price,
  userId,
  currentUserId,
  onEdit,
  onDelete,
  onPlaceOrder
}) {
  const isOwner = currentUserId && userId === currentUserId;
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ title, description, price });

  const handleSave = () => {
    if (onEdit) {
      onEdit(id, editData);
      setIsEditing(false);
    }
  };

  const handleDelete = () => {
    if (window.confirm(`Delete "${title}"?`)) {
      if (onDelete) {
        onDelete(id);
      }
    }
  };

  return (
    <Card padding="md" shadow="sm" interactive className="mb-3 hover:shadow-md transition-shadow">
      {isEditing ? (
        <div>
          <div className="grid gap-3">
            <Input label="Title" value={editData.title} onChange={e => setEditData({ ...editData, title: e.target.value })} />
            <Input label="Description" value={editData.description} onChange={e => setEditData({ ...editData, description: e.target.value })} />
            <Input label="Price (USD)" type="number" step="0.01" value={editData.price} onChange={e => setEditData({ ...editData, price: e.target.value })} />
          </div>
          <div className="flex gap-3 mt-4">
            <Button onClick={handleSave} variant="success" size="sm">Save</Button>
            <Button onClick={() => setIsEditing(false)} variant="secondary" size="sm">Cancel</Button>
          </div>
        </div>
      ) : (
        <div className="flex gap-4 items-start">
          <div role="img" aria-label={`Image for ${title}`} className="flex-shrink-0 w-28 h-28 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">Image</div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-1 text-gray-900">{title}</h3>
            <p className="text-gray-600 mb-3 line-clamp-3">{description || 'No description'}</p>
            <div className="text-indigo-600 font-bold text-lg">${Number(price || 0).toFixed(2)}</div>
          </div>

          <div className="flex flex-col gap-2 items-end">
            {!isOwner && onPlaceOrder && (
              <div className="flex flex-col items-end gap-2">
                <Button aria-label={`Place order for ${title}`} onClick={() => onPlaceOrder(id, Number(price))} variant="success" size="sm">Place Order</Button>
                <Button aria-label={`View details for ${title}`} onClick={() => window.location.href = `/product/${id}`} variant="outline" size="sm">View</Button>
              </div>
            )}

            {isOwner && (
              <>
                <Button onClick={() => setIsEditing(true)} variant="primary" size="sm">Edit</Button>
                <Button onClick={handleDelete} variant="danger" size="sm">Delete</Button>
              </>
            )}
          </div>
        </div>
      )}
    </Card>
  );
}
