"use client";

export default function EditProductModal({
  showEditModal,
  newProduct,
  setNewProduct,
  categories,
  formatPriceDisplay,
  handlePriceInputChange,
  handleUpdateProduct,
  cancelUpdateProduct,
}) {
  if (!showEditModal) return null;

  return (
    <div
      key="edit-modal"
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
    >
      <div className="bg-white p-6 rounded-xl max-w-md w-full mx-4">
        <h2 className="text-2xl font-bold text-secondary mb-4">Edit Product</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-secondary mb-1">
              Title *
            </label>
            <input
              key="edit-title"
              type="text"
              value={newProduct.title}
              onChange={(e) =>
                setNewProduct({ ...newProduct, title: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
              placeholder="Product title"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-secondary mb-1">
              Price * (USD)
            </label>
            <input
              key="edit-price"
              type="text"
              inputMode="decimal"
              placeholder="Enter price (e.g., 1299.99)"
              value={formatPriceDisplay(newProduct.price, "en-US")}
              onChange={(e) => {
                const rawValue = handlePriceInputChange(e.target.value);
                setNewProduct({
                  ...newProduct,
                  price: rawValue,
                });
              }}
              onBlur={(e) => {
                const rawValue = handlePriceInputChange(e.target.value);
                setNewProduct({
                  ...newProduct,
                  price: rawValue,
                });
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-secondary mb-1">
              Description
            </label>
            <textarea
              key="edit-description"
              value={newProduct.description}
              onChange={(e) =>
                setNewProduct({
                  ...newProduct,
                  description: e.target.value,
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
              placeholder="Product description"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-secondary mb-1">
              Category
            </label>
            <select
              key="edit-category"
              value={newProduct.categoryId}
              onChange={(e) =>
                setNewProduct({
                  ...newProduct,
                  categoryId: parseInt(e.target.value),
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
            >
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-secondary mb-1">
              Image URL
            </label>
            <input
              key="edit-image"
              type="text"
              value={newProduct.image}
              onChange={(e) =>
                setNewProduct({ ...newProduct, image: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
              placeholder="https://example.com/image.jpg"
            />
          </div>
        </div>
        <div className="flex gap-4 mt-6">
          <button
            onClick={cancelUpdateProduct}
            className="flex-1 py-2 bg-gray-200 text-secondary rounded-lg hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleUpdateProduct}
            className="flex-1 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
          >
            Update Product
          </button>
        </div>
      </div>
    </div>
  );
}
