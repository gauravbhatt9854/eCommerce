interface EditProductFormProps {
  editedProduct: any;
  onChange: (e: any) => void;
  onSave: () => void;
  onCancel: () => void;
}

const EditProductForm = ({ editedProduct, onChange, onSave, onCancel }: EditProductFormProps) => (
  <div className="mt-8 p-6 border border-gray-300 rounded-lg bg-gray-50">
    <input
      type="text"
      name="name"
      value={editedProduct?.name || ""}
      onChange={onChange}
      className="w-full p-4 mb-4 border rounded-lg focus:ring-2 focus:ring-green-500"
      placeholder="Product Name"
    />
    <textarea
      name="description"
      value={editedProduct?.description || ""}
      onChange={onChange}
      className="w-full p-4 mb-4 border rounded-lg focus:ring-2 focus:ring-green-500"
      placeholder="Product Description"
    />
    <input
      type="number"
      name="price"
      value={editedProduct?.price || ""}
      onChange={onChange}
      className="w-full p-4 mb-4 border rounded-lg focus:ring-2 focus:ring-green-500"
      placeholder="Product Price"
    />
    <div className="flex space-x-8">
      <button
        onClick={onSave}
        className="px-8 py-4 bg-green-600 text-white font-semibold rounded-lg shadow-xl hover:bg-green-700 transition"
      >
        Save Changes
      </button>
      <button
        onClick={onCancel}
        className="px-8 py-4 bg-gray-400 text-white font-semibold rounded-lg shadow-xl hover:bg-gray-500 transition"
      >
        Cancel
      </button>
    </div>
  </div>
);

export default EditProductForm;