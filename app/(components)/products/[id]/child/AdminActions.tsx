interface AdminActionsProps {
  onEdit: () => void;
  onDelete: () => void;
}

const AdminActions = ({ onEdit, onDelete }: AdminActionsProps) => (
  <div className="mt-8 flex space-x-8">
    <button
      onClick={onEdit}
      className="px-8 py-4 bg-green-600 text-white font-semibold rounded-lg shadow-xl hover:bg-green-700 transition"
    >
      Edit Product
    </button>
    <button
      onClick={onDelete}
      className="px-8 py-4 bg-red-600 text-white font-semibold rounded-lg shadow-xl hover:bg-red-700 transition"
    >
      Delete Product
    </button>
  </div>
);

export default AdminActions;