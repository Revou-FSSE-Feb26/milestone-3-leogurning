"use client";

export default function DeleteConfirmationModal({
  showDeleteModal,
  cancelDelete,
  confirmDeleteProduct,
}) {
  if (!showDeleteModal) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl max-w-md w-full mx-4">
        <h2 className="text-2xl font-bold text-secondary mb-2">
          Confirm Deletion
        </h2>
        <p className="text-accent mb-6">
          Are you sure you want to delete this product? This action cannot be
          undone.
        </p>
        <div className="flex gap-4">
          <button
            onClick={cancelDelete}
            className="flex-1 py-2 bg-gray-200 text-secondary rounded-lg hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={confirmDeleteProduct}
            className="flex-1 py-2 bg-red-500 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
