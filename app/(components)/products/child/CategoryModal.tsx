import { useState } from "react";

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (categoryName: string) => void;
}

const CategoryModal = ({ isOpen, onClose, onSubmit }: CategoryModalProps) => {
  const [newCategory, setNewCategory] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategory) return alert("Category name is required!");
    onSubmit(newCategory);
    setNewCategory("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-30">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-4">Add New Category</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder="Category Name"
            required
            className="border p-2 w-full rounded"
          />
          <div className="flex justify-end space-x-4">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-500 text-white rounded-md">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-md">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CategoryModal;
